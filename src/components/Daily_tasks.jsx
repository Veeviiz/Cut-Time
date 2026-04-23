import { React } from "react";
import TimeProgressBar from "../util/TimeProgressBar";
import { useProjects } from "../context/ProjectContext";
const Daily_tasks = () => {
  const { todayProjects } = useProjects();

  const maxMinute = 25;

  const totalSeconds = todayProjects.reduce(
    (sum, p) => sum + (p.duration || 0),
    0,
  );

  const currentMinute = Math.floor(totalSeconds / 60);
  return (
    <>
      <div className="w-full py-4 bg-slate-800 border border-gray-700 w-full max-w-full sm:w-full md:w-full lg:w-full h-full pb-4 flex-shrink-0 rounded-md shadow-md my-4">
        <div className="px-4 flex justify-between h-full">
          <p className="text-3xl font-bold">Daily Goal</p>
        </div>
        <div className="px-4 mt-2 text-gray-400">
          <TimeProgressBar
            currentMinute={currentMinute}
            maxMinute={maxMinute}
          />
          <p className="text-sm text-gray-400 mt-2">
            {currentMinute >= maxMinute
              ? "Great job! You've reached your daily goal!"
              : `Keep going! You have ${maxMinute - currentMinute} minutes left to reach your goal.`}
          </p>
        </div>
      </div>
    </>
  );
};

export default Daily_tasks;
