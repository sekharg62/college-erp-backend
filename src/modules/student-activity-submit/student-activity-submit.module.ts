import { Module } from '@nestjs/common';
import { StudentModule } from '../student/student.module';
import { TeacherModule } from '../teacher/teacher.module';
import { StudentActivitySubmitController } from './student-activity-submit.controller';
import { StudentActivitySubmitService } from './student-activity-submit.service';

@Module({
  imports: [StudentModule, TeacherModule],
  controllers: [StudentActivitySubmitController],
  providers: [StudentActivitySubmitService],
  exports: [StudentActivitySubmitService],
})
export class StudentActivitySubmitModule {}
