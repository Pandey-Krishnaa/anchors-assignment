import prisma from "@/db";
import { sendEmail } from "@/lib/email";
import { NextRequest } from "next/server";
import amqp from "amqplib";
export async function POST(request: NextRequest) {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue("notifications");

    const { postedBy, roleName, location, minCTC, maxCTC } =
      await request.json();
    if (!postedBy || !roleName || !location || !minCTC || !maxCTC)
      return Response.json({ message: "incomplete inputs" }, { status: 400 });
    if (minCTC >= maxCTC)
      return Response.json(
        {
          message:
            "invalid ctc range, they can't equal and min ctc can't greater than max ctc",
        },
        { status: 400 }
      );
    const company = await prisma.company.findUnique({
      where: { id: postedBy },
    });
    if (!company)
      return Response.json(
        { message: "not able to find your company" },
        { status: 400 }
      );
    const rr = roleName.length * 2 + location.length * 2;
    if (rr > company.credits)
      return Response.json(
        { message: "Oops! You don't have any rupees in the account" },
        { status: 400 }
      );
    await prisma.$transaction(async (tx) => {
      await tx.company.update({
        where: { id: company.id },
        data: {
          credits: {
            decrement: rr,
          },
        },
      });
      await tx.job.create({
        data: { roleName, location, postedBy, minCTC, maxCTC },
      });
      await tx.companyBalanceHistory.create({
        data: {
          type: "deposit",
          reason: `posted a job for ${roleName}`,
          amount: rr,
          companyId: company.id,
        },
      });
      await sendEmail({
        to: company.email,
        subject: "congrats!",
        text: `Congrats! You published a new job for ${roleName}`,
        html: `<b>Congrats! You published a new job for ${roleName}</b>`,
      });
      await channel.sendToQueue(
        "notifications",
        Buffer.from(
          JSON.stringify({
            companyId: company.id,
            subject: "job notification from career connect!",
            text: `${company.name} posted new job for ${roleName}`,
            html: `<b>${company.name} posted new job for ${roleName}</b>`,
          })
        )
      );
      await channel.close();
      await connection.close();
    });

    return Response.json({ message: "job created" }, { status: 200 });
  } catch (error) {
    // @ts-ignore
    return Response.json({ message: error.message }, { status: 500 });
  }
}
