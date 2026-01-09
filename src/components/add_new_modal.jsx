import React, { useEffect, useState, useRef } from "react";
import DropZone from "./DropZone";
import { useProjects } from "../context/ProjectContext";
import { FaFilePen } from "react-icons/fa6";
import { IoTime } from "react-icons/io5";
import { MdOutlineNumbers } from "react-icons/md";

const AddNewModal = ({ setOpen, onSuccess }) => {
  const { addProject } = useProjects();
  const [formData, setFormData] = useState({
    title: "",
    episode: "",
    duration: "",
    date: "",
  });
  const fileRef = useRef(null);
  const handleSubmit = () => {
    if (
      !formData.title ||
      !formData.episode ||
      !formData.duration ||
      !formData.date
    )
      return alert("กรุณากรอกข้อมูลให้ครบ");

    const newProject = {
      id: Date.now().toString(),
      ...formData,
      updated: formData.date || new Date().toLocaleString(),
    };

    try {
      addProject(newProject);
      if (typeof onSuccess === "function") onSuccess();
      window.dispatchEvent(new Event("projectsUpdated"));
      setOpen(false);
      setFormData({ title: "", episode: "", duration: "", date: "" });
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  // ฟังก์ชันอ่าน duration ของวิดีโอ

  const getVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
    });
  };

  const parseFileName = (fileName) => {
    const name = fileName.replace(/\.[^/.]+$/, "").trim();

    // จับช่วงตอน เช่น 91-93
    const rangeMatch = name.match(/(\d+)\s*-\s*(\d+)/);

    if (rangeMatch) {
      const episode = `${rangeMatch[1]}-${rangeMatch[2]}`;
      const title = name
        .replace(rangeMatch[0], "")
        .replace(/ตัวอย่าง|preview/gi, "")
        .trim();

      return { title, episode };
    }

    // fallback จับตอนเดียว
    const singleMatch = name.match(/(ep|episode|ตอน)?\s*(\d+)/i);

    if (singleMatch) {
      const episode = singleMatch[2];
      const title = name.replace(singleMatch[0], "").trim();
      return { title, episode };
    }

    return { title: name, episode: "" };
  };

  const handleFileSelect = async (files) => {
    const file = files[0];
    if (!file) return;

    // ดึง duration
    const duration = await getVideoDuration(file);
    const { title, episode } = parseFileName(file.name);
    setFormData((prev) => ({
      ...prev,
      title,
      episode,
      duration: (duration / 60).toFixed(2),
      date: new Date().toISOString().split("T")[0],
    }));
  };
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="flex flex-col justify-between bg-slate-800 rounded-lg p-6 w-full max-w-lg md:max-w-[50%]">
          <h1 className="flex text-2xl font-bold pb-8">New Video Project</h1>
          {/* Input */}
          <div className="flex flex-col items-start mb-8">
            <form autoComplete="on" className="w-full text-start">
              <label className="px-2">Project Title</label>
              <div className="relative w-full inline-flex items-center">
                <FaFilePen className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xl" />
                <input
                  name="title"
                  autoComplete="on"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full mt-2 mb-2 p-2 rounded-md bg-slate-900 focus:border-sky-500 focus:outline focus:outline-sky-500 pl-10 pr-4"
                  type="text"
                  placeholder="Project title"
                />
              </div>

              {/* Row */}
              <div className=" flex  justify-between w-full gap-10">
                {/* EP */}
                <div className="flex  flex-col w-[50%] items-start">
                  <label className="px-2">Episode #</label>
                  <div className="relative w-full inline-flex items-center">
                    <MdOutlineNumbers className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xl" />
                    <input
                      name="episode"
                      value={formData.episode}
                      onChange={(e) =>
                        setFormData({ ...formData, episode: e.target.value })
                      }
                      className="w-full mt-2 mb-2 p-2 rounded-md bg-slate-900 focus:border-sky-500 focus:outline focus:outline-sky-500 pl-10 pr-4"
                      type="text"
                      placeholder="10-11"
                    />
                  </div>
                </div>
                {/* Min */}
                <div className="flex flex-col w-[50%] items-start">
                  <div className="flex">
                    <label className="px-2">Duration</label>
                    <span className="text-gray-500">(minutes)</span>
                  </div>
                  <div className="relative w-full inline-flex items-center">
                    <IoTime className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xl" />
                    <input
                      name="duration"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full mt-2 mb-2 p-2 rounded-md bg-slate-900 focus:border-sky-500 focus:outline focus:outline-sky-500 pl-10 pr-4"
                      type="text"
                      placeholder="00:00"
                    />
                  </div>
                </div>
              </div>
              <label className="px-2">Date</label>
              <input
                value={formData.date}
                type="date"
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                name="date"
                id=""
                className="w-full mt-2 mb-2 p-2 rounded-md bg-slate-900 focus:border-sky-500 focus:outline focus:outline-sky-500"
              />
              <input
                type="file"
                accept="video/*"
                multiple
                hidden
                ref={fileRef}
                onChange={(e) => handleFileSelect(Array.from(e.target.files))}
                className="w-full mt-2 mb-2 p-2 rounded-md bg-slate-900 cursor-pointer focus:border-sky-500 focus:outline focus:outline-sky-500"
              />
            </form>
            <DropZone
              onFiles={handleFileSelect}
              onClick={() => fileRef.current.click()}
            />
          </div>
          <hr className="border-sky-500 mb-8" />
          {/* footer */}
          <div className="flex justify-end gap-7 ">
            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer hover:text-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-blue-600 text-white cursor-pointer hover:bg-sky-500"
            >
              + Create Project
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewModal;
