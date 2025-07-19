import Link from "next/link";

const dummyStats = {
  patents: 42,
  documents: 87,
};

const lineChartData = [
  { month: "Jan", patents: 5, documents: 10 },
  { month: "Feb", patents: 7, documents: 12 },
  { month: "Mar", patents: 6, documents: 15 },
  { month: "Apr", patents: 8, documents: 13 },
  { month: "May", patents: 9, documents: 18 },
  { month: "Jun", patents: 7, documents: 19 },
];

const pieData = [
  { label: "Patents", value: 42, color: "#0ea5e9" },
  { label: "Documents", value: 87, color: "#a855f7" },
];

const recentActivity = [
  { type: "Patent", desc: "Patent #123 analyzed", time: "2 hours ago" },
  { type: "Document", desc: "Document XYZ uploaded", time: "4 hours ago" },
  { type: "Patent", desc: "Patent #456 analyzed", time: "1 day ago" },
  { type: "Document", desc: "Document ABC analyzed", time: "2 days ago" },
];

const topTypes = [
  { label: "NDA Documents", value: 30, color: "bg-ai-blue-500" },
  { label: "Utility Patents", value: 25, color: "bg-ai-purple-500" },
  { label: "Design Patents", value: 18, color: "bg-ai-cyan-400" },
];

function LineChart() {
  const width = 320;
  const height = 100;
  const max = Math.max(...lineChartData.map(d => d.patents + d.documents));
  const xStep = width / (lineChartData.length - 1);
  const y = v => height - (v / max) * (height - 20);
  const patentPoints = lineChartData.map((d, i) => `${i * xStep},${y(d.patents)}`).join(" ");
  const docPoints = lineChartData.map((d, i) => `${i * xStep},${y(d.documents)}`).join(" ");
  return (
    <svg width={width} height={height} className="w-full h-28 md:h-32">
      <line x1="0" y1={height-1} x2={width} y2={height-1} stroke="#334155" strokeWidth="2" />
      <polyline fill="none" stroke="#0ea5e9" strokeWidth="3" points={patentPoints} />
      <polyline fill="none" stroke="#a855f7" strokeWidth="3" points={docPoints} />
      {lineChartData.map((d, i) => (
        <>
          <circle key={`p${i}`} cx={i * xStep} cy={y(d.patents)} r="4" fill="#0ea5e9" />
          <circle key={`d${i}`} cx={i * xStep} cy={y(d.documents)} r="4" fill="#a855f7" />
        </>
      ))}
    </svg>
  );
}

function PieChart() {
  const total = pieData.reduce((sum, d) => sum + d.value, 0);
  let acc = 0;
  return (
    <svg width="100" height="100" viewBox="0 0 32 32" className="w-20 h-20 md:w-24 md:h-24">
      {pieData.map((slice, i) => {
        const start = (acc / total) * 2 * Math.PI;
        acc += slice.value;
        const end = (acc / total) * 2 * Math.PI;
        const x1 = 16 + 16 * Math.sin(start);
        const y1 = 16 - 16 * Math.cos(start);
        const x2 = 16 + 16 * Math.sin(end);
        const y2 = 16 - 16 * Math.cos(end);
        const large = end - start > Math.PI ? 1 : 0;
        return (
          <path
            key={slice.label}
            d={`M16,16 L${x1},${y1} A16,16 0 ${large} 1 ${x2},${y2} Z`}
            fill={slice.color}
            opacity={0.9}
          />
        );
      })}
    </svg>
  );
}

