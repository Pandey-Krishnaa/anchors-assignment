"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isCompany } from "@/lib/utils";
import { signOut } from "next-auth/react";

function Nav() {
  const session = useSession();
  const router = useRouter();

  let isCompany = false;
  if (session && session.data && session.data.user)
    isCompany = Object.keys(session.data.user).includes("logo");
  return (
    <nav className="flex py-3 px-1 justify-between items-center">
      <Link href={"/"} className="text-2xl font-medium">
        Career Connect
      </Link>
      {session.status === "authenticated" && (
        <div className="links flex gap-3">
          {isCompany && (
            <>
              <Link href={"/company/update"}>Update Company</Link>
              <Link href={"/company/post-job"}>Post Job</Link>
            </>
          )}
          {!isCompany && <Link href={"/student/update"}>Update Profile</Link>}
          <button
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Nav;
