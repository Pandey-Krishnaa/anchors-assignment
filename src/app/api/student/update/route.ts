import prisma from "@/db";
import { authConfig } from "@/lib/next-auth-config";
import { writeFile, unlink } from "fs/promises";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
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
    if (!session || !session.user || !session.user.id)
      return Response.json({ message: "not logged in" }, { status: 401 });
    const id = Number(session.user.id);
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student)
      return Response.json({ message: "not logged in" }, { status: 401 });
    const data = await request.formData();
    const updatedName = data.get("name") || student.name;
    const updatedLocation = data.get("location") || student.location;
    const updatedPhoneNumber = data.get("phoneNumber") || student.phoneNumber;
    let updatedProfilePicUrl = student.profilePic;
    let updatedProfilePicPubId = student.profilePicPubId;
    let updatedResumeUrl = student.resume;
    let updatedResumePubId = student.resumePubId;
    if (data.get("profilePicture")) {
      // @ts-ignore
      const file: File = data.get("profilePicture");
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + file.name.replaceAll(" ", "_");
      const filePath = path.join(process.cwd(), "public/uploads/" + filename);
      await writeFile(filePath, buffer);
      const uploadedImage = await cloudinary.uploader.upload(filePath);
      updatedProfilePicUrl = uploadedImage.secure_url;
      updatedProfilePicPubId = uploadedImage.public_id;
      await unlink(filePath);
    }
    if (data.get("resume")) {
      // @ts-ignore
      const file: File = data.get("resume");
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = Date.now() + file.name.replaceAll(" ", "_");
      const filePath = path.join(process.cwd(), "public/uploads/" + filename);
      await writeFile(filePath, buffer);
      const uploadedImage = await cloudinary.uploader.upload(filePath);
      updatedResumeUrl = uploadedImage.secure_url;
      updatedProfilePicPubId = uploadedImage.public_id;
      await unlink(filePath);
    }

    await prisma.student.update({
      where: { id: student.id },
      data: {
        resume: updatedResumeUrl,
        resumePubId: updatedResumePubId,
        profilePic: updatedProfilePicUrl,
        profilePicPubId: updatedProfilePicPubId,

        name: String(updatedName),
        location: String(updatedLocation),
        phoneNumber: Number(updatedPhoneNumber),
      },
    });
    return Response.json({ message: "profile updated" }, { status: 200 });
  } catch (error) {
    return Response.json(
      // @ts-ignore
      { message: error.message || "something went wrong" },
      { status: 500 }
    );
  }
}
