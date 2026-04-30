import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useProjects } from "../context/ProjectContext";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
const BarChartData = () => {
  const { priceEverymonth } = useProjects();

  const sortedEntries = Object.entries(priceEverymonth).sort(
    ([a], [b]) => new Date(a) - new Date(b),
  );

  const formatMonth = (m) => {
    const date = new Date(m);
    return date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const labels = sortedEntries.map(([month]) => formatMonth(month));
  const values = sortedEntries.map(([, value]) => Math.round(value));

  return (
    <div className="w-full h-64 md:h-96 bg-slate-900 rounded-md p-4 border border-gray-700">
      <div className="flex items-center justify-start ">
        <RiMoneyDollarCircleFill className="text-2xl mr-2" />
        <h1>สรุปรายเดือน</h1>
      </div>
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: labels,
            tickLabelStyle: {
              fill: "#aaa",
              fontSize: 11,
              fontFamily: "Kanit, sans-serif",
            },
          },
        ]}
        yAxis={[
          {
            tickLabelStyle: {
              fill: "#fff",
              fontSize: 12,
              fontFamily: "Kanit, sans-serif",
            },
          },
        ]}
        series={[
          {
            data: values,

            valueFormatter: (v) => `${v.toLocaleString()} ฿`,
          },
        ]}
        // ❌ เอา width/height ออก
        // width={500}
        // height={300}

        // ✅ ใช้ style แทน
        sx={{
          width: "100%",
          height: "100%",

          label: {
            fill: "#fff",
            fontSize: 12,
            fontFamily: "Kanit, sans-serif",
          },
          // backgroundColor: "oklch(0.208 0.042 265.755)",
          borderRadius: 2,
          // border: "1px solid oklch(0.373 0.034 259.733)",
          p: 2,

          "& .MuiChartsLegend-root": {
            color: "#ffffff",
            fontFamily: "Kanit, sans-serif",
          },

          "& .MuiBarElement-root": {
            fill: "#4f46e5",
            rx: 6,
          },

          "& .MuiBarElement-root:hover": {
            fill: "#6366f1",
          },

          "& .MuiChartsGrid-line": {
            stroke: "#333",
          },

          "& .MuiChartsAxis-line": {
            stroke: "#555",
          },
        }}
      />
    </div>
  );
};

export default BarChartData;
