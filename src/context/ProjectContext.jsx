import { createContext, useContext, useEffect, useState } from "react";

const ProjectContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjectTitle, setSelectedProjectTitle] = useState("");

  const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  };

  console.log(getCurrentMonth());

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const itemsPerPage = 5;

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthFilterProjects = projects.filter((p) => {
    if (!p.date) return false;
    if (!selectedMonth) return true;

    return p.date.startsWith(selectedMonth);
  });

  const currentMonthProjects = projects.filter((p) => {
    if (!p.date) return false;
    const d = new Date(p.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const filteredProjects = monthFilterProjects.filter((p) => {
    const keyword = search.toLowerCase();
    const thaiDate = new Date(p.date).toLocaleDateString("th-TH");

    const matchSearch =
      p.title.toLowerCase().includes(keyword) ||
      p.episode.toLowerCase().includes(keyword) ||
      p.date.includes(keyword) ||
      thaiDate.includes(keyword);

    const matchSelect =
      !selectedProjectTitle || p.title === selectedProjectTitle;

    return matchSearch && matchSelect;
  });
  const sortedProjects = [...filteredProjects].sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentProjects = sortedProjects.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [search, selectedProjectTitle, selectedMonth]);
  useEffect(() => {
    const data = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("video:")) {
        data.push(JSON.parse(localStorage.getItem(key)));
      }
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProjects(data);
  }, []); //

  const addProject = (project) => {
    localStorage.setItem(`video:${project.id}`, JSON.stringify(project));
    setProjects((prev) => [...prev, project]);
  };

  const updateProject = (id, updatedProject) => {
    if (!id) {
      console.error("updateProject error: id is undefined", updatedProject);
      return;
    }
    localStorage.setItem(`video:${id}`, JSON.stringify(updatedProject));

    setProjects((prev) => prev.map((p) => (p.id === id ? updatedProject : p)));
  };

  const deleteProject = (projectId) => {
    localStorage.removeItem(`video:${projectId}`);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  // Average Duration
  const averageDuration =
    projects.reduce((sum, p) => sum + Number(p.duration || 0), 0) /
      projects.length || 0;

  const uniqueTitles = [...new Set(projects.map((p) => p.title))];
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
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
