import { useState, useRef, useEffect, useMemo } from "react";
import { Clock, Plus, X } from "lucide-react";

// ---------- helpers ----------
function parseInput(raw) {
  const val = raw.trim().replace(/[^0-9:]/g, "");
  if (!val) return null;

  if (val.includes(":")) {
    const [mm, ss] = val.split(":");
    const m = parseInt(mm) || 0;
    const s = parseInt(ss) || 0;
    return { m, s, valid: s <= 59 };
  }
  if (val.length <= 2) {
    const s = parseInt(val);
    return { m: 0, s, valid: s <= 59 };
  }
  const s = parseInt(val.slice(-2));
  const m = parseInt(val.slice(0, -2));
  return { m, s, valid: s <= 59 };
}

const fmt = (m, s) => `${m}:${String(s).padStart(2, "0")}`;
const pad = (n) => String(n).padStart(2, "0");

function toHms(total) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { h, m, s };
}

// ---------- component ----------
let nextId = 1;
const makeRow = (value = "") => ({ id: nextId++, value });

export default function TimeSummer() {
  const [rows, setRows] = useState(() => [
    makeRow(fmt(0, 0)),
    makeRow(fmt(0, 0)),
    makeRow(fmt(0, 0)),
  ]);
  const [focusId, setFocusId] = useState(null);
  const inputRefs = useRef({});

  // focus the newly added row
  useEffect(() => {
    if (focusId !== null) {
      inputRefs.current[focusId]?.focus();
      setFocusId(null);
    }
  }, [focusId, rows]);

  const addRow = () => {
    const row = makeRow();
    setRows((prev) => [...prev, row]);
    setFocusId(row.id);
  };

  const removeRow = (id) => setRows((prev) => prev.filter((r) => r.id !== id));

  const updateRow = (id, value) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, value } : r)));

  const formatRow = (id) =>
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const p = parseInput(r.value);
        return p && p.valid ? { ...r, value: fmt(p.m, p.s) } : r;
      })
    );

  const stats = useMemo(() => {
    let total = 0;
    let count = 0;
    rows.forEach((r) => {
      const p = parseInput(r.value);
      if (p && p.valid) {
        total += p.m * 60 + p.s;
        count++;
      }
    });
    if (count === 0) return null;

    const { h, m, s } = toHms(total);
    const avg = Math.round(total / count);
    const a = toHms(avg);

    return {
      total,
      count,
      hms: `${h}:${pad(m)}:${pad(s)}`,
      ms: (total * 1000).toLocaleString(),
      avg: `${a.h > 0 ? a.h + ":" : ""}${a.m}:${pad(a.s)} (${avg.toLocaleString()} วิ)`,
    };
  }, [rows]);

  return (
    <div className="mx-auto my-8 max-w-[460px] px-4 pb-8">
      <h2 className="sr-only">รวมเวลาหลายชุดและแปลงเป็นวินาที</h2>

      {/* Header */}
      <div className="mb-8 text-center">
        
        <div className="text-[22px] font-medium text-neutral-900 dark:text-neutral-100">
          แปลงเป็นวินาที
        </div>
        <div className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          ใส่เวลาแบบ MM:SS แล้วนำมารวมกัน
        </div>
      </div>

      {/* Inputs card */}
      <div className="mb-4 rounded-xl border border-gray-700 bg-slate-800 p-5 ">
        <div>
          {rows.map((row, i) => {
            const parsed = parseInput(row.value);
            const invalid = parsed && !parsed.valid;
            const badge = !parsed
              ? "— วิ"
              : invalid
              ? "!"
              : `${(parsed.m * 60 + parsed.s).toLocaleString()} วิ`;

            return (
              <div key={row.id} className="mb-2 flex items-center gap-2">
                <span className="w-[18px] shrink-0 text-right text-xs text-neutral-500 dark:text-neutral-400">
                  {i + 1}
                </span>

                <input
                  ref={(el) => (inputRefs.current[row.id] = el)}
                  type="text"
                  inputMode="numeric"
                  placeholder="0:00"
                  value={row.value}
                  onChange={(e) => updateRow(row.id, e.target.value)}
                  onBlur={() => formatRow(row.id)}
                  onKeyDown={(e) => e.key === "Enter" && addRow()}
                  className={`min-w-0 flex-1 rounded-lg border bg-slate-900 px-3.5 py-[9px] text-xl font-medium tracking-wide text-gray outline-none transition-colors ${
                    invalid
                      ? "border-slate-900  focus:ring-[2px] focus:ring-blue-500 "
                      : "border-gray-600  focus:ring-[2px] focus:ring-blue-500 "
                  }`}
                />

                <span className="min-w-16 whitespace-nowrap rounded-lg bg-blue-500/20 px-2.5 py-1 text-right text-xs text-blue-400">
                  {badge}
                </span>

                <button
                  type="button"
                  onClick={() => removeRow(row.id)}
                  aria-label="ลบแถวนี้"
                  className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-500 text-neutral-500 transition-colors hover:border-[#F09595] hover:bg-[#FCEBEB] hover:text-[#A32D2D] "
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={addRow}
          className="mt-1 flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg border border-dashed border-blue-500 bg-transparent p-[9px] text-sm text-blue-500 transition-colors hover:bg-blue-500 hover:text-white"
        >
          <Plus size={14} aria-hidden="true" />
          เพิ่มชุดเวลา
        </button>

        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          พิมพ์ <b className="font-medium text-blue-500">7:24</b> หรือแค่{" "}
          <b className="font-medium text-blue-500">724</b> ก็ได้ — ระบบแปลงให้อัตโนมัติ
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2 py-1.5" aria-hidden="true">
        <div className="h-[1.5px] flex-1 bg-blue-500" />
        <div className="text-xl font-medium text-blue-500">=</div>
        <div className="h-[1.5px] flex-1 bg-blue-500" />
      </div>

      {/* Result */}
      <div className="rounded-xl border border-blue-500 bg-blue-100 p-6 text-center">
        <div className="mb-2 text-[13px] text-blue-700">รวมทั้งหมด</div>
        <div className="text-[52px] font-medium leading-none text-blue-800">
          {stats ? stats.total.toLocaleString() : "—"}
        </div>
        <div className="mt-1.5 text-base text-blue-700">วินาที (seconds)</div>
      </div>

      {/* Breakdown */}
      <div className="mt-4 rounded-lg bg-slate-800 px-5 py-4 border border-gray-700">
        <div className="mb-2.5 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          รายละเอียด
        </div>
        {[
          ["รูปแบบ ชม:นาที:วินาที", stats?.hms],
          ["มิลลิวินาที", stats && `${stats.ms} ms`],
          ["จำนวนชุด", stats && `${stats.count} ชุด`],
          ["เฉลี่ยต่อชุด", stats?.avg],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between border-b border-gray-600 py-[5px] text-sm last:border-b-0 "
          >
            <span className="text-neutral-500 dark:text-neutral-400">{label}</span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100">
              {value ?? "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}