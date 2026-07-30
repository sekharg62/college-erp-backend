import { IsUUID } from 'class-validator';

export class FindSemestersQueryDto {
  @IsUUID()
  departmentId: string;
}
