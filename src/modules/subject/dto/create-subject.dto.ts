import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateSubjectDto {
  @IsUUID()
  departmentId: string;

  @IsUUID()
  semesterId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  slug: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  subjectCode?: string;
}
