"use server";
import { authConfig } from "@/lib/next-auth-config";
import {
  isCompany,
  isCompanyProfileCompleted,
  isStudentProfileCompleted,
} from "@/lib/utils";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authConfig);
  console.log(session);

  if (!session || !session.user) redirect("/register");
  const company = isCompany(session.user);
  if (company) {
    (await isCompanyProfileCompleted(session.user.id))
      ? redirect("/company")
      : redirect("/company/update");
  } else {
    (await isStudentProfileCompleted(session.user.id))
      ? redirect("/student")
      : redirect("/student/update");
  }

  return <h1>Hello</h1>;
}
