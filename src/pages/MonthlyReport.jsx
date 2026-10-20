import { useMemo, useRef, useState } from "react";
import { FileDown } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { ProjectProvider, useProjects } from "../context/ProjectContext";

const currentMonthKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

const formatThaiDate = (year, month, day) =>
  new Date(year, month - 1, day).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatNumber = (value) => new Intl.NumberFormat("th-TH").format(value);

const parseEpisode = (value) => {
  const episode = String(value || "").trim();
  const rangeMatch = episode.match(/^(\d+)\s*[-–]\s*(\d+)$/);
  if (rangeMatch) {
    const start = Number(rangeMatch[1]);
    const end = Number(rangeMatch[2]);
    return start <= end ? { start, end } : { start: end, end: start };
  }

  const singleMatch = episode.match(/^\d+$/);
  if (singleMatch) {
    const number = Number(episode);
    return { start: number, end: number };
  }

  return null;
};

const createMonthlySummary = (projects) => {
  const workDays = new Set();
  const groupedProjects = new Map();
  let totalSeconds = 0;

  projects.forEach((project) => {
    if (!project?.title) return;

    const group = groupedProjects.get(project.title) || {
      title: project.title,
      ranges: [],
      otherEpisodes: new Set(),
    };
    const episode = String(project.episode || "").trim();
    const range = parseEpisode(episode);

    if (range) group.ranges.push(range);
    else if (episode) group.otherEpisodes.add(episode);

    groupedProjects.set(project.title, group);

    if (project.date) workDays.add(project.date);
    const duration = Number(project.duration);
    if (Number.isFinite(duration) && duration > 0) totalSeconds += duration;
  });

  const rows = Array.from(groupedProjects.values())
    .map((group) => {
      const sortedRanges = group.ranges.sort(
        (a, b) => a.start - b.start || a.end - b.end,
      );
      const mergedRanges = [];

      sortedRanges.forEach((range) => {
        const previous = mergedRanges[mergedRanges.length - 1];
        if (previous && range.start <= previous.end + 1) {
          previous.end = Math.max(previous.end, range.end);
        } else {
          mergedRanges.push({ ...range });
        }
      });

      const rangeLabels = mergedRanges.map(({ start, end }) =>
        start === end ? String(start) : `${start}–${end}`,
      );
      const otherEpisodes = Array.from(group.otherEpisodes);
      const episodeCount =
        mergedRanges.reduce(
          (sum, range) => sum + range.end - range.start + 1,
          0,
        ) + otherEpisodes.length;

      return {
        title: group.title,
        episodeRange: [...rangeLabels, ...otherEpisodes].join(", ") || "-",
        episodeCount,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "th"));

  return {
    rows,
    workDays: workDays.size,
    totalEpisodes: rows.reduce((sum, row) => sum + row.episodeCount, 0),
    totalSeconds,
  };
};

const MonthlyReportContent = () => {
  const { projects, loading } = useProjects();
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const reportRef = useRef(null);
  const [year, month] = selectedMonth.split("-").map(Number);
  const dayCount = new Date(year, month, 0).getDate();
  const monthProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          typeof project?.date === "string" &&
          project.date.slice(0, 7) === selectedMonth,
      ),
    [projects, selectedMonth],
  );
  const summary = useMemo(
    () => createMonthlySummary(monthProjects),
    [monthProjects],
  );
  const totalHours = Math.floor(summary.totalSeconds / 3600);
  const totalMinutes = Math.floor((summary.totalSeconds % 3600) / 60);
  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("th-TH", {
    month: "long",
    year: "numeric",
  });

  const prepareReportForPdf = (element) => {
    const clone = element.cloneNode(true);

    clone.style.backgroundColor = "#ffffff";
    clone.style.color = "#111827";
    clone.style.fontFamily = "Tahoma, sans-serif";

    const elements = [clone, ...clone.querySelectorAll("*")];

    elements.forEach((node) => {
      const computed = window.getComputedStyle(node);

      // แทนที่สีที่ html2canvas อาจไม่รองรับ
      for (const property of [
        "color",
        "backgroundColor",
        "borderTopColor",
        "borderRightColor",
        "borderBottomColor",
        "borderLeftColor",
      ]) {
        const value = computed[property];

        if (value?.includes("oklch(")) {
          node.style[property] =
            property === "backgroundColor"
              ? "#ffffff"
              : property === "color"
                ? "#111827"
                : "#e5e7eb";
        }
      }
    });

    return clone;
  };

  const downloadPdf = async () => {
    const element = reportRef.current;
    const clone = prepareReportForPdf(element);
    clone.style.position = "fixed";
    clone.style.left = "-10000px";
    clone.style.top = "0";
    clone.style.width = `${element.scrollWidth}px`;

    document.body.appendChild(clone);

    if (!element || loading || isDownloading) return;

    setIsDownloading(true);
    setDownloadError("");

    try {
      const canvas = await html2canvas(clone, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: true,
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      const pageCanvasHeight = (contentHeight * canvas.width) / contentWidth;

      let offsetY = 0;
      let page = 0;

      while (offsetY < canvas.height) {
        const sliceHeight = Math.min(pageCanvasHeight, canvas.height - offsetY);

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.ceil(sliceHeight);

        const context = pageCanvas.getContext("2d");

        if (!context) {
          throw new Error("ไม่สามารถสร้าง Canvas สำหรับ PDF ได้");
        }

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

        context.drawImage(
          canvas,
          0,
          offsetY,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight,
        );

        if (page > 0) pdf.addPage();

        const imageData = pageCanvas.toDataURL("image/jpeg", 0.9);

        pdf.addImage(
          imageData,
          "JPEG",
          margin,
          margin,
          contentWidth,
          (sliceHeight * contentWidth) / canvas.width,
        );

        offsetY += sliceHeight;
        page++;
      }

      pdf.save(`monthly-work-report-${selectedMonth}.pdf`);
    } catch (error) {
      console.error("Monthly report PDF generation failed:", error);

      setDownloadError(
        `สร้าง PDF ไม่สำเร็จ: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    } finally {
      clone.remove();
    }
  };

  return (
    <main className="mx-auto max-w-5xl space-y-6 text-white">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
            Monthly work report
          </p>
          <h1 className="mt-2 text-3xl font-bold">รายงานประจำเดือน</h1>
          <p className="mt-2 text-slate-400">
            เลือกเดือนเพื่อสรุปวันทำงาน ผลงาน และเวลาตัดต่อ
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-2 text-sm text-slate-300">
            เดือนและปี
            <input
              aria-label="เลือกเดือนและปี"
              type="month"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
              className="rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <button
            type="button"
            onClick={downloadPdf}
            disabled={loading || isDownloading}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FileDown size={18} />
            {isDownloading ? "กำลังสร้าง PDF..." : "ดาวน์โหลด PDF"}
          </button>
        </div>
      </header>

      {loading ? (
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-8 text-center text-slate-300">
          กำลังโหลดข้อมูล...
        </div>
      ) : (
        <>
          {downloadError && (
            <p
              role="alert"
              className="rounded-md bg-red-950/60 p-3 text-red-200"
            >
              {downloadError}
            </p>
          )}
          <div className="overflow-x-auto rounded-xl bg-slate-700/60 p-2 sm:p-4">
            <article
              ref={reportRef}
              className="mx-auto max-w-[820px] bg-white p-6 text-slate-900 sm:p-10"
              style={{
                fontFamily: '"Leelawadee UI", Tahoma, sans-serif',
                lineHeight: 1.55,
              }}
            >
              <div
                style={{
                  marginBottom: 20,
                  color: "#4361ee",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                }}
              >
                MONTHLY WORK REPORT
              </div>
              <h2 style={{ margin: 0, fontSize: 28, lineHeight: 1.35 }}>
                สรุปการทำงานประจำเดือน
              </h2>
              <p style={{ margin: "6px 0 22px", color: "#68738a" }}>
                รายงานผลงานประจำเดือน{monthLabel}
              </p>

              <section
                aria-label="ช่วงเวลารายงาน"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  marginBottom: 22,
                  border: "1px solid #e1e7f0",
                  borderRadius: 10,
                  background: "#f8faff",
                }}
              >
                {[
                  ["เริ่มต้นเดือน", formatThaiDate(year, month, 1)],
                  ["สิ้นสุดเดือน", formatThaiDate(year, month, dayCount)],
                  [
                    "วันที่ทำงาน",
                    `${formatNumber(summary.workDays)} / ${formatNumber(dayCount)} วัน`,
                  ],
                ].map(([label, value]) => (
                  <div key={label} style={{ padding: "14px 12px" }}>
                    <div
                      style={{
                        marginBottom: 5,
                        color: "#758099",
                        fontSize: 11,
                      }}
                    >
                      {label}
                    </div>
                    <strong style={{ color: "#202c45", fontSize: 14 }}>
                      {value}
                    </strong>
                  </div>
                ))}
              </section>

              <section
                aria-label="สรุปผลงาน"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 12,
                  marginBottom: 26,
                }}
              >
                <div
                  style={{
                    borderRadius: 10,
                    background: "#f3f5ff",
                    padding: 16,
                  }}
                >
                  <div style={{ color: "#626e87", fontSize: 12 }}>จำนวนตอน</div>
                  <div
                    style={{
                      marginTop: 4,
                      color: "#3449bd",
                      fontSize: 25,
                      fontWeight: 800,
                    }}
                  >
                    {formatNumber(summary.totalEpisodes)} ตอน
                  </div>
                  <div style={{ color: "#68738a", fontSize: 12 }}>
                    จาก {formatNumber(summary.rows.length)} โปรเจกต์
                  </div>
                </div>
                <div
                  style={{
                    borderRadius: 10,
                    background: "#eef9f6",
                    padding: 16,
                  }}
                >
                  <div style={{ color: "#626e87", fontSize: 12 }}>
                    เวลาตัดต่อรวม
                  </div>
                  <div
                    style={{
                      marginTop: 4,
                      color: "#12806c",
                      fontSize: 25,
                      fontWeight: 800,
                    }}
                  >
                    {formatNumber(totalHours)} ชั่วโมง{" "}
                    {formatNumber(totalMinutes)} นาที
                  </div>
                  <div style={{ color: "#68738a", fontSize: 12 }}>
                    {formatNumber(summary.totalSeconds)} วินาที
                  </div>
                </div>
              </section>

              <section aria-labelledby="monthly-work-heading">
                <h3
                  id="monthly-work-heading"
                  style={{ margin: "0 0 10px", fontSize: 17 }}
                >
                  รายงานการทำงาน
                </h3>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "#f3f5fa" }}>
                    <tr>
                      {["ชื่อโปรเจกต์", "ช่วงตอน", "จำนวนตอน"].map(
                        (heading) => (
                          <th
                            key={heading}
                            scope="col"
                            style={{
                              padding: "10px 9px",
                              color: "#63708a",
                              fontSize: 12,
                              textAlign:
                                heading === "จำนวนตอน" ? "right" : "left",
                            }}
                          >
                            {heading}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {summary.rows.length ? (
                      summary.rows.map((row) => (
                        <tr key={row.title}>
                          <td
                            style={{
                              borderBottom: "1px solid #e9edf3",
                              padding: "11px 9px",
                              fontWeight: 700,
                            }}
                          >
                            {row.title}
                          </td>
                          <td
                            style={{
                              borderBottom: "1px solid #e9edf3",
                              padding: "11px 9px",
                              color: "#5d6982",
                            }}
                          >
                            {row.episodeRange}
                          </td>
                          <td
                            style={{
                              borderBottom: "1px solid #e9edf3",
                              padding: "11px 9px",
                              color: "#3449bd",
                              textAlign: "right",
                              fontWeight: 700,
                            }}
                          >
                            {formatNumber(row.episodeCount)} ตอน
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          style={{
                            padding: 18,
                            color: "#68738a",
                            textAlign: "center",
                          }}
                        >
                          ไม่มีข้อมูลการทำงานในเดือนนี้
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan={2}
                        style={{
                          padding: "12px 9px",
                          color: "#3449bd",
                          fontWeight: 700,
                        }}
                      >
                        รวมจำนวนตอน
                      </td>
                      <td
                        style={{
                          padding: "12px 9px",
                          color: "#3449bd",
                          textAlign: "right",
                          fontWeight: 700,
                        }}
                      >
                        {formatNumber(summary.totalEpisodes)} ตอน
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </section>
            </article>
          </div>
        </>
      )}
    </main>
  );
};

export const MonthlyReport = () => (
  <ProjectProvider>
    <MonthlyReportContent />
  </ProjectProvider>
);
