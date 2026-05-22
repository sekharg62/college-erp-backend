import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { BCRYPT_ROUNDS } from '../../common/constants/auth.constants';
import { AdminJwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(dto: CreateAdminDto) {
    await this.ensureInstituteExists(dto.instituteId);

    const hashedPassword = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    try {
      const admin = await this.prisma.db.admin.create({
        data: {
          instituteId: dto.instituteId,
          name: dto.name,
          phoneNo: dto.phoneNo,
          password: hashedPassword,
        },
      });

      return this.omitPassword(admin);
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async login(dto: LoginAdminDto) {
    const admin = await this.prisma.db.admin.findFirst({
      where: { phoneNo: dto.phoneNo },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const passwordMatches = await bcrypt.compare(dto.password, admin.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const payload: AdminJwtPayload = {
      sub: admin.id,
      instituteId: admin.instituteId,
      role: 'ADMIN',
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      admin: this.omitPassword(admin),
    };
  }

  private async ensureInstituteExists(instituteId: string) {
    const institute = await this.prisma.db.institute.findUnique({
      where: { id: instituteId },
    });
    if (!institute) {
      throw new NotFoundException(
        `Institute with id "${instituteId}" not found`,
      );
    }
  }

  private omitPassword<T extends { password: string }>(admin: T) {
    const { password: _, ...rest } = admin;
    return rest;
  }

  private handlePrismaError(error: unknown): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new NotFoundException('Institute not found');
      }
    }
    throw error;
  }
}
