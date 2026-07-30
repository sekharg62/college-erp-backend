import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSemesterDto } from './dto/create-semester.dto';
import { PatchSemesterDto } from './dto/patch-semester.dto';
import { UpdateSemesterDto } from './dto/update-semester.dto';

@Injectable()
export class SemesterService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSemesterDto) {
    await this.ensureDepartmentExists(dto.departmentId);

    try {
      return await this.prisma.db.semester.create({
        data: {
          departmentId: dto.departmentId,
          number: dto.number,
          label: dto.label,
          sortOrder: dto.sortOrder ?? 0,
        },
      });
    } catch (error) {
      this.handlePrismaError(error);
    }
  }

  async findAllByDepartment(departmentId: string) {
    await this.ensureDepartmentExists(departmentId);

    return this.prisma.db.semester.findMany({
      where: { departmentId },
      orderBy: [{ sortOrder: 'asc' }, { number: 'asc' }],
    });
  }

  async findOne(id: string) {
    return this.findOneOrThrow(id);
  }

  async update(id: string, dto: UpdateSemesterDto) {
    await this.findOneOrThrow(id);
    await this.ensureDepartmentExists(dto.departmentId);

    try {
      return await this.prisma.db.semester.update({
        where: { id },
        data: {
          departmentId: dto.departmentId,
          number: dto.number,
          label: dto.label,
          sortOrder: dto.sortOrder ?? 0,
        },
      });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async patch(id: string, dto: PatchSemesterDto) {
    if (Object.keys(dto).length === 0) {
      return this.findOneOrThrow(id);
    }

    await this.findOneOrThrow(id);

    if (dto.departmentId) {
      await this.ensureDepartmentExists(dto.departmentId);
    }

    try {
      return await this.prisma.db.semester.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.db.semester.delete({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error, id);
    }
  }

  private async findOneOrThrow(id: string) {
    const semester = await this.prisma.db.semester.findUnique({
      where: { id },
    });
    if (!semester) {
      throw new NotFoundException(`Semester with id "${id}" not found`);
    }
    return semester;
  }

  private async ensureDepartmentExists(departmentId: string) {
    const department = await this.prisma.db.department.findUnique({
      where: { id: departmentId },
    });
    if (!department) {
      throw new NotFoundException(
        `Department with id "${departmentId}" not found`,
      );
    }
  }

  private handlePrismaError(error: unknown, id?: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Semester with id "${id}" not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Semester number already exists for this department',
        );
      }
      if (error.code === 'P2003') {
        throw new NotFoundException('Department not found');
      }
    }
    throw error;
  }
}
