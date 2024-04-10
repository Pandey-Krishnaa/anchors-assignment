"use server";
import RegisterForm from "@/components/RegisterForm";
import { authConfig } from "@/lib/next-auth-config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const session = await getServerSession(authConfig);
  console.log("session = ", session);
  if (session) redirect("/");

  return (
    <div>
      <RegisterForm />
    </div>
  );
}

export default page;
