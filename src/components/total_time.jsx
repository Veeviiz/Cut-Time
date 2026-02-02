import React from "react";
import { useProjects } from "../context/ProjectContext";
import { BsFillStopwatchFill } from "react-icons/bs";
const TotalTime = () => {
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
  const totalMinutesRaw = totalDuration / 60;
  const totalMinutes = Number(totalMinutesRaw.toFixed(2));
  console.log(totalMinutes);
  const totalPrice = totalMinutes * 20;

  return (
    <>
      <div className="w-full flex justify-center mt-4 md:items-center">
        <div className="w-full max-w-[95%] md:max-w-[70%] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col p-3 md:p-4 rounded-lg bg-slate-800 min-w-full w-full md:w-auto">
            <p className="text-sm text-zinc-500">TOTAL PRODUCTION TIME</p>
            <div className="flex justify-center items-center gap-4">
              <BsFillStopwatchFill size={24} className="text-blue-500" />
              {totalDuration === 0 ? (
                <h1 className="text-2xl md:text-3xl text-white font-bold">-</h1>
              ) : (
                <h1 className="text-2xl md:text-3xl text-white font-bold">
                  {hours}h{minutes}m
                </h1>
              )}
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm   md:text-sm font-bold text-zinc-500">
                ทั้งหมดเป็นนาที
              </span>
              <span className="text-sm text-red-500  md:text-md font-bold ">
                {totalMinutes} min
              </span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-sm   md:text-sm font-bold text-zinc-500">
                เป็นจำนวนเงิน
              </span>
              <span className="text-sm text-green-500  md:text-md font-bold ">
                {totalPrice.toLocaleString()} ₿
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalTime;
