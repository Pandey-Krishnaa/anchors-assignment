-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "otp" INTEGER,
    "teamSize" INTEGER,
    "websiteLink" TEXT,
    "logo" TEXT,
    "logoPubId" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 200,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "otp" INTEGER,
    "phoneNumber" INTEGER,
    "resume" TEXT,
    "resumePubId" TEXT,
    "profilePic" TEXT,
    "profilePicPubId" TEXT,
    "location" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 300,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "roleName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "minCTC" INTEGER NOT NULL,
    "maxCTC" INTEGER NOT NULL,
    "postedBy" INTEGER NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_postedBy_fkey" FOREIGN KEY ("postedBy") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
