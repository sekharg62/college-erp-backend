import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StudentJwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class StudentJwtStrategy extends PassportStrategy(Strategy, 'student-jwt') {
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

  async validate(payload: StudentJwtPayload) {
    if (payload.role !== 'STUDENT') {
      throw new UnauthorizedException('Invalid token');
    }

    const student = await this.prisma.db.student.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        instituteId: true,
        adminId: true,
        teacherId: true,
        rollNo: true,
        name: true,
      },
    });

    if (
      !student ||
      student.instituteId !== payload.instituteId ||
      student.adminId !== payload.adminId ||
      student.teacherId !== payload.teacherId ||
      student.rollNo !== payload.rollNo
    ) {
      throw new UnauthorizedException('Student not found or token revoked');
    }

    return student;
  }
}
