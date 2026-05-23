import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FindStudentActivitySubmitsQueryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  academicYear: string;
}