export default function DashboardPage() {
  return (
    <div className="w-full max-w-5xl flex flex-col gap-8 px-2 sm:px-4 md:px-8">
      <div className="glass-effect p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl mb-4">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 gradient-text-animate">Dashboard</h2>
        <p className="text-slate-300 mb-2 text-sm sm:text-base">Welcome to your dashboard! Here you can access patent and document analysis features.</p>
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-6">
          {/* Patent Stats */}
          <div className="bg-slate-800/60 rounded-xl p-4 sm:p-6 flex flex-col items-center">
            <span className="text-base sm:text-lg text-slate-300 mb-2">Total Patents Analyzed</span>
            <span className="text-2xl sm:text-3xl font-bold text-ai-blue-400 mb-4">{dummyStats.patents}</span>
            <div className="w-full h-16 sm:h-24 flex items-end">
              <div className="bg-gradient-to-t from-ai-blue-500 to-ai-purple-400 rounded w-full" style={{height: `${dummyStats.patents * 2}px`, maxHeight: '100%'}}></div>
            </div>
          </div>
          {/* Document Stats */}
          <div className="bg-slate-800/60 rounded-xl p-4 sm:p-6 flex flex-col items-center">
            <span className="text-base sm:text-lg text-slate-300 mb-2">Total Documents Analyzed</span>
            <span className="text-2xl sm:text-3xl font-bold text-ai-purple-400 mb-4">{dummyStats.documents}</span>
            <div className="w-full h-16 sm:h-24 flex items-end">
              <div className="bg-gradient-to-t from-ai-purple-500 to-ai-blue-400 rounded w-full" style={{height: `${dummyStats.documents * 2}px`, maxHeight: '100%'}}></div>
            </div>
          </div>
        </div>
        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-10">
          {/* Line Chart */}
          <div className="bg-slate-800/60 rounded-xl p-4 sm:p-6 flex flex-col items-center">
            <span className="text-base sm:text-lg text-slate-300 mb-2">Analysis Over Last 6 Months</span>
            <LineChart />
            <div className="flex gap-4 mt-2">
              <span className="flex items-center text-ai-blue-400 text-xs sm:text-sm"><span className="w-3 h-3 rounded-full bg-ai-blue-400 mr-1"></span>Patents</span>
              <span className="flex items-center text-ai-purple-400 text-xs sm:text-sm"><span className="w-3 h-3 rounded-full bg-ai-purple-400 mr-1"></span>Documents</span>
            </div>
            <div className="flex gap-2 mt-2 text-xs text-slate-400 flex-wrap">
              {lineChartData.map(d => <span key={d.month}>{d.month}</span>)}
            </div>
          </div>
          {/* Pie Chart */}
          <div className="bg-slate-800/60 rounded-xl p-4 sm:p-6 flex flex-col items-center">
            <span className="text-base sm:text-lg text-slate-300 mb-2">Proportion of Analyses</span>
            <PieChart />
            <div className="flex gap-4 mt-2 flex-wrap">
              {pieData.map(slice => (
                <span key={slice.label} className="flex items-center text-xs sm:text-sm" style={{color: slice.color}}>
                  <span className="w-3 h-3 rounded-full mr-1" style={{background: slice.color}}></span>{slice.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        {/* Recent Activity & Top Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-10">
          {/* Recent Activity */}
          <div className="bg-slate-800/60 rounded-xl p-4 sm:p-6">
            <span className="text-base sm:text-lg text-slate-300 mb-2 block">Recent Activity</span>
            <ul className="divide-y divide-slate-700">
              {recentActivity.map((item, i) => (
                <li key={i} className="py-2 flex flex-col">
                  <span className="font-medium text-slate-200 text-xs sm:text-base">{item.desc}</span>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* Top Types */}
          <div className="bg-slate-800/60 rounded-xl p-4 sm:p-6">
            <span className="text-base sm:text-lg text-slate-300 mb-2 block">Top 3 Most Analyzed Types</span>
            <ul className="flex flex-col gap-4 mt-4">
              {topTypes.map((type, i) => (
                <li key={type.label} className="flex items-center gap-2">
                  <span className={`block h-3 sm:h-4 rounded ${type.color}`} style={{width: `${type.value * 4}px`}}></span>
                  <span className="text-slate-200 text-xs sm:text-sm w-24 sm:w-32">{type.label}</span>
                  <span className="text-slate-400 text-xs">{type.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Patent Analysis Feature */}
        <div className="glass-effect p-4 sm:p-6 rounded-xl flex flex-col justify-between shadow-lg mb-4 md:mb-0">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold gradient-text-animate mb-2">Patent Analysis</h3>
            <p className="text-slate-300 mb-4 text-xs sm:text-base">Analyze patents, get insights, and manage your intellectual property efficiently. (Dummy feature for now)</p>
          </div>
          <Link href="/app/patent-analysis">
            <button className="mt-auto w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-xs sm:text-base">
              Go to Patent Analysis
            </button>
          </Link>
        </div>
        {/* Document Analysis Feature */}
        <div className="glass-effect p-4 sm:p-6 rounded-xl flex flex-col justify-between shadow-lg">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold gradient-text-animate mb-2">Document Analysis</h3>
            <p className="text-slate-300 mb-4 text-xs sm:text-base">Upload and analyze legal documents for key information and compliance. (Dummy feature for now)</p>
          </div>
          <Link href="/app/document-analysis">
            <button className="mt-auto w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-xs sm:text-base">
              Go to Document Analysis
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
} 