export function TableSkeleton() {
  return (
    <div className="w-full flex justify-center mt-6 mb-10">
      <div className="w-full max-w-[95%] md:max-w-[70%] rounded-t-lg text-white">
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full table-fixed">
            <thead className="bg-slate-800">
              <tr className="text-gray-400 text-sm">
                <th className="py-3 px-4 text-left">DATE</th>
                <th className="text-left">PROJECT TITLE</th>
                <th className="py-3 px-4">EPISODE</th>
                <th className="py-3 px-4">DURATION</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="bg-slate-900">
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="py-6 px-4">
                    <div className="h-4 w-20 bg-slate-700 rounded animate-pulse"></div>
                  </td>
                  <td className="py-6">
                    <div className="h-4 w-40 bg-slate-700 rounded animate-pulse"></div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="h-6 w-12 bg-slate-700 rounded-full animate-pulse mx-auto"></div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="h-4 w-16 bg-slate-700 rounded animate-pulse"></div>
                  </td>
                  <td className="py-6 px-4 text-right">
                    <div className="h-8 w-16 bg-slate-700 rounded animate-pulse ml-auto"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function MobileSkeleton() {
  return (
    <div className="block md:hidden space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-slate-900 border border-gray-800 rounded-lg p-4 space-y-3 animate-pulse"
        >
          <div className="flex justify-between">
            <div className="h-3 w-20 bg-slate-700 rounded"></div>
            <div className="h-3 w-10 bg-slate-700 rounded"></div>
          </div>
          <div className="h-5 w-2/3 bg-slate-700 rounded"></div>
          <div className="flex justify-between items-center">
            <div className="h-4 w-16 bg-slate-700 rounded"></div>
            <div className="h-8 w-20 bg-slate-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="animate-pulse bg-slate-900 rounded-xl p-5 space-y-4">
      <div className="h-4 w-1/3 bg-slate-600 rounded"></div>
      <div className="h-8 w-1/2 bg-slate-600 rounded"></div>
      <div className="h-3 w-1/4 bg-slate-600 rounded"></div>
    </div>
  );
}
