// import { useState } from "react";

import TotalTime from "./components/total_time";
import ToolBar from "./components/toolbar";
import ProjectTable from "./components/project_table";
import { ProjectProvider } from "./context/ProjectContext";
import "./App.css";

function App() {
  return (
    <>
      <ProjectProvider>
        <TotalTime />
        <ToolBar />
        <ProjectTable></ProjectTable>
      </ProjectProvider>
    </>
  );
}

export default App;
