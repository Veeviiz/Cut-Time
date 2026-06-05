// Shared helpers for date/month, duration and pricing
export const toMonthKey = (date) => {
  const d =
    typeof date === "string"
      ? new Date(date)
      : date instanceof Date
        ? date
        : new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const formatMonthLabel = (monthKey) => {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
};

export const durationSecondsToMinutes = (seconds) => {
  const s = Number(seconds || 0);
  return s / 60;
};

export const minutesToPrice = (minutes, rate = 20) => {
  return minutes * rate;
};

export const clampProgress = (minutes, period = 25) =>
  Math.min((minutes / period) * 100, 100);

// Single-pass aggregate computation for projects array
export const computeAggregates = (
  projects,
  { selectedMonth, selectedProjectTitle, search = "", todayKey } = {},
) => {
  const now = new Date();
  const today = todayKey || now.toLocaleDateString("en-CA");
  const keyword = (search || "").toLowerCase();

  const monthMap = new Map();
  const uniqueTitles = new Set();
  const priceEverymonth = {};

  const filtered = [];
  const todayProjects = [];

  const currentMonthIdx = now.getMonth();
  const currentYear = now.getFullYear();
  const currentMonthProjects = [];

  // compute selectedMonth parts
  const [selYear, selMonth] = (selectedMonth || toMonthKey(now))
    .split("-")
    .map(Number);
  const selMonthIdx = selMonth - 1;
  const lastMonthIdx = selMonthIdx === 0 ? 11 : selMonthIdx - 1;
  const lastMonthYear = selMonthIdx === 0 ? selYear - 1 : selYear;
  const lastMonthProjects = [];

  projects.forEach((p) => {
    if (!p) return;
    if (p.title) uniqueTitles.add(p.title);

    if (p.date) {
      const d = new Date(p.date);
      const key = toMonthKey(d);
      if (!monthMap.has(key)) monthMap.set(key, formatMonthLabel(key));

      const minutes = durationSecondsToMinutes(p.duration);
      priceEverymonth[key] =
        (priceEverymonth[key] || 0) + minutesToPrice(minutes);

      if (p.date === today) todayProjects.push(p);
      if (d.getMonth() === currentMonthIdx && d.getFullYear() === currentYear)
        currentMonthProjects.push(p);
      if (d.getMonth() === lastMonthIdx && d.getFullYear() === lastMonthYear)
        lastMonthProjects.push(p);
    }

    // selected month filter
    if (selectedMonth && p.date) {
      const d = new Date(p.date);
      if (!(d.getFullYear() === selYear && d.getMonth() === selMonthIdx))
        return;
    }

    if (selectedProjectTitle && p.title !== selectedProjectTitle) return;

    const thaiDate = p.date ? new Date(p.date).toLocaleDateString("th-TH") : "";
    const matchesSearch =
      !keyword ||
      String(p.title || "")
        .toLowerCase()
        .includes(keyword) ||
      String(p.episode || "")
        .toLowerCase()
        .includes(keyword) ||
      String(p.date || "").includes(keyword) ||
      thaiDate.includes(keyword);

    if (matchesSearch) filtered.push(p);
  });

  const sortedProjects = filtered
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const totalDuration = filtered.reduce(
    (sum, p) => sum + Number(p.duration || 0),
    0,
  );
  const averageDuration = filtered.length ? totalDuration / filtered.length : 0;
  const totalMinutes = Number((totalDuration / 60).toFixed(2));
  const totalPrice = minutesToPrice(totalMinutes);

  const lastMonthEarning = lastMonthProjects.reduce(
    (sum, p) => sum + minutesToPrice(durationSecondsToMinutes(p.duration)),
    0,
  );
  const percentChange =
    lastMonthEarning === 0
      ? 0
      : ((totalPrice - lastMonthEarning) / lastMonthEarning) * 100;

  // episode count per project for selectedMonth or overall
  const projectEpCount = {};
  projects.forEach((p) => {
    if (!p?.title || !p?.episode || !p?.date) return;
    const d = new Date(p.date);
    const monthKey = toMonthKey(d);
    if (selectedMonth && selectedMonth !== monthKey) return;
    const [start, end] = p.episode.split("-").map(Number);
    let count = 0;
    if (!isNaN(start) && !isNaN(end)) count = end - start + 1;
    else if (!isNaN(start)) count = 1;
    projectEpCount[p.title] = (projectEpCount[p.title] || 0) + count;
  });

  const lastProjectDate = projects.reduce((latest, p) => {
    if (!p?.date) return latest;
    const d = new Date(p.date);
    return d > latest ? d : latest;
  }, new Date(0));
  if (lastProjectDate > now) {
    const futureMonthKey = toMonthKey(lastProjectDate);
    if (!monthMap.has(futureMonthKey))
      monthMap.set(futureMonthKey, formatMonthLabel(futureMonthKey));
  }
  console.log(lastProjectDate, monthMap);

  return {
    uniqueTitles: Array.from(uniqueTitles),
    sortedProjects,
    averageDuration,
    lastMonthProjects,
    currentMonthProjects,
    todayProjects,
    percentChange,
    lastMonthEarning,
    totalPrice,
    priceEverymonth,
    projectEpCount,
    lastProjectDate,
    monthOptions: Array.from(monthMap.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => b.value.localeCompare(a.value)),
  };
};
