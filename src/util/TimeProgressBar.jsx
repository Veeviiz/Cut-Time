export default function TimeProgressBar({ currentMinute = 0, maxMinute = 25 }) {
  const progress = Math.min((currentMinute / maxMinute) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-sm">
        <span>
          {currentMinute} Minutes / {maxMinute} Minutes
        </span>
        <span>{Math.round(progress)}%</span>
      </div>

      <div className="w-full bg-slate-600 rounded-full h-4 overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
