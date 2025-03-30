import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: { name: string; email: string; password: string }) {
    const { name, email, password } = registerDto;

    // Kiểm tra email đã tồn tại chưa
    const userExists = await this.userRepository.findOne({ where: { email } });
    if (userExists) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Tạo user mới
    const user = this.userRepository.create({
      name,
      email,
      password,
      role: 'user',
      isActive: true
    });

    await this.userRepository.save(user);

    return {
      message: 'Đăng ký thành công'
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  async logout(userId: number) {
    return { message: 'Đăng xuất thành công' };
  }
} 