import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../service/supabaseClient";

const ProjectContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  console.log(getCurrentMonth());

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const itemsPerPage = projects.length > 10 ? 5 : 10;

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);

      const { data, error } = await supabase.from("videos").select("*");
      if (error) {
        console.error("Supabase error", error);
      } else {
        setProjects(data);
      }
      setLoading(false);
    };
    loadProjects();
  }, []);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthFilterProjects = projects.filter((p) => {
    if (!p || !p.date) return false;
    if (!selectedMonth) return true;

    const d = new Date(p.date);
    const [year, month] = selectedMonth.split("-").map(Number);

    return d.getFullYear() === year && d.getMonth() === month - 1;
  });

  const currentMonthProjects = projects.filter((p) => {
    if (!p || !p.date) return false;
    const d = new Date(p.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const filteredProjects = monthFilterProjects.filter((p) => {
    if (!p || !p.date) return false;
    const keyword = search.toLowerCase();
    const thaiDate = new Date(p.date).toLocaleDateString("th-TH");

    const matchSearch =
      String(p.title).toLowerCase().includes(keyword) ||
      String(p.episode).toLowerCase().includes(keyword) ||
      String(p.date).includes(keyword) ||
      thaiDate.includes(keyword);

    const matchSelect =
      !selectedProjectTitle || p.title === selectedProjectTitle;

    return matchSearch && matchSelect;
  });
  const sortedProjects = [...filteredProjects].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentProjects = sortedProjects.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedProjectTitle, selectedMonth]);

  // useEffect(() => {
  //   const data = [];

  //   for (let i = 0; i < localStorage.length; i++) {
  //     const key = localStorage.key(i);
  //     if (key.startsWith("video:")) {
  //       data.push(JSON.parse(localStorage.getItem(key)));
  //     }
  //   }

  //   setProjects(data);
  // }, []); // โหลดข้อมูลจาก localStorage เมื่อคอมโพเนนต์ถูกสร้างขึ้น

  const addProject = async (project) => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .insert([project])
        .select();

      if (error) throw error;

      setProjects((prev) => [...prev, ...data]);
    } catch (err) {
      console.error("Insert failed:", err.message);
    }
  };

  const updateProject = async (id, updatedProject) => {
    if (!id) {
      console.error("updateProject error: id is undefined", updatedProject);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("videos")
        .update(updatedProject)
        .eq("id", id)
        .select();
      if (error) throw error;

      const updated = Array.isArray(data) ? data[0] : data;
      if (!updated) throw new Error("No updated row returned from Supabase");

      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err) {
      console.error("Update failed:", err.message);
    }
  };

  const deleteProject = async (projectId) => {
    try {
      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", projectId);
      if (error) throw error;

      localStorage.removeItem(`video:${projectId}`);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error("Delete failed:", err.message);
    }
  };
  const todayStr = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD"

  const todayProjects = projects.filter((p) => p?.date === todayStr);
  console.log("Today's Projects date:", todayProjects);
  // Average Duration
  const averageDuration =
    filteredProjects.reduce((sum, p) => sum + Number(p.duration || 0), 0) /
      filteredProjects.length || 0;

  const [year, month] = selectedMonth.split("-").map(Number);
  const selectedMonthIndex = month - 1;

  const lastMonthProjects = projects.filter((p) => {
    if (!p || !p.date) return false;

    const d = new Date(p.date);

    const lastMonth = selectedMonthIndex === 0 ? 11 : selectedMonthIndex - 1;
    const lastMonthYear = selectedMonthIndex === 0 ? year - 1 : year;

    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });
  const uniqueTitles = [
    ...new Set(projects.map((p) => p?.title).filter(Boolean)),
  ];

  const convertToProgress = (minutes) => {
    const percentage = (minutes / 25) * 100;
    return Math.min(percentage, 100);
  };

  return (
    <ProjectContext.Provider
      value={{
        uniqueTitles,
        projects,
        currentProjects,
        addProject,
        updateProject,
        deleteProject,
        search,
        setSearch,
        currentPage,
        setCurrentPage,
        totalPages,
        indexOfLastItem,
        indexOfFirstItem,
        filteredProjects,
        selectedProjectTitle,
        setSelectedProjectTitle,
        currentMonthProjects,
        selectedMonth,
        setSelectedMonth,
        averageDuration,
        lastMonthProjects,
        loading,
        convertToProgress,
        todayProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
