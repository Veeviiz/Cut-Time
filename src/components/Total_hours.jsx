import React from "react";
import { useProjects } from "../context/ProjectContext";
import { BsFillStopwatchFill } from "react-icons/bs";
const Total_hours = () => {
  const { filteredProjects, lastMonthProjects } = useProjects();

  // const now = new Date();
  // const currentMonth = now.getMonth();
  // const currentYear = now.getFullYear();

  // const currentMonthProjects = projects.filter((p) => {
  //   if (!p.date) return false;
  //   const d = new Date(p.date);
  //   return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  // });

  const totalDuration = filteredProjects.reduce((sum, p) => {
    return sum + Number(p.duration || 0);
  }, 0);

  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  const lastMonthDuration = lastMonthProjects.reduce((sum, p) => {
    return sum + Number(p.duration || 0);
  }, 0);

  const lastMonthHours = Math.floor(lastMonthDuration / 3600);
  const lastMonthMinutes = Math.floor((lastMonthDuration % 3600) / 60);
  const percentChange =
    lastMonthDuration === 0
      ? totalDuration > 0
        ? 100
        : 0
      : ((totalDuration - lastMonthDuration) / lastMonthDuration) * 100;
  return (
    <>
      <div className="bg-slate-800 border border-gray-700 w-full max-w-full sm:w-full md:w-full lg:w-full h-full pb-4 flex-shrink-0 rounded-md shadow-md ">
        <div>
          <div className="p-4 flex justify-between h-full">
            <p className="text-gray-400">Total Hours Edited</p>
            <BsFillStopwatchFill size={24} className="text-blue-500" />
          </div>
          <div className="flex items-center">
            {totalDuration === 0 ? (
              <p className="text-2xl md:text-3xl text-white font-bold px-4">
                -
              </p>
            ) : (
              <p className="text-2xl md:text-3xl text-white font-bold px-4">
                {hours}h {minutes}m
              </p>
            )}
            <p
              className={`text-sm px-4 mt-1 ${percentChange >= 0 ? "text-green-400" : "text-red-400"}`}
            >
              {percentChange >= 0 ? "↑" : "↓"}{" "}
              {Math.abs(percentChange).toFixed()}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 px-4 mt-1">
              vs. {""}
              <span className="text-gray-400">
                {lastMonthHours}h {lastMonthMinutes}m
              </span>{" "}
              last month
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Total_hours;
