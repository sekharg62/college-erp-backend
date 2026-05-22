import {
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @IsUUID()
  instituteId: string;

  @IsUUID()
  adminId: string;

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
  @MinLength(6)
  @MaxLength(128)
  password: string;

  @IsString()
  @IsNotEmpty()
  phoneNo: string;
}
