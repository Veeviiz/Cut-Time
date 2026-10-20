import React from "react";
import TotalTime from "../components/total_time";
import ToolBar from "../components/toolbar";
import ProjectTable from "../components/project_table";
import { ProjectProvider } from "../context/ProjectContext";
const Home = () => {
  return (
    <div className="w-full text-white">
      <div className="mx-auto pt-4 px-4">
      <ProjectProvider>
        <ToolBar />
        <ProjectTable />
      </ProjectProvider>
      </div>
    </div>
  );
};

export default Home;
