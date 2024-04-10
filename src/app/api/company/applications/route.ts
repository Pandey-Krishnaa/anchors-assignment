import prisma from "@/db";
import { authConfig } from "@/lib/next-auth-config";

import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session || !session.user || !session.user.id)
      return Response.json(
        { message: "login again, and then try again" },
        { status: 401 }
      );
    const id = Number(session.user.id);
    const applications = await prisma.jobApplication.findMany({
      where: { companyId: id },
      include: { student: true, job: true },
    });
    applications.forEach((application) => {
      // @ts-ignore
      application.student.phoneNumber = `${application.student.phoneNumber}`;
    });
    return Response.json({ applications }, { status: 200 });
  } catch (error) {
    return Response.json(
      // @ts-ignore
      { message: error.message || "something went wrong" },
      { status: 200 }
    );
  }
}
