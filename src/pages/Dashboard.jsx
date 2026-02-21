import React from "react";
import TotalTime from "../components/total_time";
import { ProjectProvider } from "../context/ProjectContext";
import Ep_Completed from "../components/Ep_Completed";
import Total_hours from "../components/Total_hours";
import Total_earning from "../components/Total_earning";
import Avg_Duration from "../components/Avg_Duration";
const Dashboard = () => {
  return (
    <div className="w-full flex flex-wrap items-stretch justify-center mb-10 gap-4 md:py-3 px-2 mt-4">
      <ProjectProvider>
        <Total_earning />
        <Total_hours />
        <Ep_Completed />
        <Avg_Duration />
      </ProjectProvider>
      {/* // <TotalTime />
        // <TotalTime />
        // <TotalTime /> */}
    </div>
  );
};

export default Dashboard;
