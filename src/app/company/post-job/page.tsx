"use server";
import PostJobForm from "@/components/PostJobForm";
import { authConfig } from "@/lib/next-auth-config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || !session.user.id) redirect("/register");
  const id = Number(session.user.id);
  return (
    <div>
      <PostJobForm id={id} />
    </div>
  );
}

export default page;
