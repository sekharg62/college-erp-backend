-- CreateEnum
CREATE TYPE "StudentActivitySubmitStatus" AS ENUM ('PENDING', 'APPROVE', 'REJECT');

-- CreateTable
CREATE TABLE "student_activity_submit" (
    "id" UUID NOT NULL,
    "studentId" UUID NOT NULL,
    "activityId" TEXT NOT NULL,
    "subActivityId" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "proofUrl" TEXT NOT NULL,
    "status" "StudentActivitySubmitStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_activity_submit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "student_activity_submit_studentId_idx" ON "student_activity_submit"("studentId");

-- CreateIndex
CREATE INDEX "student_activity_submit_activityId_idx" ON "student_activity_submit"("activityId");

-- CreateIndex
CREATE INDEX "student_activity_submit_subActivityId_idx" ON "student_activity_submit"("subActivityId");

-- CreateIndex
CREATE INDEX "student_activity_submit_status_idx" ON "student_activity_submit"("status");

-- AddForeignKey
ALTER TABLE "student_activity_submit" ADD CONSTRAINT "student_activity_submit_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
