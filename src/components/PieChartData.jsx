import React from "react";
import { useProjects } from "../context/ProjectContext";
import { PieChart } from "@mui/x-charts/PieChart";
const PieChartData = () => {
  const { projects } = useProjects();

  // แยกชื่อโปรเจกต์และรวมตอนของแต่ละโปรเจกต์
  const projectEpCount = {};
  projects.forEach((p) => {
    if (!p?.title || !p?.episode) return;

    // แยกช่วงตอน
    const [start, end] = p.episode.split("-").map(Number);

    let count = 0;

    if (!isNaN(start) && !isNaN(end)) {
      count = end - start + 1;
    } else if (!isNaN(start)) {
      count = 1; // กรณี "48"
    }

    if (!projectEpCount[p.title]) {
      projectEpCount[p.title] = 0;
    }

    projectEpCount[p.title] += count;
  });
  console.log(projectEpCount);

  return (
    <>
      <div className="w-full h-64 md:h-96">
        <PieChart
          series={[
            {
              data: Object.entries(projectEpCount).map(
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

              valueFormatter: (item) => `${item.value} EP`,
            },
          ]}
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "oklch(0.208 0.042 265.755)",
            borderRadius: 2,
            border: "1px solid oklch(0.373 0.034 259.733)",
            p: 2,
            display: "flex",
            flexDirection: "column",
            "& .MuiChartsLegend-root": {
              color: "#ffffff",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              fontFamily: "Kanit, sans-serif",

              // 👇 ซ่อนเมื่อจอเล็ก (mobile)
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
