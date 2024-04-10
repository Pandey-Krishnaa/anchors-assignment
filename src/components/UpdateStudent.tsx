"use client";
import React, { useState } from "react";
import { updateStudentType } from "./types";
import Link from "next/link";
import { locations } from "@/constant";
function UpdateStudent({ student }: { student: updateStudentType }) {
  const [data, setData] = useState({
    name: student.name,
    location: student.location || "noida",
    phoneNumber: student.phoneNumber,
  });
  const [submitting, setSubmitting] = useState(false);
  const submitHandler = async () => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.location) formData.append("location", data.location);
      if (data.phoneNumber)
        formData.append("phoneNumber", String(data.phoneNumber));
      // @ts-ignore
      if (data.resume) formData.append("resume", data.resume);
      // @ts-ignore
      if (data.profilePicture) {
        // @ts-ignore
        formData.append("profilePicture", data.profilePicture);
      }
      const response = await fetch("/api/student/update", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      if (!response.ok) return alert(json.message || "something went wrong");
      alert("profile updated");
    } catch (error) {
      // @ts-ignore
      alert(error.message || "something went wrong ");
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
              {`Update Your Profile.`}
            </h1>

            <form
              className="space-y-1 md:space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                submitHandler();
              }}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>
                <input
                  type="name"
                  name="name"
                  id="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="your name"
                  onChange={(e) => {
                    setData({ ...data, name: e.target.value });
                  }}
                  // @ts-ignore
                  value={data.name}
                />
              </div>
              <div>
                <label
                  htmlFor="locations"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Location
                </label>
                <select
                  id="locations"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  {locations.map((location) => {
                    return (
                      <option
                        value={location}
                        key={location}
                        onClick={(e) => {
                          // @ts-ignore
                          setData({ ...data, location });
                        }}
                        selected={location === "noida"}
                      >
                        {location.toUpperCase()}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Phone Number
                </label>
                <input
                  type="number"
                  name="phoneNumber"
                  id="phoneNumber"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="phone number"
                  value={Number(data.phoneNumber)}
                  onChange={(e) => {
                    if (e.target.value.length <= 10)
                      setData({ ...data, phoneNumber: Number(e.target.value) });
                    else {
                      return;
                    }
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="logo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Profile Picture
                </label>
                <input
                  type="file"
                  name="logo"
                  id="logo"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="company logo"
                  accept="image/png,image/jpg,image/jpeg"
                  multiple={false}
                  onChange={(e) => {
                    // @ts-ignore
                    setData({ ...data, profilePicture: e.target.files[0] });
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="resume"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Resume
                </label>
                <input
                  type="file"
                  name="resume"
                  id="resume"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="resume"
                  accept="application/pdf"
                  multiple={false}
                  onChange={(e) => {
                    // @ts-ignore
                    setData({ ...data, resume: e.target.files[0] });
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={submitting}
              >
                {submitting ? "Updating..." : "Update"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UpdateStudent;
