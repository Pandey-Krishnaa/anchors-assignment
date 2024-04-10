"use server";
import StudentHomePage from "@/components/StudentHomePage";
import prisma from "@/db";
import { authConfig } from "@/lib/next-auth-config";
import { isStudentProfileCompleted } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const session = await getServerSession(authConfig);

  if (!session || !session.user || !session.user.id)
    return redirect("/register");

  const id = Number(session.user.id);
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) redirect("/register");
  if (!(await isStudentProfileCompleted(id)))
    return redirect("/student/update");
  return <StudentHomePage />;
}

export default page;
