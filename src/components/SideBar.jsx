import { useState } from "react";
import { Menu, X, Home, Folder, Settings } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { PiFilmSlateFill } from "react-icons/pi";

export default function SidebarLayout() {
  // mobile open/close
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // desktop collapse
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: Home, link: "/" },
    { name: "Projects", icon: Folder, link: "/projects" },
    { name: "Settings", icon: Settings, link: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* Overlay (Mobile only) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 transform transition-all duration-300
          md:relative md:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "md:w-20" : "md:w-64"} w-64
          bg-slate-900 border-r border-slate-700 flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <NavLink to="/" className="flex gap-3 items-center">
              <PiFilmSlateFill className="text-2xl" />
              <h1 className="text-xl font-bold">CutTime</h1>
            </NavLink>
          )}

          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsSidebarOpen(!isSidebarOpen);
              } else {
                setIsCollapsed(!isCollapsed);
              }
            }}
            className="p-1 rounded hover:bg-slate-700"
          >
            {isCollapsed || !isSidebarOpen ? <Menu /> : <X />}
          </button>
        </div>

        {/* Menu */}
        <nav className="mt-4 flex-1 flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsSidebarOpen(false);
                }
              }}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 mx-2 rounded-lg transition ${
                  isActive ? "bg-blue-600" : "hover:bg-blue-500/20"
                } ${isCollapsed ? "justify-center" : ""}`
              }
            >
              <item.icon size={20} />
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 text-sm text-gray-400">
          {!isCollapsed ? "© 2026 CutTime" : "©"}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 overflow-auto">
        {/* Mobile open button */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded bg-slate-800"
          >
            <Menu />
          </button>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
