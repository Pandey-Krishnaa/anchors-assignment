import prisma from "@/db";
import { sendEmail } from "@/lib/email";
import { generateOtp } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    let student = await prisma.student.findFirst({ where: { email } });
    const otp = generateOtp();

    if (!student) {
      await prisma.$transaction(async (tx) => {
        student = await tx.student.create({ data: { email, otp } });
        await sendEmail({
          to: email,
          text: `You OTP to login is ${otp}`,
          subject: "your login otp.",
          html: `<b>You OTP to login is ${otp}</b>`,
        });
      });
    } else {
      await prisma.$transaction(async (tx) => {
        student = await tx.student.update({
          where: { email },
          data: { otp },
        });
        await sendEmail({
          to: email,
          text: `You OTP to login is ${otp}`,
          subject: "your login otp.",
          html: `<b>You OTP to login is ${otp}</b>`,
        });
      });
    }
    return Response.json({ student }, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
