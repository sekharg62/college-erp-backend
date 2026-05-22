import { IsUUID } from 'class-validator';

export class FindTeachersQueryDto {
  @IsUUID()
  adminId: string;
}
