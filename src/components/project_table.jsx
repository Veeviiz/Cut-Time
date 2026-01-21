import React, { useState } from "react";
import { useProjects } from "../context/ProjectContext";
import { IoTrashBinOutline } from "react-icons/io5";
import { BiEdit } from "react-icons/bi";
import AddNewModal from "./add_new_modal";
const ProjectTable = () => {
  const [editingProject, setEditingProject] = useState(null);
  const { deleteProject } = useProjects();
  const {
    currentProjects,
    indexOfFirstItem,
    indexOfLastItem,
    currentPage,
    setCurrentPage,
    totalPages,
    filteredProjects,
  } = useProjects();
  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  if (currentProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <p className="text-lg">ยังไม่มีโปรเจกต์</p>
        <p className="text-sm">กด “Create Project” เพื่อเริ่มต้น</p>
      </div>
    );
  }

  const confirmDelete = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(projectId);
    }
  };
  return (
    <>
      <div className="w-full flex justify-center mt-6">
        <div className="w-full max-w-[95%] md:max-w-[70%] rounded-t-lg text-white">
          {/* Mobile list view (small screens) */}
          <div className="block md:hidden space-y-3">
            {currentProjects.map((p) => (
              <div
                key={p.id}
                className="bg-slate-900 border border-gray-800 rounded-lg p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">{p.date}</div>
                  <div className="text-sm text-gray-400">EP {p.episode}</div>
                </div>
                <div className="font-medium text-lg">{p.title}</div>
                <div className="flex  items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Duration</div>
                    <div className="font-medium">
                      {formatDuration(p.duration)}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      className="px-2 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded"
                      onClick={() => setEditingProject(p)}
                    >
                      <BiEdit />
                    </button>
                    {editingProject && (
                      <AddNewModal
                        setOpen={() => setEditingProject(null)}
                        project={editingProject}
                      />
                    )}
                    <button
                      className="px-2 py-2  text-sm bg-gray-700 hover:bg-gray-600 rounded"
                      onClick={() => deleteProject(p.id)}
                    >
                      <IoTrashBinOutline className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/table view (md and up) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full rounded-t-lg overflow-hidden table-fixed">
              <thead className="bg-slate-800">
                <tr className="text-gray-400 text-sm border-b border-gray-700">
                  <th className="py-3 px-4 text-left">DATE</th>
                  <th className="text-left">PROJECT TITLE</th>
                  <th className="py-3 px-4">EPISODE</th>
                  <th className="py-3 px-4">DURATION</th>
                  <th className="py-3 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>

              <tbody className="bg-slate-800">
                {currentProjects.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-800 bg-slate-900 hover:bg-slate-800 transition "
                  >
                    <td className="py-6 px-4 font-medium text-left">
                      {p.date}
                    </td>
                    <td className="py-7  flex items-center gap-1  ">
                      <div className="font-medium ">{p.title}</div>
                    </td>
                    <td className="py-6 px-4">
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                        EP {p.episode}
                      </span>
                    </td>
                    <td className="py-6 px-4 font-medium">
                      {formatDuration(p.duration)}
                    </td>
                    <td className="py-6 px-4 text-right ">
                      <div className="gap-2 flex justify-end">
                        <button
                          className="px-2 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded cursor-pointer"
                          onClick={() => setEditingProject(p)}
                        >
                          <BiEdit />
                        </button>
                        {editingProject && (
                          <AddNewModal
                            setOpen={() => setEditingProject(null)}
                            project={editingProject}
                          />
                        )}
                        <button
                          className="px-2 py-2  text-sm bg-gray-700 hover:bg-gray-600 rounded cursor-pointer"
                          onClick={() => confirmDelete(p.id)}
                        >
                          <IoTrashBinOutline className="text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="min-w-full rounded-b-lg overflow-hidden table-fixed bg-slate-800 flex justify-between px-4 py-3 items-center mt-3">
            {currentProjects.length > 0 ? (
              <p className="text-sm text-gray-400">
                Showing {indexOfFirstItem + 1}–
                {Math.min(indexOfLastItem, filteredProjects.length)} of{" "}
                {filteredProjects.length} Clips
              </p>
            ) : (
              <p className="text-sm text-gray-500">No Clips Found</p>
            )}
            <div className="flex  gap-2 ">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded cursor-pointer ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-gray-300"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectTable;
