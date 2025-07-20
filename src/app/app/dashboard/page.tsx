import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import React from "react";

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
  { label: "Patents", value: 42, color: "hsl(var(--primary))" },
  { label: "Documents", value: 87, color: "hsl(var(--accent))" },
];

const recentActivity = [
  { type: "Patent", desc: "Patent #123 analyzed", time: "2 hours ago" },
  { type: "Document", desc: "Document XYZ uploaded", time: "4 hours ago" },
  { type: "Patent", desc: "Patent #456 analyzed", time: "1 day ago" },
  { type: "Document", desc: "Document ABC analyzed", time: "2 days ago" },
];

const topTypes = [
  { label: "NDA Documents", value: 30, color: "bg-primary" },
  { label: "Utility Patents", value: 25, color: "bg-accent" },
  { label: "Design Patents", value: 18, color: "bg-muted" },
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
      <line x1="0" y1={height-1} x2={width} y2={height-1} stroke="hsl(var(--border))" strokeWidth="2" />
      <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="3" points={patentPoints} />
      <polyline fill="none" stroke="hsl(var(--accent))" strokeWidth="3" points={docPoints} />
      {lineChartData.map((d, i) => (
        <React.Fragment key={i}>
          <circle cx={i * xStep} cy={y(d.patents)} r="4" fill="hsl(var(--primary))" />
          <circle cx={i * xStep} cy={y(d.documents)} r="4" fill="hsl(var(--accent))" />
        </React.Fragment>
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
      <Card className="document-card">
        <CardHeader>
          <CardTitle className="text-legal-title text-foreground">Dashboard</CardTitle>
          <p className="text-muted-foreground">Welcome to your dashboard! Here you can access patent and document analysis features.</p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* Patent Stats */}
            <Card className="document-card">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center">
                <span className="text-base sm:text-lg text-muted-foreground mb-2">Total Patents Analyzed</span>
                <span className="text-2xl sm:text-3xl font-bold text-primary mb-4">{dummyStats.patents}</span>
                <div className="w-full h-16 sm:h-24 flex items-end">
                  <div className="bg-gradient-to-t from-primary to-accent rounded w-full" style={{height: `${dummyStats.patents * 2}px`, maxHeight: '100%'}}></div>
                </div>
              </CardContent>
            </Card>
            {/* Document Stats */}
            <Card className="document-card">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center">
                <span className="text-base sm:text-lg text-muted-foreground mb-2">Total Documents Analyzed</span>
                <span className="text-2xl sm:text-3xl font-bold text-accent mb-4">{dummyStats.documents}</span>
                <div className="w-full h-16 sm:h-24 flex items-end">
                  <div className="bg-gradient-to-t from-accent to-primary rounded w-full" style={{height: `${dummyStats.documents * 2}px`, maxHeight: '100%'}}></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* Line Chart */}
            <Card className="document-card">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center">
                <span className="text-base sm:text-lg text-muted-foreground mb-2">Analysis Over Last 6 Months</span>
                <LineChart />
                <div className="flex gap-4 mt-2">
                  <span className="flex items-center text-primary text-xs sm:text-sm">
                    <span className="w-3 h-3 rounded-full bg-primary mr-1"></span>Patents
                  </span>
                  <span className="flex items-center text-accent text-xs sm:text-sm">
                    <span className="w-3 h-3 rounded-full bg-accent mr-1"></span>Documents
                  </span>
                </div>
                <div className="flex gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
                  {lineChartData.map(d => <span key={d.month}>{d.month}</span>)}
                </div>
              </CardContent>
            </Card>
            {/* Pie Chart */}
            <Card className="document-card">
              <CardContent className="p-4 sm:p-6 flex flex-col items-center">
                <span className="text-base sm:text-lg text-muted-foreground mb-2">Proportion of Analyses</span>
                <PieChart />
                <div className="flex gap-4 mt-2 flex-wrap">
                  {pieData.map(slice => (
                    <span key={slice.label} className="flex items-center text-xs sm:text-sm" style={{color: slice.color}}>
                      <span className="w-3 h-3 rounded-full mr-1" style={{background: slice.color}}></span>{slice.label}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Top Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* Recent Activity */}
            <Card className="document-card">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recentActivity.map((item, i) => (
                    <li key={i} className="flex flex-col">
                      <span className="font-medium text-foreground text-xs sm:text-base">{item.desc}</span>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            {/* Top Types */}
            <Card className="document-card">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Top 3 Most Analyzed Types</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-col gap-4">
                  {topTypes.map((type, i) => (
                    <li key={type.label} className="flex items-center gap-2">
                      <span className={`block h-3 sm:h-4 rounded ${type.color}`} style={{width: `${type.value * 4}px`}}></span>
                      <span className="text-foreground text-xs sm:text-sm w-24 sm:w-32">{type.label}</span>
                      <span className="text-muted-foreground text-xs">{type.value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        {/* Patent Analysis Feature */}
        <Card className="document-card">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">Patent Analysis</CardTitle>
            <p className="text-muted-foreground text-xs sm:text-base">Analyze patents, get insights, and manage your intellectual property efficiently. (Dummy feature for now)</p>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/app/patent-analysis">
                Go to Patent Analysis
              </Link>
            </Button>
          </CardContent>
        </Card>
        {/* Document Analysis Feature */}
        <Card className="document-card">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold text-foreground">Document Analysis</CardTitle>
            <p className="text-muted-foreground text-xs sm:text-base">Upload and analyze legal documents for key information and compliance. (Dummy feature for now)</p>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/app/document-analysis">
                Go to Document Analysis
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 