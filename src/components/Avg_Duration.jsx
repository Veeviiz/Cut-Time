import React from "react";
import { useProjects } from "../context/ProjectContext";

import { RiTimerLine } from "react-icons/ri";
const Avg_Duration = () => {
  const { averageDuration } = useProjects();

  const averageMinutes = averageDuration / 60;
  return (
    <>
      <div className="bg-slate-800 border border-gray-700 w-full max-w-full sm:w-full md:w-full lg:w-full h-full pb-4 flex-shrink-0 rounded-md shadow-md ">
        <div>
          <div className="p-4 flex justify-between h-full">
            <p className="text-gray-400">Avg. Duration</p>
            <RiTimerLine size={24} className="text-yellow-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl text-white font-bold px-4">
              {averageMinutes.toFixed(2)} mins
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Avg_Duration;
