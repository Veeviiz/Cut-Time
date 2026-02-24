import React from "react";
import { BsFillStopwatchFill } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useProjects } from "../context/ProjectContext";
const Ep_Completed = () => {
  const { filteredProjects, lastMonthProjects } = useProjects();

  console.log(filteredProjects.length);
  console.log(lastMonthProjects.length);

  const percentChange =
    lastMonthProjects.length === 0
      ? filteredProjects.length > 0
        ? 100
        : 0
      : ((filteredProjects.length - lastMonthProjects.length) /
          lastMonthProjects.length) *
        100;
  return (
    <>
      <div className="bg-slate-800 border border-gray-700 w-full max-w-full sm:w-full md:w-full lg:w-full h-full pb-4 flex-shrink-0 rounded-md shadow-md ">
        <div>
          <div className="p-4 flex justify-between h-full">
            <p className="text-gray-400">Episodes Completed</p>
            <IoMdCheckmarkCircleOutline size={24} className="text-orange-500" />
          </div>
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl text-white font-bold px-4">
              {filteredProjects.length}
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
                {lastMonthProjects.length}
              </span>{" "}
              last month
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ep_Completed;
