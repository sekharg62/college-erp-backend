import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminJwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
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

  async validate(payload: AdminJwtPayload) {
    if (payload.role !== 'ADMIN') {
      throw new UnauthorizedException('Invalid token');
    }

    const admin = await this.prisma.db.admin.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        instituteId: true,
        name: true,
        phoneNo: true,
      },
    });

    if (!admin || admin.instituteId !== payload.instituteId) {
      throw new UnauthorizedException('Admin not found or token revoked');
    }

    return admin;
  }
}
