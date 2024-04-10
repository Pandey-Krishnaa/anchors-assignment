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
    const history = await prisma.companyBalanceHistory.findMany({
      where: { companyId: id },
      orderBy: { createdAt: "desc" },
    });
    return Response.json({ history }, { status: 200 });
  } catch (error) {
    return Response.json(
      // @ts-ignore
      { message: error.message || "something went wrong" },
      { status: 200 }
    );
  }
}
