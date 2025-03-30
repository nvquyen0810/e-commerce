import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller('admin')
export class AdminController {
  @Get()
  serveAdmin(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', '..', 'public', 'admin', 'build', 'index.html'));
  }

  @Get('*')
  serveAdminRoutes(@Res() res: Response) {
    return res.sendFile(join(__dirname, '..', '..', 'public', 'admin', 'build', 'index.html'));
  }
} 