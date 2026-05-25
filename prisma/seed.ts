import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

const BCRYPT_ROUNDS = 10;

async function main() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@maar.com';
  const password = process.env.ADMIN_PASSWORD ?? 'admin123';
  const name = process.env.ADMIN_NAME ?? 'Admin User';

  const connectionString =
    process.env.DIRECT_URL ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL or DIRECT_URL is required for seed');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name,
      role: Role.ADMIN,
    },
    create: {
      email,
      password: hashedPassword,
      name,
      role: Role.ADMIN,
    },
  });

  console.log(`Admin user ready: ${user.email} (id: ${user.id})`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
