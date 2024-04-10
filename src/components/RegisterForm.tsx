"use client";
import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
function RegisterForm() {
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<number>();
  const [loginAs, setLoginAs] = useState<string>("student");
  const registerHandler = async () => {
    setSubmitting(true);
    if (
      !email ||
      !email.includes("@") ||
      !email.includes(".") ||
      email.length < 6
    )
      return alert("invalid email format..");
    try {
      const response = await fetch(
        `/api/${loginAs === "student" ? "student" : "company"}/register`,
        {
          method: "POST",
          body: JSON.stringify({ email }),
        }
      );
      const json = await response.json();
      if (!response.ok) return alert(json.message || "something went wrong...");
      alert("otp sent...");
      setEmailSent(true);
    } catch (error) {
      alert("something went wrong...");
    }
    setSubmitting(false);
  };
  const submitHandler = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/${loginAs === "student" ? "student" : "company"}/verify-otp`,
        {
          method: "POST",
          body: JSON.stringify({ email, otp }),
        }
      );
      const json = await response.json();
      if (!response.ok) return alert(json.message || "something went wrong...");
      alert("verifiaion completed");
    } catch (error) {
      alert("something went wrong...");
    }
    setSubmitting(false);
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Career Connect
        </Link>

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {`Let's Go.`}
            </h1>
            <div className="flex items-center justify-between">
              <button
                className={`w-full ${
                  loginAs === "student"
                    ? " bg-blue-600 text-white"
                    : "text-blue-600"
                } hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-[100px] text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                onClick={(e) => {
                  e.preventDefault();
                  setLoginAs("student");
                }}
              >
                Student
              </button>
              <button
                className={`w-full ${
                  loginAs === "company"
                    ? " bg-blue-600 text-white"
                    : "text-blue-600"
                } hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-[100px] text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
                onClick={(e) => {
                  e.preventDefault();
                  setLoginAs("company");
                }}
              >
                Company
              </button>
            </div>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                signIn("credentials", { email, otp, loginAs });
              }}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                />
              </div>
              {emailSent && (
                <div>
                  <label
                    htmlFor="otp"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your OTP
                  </label>
                  <input
                    type="number"
                    name="otp"
                    id="otp"
                    onChange={(e) => setOtp(Number(e.target.value))}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="123456"
                    required
                  />
                </div>
              )}
              {emailSent ? (
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  disabled={submitting}
                >
                  {submitting ? "Verifying OTP..." : "Verify OTP"}
                </button>
              ) : (
                <button
                  className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  disabled={submitting}
                  onClick={(e) => {
                    e.preventDefault();
                    registerHandler();
                  }}
                >
                  {submitting ? "Sending OTP..." : "Send OTP"}
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterForm;
