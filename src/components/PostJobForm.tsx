"use client";
import { locations } from "@/constant";

import React, { useState } from "react";

function PostJobForm({ id }: { id: number }) {
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<{
    roleName?: string;
    location?: string;
    minCTC?: number;
    maxCTC?: number;
    postedBy?: number;
  }>({ location: "noida", postedBy: id });
  const submitHandler = async () => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/company/post-job", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const json = await response.json();
      if (!response.ok) return alert(json.message || "something went wrong");

      alert("job posted");
    } catch (error) {
      console.log(error);
      // @ts-ignore
      alert(error.message || "something went wrong");
    }
    setSubmitting(false);
  };
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {`Post A Job.`}
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                submitHandler();
              }}
            >
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  id="role"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="role"
                  required
                  onChange={(e) => {
                    // @ts-ignore
                    setData({ ...data, roleName: e.target.value });
                  }}
                />
              </div>
              <div>
                <label
                  htmlFor="locations"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Select an option
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
                  htmlFor="minCtc"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Min CTC
                </label>
                <input
                  type="number"
                  name="minCtc"
                  id="minCtc"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="min ctc"
                  // @ts-ignore
                  onChange={(e) => {
                    // @ts-ignore
                    setData({ ...data, minCTC: Number(e.target.value) });
                  }}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="maxCtc"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Max CTC
                </label>
                <input
                  type="number"
                  name="maxCtc"
                  id="maxCtc"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="max ctc"
                  required
                  onChange={(e) => {
                    // @ts-ignore
                    setData({ ...data, maxCTC: Number(e.target.value) });
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                disabled={submitting}
              >
                {submitting ? "Posting Job..." : "Post Job"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PostJobForm;
