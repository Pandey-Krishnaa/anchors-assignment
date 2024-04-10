import prisma from "@/db";
import { generateOtp } from "@/lib/utils";
export const regiter = async (email: string) => {
  try {
    let student = await prisma.student.findUnique({ where: { email } });
    const otp = generateOtp();
    if (!student)
      student = await prisma.student.create({ data: { email, otp } });
    else
      student = await prisma.student.update({
        where: { email },
        data: {
          otp,
        },
      });
    return student;
  } catch (error) {
    throw error;
  }
};

export const verifyOtp = async (email: string, otp: number) => {
  try {
    let student = await prisma.student.findFirst({ where: { email, otp } });
    if (!student) throw new Error("invalid otp");
    return student;
  } catch (error) {
    throw error;
  }
};
