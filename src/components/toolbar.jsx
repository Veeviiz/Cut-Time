import React, { useState } from "react";
import { useProjects } from "../context/ProjectContext";
import AddNewModal from "./add_new_modal";

import { IoMdSearch } from "react-icons/io";
const ToolBar = () => {
  const [open, setOpen] = useState(false);
  const { search, setSearch } = useProjects();
  return (
    <>
      {/* Toolbar : Search and Add new */}
      <div className="w-full flex justify-center pt-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 p-4 md:py-4 rounded-lg bg-slate-800 w-full max-w-[95%] md:max-w-[70%] items-center">
          {/* Search */}
          <div className="relative w-full inline-flex items-center">
            <IoMdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xl" />
            <input
              className="flex-1 w-[30%] md:w-auto p-2 rounded-md bg-slate-900 focus:border-sky-500 focus:outline focus:outline-sky-500 pl-10 pr-4"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder=" Search projects by title..."
            />
          </div>

          {/* Add new Btn */}
          <button
            className="p-2 bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-500 md:ml-4 w-[30%]"
            onClick={() => setOpen(true)}
          >
            + New Project
          </button>

          {open && <AddNewModal setOpen={setOpen} />}
        </div>
      </div>
    </>
  );
};

export default ToolBar;
