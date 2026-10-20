
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const formatNumber = (value) =>
  new Intl.NumberFormat("th-TH").format(value);

// แปลงข้อมูลตอน เช่น "1-10" หรือ "5" ให้เป็นช่วงตอน
const parseEpisode = (value) => {
  const episode = String(value || "").trim();
  const rangeMatch = episode.match(/^(\d+)\s*[-–]\s*(\d+)$/);

  if (rangeMatch) {
    const start = Number(rangeMatch[1]);
    const end = Number(rangeMatch[2]);

    return start <= end
      ? { start, end }
      : { start: end, end: start };
  }

  if (/^\d+$/.test(episode)) {
    const number = Number(episode);
    return { start: number, end: number };
  }

  return null;
};

// รวมช่วงตอนและสรุปข้อมูลการทำงาน
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

    if (range) {
      group.ranges.push(range);
    } else if (episode) {
      group.otherEpisodes.add(episode);
    }

    groupedProjects.set(project.title, group);

    if (project.date) {
      workDays.add(project.date);
    }

    const duration = Number(project.duration);

    if (Number.isFinite(duration) && duration > 0) {
      totalSeconds += duration;
    }
  });

  const rows = Array.from(groupedProjects.values())
    .map((group) => {
      const sortedRanges = [...group.ranges].sort(
        (a, b) => a.start - b.start || a.end - b.end
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
        start === end ? String(start) : `${start}–${end}`
      );

      const otherEpisodes = Array.from(group.otherEpisodes);

      const episodeCount =
        mergedRanges.reduce(
          (sum, range) => sum + range.end - range.start + 1,
          0
        ) + otherEpisodes.length;

      return {
        title: group.title,
        episodeRange:
          [...rangeLabels, ...otherEpisodes].join(", ") || "-",
        episodeCount,
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, "th"));

  return {
    rows,
    workDays: workDays.size,
    totalEpisodes: rows.reduce(
      (sum, row) => sum + row.episodeCount,
      0
    ),
    totalSeconds,
  };
};

// โหลดฟอนต์ภาษาไทย
// วางไฟล์ Kanit-Regular.ttf ไว้ที่ public/fonts/Kanit-Regular.ttf
async function loadThaiFont(pdf) {
  const response = await fetch("/fonts/Kanit-Regular.ttf");

  if (!response.ok) {
    throw new Error(
      "ไม่พบฟอนต์ภาษาไทย กรุณาวาง Kanit-Regular.ttf ใน public/fonts/"
    );
  }

  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";

  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, i + chunkSize)
    );
  }

  pdf.addFileToVFS("Kanit-Regular.ttf", btoa(binary));
  pdf.addFont("Kanit-Regular.ttf", "Kanit", "normal");
  pdf.setFont("Kanit", "normal");
}

// สร้างรายงาน PDF ตามเดือนที่เลือก
export async function exportMonthlyPdf(projects, selectedMonth) {
  if (!/^\d{4}-\d{2}$/.test(selectedMonth || "")) {
    throw new Error("กรุณาเลือกเดือนที่ต้องการออกรายงาน");
  }

  const [year, month] = selectedMonth.split("-").map(Number);

  if (month < 1 || month > 12) {
    throw new Error("เดือนที่เลือกไม่ถูกต้อง");
  }

  // กรองเฉพาะข้อมูลของเดือนที่เลือก
  const monthProjects = (projects || []).filter(
    (project) =>
      typeof project?.date === "string" &&
      project.date.slice(0, 7) === selectedMonth
  );

  const summary = createMonthlySummary(monthProjects);
  const dayCount = new Date(year, month, 0).getDate();

  const monthLabel = new Date(year, month - 1, 1).toLocaleDateString(
    "th-TH",
    {
      month: "long",
      year: "numeric",
    }
  );

  const totalMinutesAll = Math.round(summary.totalSeconds / 60);
  const totalHours = Math.floor(totalMinutesAll / 60);
  const totalMinutes = totalMinutesAll % 60;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  await loadThaiFont(pdf);

  const formatDate = (date) =>
    date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "numeric",
      year: "2-digit",
    });

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month - 1, dayCount);

  // หัวรายงาน
  pdf.setFont("Kanit", "normal");
  pdf.setFontSize(18);
  pdf.text("รายงานการทำงานประจำเดือน", 14, 20);

  pdf.setFontSize(12);
  pdf.text(`ประจำเดือน ${monthLabel}`, 14, 28);

  // ข้อมูลสรุป
  pdf.setFontSize(10);

  const details = [
    "ชื่อ : วี",
    "ตำแหน่ง : ตัดต่อ",
    `วันที่ : ${formatDate(new Date())}`,
    `เริ่มต้นเดือนวันที่ : ${formatDate(startDate)}`,
    `ท้ายเดือนวันที่ : ${formatDate(endDate)}`,
    `ทำงานไปกี่วัน : ${formatNumber(summary.workDays)}/${formatNumber(dayCount)} วัน`,
    "ว่างงาน : -",
    "ลาไปกี่ครั้ง : (_/5)",
    `จำนวนตอนรวมทุกอย่าง : ${formatNumber(summary.totalEpisodes)} ตอน`,
    `ที่ตัดคลิป : ${formatNumber(totalMinutesAll)} นาที`,
    `เวลารวม : ${formatNumber(totalHours)} ชม. ${formatNumber(totalMinutes)} น.`,
    "เวลาการทำงานต่อวัน : _ ชั่วโมง",
    "เวลาการทำงานทั้งเดือน : เฉลี่ย _ ชั่วโมง",
    "ความขยันของตัวเอง : (_/5)",
    "ปัญหาในการทำงาน : -",
  ];

  let y = 36;

  details.forEach((line) => {
    pdf.text(line, 14, y);
    y += 6;
  });

  // ตารางรายงานโปรเจกต์
  y += 3;

  pdf.setFontSize(13);
  pdf.text("รายงานการทำงาน", 14, y);

  autoTable(pdf, {
    startY: y + 5,
    head: [["ชื่อโปรเจกต์", "ช่วงตอน", "จำนวนตอน"]],
    body: summary.rows.length
      ? summary.rows.map((row) => [
          row.title,
          row.episodeRange,
          `${formatNumber(row.episodeCount)} ตอน`,
        ])
      : [["ไม่มีข้อมูลการทำงานในเดือนนี้", "-", "-"]],
    styles: {
      font: "Kanit",
      fontStyle: "normal",
      fontSize: 9,
      cellPadding: 3,
      overflow: "linebreak",
    },
    headStyles: {
      font: "Kanit",
      fontStyle: "normal",
      fillColor: [243, 245, 250],
      textColor: [52, 73, 189],
    },
    columnStyles: {
      0: { cellWidth: 75 },
      1: { cellWidth: 55 },
      2: { halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  // ข้อมูลผู้รับเงิน
  let footerY = pdf.lastAutoTable.finalY + 10;

  if (footerY > 245) {
    pdf.addPage();
    footerY = 20;
  }

  pdf.setFont("Kanit", "normal");
  pdf.setFontSize(11);

  const paymentDetails = [
    "ข้อมูลผู้รับเงิน",
    "ชื่อจริง : นาย นัซรี สาและ",
    "ธนาคาร : กสิกรไทย",
    "เลขบัญชี : 1953907875",
    "เบอร์ติดต่อ : 0929578809",
  ];

  paymentDetails.forEach((line, index) => {
    if (index > 0) footerY += 6;
    pdf.text(line, 14, footerY);
  });

  // บันทึกไฟล์
  pdf.save(`monthly-work-report-${selectedMonth}.pdf`);
}
