import React from "react";
import { useProjects } from "../context/ProjectContext";
import { BsFillStopwatchFill } from "react-icons/bs";
const TotalTime = () => {
  const { projects } = useProjects();
  const totalDuration = projects.reduce((sum, p) => {
    return sum + Number(p.duration || 0);
  }, 0);

  const hours = Math.floor(totalDuration / 60);
  const minutes = Math.round(totalDuration % 60);
  const totalPrice = Math.round(totalDuration * 20);
  return (
    <>
      <div className="w-full flex justify-center mt-4 md:items-center">
        <div className="w-full max-w-[95%] md:max-w-[70%] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="font-bold text-3xl md:text-4xl">Video Project</h1>

          <div className="flex flex-col p-3 md:p-4 rounded-lg bg-slate-800 min-w-[140px]">
            <p className="text-sm text-zinc-500">TOTAL PRODUCTION TIME</p>
            <div className="flex justify-center items-center gap-4">
              <BsFillStopwatchFill size={24} className="text-blue-500" />
              <h1 className="text-2xl md:text-3xl text-white font-bold">
                {hours}h{minutes}m
              </h1>
            </div>

            <span className="text-xl text-green-500  md:text-md font-bold ">
              ₿{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalTime;
