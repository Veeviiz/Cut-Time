// import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Link, Route, Routes, BrowserRouter } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import SideBar from "./components/SideBar";

function App() {
  return (
    <>
      {/* <Navbar /> */}

      <Routes>
        <Route path="/" element={<SideBar />}>
          <Route index element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
