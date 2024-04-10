import prisma from "@/db";
import { sendEmail } from "@/lib/email";
import { generateOtp } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    let company = await prisma.company.findFirst({ where: { email } });
    const otp = generateOtp();

    if (!company) {
      await prisma.$transaction(async (tx) => {
        company = await tx.company.create({ data: { email, otp } });
        await sendEmail({
          to: email,
          text: `You OTP to login is ${otp}`,
          subject: "your login otp.",
          html: `<b>You OTP to login is ${otp}</b>`,
        });
      });
    } else {
      await prisma.$transaction(async (tx) => {
        company = await tx.company.update({
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
    return Response.json({ company }, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
