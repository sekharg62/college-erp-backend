import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class PatchStudentDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  rollNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  admissionYear?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNo?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password?: string;

  @IsOptional()
  @IsString()
  signature?: string;
}
