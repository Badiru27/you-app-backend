import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

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
  @ValidateIf((obj) => obj.userName === null || obj.userName === undefined)
  @IsOptional()
  email?: string | null;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ValidateIf((obj) => obj.email === null || obj.email === undefined)
  userName?: string | null;

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
