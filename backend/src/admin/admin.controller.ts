import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin')
export class AdminController {
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  getAdminDashboard() {
    return { message: 'Welcome to Admin Dashboard' };
  }
} 