import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { StringValue } from 'ms';
import { TeacherModule } from '../teacher/teacher.module';
import { StudentJwtAuthGuard } from './guards/student-jwt-auth.guard';
import { StudentJwtStrategy } from './strategies/student-jwt.strategy';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  imports: [
    TeacherModule,
    PassportModule.register({ defaultStrategy: 'student-jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>(
            'jwt.expiresIn',
          ) as StringValue,
        },
      }),
    }),
  ],
  controllers: [StudentController],
  providers: [StudentService, StudentJwtStrategy, StudentJwtAuthGuard],
  exports: [StudentService, StudentJwtAuthGuard, JwtModule],
})
export class StudentModule {}
