import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsNumber,
  IsArray,
  IsUrl,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  displayName?: string | null;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender | null;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  birthday?: Date | null;

  @IsNumber()
  @IsOptional()
  height?: number | null;

  @IsNumber()
  @IsOptional()
  weight?: number | null;

  @IsUrl()
  @IsOptional()
  imageUrl?: string | null;
}

export class ProfileDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  displayName?: string | null;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender | null;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  birthday?: Date | null;

  @IsNumber()
  @IsOptional()
  height?: number | null;

  @IsNumber()
  @IsOptional()
  weight?: number | null;

  @IsUrl()
  @IsOptional()
  imageUrl?: string | null;

  @IsArray()
  @IsString({ each: true })
  interest: string[];

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  deletedAt: Date | null;
}
