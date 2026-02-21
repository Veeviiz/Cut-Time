import React from "react";
import { useProjects } from "../context/ProjectContext";
import { BsFillStopwatchFill } from "react-icons/bs";
const Total_hours = () => {
  const { projects } = useProjects();

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthProjects = projects.filter((p) => {
    if (!p.date) return false;
    const d = new Date(p.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalDuration = currentMonthProjects.reduce((sum, p) => {
    return sum + Number(p.duration || 0);
  }, 0);

  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);

  return (
    <>
      <div className="bg-slate-800 border border-gray-700 w-full max-w-[95%] sm:w-1/2 md:w-1/3 lg:w-70 h-full pb-4 flex-shrink-0 rounded-md shadow-md ">
        <div>
          <div className="p-4 flex justify-between h-full">
            <p className="text-gray-400">Total Hours Edited</p>
            <BsFillStopwatchFill size={24} className="text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl text-white font-bold px-4">
              {totalDuration === 0 ? (
                <h1 className="text-2xl md:text-3xl text-white font-bold">-</h1>
              ) : (
                <h1 className="text-2xl md:text-3xl text-white font-bold">
                  {hours}h {minutes}m
                </h1>
              )}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Total_hours;
