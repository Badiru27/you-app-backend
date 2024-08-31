import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  userName?: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UserDto {
  id: string;
  email: string;
  userName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
