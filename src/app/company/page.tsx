"use server";
import CompanyDetails from "@/components/CompanyDetails";
import CompanyTabs from "@/components/CompanyTabs";
import prisma from "@/db";
import { authConfig } from "@/lib/next-auth-config";
import { isCompanyProfileCompleted } from "@/lib/utils";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

async function page() {
  const session = await getServerSession(authConfig);
  if (!session) redirect("/register");
  const id = Number(session.user.id);
  if (!(await isCompanyProfileCompleted(id))) {
    redirect("/company/update");
  }
  const company = await prisma.company.findFirst({ where: { id } });
  console.log(company);
  return (
    <div className="p-4">
      <div className="flex items-center  justify-between">
        <div>
          <Image
            src={company?.logo!}
            alt="logo"
            width={100}
            height={100}
            className="rounded-[10px]"
          />
        </div>
        <div>
          <h1 className="text-2xl uppercase">{company?.name}</h1>
        </div>
      </div>
      <div className="pt-5 flex gap-5">
        <button
          type="button"
          disabled={true}
          className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        >
          {company?.teamSize + " members"}
        </button>
        <button
          type="button"
          disabled={true}
          className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        >
          {company?.credits + " credits"}
        </button>
        <Link
          href={company?.websiteLink!}
          className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        >
          visit website
        </Link>
        <Link
          href={"/company/post-job"}
          className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
        >
          post a job
        </Link>
      </div>
      <div>
        <CompanyDetails id={id} />
      </div>
    </div>
  );
}

export default page;
