import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../service/supabaseClient";
import { computeAggregates, toMonthKey } from "../util/helpers";

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

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [defaultMonthSet, setDefaultMonthSet] = useState(false);
  const itemsPerPage = projects.length > 10 ? 5 : 10;

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("videos").select("*");
      if (error) console.error("Supabase error", error);
      else setProjects(data || []);
      setLoading(false);
    };
    loadProjects();
  }, []);

  useEffect(
    () => setCurrentPage(1),
    [search, selectedProjectTitle, selectedMonth],
  );

  // derive all useful values in a single pass via computeAggregates helper
  const derived = useMemo(() => {
    return computeAggregates(projects, {
      selectedMonth,
      selectedProjectTitle,
      search,
      todayKey: new Date().toLocaleDateString("en-CA"),
    });
  }, [projects, selectedMonth, selectedProjectTitle, search]);

  const {
    uniqueTitles,
    sortedProjects,
    averageDuration,
    lastMonthProjects,
    currentMonthProjects,
    todayProjects,
    percentChange,
    lastMonthEarning,
    totalPrice,
    priceEverymonth,
    projectEpCount,
    lastProjectDate,
    monthOptions,
  } = derived;

  // when projects load first time, default selectedMonth to the month of the latest project
  useEffect(() => {
    if (defaultMonthSet) return;
    if (!projects || projects.length === 0) return;

    if (
      lastProjectDate &&
      lastProjectDate.getTime &&
      lastProjectDate.getTime() > 0
    ) {
      setSelectedMonth(toMonthKey(lastProjectDate));
    } else if (monthOptions && monthOptions.length > 0) {
      setSelectedMonth(monthOptions[0].value);
    }

    setDefaultMonthSet(true);
  }, [projects, lastProjectDate, monthOptions, defaultMonthSet]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjects = sortedProjects.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(sortedProjects.length / itemsPerPage),
  );

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
  const convertToProgress = (minutes) => Math.min((minutes / 25) * 100, 100);
  const selectedEpCount = projectEpCount;
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
        filteredProjects: sortedProjects,
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
        percentChange,
        lastMonthEarning,
        totalPrice,
        priceEverymonth,
        selectedEpCount,
        monthOptions,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
