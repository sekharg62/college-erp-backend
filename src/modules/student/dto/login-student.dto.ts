import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginStudentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  rollNo: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
