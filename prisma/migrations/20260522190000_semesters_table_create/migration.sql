-- CreateTable
CREATE TABLE "semesters" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "departmentId" UUID NOT NULL,
    "number" INTEGER NOT NULL,
    "label" VARCHAR(50),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "semesters_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "semesters_number_check" CHECK ("number" >= 1 AND "number" <= 8)
);

-- CreateIndex
CREATE INDEX "semesters_departmentId_idx" ON "semesters"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "semesters_departmentId_number_key" ON "semesters"("departmentId", "number");

-- AddForeignKey
ALTER TABLE "semesters" ADD CONSTRAINT "semesters_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
