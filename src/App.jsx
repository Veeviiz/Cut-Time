// import { useState } from "react";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/projects" element={<Home />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
