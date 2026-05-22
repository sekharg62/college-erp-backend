import { Module } from '@nestjs/common';
import { TeacherModule } from '../teacher/teacher.module';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [TeacherModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
