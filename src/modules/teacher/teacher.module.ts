import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { StringValue } from 'ms';
import { TeacherJwtAuthGuard } from './guards/teacher-jwt-auth.guard';
import { TeacherJwtStrategy } from './strategies/teacher-jwt.strategy';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'teacher-jwt' }),
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
  controllers: [TeacherController],
  providers: [TeacherService, TeacherJwtStrategy, TeacherJwtAuthGuard],
  exports: [TeacherService, TeacherJwtAuthGuard, JwtModule],
})
export class TeacherModule {}
