import React from "react";
import { useProjects } from "../context/ProjectContext";

import { MdMonetizationOn } from "react-icons/md";
const Total_earning = () => {
  const { filteredProjects, lastMonthProjects } = useProjects();
  // const now = new Date();
  // const currentMonth = now.getMonth();
  // const currentYear = now.getFullYear();

  // const currentMonthProjects = filteredProjects.filter((p) => {
  //   if (!p.date) return false;
  //   const d = new Date(p.date);
  //   return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  // });

  // console.log(currentMonthProjects);
  const totalDuration = filteredProjects.reduce((sum, p) => {
    return sum + Number(p.duration || 0);
  }, 0);
  const totalMinutesRaw = totalDuration / 60;
  const totalMinutes = Number(totalMinutesRaw.toFixed(2));
  console.log(totalMinutes);
  const totalPrice = totalMinutes * 20;

  const lastMonthEarning = lastMonthProjects.reduce((sum, p) => {
    const minutes = Number(p.duration || 0) / 60;
    return sum + minutes * 20;
  }, 0);

  const percentChange =
    lastMonthEarning === 0
      ? 0
      : ((totalPrice - lastMonthEarning) / lastMonthEarning) * 100;
  return (
    <>
      <div className="bg-slate-800 border border-gray-700 w-full max-w-full sm:w-full md:w-full lg:w-full h-full pb-4 flex-shrink-0 rounded-md shadow-md ">
        <div>
          <div className="p-4 flex justify-between h-full">
            <p className="text-gray-400">Total Earnings</p>
            <MdMonetizationOn size={24} className="text-green-500" />
          </div>
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl text-white font-bold px-4">
              ₿{totalPrice.toLocaleString()}
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
                ₿
                {lastMonthEarning.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>{" "}
              last month
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Total_earning;
