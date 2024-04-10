import prisma from "@/db";
import { type ClassValue, clsx } from "clsx";

import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateOtp = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const isCompany = (data: any): boolean => {
  return Object.keys(data).includes("teamSize");
};

export const isCompanyProfileCompleted = async (id: number) => {
  try {
    const company = await prisma.company.findFirst({ where: { id } });
    if (!company) throw Error("please sign in again");
    if (
      !company.name ||
      !company.websiteLink ||
      !company.logo ||
      !company.teamSize
    )
      return false;
    return true;
  } catch (error) {
    throw error;
  }
};
export const isStudentProfileCompleted = async (id: number) => {
  try {
    const student = await prisma.student.findFirst({ where: { id } });
    if (!student) throw Error("please sign in again");
    if (
      !student.name ||
      !student.phoneNumber ||
      !student.profilePic ||
      !student.resume ||
      !student.location
    )
      return false;
    return true;
  } catch (error) {
    throw error;
  }
};
