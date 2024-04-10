import prisma from "@/db";
import { sendEmail } from "@/lib/email";
import { authConfig } from "@/lib/next-auth-config";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    console.log(request.nextUrl.searchParams);
    const session = await getServerSession(authConfig);
    if (!session || !session.user || !session.user.id)
      return Response.json(
        { message: "login again, and then try again" },
        { status: 401 }
      );

    const studentId = Number(session.user.id);

    const applied = await prisma.jobApplication.findMany({
      where: { studentId },
      select: { jobId: true },
    });
    console.log("applied job = ", applied);
    const appliedJobId: number[] = [];
    applied.forEach((x) => appliedJobId.push(x.jobId));
    const jobs = await prisma.job.findMany({
      where: { id: { notIn: appliedJobId } },
    });

    // const jobs = await prisma.job.findMany({
    //   orderBy: { createdAt: "desc" },
    // });
    return Response.json({ jobs }, { status: 200 });
  } catch (error) {
    console.log(error);

    return Response.json(
      // @ts-ignore
      { message: error.message || "something went wrong" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session || !session.user || !session.user.id)
      return Response.json(
        { message: "login again, and then try again" },
        { status: 401 }
      );
    //   jobid
    const { id } = await request.json();
    const studentId = Number(session.user.id);
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student)
      return Response.json(
        { message: "login again, and then try again" },
        { status: 401 }
      );
    if (!id)
      return Response.json(
        { message: "job id is not mentioned" },
        { status: 400 }
      );
    const job = await prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });
    console.log("********************************");
    console.log(job);

    if (!job) return Response.json({ message: "invalid job" }, { status: 400 });
    const rr = job.roleName.length * 2 + job.location.length * 5;

    if (student.credits < rr)
      return Response.json(
        { message: "Oops! You don't have any rupees in the account" },
        { status: 400 }
      );

    await prisma.$transaction(async (tx) => {
      await tx.company.update({
        where: { id: job.postedBy },
        data: {
          credits: { increment: rr / 2 },
        },
      });
      await tx.student.update({
        where: { id: student.id },
        data: {
          credits: { decrement: rr },
        },
      }),
        await tx.studentBalanceHistory.create({
          data: {
            studentId: student.id,
            amount: rr,
            reason: `applied for ${job.roleName} at ${job.company.name}.`,
            type: "debit",
          },
        });
      await tx.companyBalanceHistory.create({
        data: {
          companyId: job.postedBy,
          type: "credit",
          amount: rr / 2,
          reason: `${student.name} applied for ${job.roleName} #${job.id}`,
        },
      });
      await tx.jobApplication.create({
        data: {
          studentId: student.id,
          jobId: job.id,
          companyId: job.company.id,
        },
      });
      await sendEmail({
        to: job.company.email,
        text: `${student.name} applied for ${job.roleName}`,
        html: `<b>${student.name} applied for ${job.roleName}</b>`,
        subject: "Congrats",
      });
    });
    return Response.json({ message: "job application submitted" });
  } catch (error) {
    return Response.json(
      // @ts-ignore
      { message: error.message || "something went wrong" },
      { status: 500 }
    );
  }
}
