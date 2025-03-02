/*
  Warnings:

  - You are about to drop the column `timeLogTitle` on the `TimeLog` table. All the data in the column will be lost.
  - Added the required column `userId` to the `TimeLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TimeLog" DROP COLUMN "timeLogTitle",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TimeLog" ADD CONSTRAINT "TimeLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
