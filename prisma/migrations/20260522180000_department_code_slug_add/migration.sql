-- AlterTable
ALTER TABLE "Department" ADD COLUMN "departmentCode" TEXT;

ALTER TABLE "Department" ADD COLUMN "slug" TEXT;

UPDATE "Department" SET "departmentCode" = "id"::text, "slug" = "id"::text WHERE "departmentCode" IS NULL;

ALTER TABLE "Department" ALTER COLUMN "departmentCode" SET NOT NULL;

ALTER TABLE "Department" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Department_departmentCode_key" ON "Department"("departmentCode");

-- CreateIndex
CREATE UNIQUE INDEX "Department_slug_key" ON "Department"("slug");
