import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TeacherJwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class TeacherJwtStrategy extends PassportStrategy(Strategy, 'teacher-jwt') {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  async validate(payload: TeacherJwtPayload) {
    if (payload.role !== 'TEACHER') {
      throw new UnauthorizedException('Invalid token');
    }

    const teacher = await this.prisma.db.teacher.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        instituteId: true,
        adminId: true,
        departmentId: true,
        name: true,
        phoneNo: true,
      },
    });

    if (
      !teacher ||
      teacher.instituteId !== payload.instituteId ||
      teacher.adminId !== payload.adminId
    ) {
      throw new UnauthorizedException('Teacher not found or token revoked');
    }

    return teacher;
  }
}
