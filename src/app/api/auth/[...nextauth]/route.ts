import { authConfig } from "@/lib/next-auth-config";
import NextAuth from "next-auth";
// @ts-ignore
const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
