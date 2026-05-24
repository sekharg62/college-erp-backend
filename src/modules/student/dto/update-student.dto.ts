import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateStudentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  rollNo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  admissionYear: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phoneNo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  password: string;

  @IsOptional()
  @IsString()
  signature?: string;
}
