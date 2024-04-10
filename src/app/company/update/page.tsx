"use server";
import UpdateCompanyForm from "@/components/UpdateCompanyForm";
import { updateCompanyType } from "@/components/types";
import prisma from "@/db";
import { authConfig } from "@/lib/next-auth-config";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function page() {
  const session = await getServerSession(authConfig);
  if (!session || !session.user || !session.user.id) redirect("/register");
  const id = Number(session.user.id);
  const company = await prisma.company.findFirst({ where: { id } });
  if (!company) redirect("/register");
  const initialValues: updateCompanyType = {
    name: company.name,
    websiteLink: company.websiteLink,
    teamSize: company.teamSize,
  };
  return (
    <div>
      <UpdateCompanyForm company={initialValues} />
    </div>
  );
}

export default page;
