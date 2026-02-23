import React, { useState } from "react";
import { useProjects } from "../context/ProjectContext";
import AddNewModal from "./add_new_modal";
import { IoMdSearch } from "react-icons/io";

const ToolBar = () => {
  const [open, setOpen] = useState(false);
  const {
    search,
    setSearch,
    uniqueTitles,
    setSelectedProjectTitle,
    selectedProjectTitle,
    selectedMonth,
    setSelectedMonth,
  } = useProjects();

  return (
    <>
      <div className="w-full flex justify-center pt-4">
        {/* MAIN CONTAINER */}
        <div className="w-full max-w-[95%] md:max-w-[70%] bg-slate-800 rounded-xl p-4 flex flex-col gap-4">
          {/* TOP ROW : Search + Button */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full md:flex-1">
              <IoMdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xl" />
              <input
                className="w-full bg-slate-900 text-white placeholder:text-zinc-500 pl-10 pr-4 py-2 rounded-md focus:outline focus:outline-sky-500"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects by title or episode..."
              />
            </div>

            {/* Add new */}
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-sky-500 w-full md:w-auto"
              onClick={() => setOpen(true)}
            >
              + New Project
            </button>
          </div>

          {/* BOTTOM ROW : FILTER */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-sm">
              <span className="text-zinc-400 flex items-center gap-2">
                MONTH FILTER:
              </span>
              <div className="relative">
                <input
                  type="month"
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  value={selectedMonth}
                  className="appearance-none bg-slate-900 text-white px-3 py-2 rounded-md focus:outline focus:outline-sky-500 w-full md:w-auto"
                ></input>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-sm">
              <span className="text-zinc-400 flex items-center gap-2">
                FILTER BY:
              </span>

              <div className="relative">
                <select
                  className="appearance-none bg-slate-900 text-white px-3 py-2 pr-10 rounded-md focus:outline focus:outline-sky-500 w-full md:w-auto"
                  value={selectedProjectTitle}
                  onChange={(e) => setSelectedProjectTitle(e.target.value)}
                >
                  <option value="">All Projects</option>
                  {uniqueTitles.map((title) => (
                    <option key={title} value={title}>
                      {title}
                    </option>
                  ))}
                </select>

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  ▼
                </span>
              </div>

              {/* Clear */}
              <button
                className="text-blue-400 hover:underline ml-0 md:ml-2"
                onClick={() => setSelectedProjectTitle("")}
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && <AddNewModal setOpen={setOpen} />}
    </>
  );
};

export default ToolBar;
