-- AlterTable
ALTER TABLE "Student" ADD COLUMN "admissionYear" TEXT NOT NULL DEFAULT '';

-- Remove default so new rows must supply admissionYear explicitly
ALTER TABLE "Student" ALTER COLUMN "admissionYear" DROP DEFAULT;
