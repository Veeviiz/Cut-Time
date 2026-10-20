import { useState } from "react";
import { FileDown } from "lucide-react";
import { useProjects } from "../context/ProjectContext";
import { exportMonthlyPdf } from "../utils/exportMonthlyPdf";

export default function DownloadMonthlyReportButton() {
  const { projects, loading, selectedMonth } = useProjects();
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    setIsDownloading(true);
    setError("");

    try {
      await exportMonthlyPdf(projects, selectedMonth);
    } catch (err) {
      console.error("Monthly PDF export failed:", err);
      setError(err.message || "สร้าง PDF ไม่สำเร็จ กรุณาลองอีกครั้ง");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleDownload}
        disabled={loading || isDownloading}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FileDown size={18} />
        {loading
          ? "กำลังโหลดข้อมูล..."
          : isDownloading
            ? "กำลังสร้าง PDF..."
            : "ดาวน์โหลดรายงาน"}
      </button>

      {error && (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
