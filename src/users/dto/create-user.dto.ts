import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@bidflow/database';

export class CreateUserDto {
  @ApiProperty() @IsString() firstName: string;
  @ApiProperty() @IsString() lastName: string;
  @ApiProperty() @IsEmail()  email: string;
  @ApiProperty() @IsString() @MinLength(8) password: string;
  @ApiPropertyOptional({ enum: UserRole, default: UserRole.BUYER })
  @IsOptional() @IsEnum(UserRole)
  role?: UserRole;
}
