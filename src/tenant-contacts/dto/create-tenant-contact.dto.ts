import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class CreateTenantContactDto {
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  mail?: string;

  @IsOptional()
  @IsString()
  message?: string;
}
