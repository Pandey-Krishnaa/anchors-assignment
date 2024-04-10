"use server";

import prisma from "@/db";
import { generateOtp } from "@/lib/utils";
import { updateCompanyDetailsType } from "./types";
import { writeFile } from "fs/promises";

export const regiter = async (email: string) => {
  try {
    let company = await prisma.company.findUnique({ where: { email } });
    const otp = generateOtp();
    if (!company)
      company = await prisma.company.create({ data: { email, otp } });
    else
      company = await prisma.company.update({
        where: { email },
        data: {
          otp,
        },
      });
    return company;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (email: string, otp: number) => {
  try {
    let company = await prisma.company.findFirst({ where: { email, otp } });
    if (!company) throw new Error("invalid otp");

    return company;
  } catch (error) {
    throw error;
  }
};

export const updateDetails = async (
  email: string,
  data: updateCompanyDetailsType
) => {
  try {
    
  } catch (error) {}
};
