"use client";
import Link from "next/link";
import React, { useState } from "react";
import { updateCompanyType } from "./types";

function UpdateCompanyForm({ company }: { company: updateCompanyType }) {
  const [data, setData] = useState({
    name: company.name || "",
    teamSize: company.teamSize || 0,
    websiteLink: company.websiteLink || "",
  });
  const submitHandler = async () => {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    // @ts-ignore
    if (data.teamSize) formData.append("teamSize", data.teamSize);
    if (data.websiteLink) formData.append("websiteLink", data.websiteLink);
    // @ts-ignore
    if (data.logo) formData.append("logo", data.logo);
    try {
      const response = await fetch("/api/company/update", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) return alert(data.message || "something went wrong");
      console.log(data);
      alert("updated company profile");
    } catch (error) {
      alert("failed to updated profile");
      console.log(error);
    }
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
              {`Update Company.`}
            </h1>
            <div className="flex items-center justify-between"></div>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                submitHandler();
                console.log(data);
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
                  placeholder="company name"
                  value={data.name}
                  onChange={(e) => {
                    // @ts-ignore
                    setData({ ...data, name: e.target.value });
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="websiteLink"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Website Link
                </label>
                <input
                  type="text"
                  name="websiteLink"
                  id="websiteLink"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="website link"
                  value={data.websiteLink}
                  onChange={(e) => {
                    // @ts-ignore
                    setData({ ...data, websiteLink: e.target.value });
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="teamSize"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Team Size
                </label>
                <input
                  type="number"
                  name="teamSize"
                  id="teamSize"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="team size"
                  value={data.teamSize}
                  onChange={(e) => {
                    // @ts-ignore
                    setData({ ...data, teamSize: e.target.value });
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="logo"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Logo
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
                    setData({ ...data, logo: e.target.files[0] });
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UpdateCompanyForm;
