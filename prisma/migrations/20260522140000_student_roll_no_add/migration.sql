-- AlterTable
ALTER TABLE "Student" ADD COLUMN "rollNo" TEXT;

-- Backfill existing rows before enforcing NOT NULL + unique
UPDATE "Student" SET "rollNo" = "id"::text WHERE "rollNo" IS NULL;

ALTER TABLE "Student" ALTER COLUMN "rollNo" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_rollNo_key" ON "Student"("rollNo");
