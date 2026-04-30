import React from "react";
import { useProjects } from "../context/ProjectContext";
import { PieChart } from "@mui/x-charts/PieChart";
import { MdMovie } from "react-icons/md";
const PieChartData = () => {
  const { selectedEpCount } = useProjects();

  return (
    <>
      <div className="w-full h-64 md:h-96 bg-slate-900 rounded-md p-4 border border-gray-700">
        <div className="flex items-center justify-between ">
          <div className="flex items-center justify-start ">
            <MdMovie className="text-2xl mr-2" />
            <h1>จำนวนตอนของแต่ละเรื่อง</h1>
          </div>

          {/* <div className="relative">
            <select
              className="appearance-none bg-slate-900 text-white px-3  pr-10 rounded-md focus:outline focus:outline-sky-500 w-full md:w-auto"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">ทุกเดือน</option>

              {monthOptions.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400">
              ▼
            </span>
          </div> */}
        </div>
        <PieChart
          series={[
            {
              data: Object.entries(selectedEpCount).map(
                ([label, value], index) => ({
                  id: index,
                  label,
                  value,
                }),
              ),

              innerRadius: 50,
              paddingAngle: 2,

              highlightScope: { fade: "global", highlight: "item" },

              faded: {
                innerRadius: 50,
                additionalRadius: -10,
                color: "#444",
              },

              highlighted: {
                additionalRadius: 5,
              },

              valueFormatter: (item) => `${item.value} ตอน`,
            },
          ]}
          sx={{
            width: "100%",
            height: "100%",
            // backgroundColor: "oklch(0.208 0.042 265.755)",
            borderRadius: 2,
            // border: "1px solid oklch(0.373 0.034 259.733)",
            p: 2,
            display: "flex",
            flexDirection: "column",
            "& .MuiChartsLegend-root": {
              color: "#ffffff",
              display: "flex",
              flexDirection: "row",
              justifyContent: "start",
              fontFamily: "Kanit, sans-serif",

              //  ซ่อนเมื่อจอเล็ก (mobile)
              "@media (max-width:600px)": {
                display: "none",
              },
            },

            "& .MuiChartsArc-root": {
              stroke: "#111",
              strokeWidth: 2,
              transition: "all 0.3s ease",
            },
          }}
        />
      </div>
    </>
  );
};

export default PieChartData;
