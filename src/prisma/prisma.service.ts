import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly pool: Pool;
  /** Generated Prisma client — use for queries (e.g. `prisma.db.department.findMany()`). */
  readonly db: PrismaClient;

  constructor(configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('databaseUrl');
    this.pool = new Pool({ connectionString });
    const adapter = new PrismaPg(this.pool);
    this.db = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    try {
      await this.db.$connect();
      this.logger.log('Database connected successfully');
    } catch (error) {
      this.logger.error('Database connection failed', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.db.$disconnect();
    await this.pool.end();
    this.logger.log('Database disconnected');
  }
}
