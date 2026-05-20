import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { PatchInstituteDto } from './dto/patch-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';

@Injectable()
export class InstituteService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInstituteDto) {
    try {
      return await this.prisma.db.institute.create({ data: dto });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async update(id: string, dto: UpdateInstituteDto) {
    try {
      return await this.prisma.db.institute.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async patch(id: string, dto: PatchInstituteDto) {
    if (Object.keys(dto).length === 0) {
      return this.findOneOrThrow(id);
    }

    try {
      return await this.prisma.db.institute.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.db.institute.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  private async findOneOrThrow(id: string) {
    const institute = await this.prisma.db.institute.findUnique({
      where: { id },
    });
    if (!institute) {
      throw new NotFoundException(`Institute with id "${id}" not found`);
    }
    return institute;
  }

  private handlePrismaError(error: unknown, id?: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Institute with id "${id}" not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Institute code already exists');
      }
    }
    throw error;
  }
}
