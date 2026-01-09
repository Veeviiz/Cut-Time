import { createContext, useContext, useEffect, useState } from "react";

const ProjectContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );
  const sortedProjects = [...filteredProjects].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentProjects = sortedProjects.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [search]);
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

  const deleteProject = (projectId) => {
    localStorage.removeItem(`video:${projectId}`);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProjects,
        addProject,
        deleteProject,
        search,
        setSearch,
        currentPage,
        setCurrentPage,
        totalPages,
        indexOfLastItem,
        indexOfFirstItem,
        filteredProjects,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
