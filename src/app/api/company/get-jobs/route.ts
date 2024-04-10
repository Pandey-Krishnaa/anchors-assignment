import prisma from "@/db";
import { authConfig } from "@/lib/next-auth-config";
import { request } from "http";
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
    const jobs = await prisma.job.findMany({
      where: { postedBy: id },
      orderBy: { createdAt: "desc" },
    });
    return Response.json({ jobs }, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
