import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AdminModule } from './modules/admin/admin.module';
import { DepartmentModule } from './modules/department/department.module';
import { InstituteModule } from './modules/institute/institute.module';
import { StudentActivitySubmitModule } from './modules/student-activity-submit/student-activity-submit.module';
import { StudentModule } from './modules/student/student.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    HealthModule,
    InstituteModule,
    AdminModule,
    DepartmentModule,
    TeacherModule,
    StudentModule,
    StudentActivitySubmitModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
