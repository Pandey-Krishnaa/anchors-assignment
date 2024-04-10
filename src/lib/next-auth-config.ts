import prisma from "@/db";
import CredentialProvider from "next-auth/providers/credentials";
export const authConfig = {
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "email",
          type: "email",
          placeholder: "youremail@gmail.com",
        },
        password: { label: "OTP", type: "text" },
        loginAs: { label: "Login as", type: "text" },
      },
      //   @ts-ignore
      async authorize(credentials: any) {
        console.log(credentials);

        if (credentials.loginAs === "student") {
          const student = await prisma.student.findFirst({
            where: { email: credentials.email, otp: Number(credentials.otp) },
          });
          console.log(student);
          if (!student) return null;
          return student;
        } else {
          const company = await prisma.company.findFirst({
            where: { email: credentials.email, otp: Number(credentials.otp) },
          });
          if (!company) return null;
          console.log(company);

          return company;
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }: any) => {
      user && (token.user = user);
      return token;
    },
    session: async ({ session, token }: any) => {
      session.user = token.user; // Setting token in session
      return session;
    },
  },
  pages: {
    signIn: "/register", //Need to define custom login page (if using)
  },
};
