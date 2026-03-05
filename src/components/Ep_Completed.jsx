import React from "react";
import { BsFillStopwatchFill } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useProjects } from "../context/ProjectContext";
const Ep_Completed = () => {
  const { filteredProjects, lastMonthProjects } = useProjects();

  // console.log(`This month's projects: ${filteredProjects.length}`);
  // console.log(
  //   `This month's projects Episode: ${JSON.stringify(filteredProjects.map((p) => p.episode))}`,
  // );
  // console.log(`Last month's projects: ${lastMonthProjects.length}`);

  const episode = filteredProjects.map((p) => p.episode);

  const result = episode.map((e) => {
    const [start, end] = e.split("-").map(Number);
    return end - start + 1;
  });

  const totalEpisodes = result.reduce((sum, num) => sum + num, 0);
  console.log(totalEpisodes);

  // ฟังก์ชันนับจำนวนตอนจากรายการโปรเจกต์
  function countEpisodes(projects) {
    return projects.reduce((sum, p) => {
      if (!p.episode) return sum;

      const [start, end] = p.episode.split("-").map(Number);

      if (!end) return sum + start; // เผื่อกรณีมีแค่ตอนเดียว เช่น "5" แทนที่จะเป็น "5-5"

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
      <div className="bg-slate-800 border border-gray-700 w-full max-w-full sm:w-full md:w-full lg:w-full h-full pb-4 flex-shrink-0 rounded-md shadow-md ">
        <div>
          <div className="p-4 flex justify-between h-full">
            <p className="text-gray-400">Episodes Completed</p>
            <IoMdCheckmarkCircleOutline size={24} className="text-orange-500" />
          </div>
          <div className="flex items-center">
            <h1 className="text-2xl md:text-3xl text-white font-bold px-4">
              {totalEpisodes || 0}
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
