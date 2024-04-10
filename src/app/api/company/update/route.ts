import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/next-auth-config";
import prisma from "@/db";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  api_key: process.env.CLOUDINARY_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    if (!session)
      return Response.json({ message: "please login again." }, { status: 401 });
    const id = Number(session.user.id);
    let company = await prisma.company.findFirst({ where: { id } });
    if (!company)
      return Response.json({ message: "please login again" }, { status: 401 });

    const formData = await request.formData();
    const updatedName = formData.get("name") || company.name;
    const updatedWebsiteLink =
      formData.get("websiteLink") || company.websiteLink;
    const updatedTeamSize =
      Number(formData.get("teamSize")) || company.teamSize;
    let updatedLogo: File | null = null;
    let uploadedImgUrl = company.logo;
    let uploadedImagePubId = company.logoPubId;
    // @ts-ignore
    if (formData.get("logo")) updatedLogo = formData.get("logo");
    if (updatedLogo) {
      const buffer = Buffer.from(await updatedLogo.arrayBuffer());
      const filename = Date.now() + updatedLogo.name.replaceAll(" ", "_");
      const filePath = path.join(process.cwd(), "public/uploads/" + filename);
      await writeFile(filePath, buffer);
      const uploadedImage = await cloudinary.uploader.upload(filePath);
      uploadedImgUrl = uploadedImage.secure_url;
      uploadedImagePubId = uploadedImage.public_id;
      await unlink(filePath);
    }
    let bonus = 0;
    if (!company.name) bonus += 25;
    if (!company.websiteLink) bonus += 50;
    if (!company.teamSize) bonus += 20;
    if (!company.logo) bonus += 50;
    company = await prisma.company.update({
      where: { id: company.id },
      data: {
        // @ts-ignore
        name: updatedName,
        teamSize: updatedTeamSize,
        // @ts-ignore
        websiteLink: updatedWebsiteLink,
        logo: uploadedImgUrl,
        logoPubId: uploadedImagePubId,
        credits: {
          increment: bonus,
        },
      },
    });

    return Response.json(
      { message: "company updated", company },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return Response.json(
      // @ts-ignore
      { message: error.message || "something went wrong" },
      { status: 500 }
    );
  }
}
