import React from "react";
import { ProjectProvider, useProjects } from "../context/ProjectContext";
import { StatCardSkeleton } from "../util/skeletonLoading";
import Ep_Completed from "../components/Ep_Completed";
import Total_hours from "../components/Total_hours";
import Total_earning from "../components/Total_earning";
import Avg_Duration from "../components/Avg_Duration";
import Daily_tasks from "../components/Daily_tasks";

const DashboardContent = () => {
  const { selectedMonth, setSelectedMonth, loading } = useProjects();

  console.log(localStorage);
  return (
    <div className="w-full text-white">
      <div className="mx-auto pt-8 px-4">
        {/* Header */}
        <Daily_tasks />
        <div className="w-full py-4 bg-slate-800 border border-gray-700 w-full max-w-full sm:w-full md:w-full lg:w-full h-full pb-4 flex-shrink-0 rounded-md shadow-md my-4 px-4">
          <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-4 ">
            <h1 className="text-4xl font-bold">Dashboard</h1>

            <div className="flex gap-4 items-center text-sm md:text-base">
              <span className="text-zinc-400">Monthly Summary</span>

              <input
                type="month"
                onChange={(e) => setSelectedMonth(e.target.value)}
                value={selectedMonth}
                className="bg-slate-900 text-white px-3 py-1 rounded-md 
                         focus:outline focus:outline-sky-500"
              />
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
            {loading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <StatCardSkeleton key={i} />
                ))}
              </>
            ) : (
              <>
                <Total_earning />
                <Total_hours />
                <Ep_Completed />
                <Avg_Duration />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <ProjectProvider>
      <DashboardContent />
    </ProjectProvider>
  );
};

export default Dashboard;
