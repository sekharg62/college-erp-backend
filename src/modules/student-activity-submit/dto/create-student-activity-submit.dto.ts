import { StudentActivitySubmitStatus } from '@prisma/client';
import {
  Equals,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateStudentActivitySubmitDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  activityId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  subActivityId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  academicYear: string;

  @IsInt()
  @Min(0)
  points: number;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  @MaxLength(2048)
  proofUrl: string;

  @IsEnum(StudentActivitySubmitStatus)
  @Equals(StudentActivitySubmitStatus.PENDING, {
    message: 'status must be PENDING for new submissions',
  })
  status: StudentActivitySubmitStatus;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
