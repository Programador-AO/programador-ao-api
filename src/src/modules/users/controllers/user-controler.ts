import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth-guard';
import { UserService } from '../services/user-service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
