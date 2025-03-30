import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService, User } from '../user';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new BadRequestException('Account is deactivated');
    }

    const { password: _, ...result } = user.toObject();
    return result;
  }

  async login(user: Omit<User, 'password'>) {
    const payload = { 
      email: user.email, 
      sub: user._id,
      roles: user.roles || ['user']
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      }),
    ]);

    // Lưu refresh token vào database
    await this.userService.update(user._id.toString(), { refreshToken });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        roles: user.roles || ['user'],
      }
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findOne(payload.sub);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { 
        email: user.email, 
        sub: user._id,
        roles: user.roles || ['user']
      };

      const [newAccessToken, newRefreshToken] = await Promise.all([
        this.jwtService.signAsync(newPayload, {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        }),
        this.jwtService.signAsync(newPayload, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        }),
      ]);

      await this.userService.update(user._id.toString(), { refreshToken: newRefreshToken });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.userService.update(userId, { refreshToken: undefined });
    return { message: 'Logged out successfully' };
  }
} 