import React from "react";
import TotalTime from "../components/total_time";
import ToolBar from "../components/toolbar";
import ProjectTable from "../components/project_table";
import { ProjectProvider } from "../context/ProjectContext";
const Home = () => {
  return (
    <div>
      <ProjectProvider>
        <ToolBar />
        <ProjectTable />
      </ProjectProvider>
    </div>
  );
};

export default Home;
