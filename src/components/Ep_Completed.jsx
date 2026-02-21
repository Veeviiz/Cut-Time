import React from "react";
import { BsFillStopwatchFill } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useProjects } from "../context/ProjectContext";
const Ep_Completed = () => {
  const { filteredProjects } = useProjects();

  console.log(filteredProjects);
  return (
    <>
      <div className="bg-slate-800 border border-gray-700 w-full max-w-[95%] sm:w-1/2 md:w-1/3 lg:w-70 h-full pb-4 flex-shrink-0 rounded-md shadow-md ">
        <div>
          <div className="p-4 flex justify-between h-full">
            <p className="text-gray-400">Episodes Completed</p>
            <IoMdCheckmarkCircleOutline size={24} className="text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl text-white font-bold px-4">
              {filteredProjects.length}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ep_Completed;
