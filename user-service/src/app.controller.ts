import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { CreateUserDto, LoginUserDto } from './dtos/user.dto';
import { JwtGuard } from './auth/guard';
import { ProfileDto, UpdateProfileDto } from './dtos/profile.dto';
import { ProfileService } from './profile/profile.service';
import { Request } from 'express';
import { ResultResponse } from './utils';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private readonly profileService: ProfileService,
  ) {}

  @Get('/health')
  getHello() {
    return {
      message: 'Hello You App 🚀🚀🚀',
    };
  }

  // A separate controller can be created for each module. But since most of the part is /
  // I'll just add everything here

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

  @UseGuards(JwtGuard)
  @Get('/getProfile')
  async getUserProfile(@Req() req: Request) {
    const data = await this.profileService.find(req.user['id']);

    return {
      data,
      success: true,
      message: 'Profile fetched successfully',
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard)
  @Post('/createProfile')
  async createProfile(
    @Body() dto: UpdateProfileDto,
    @Req() req: Request,
  ): Promise<ResultResponse<ProfileDto>> {
    const data = await this.profileService.create({
      ...dto,
      userId: String(req.user['id']),
    });

    return {
      data,
      success: true,
      message: 'Profile created successfully',
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @Put('/updateProfile')
  async updateProfile(
    @Body() dto: UpdateProfileDto,
    @Req() req: Request,
  ): Promise<ResultResponse<ProfileDto>> {
    const data = await this.profileService.update({
      ...dto,
      userId: String(req.user['id']),
    });

    return {
      data,
      success: true,
      message: 'Profile update successfully',
    };
  }
}
