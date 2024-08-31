import {
  IsString,
  IsOptional,
  IsEnum,
  IsDate,
  IsNumber,
  IsArray,
  IsUrl,
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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interest?: string[];
}

export class ProfileDto {
  id: string;

  displayName?: string | null;

  gender?: string | null;

  birthday?: Date | null;

  height?: number | null;

  weight?: number | null;

  imageUrl?: string | null;

  interest?: string[];

  createdAt: Date;

  updatedAt: Date;

  deletedAt: Date | null;
}
