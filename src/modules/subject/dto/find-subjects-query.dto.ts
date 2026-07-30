import { IsOptional, IsUUID } from 'class-validator';

export class FindSubjectsQueryDto {
  @IsUUID()
  departmentId: string;

  @IsOptional()
  @IsUUID()
  semesterId?: string;
}
