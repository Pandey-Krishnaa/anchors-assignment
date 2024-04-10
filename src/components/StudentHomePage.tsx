// @ts-nocheck
"use client";

import { LocateIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

function StudentHomePage() {
  const [currentTab, setCurrentTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [history, setHistory] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const submitHanlder = async (id) => {
    try {
      const response = await fetch("/api/student/jobs", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      const json = await response.json();
      if (!response.ok) return alert(json.message || "something went wrong");
      alert("applied successfully");
      setAppliedJobs([...appliedJobs, id]);
    } catch (error) {
      console.log(error);

      return alert(json.message || "something went wrong");
    }
  };
  useEffect(() => {
    setApplications([]);
    setJobs([]);
    setHistory([]);
    async function getJobs() {
      try {
        const response = await fetch("/api/student/jobs");
        const data = await response.json();
        console.log(data);

        //@ts-ignore
        if (!response.ok) return alert(error.message || "something went wrong");
        setJobs(data.jobs);
      } catch (error) {
        //@ts-ignore
        return alert(error.message || "something went wrong");
      }
    }
    async function getApplications() {
      try {
        const response = await fetch("/api/student/jobs/applications");
        const json = await response.json();
        if (!response) return alert(json.message || "something went wrong");
        console.log(json);

        setApplications(json.applications);
      } catch (error) {
        return alert(error.message || "something went wrong");
      }
    }
    async function getHistory() {
      try {
        const response = await fetch("/api/student/history");
        const json = await response.json();
        if (!response) return alert(json.message || "something went wrong");
        console.log(json);
        setHistory(json.history);
      } catch (error) {
        return alert(error.message || "something went wrong");
      }
    }
    if (currentTab === "jobs") getJobs();
    if (currentTab === "applications") getApplications();
    if (currentTab === "history") getHistory();
  }, [currentTab]);
  return (
    <div>
      <div className="flex w-screen">
        <button
          className={`text-black  px-6 py-2 border-b-2 ${
            currentTab === "jobs" ? "border-b-blue-700 " : ""
          } transition-all w-full`}
          onClick={(e) => {
            e.preventDefault();
            setCurrentTab("jobs");
          }}
        >
          Jobs
        </button>
        <button
          className={`text-black  px-6 py-2 border-b-2 ${
            currentTab === "applications" ? "border-b-blue-700 " : ""
          } transition-all w-full`}
          onClick={(e) => {
            e.preventDefault();
            setCurrentTab("applications");
          }}
        >
          Applied
        </button>
        <button
          className={`text-black  px-6 py-2 border-b-2 ${
            currentTab === "history" ? "border-b-blue-700 " : ""
          } transition-all w-full`}
          onClick={(e) => {
            e.preventDefault();
            setCurrentTab("history");
          }}
        >
          History
        </button>
      </div>
      <div className="content px-20 mt-5">
        {currentTab === "jobs" && jobs.length === 0 ? (
          <h1 className="text-center text-3xl">{`oop's no new jobs...`}</h1>
        ) : (
          jobs.map((job) => (
            <a
              key={job?.id}
              href="#"
              className="block mb-5 min-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <h5 className="mb-2 flex justify-between items-center gap-3  text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {job?.roleName}
                <span>#{job?.id}</span>
              </h5>
              <p className="font-normal text-gray-700 dark:text-gray-400 flex items-center gap-2">
                <LocateIcon />
                {job?.location?.toUpperCase()}
              </p>
              <p className="mt-3 font-normal text-gray-700 dark:text-gray-400 flex items-center gap-2">
                {job?.minCTC} - {job?.maxCTC}Rs
              </p>
              <button
                type="button"
                class="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={(e) => {
                  e.preventDefault();
                  submitHanlder(job.id);
                }}
                disabled={appliedJobs.includes(job.id)}
              >
                {appliedJobs.includes(job.id) ? "applied" : "apply"}
              </button>
            </a>
          ))
        )}
        {currentTab === "application" && applications.length === 0 ? (
          <h1>{`You haven't applied in any job`}</h1>
        ) : (
          applications.map((application) => {
            return (
              <a
                key={application.job?.id}
                href="#"
                className="block mb-5 min-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <h5 className="mb-2 flex justify-between items-center gap-3  text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {application.job?.roleName}
                  <span>#{application.job?.id}</span>
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400 flex items-center gap-2">
                  <LocateIcon />
                  {application.job?.location?.toUpperCase()}
                </p>
                <p className="mt-3 font-normal text-gray-700 dark:text-gray-400 flex items-center gap-2">
                  {application.job?.minCTC} - {application.job?.maxCTC}Rs
                </p>
                <button
                  type="button"
                  className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
                >
                  {`Spent Rs.${
                    application.job.roleName.length * 2 +
                    application.job.location.length * 5
                  }`}
                </button>
              </a>
            );
          })
        )}
        {currentTab === "history" && history.length === 0 ? (
          <h1>{`You haven't applied in any job`}</h1>
        ) : (
          history.map((hi) => {
            return (
              <a
                key={hi.id}
                href="#"
                className="block mb-5 min-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <h5 className="mb-2 flex justify-between items-center gap-3  text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {hi.reason}
                </h5>

                <button
                  type="button"
                  className="mt-5 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
                >
                  {`${hi.type === "credit" ? "+" : "-"} Rs.${hi.amount}`}
                </button>
              </a>
            );
          })
        )}
      </div>
    </div>
  );
}

export default StudentHomePage;
