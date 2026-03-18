import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterDto {
  @ApiProperty() @IsString() firstName: string;
  @ApiProperty() @IsString() lastName: string;
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() @MinLength(8) password: string;
  @ApiProperty() @IsString() companyName: string;
  @ApiProperty({ example: 'my-company' })
  @IsString() @Matches(/^[a-z0-9-]+$/) companySlug: string;
}
