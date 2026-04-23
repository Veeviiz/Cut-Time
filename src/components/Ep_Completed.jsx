import React from "react";
import { BsFillStopwatchFill } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import NumberAnimate from "../util/NumberAnimate";
import { useProjects } from "../context/ProjectContext";
const Ep_Completed = () => {
  const { filteredProjects, lastMonthProjects } = useProjects();

  // console.log(`This month's projects: ${filteredProjects.length}`);
  // console.log(
  //   `This month's projects Episode: ${JSON.stringify(filteredProjects.map((p) => p.episode))}`,
  // );
  // console.log(`Last month's projects: ${lastMonthProjects.length}`);

  // const episode = filteredProjects.map((p) => p.episode);

  // episode.forEach((e) => {
  //   const [start, end] = (e || "").split("-").map(Number);
  //   console.log(e, start, end);
  // });

  // const result = episode.map((e) => {
  //   const [start, end] = e.split("-").map(Number);
  //   return end - start + 1;
  // });

  // const totalEpisodes = result.reduce((sum, num) => sum + num, 0);
  // console.log("Total Episodes:", totalEpisodes);

  const totalEpisodes = filteredProjects.reduce((sum, p) => {
    if (!p.episode) return sum;

    if (p.episode.includes("-")) {
      const [start, end] = p.episode.split("-").map(Number);

      if (isNaN(start) || isNaN(end)) return sum;

      return sum + (end - start + 1);
    } else {
      const num = Number(p.episode);
      if (isNaN(num)) return sum;

      return sum + 1; // ตอนเดียว
    }
  }, 0);

  console.log("Total Episodes:", totalEpisodes);

  // ฟังก์ชันนับจำนวนตอนจากรายการโปรเจกต์
  function countEpisodes(projects) {
    return projects.reduce((sum, p) => {
      if (!p.episode) return sum;

      const parts = p.episode.split("-").map((s) => s.trim());
      const start = Number(parts[0]);
      const end = parts[1] ? Number(parts[1]) : null;

      if (isNaN(start)) return sum; // ถ้า start ไม่ใช่ตัวเลข ให้ข้ามรายการนี้

      // กรณีมีตัวเดียว เช่น "5"
      if (end === null || isNaN(end)) {
        return sum + 1;
      }

      if (end < start) return sum;

      return sum + (end - start + 1);
    }, 0);
  }
  const currentEpisodes = countEpisodes(filteredProjects);
  const lastMonthEpisodes = countEpisodes(lastMonthProjects);

  console.log(`Current month episodes: ${currentEpisodes}`);
  console.log(`Last month episodes: ${lastMonthEpisodes}`);
  const percentChange =
    lastMonthEpisodes === 0
      ? currentEpisodes > 0
        ? 100
        : 0
      : ((currentEpisodes - lastMonthEpisodes) / lastMonthEpisodes) * 100;
  return (
    <>
      <div className="bg-slate-900 border border-gray-700 w-full max-w-full sm:w-full md:w-full lg:w-full h-full pb-4 flex-shrink-0 rounded-md shadow-md hover:scale-105 duration-300">
        <div>
          <div className="p-4 flex justify-between h-full">
            <p className="text-gray-400">Episodes Completed</p>
            <IoMdCheckmarkCircleOutline size={24} className="text-orange-500" />
          </div>
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl text-white font-bold px-4">
              <NumberAnimate
                value={totalEpisodes || 0}
                type="number"
              ></NumberAnimate>
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
                {lastMonthEpisodes || 0}
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
