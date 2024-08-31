import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { CreateUserDto, LoginUserDto, UserDto } from './dtos/user.dto';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  signIn(@Body() dto: LoginUserDto) {
    return this.authService.loginUser(dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  signUp(@Body() dto: CreateUserDto): Promise<{ token: string }> {
    return this.authService.registerUser(dto);
  }
  @Get('/health')
  getHello() {
    return {
      message: 'Hello You App 🚀🚀🚀',
    };
  }
}
