import React from "react";
import { useProjects } from "../context/ProjectContext";

import { RiTimerLine } from "react-icons/ri";
const Avg_Duration = () => {
  const { averageDuration, lastMonthProjects } = useProjects();

  const averageMinutes = averageDuration / 60;

  console.log(averageDuration);

  const lastMonthAverageDuration =
    lastMonthProjects.reduce((sum, p) => {
      return sum + Number(p.duration || 0);
    }, 0) / (lastMonthProjects.length || 1);

  const percentChange =
    lastMonthAverageDuration === 0
      ? averageDuration > 0
        ? 100
        : 0
      : ((averageDuration - lastMonthAverageDuration) /
          lastMonthAverageDuration) *
        100;
  return (
    <>
      <div className="bg-slate-800 border border-gray-700 w-full max-w-full sm:w-full md:w-full lg:w-full h-full pb-4 flex-shrink-0 rounded-md shadow-md ">
        <div>
          <div className="p-4 flex justify-between h-full">
            <p className="text-gray-400">Avg. Duration</p>
            <RiTimerLine size={24} className="text-yellow-500" />
          </div>
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl text-white font-bold px-4">
              {averageMinutes.toFixed(0)} mins
            </h1>
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
                {lastMonthAverageDuration
                  ? (lastMonthAverageDuration / 60).toFixed(0) + " m"
                  : "-"}
              </span>{" "}
              last month
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Avg_Duration;
