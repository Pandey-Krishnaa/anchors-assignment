"use server";

import UpdateStudent from "@/components/UpdateStudent";
import { updateStudentType } from "@/components/types";
import prisma from "@/db";
import { authConfig } from "@/lib/next-auth-config";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const session = await getServerSession(authConfig);
  console.log("student =", session);

  if (!session || !session.user || !session.user.id)
    return redirect("/register");

  const id = Number(session.user.id);
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) redirect("/register");

  const initialValue: updateStudentType = {
    name: student.name || "",
    // @ts-ignore
    phoneNumber: student.phoneNumber || 9999999999,
    location: student.location || "",
  };
  return (
    <div>
      <UpdateStudent student={initialValue} />
    </div>
  );
}

export default page;
