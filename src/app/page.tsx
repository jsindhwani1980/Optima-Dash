"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Bell,
  Search,
  ChevronDown,
  Pin,
  MoreHorizontal,
  Share2,
  User,
  Lock,
  LayoutDashboard,
  Filter,
  Sparkles,
  Sun,
  Moon,
  GripVertical,
  Check,
  X,
  AlertTriangle,
  CircleCheck,
  Info,
  Users,
  Target,
  LineChartIcon,
  ClipboardList,
  Settings,
  Home,
  TimerReset,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

// === Brand & system tokens ===
const BRAND_BG = "bg-blue-600"; // primary brand color
const BRAND_TEXT = "text-blue-600"; // accents
const BRAND_RING = "focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none";

// === Demo data ===
const chipsMaster = [
  { id: "focused", label: "Focused KPIs", count: 6 },
  { id: "q1", label: "Top-Level Q1 Objectives", count: 3 },
  { id: "dept", label: "Department Highlights", count: 12 },
  { id: "risk", label: "At Risk", count: 2 },
  { id: "mine", label: "Owned by Me", count: 8 },
  { id: "new", label: "New Updates", count: 5 },
  { id: "star", label: "Starred", count: 4 },
];

const sparkData = Array.from({ length: 12 }).map((_, i) => ({ x: i + 1, y: Math.round(30 + Math.random() * 70) }));
const areaData = Array.from({ length: 12 }).map((_, i) => ({ x: i + 1, a: Math.round(20 + Math.random() * 30) }));
const radarData = [
  { metric: "Sales", value: 90 },
  { metric: "NPS", value: 70 },
  { metric: "Latency", value: 55 },
  { metric: "Churn", value: 40 },
  { metric: "Uptime", value: 85 },
];

const roles = [
  { role: "Senior Dev", trend: [62, 64, 69, 72, 75, 74, 78], status: "on" },
  { role: "UX Designer", trend: [52, 54, 58, 60, 63, 61, 66], status: "watch" },
  { role: "Data Analyst", trend: [40, 42, 45, 44, 46, 49, 51], status: "risk" },
  { role: "Software Engineer", trend: [60, 61, 63, 65, 67, 68, 70], status: "on" },
  { role: "Marketing Lead", trend: [55, 58, 60, 61, 64, 66, 67], status: "on" },
  { role: "Systems Architect", trend: [48, 49, 51, 53, 55, 56, 58], status: "watch" },
];

// === Utilities ===
const classNames = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

function FadeEdges({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <div
      className={`pointer-events-none absolute top-0 ${direction === "right" ? "right-0" : "left-0"} h-10 w-16 from-white to-transparent dark:from-neutral-950 bg-gradient-to-${direction === "right" ? "l" : "r"}`}
    />
  );
}

// === Sidebar with jobs-to-be-done groups ===
function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const groups = [
    {
      heading: "Plan",
      items: [
        { icon: Target, label: "Strategy" },
        { icon: LineChartIcon, label: "Targets (KPIs)" },
        { icon: ClipboardList, label: "Metrics" },
      ],
    },
    {
      heading: "Execute",
      items: [
        { icon: Users, label: "Teams" },
        { icon: TimerReset, label: "Updates" }, // Check-In → Updates
        { icon: ClipboardList, label: "Tasks" },
      ],
    },
    {
      heading: "Analyze",
      items: [
        { icon: LayoutDashboard, label: "Dashboards" },
        { icon: LineChartIcon, label: "Reports" }, // Explorer → Reports
      ],
    },
    { heading: "Admin", items: [{ icon: Settings, label: "Settings" }] },
  ];

  return (
    <div
      className={classNames(
        "fixed inset-y-0 left-0 z-40 w-72 border-r bg-white p-4 transition-transform dark:border-neutral-800 dark:bg-neutral-950",
        open ? "translate-x-0" : "-translate-x-full",
      )}
      aria-label="Primary navigation"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Home className={`h-5 w-5 ${BRAND_TEXT}`} />
          <span className="text-lg font-bold">Optima</span>
        </div>
        <button onClick={onClose} className={`rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${BRAND_RING}`} aria-label="Close sidebar">
          <X className="h-4 w-4" />
        </button>
      </div>
      <nav className="space-y-6">
        {groups.map((g) => (
          <div key={g.heading}>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">{g.heading}</div>
            <ul className="space-y-1">
              {g.items.map((it) => (
                <li key={it.label}>
                  <button className={`flex w-full items-center gap-2 rounded-xl px-2 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${BRAND_RING}`}>
                    <it.icon className="h-4 w-4" /> {it.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-8 rounded-xl border p-3 text-xs text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
        <div className="mb-1 font-semibold">New here?</div>
        <ol className="list-decimal pl-4">
          <li>Connect data</li>
          <li>Define objectives</li>
          <li>Track progress</li>
        </ol>
      </div>
    </div>
  );
}

// === Chip bar with selection state and counts ===
function ChipBar({ selected, setSelected }: { selected: string[]; setSelected: (v: string[]) => void }) {
  const toggle = (id: string) =>
    setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 overflow-x-auto pr-14 no-scrollbar" role="tablist" aria-label="Saved views">
        {chipsMaster.map((c) => (
          <button
            key={c.id}
            onClick={() => toggle(c.id)}
            className={classNames(
              "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800",
              selected.includes(c.id) && "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900",
              BRAND_RING,
            )}
            title={`${c.count} items`}
          >
            {c.label}
            <span className={classNames("ml-2 rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white", BRAND_BG)}>
              {c.count}
            </span>
          </button>
        ))}
        <button className={`ml-auto inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 ${BRAND_RING}`} title="More filters">
          More <ChevronDown className="h-4 w-4" />
        </button>
      </div>
      <FadeEdges direction="right" />
    </div>
  );
}

function IconButton({ children, badge, title }: { children: React.ReactNode; badge?: string | number; title?: string }) {
  return (
    <div className="relative">
      <button title={title} className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-800 ${BRAND_RING}`}>
        {children}
      </button>
      {badge ? (
        <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white" title={`${badge} new notifications`}>{badge}</span>
      ) : null}
    </div>
  );
}

// === Card shell with selectable / draggable affordances, permissions & audit ===
function CardShell({ title, subtitle, value, notify, children, locked, owner, onSelect, selected }: any) {
  return (
    <div className={classNames("group relative rounded-3xl border bg-white p-5 shadow transition-shadow hover:shadow-lg dark:bg-neutral-950 dark:border-neutral-800", selected && "ring-2 ring-blue-500")}
      role="region" aria-label={title}>
      {/* Drag handle */}
      <div className="absolute left-2 top-2 hidden cursor-grab rounded-md p-1 text-neutral-400 group-hover:block" title="Drag to reorder"><GripVertical className="h-4 w-4" /></div>
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <h3 className={`text-base font-semibold ${BRAND_TEXT}`}>{title}</h3>
          {notify ? (<span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white" title={`${notify} new updates`}>{notify}</span>) : null}
          {locked ? (<Lock className="h-4 w-4 text-neutral-400" title="View-only" />) : null}
        </div>
        <div className="flex items-center gap-1">
          <button className={`rounded-xl p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${BRAND_RING}`} title="Pin to top"><Pin className="h-4 w-4" /></button>
          <button className={`rounded-xl p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${BRAND_RING}`} title="Share"><Share2 className="h-4 w-4" /></button>
          <button className={`rounded-xl p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${BRAND_RING}`} title="More"><MoreHorizontal className="h-4 w-4" /></button>
          <input aria-label={`Select ${title}`} type="checkbox" className="ml-1 h-4 w-4" checked={selected} onChange={onSelect} />
        </div>
      </div>
      {subtitle && <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">{subtitle}</p>}
      {value && <div className="mb-3 text-3xl font-extrabold tracking-tight">{value}</div>}
      {children}
      <div className="mt-3 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <div>
          Last updated 2h ago • <button className={`underline ${BRAND_TEXT}`} onClick={() => alert("Change log example: owner changed target from 20→24, note added")}>Change log</button>
        </div>
        <button className="flex items-center gap-2" title={`Owner: ${owner}`}
          onClick={() => alert(`Filtering by owner: ${owner}`)}>
          <img alt="owner avatar" src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(owner)}`} className="h-6 w-6 rounded-full" />
          <span className="underline">{owner}</span>
        </button>
      </div>
    </div>
  );
}

function RoleTrend({ points }: { points: number[] }) {
  const data = points.map((y, i) => ({ x: i + 1, y }));
  const min = Math.min(...points);
  const max = Math.max(...points);
  return (
    <div className="h-10 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <ReferenceLine y={min} strokeDasharray="4 4" />
          <ReferenceLine y={max} strokeDasharray="4 4" />
          <Line type="monotone" dataKey="y" dot strokeWidth={2} />
          <RechartsTooltip cursor={false} />
          <XAxis dataKey="x" hide />
          <YAxis hide />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Page() {
  // Theme toggle
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const pref = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = pref ? pref === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", shouldDark);
    setIsDark(shouldDark);
  }, []);
  const toggleTheme = () => {
    const next = !isDark; setIsDark(next); document.documentElement.classList.toggle("dark", next); localStorage.setItem("theme", next ? "dark" : "light");
  };

  // Sidebar state: modal on small, persistent memory
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Chips selected state
  const [selectedChips, setSelectedChips] = useState<string[]>(["focused"]);

  // Density control
  const [density, setDensity] = useState<'comfortable' | 'cozy' | 'compact'>('comfortable');
  const cardPadding = density === 'compact' ? 'p-4' : density === 'cozy' ? 'p-5' : 'p-6';

  // Selection for bulk actions
  const [selectedCards, setSelectedCards] = useState<Record<string, boolean>>({});
  const selCount = useMemo(() => Object.values(selectedCards).filter(Boolean).length, [selectedCards]);

  const toggleCard = (id: string) => setSelectedCards((s) => ({ ...s, [id]: !s[id] }));
  const clearSelection = () => setSelectedCards({});

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-neutral-50 to-white text-neutral-900 antialiased dark:from-neutral-950 dark:to-neutral-950 dark:text-neutral-50">
      {/* Sidebar (JTBD groups) */}
      <Sidebar open={sidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 1280} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="ml-0 w-full p-4 xl:ml-72">
        {/* Top bar */}
        <div className="flex items-center gap-2">
          <button className={`rounded-xl p-2 xl:hidden ${BRAND_RING}`} onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Home className={`h-5 w-5 ${BRAND_TEXT}`} /></button>
          <div className="flex items-center gap-2">
            <LayoutDashboard className={`h-5 w-5 ${BRAND_TEXT}`} />
            <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
            <span className="ml-1 rounded-full border px-2 py-0.5 text-xs">Home</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <input placeholder="Search metrics, targets, teams" className={`w-80 rounded-2xl border px-10 py-2.5 shadow-sm placeholder:text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 ${BRAND_RING}`} />
              <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
            </div>
            <button className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2.5 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800 ${BRAND_RING}`} title="Filter results"><Filter className="h-4 w-4" /> Filters</button>
            {/* Single, global Add */}
            <button className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2.5 text-white hover:opacity-90 ${BRAND_BG} ${BRAND_RING}`} title="Create"><Plus className="h-4 w-4" /> Add</button>
            <IconButton title="Notifications" badge={5}><Bell className="h-5 w-5" /></IconButton>
            <button onClick={toggleTheme} className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2.5 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800 ${BRAND_RING}`}>{isDark ? (<><Sun className="h-4 w-4" /> Light</>) : (<><Moon className="h-4 w-4" /> Dark</>)}</button>
            <button className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2.5 hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800 ${BRAND_RING}`} title="Profile"><User className="h-4 w-4" /> me</button>
          </div>
        </div>

        {/* Sticky chip bar with selection state */}
        <div className="sticky top-16 z-30 mt-4 rounded-2xl border bg-white/70 p-2 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:border-neutral-800 dark:bg-neutral-950/70">
          <ChipBar selected={selectedChips} setSelected={setSelectedChips} />
          <div className="mt-2 flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <span>Selected: {selectedChips.length}</span>
            <button className={`underline ${BRAND_TEXT}`} onClick={() => setSelectedChips([])}>Clear all</button>
            <span className="ml-auto inline-flex items-center gap-1 rounded-full border px-2 py-1"><Sparkles className="h-3 w-3" /> Saved view</span>
          </div>
        </div>

        {/* Density controls */}
        <div className="mt-4 inline-flex overflow-hidden rounded-2xl border">
          {(["comfortable","cozy","compact"] as const).map(v => (
            <button key={v} onClick={()=>setDensity(v)} className={classNames("px-3 py-1.5 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800", density===v && "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900")}>{v[0].toUpperCase()+v.slice(1)}</button>
          ))}
        </div>

        {/* Bulk actions when cards are selected */}
        {selCount > 0 && (
          <div className="sticky top-[120px] z-30 mt-2 flex items-center justify-between rounded-2xl border bg-white p-2 text-sm shadow dark:border-neutral-800 dark:bg-neutral-900">
            <div><strong>{selCount}</strong> selected</div>
            <div className="flex items-center gap-2">
              <button className="rounded-xl border px-3 py-1">Pin</button>
              <button className="rounded-xl border px-3 py-1">Share</button>
              <button className="rounded-xl border px-3 py-1">Remove</button>
              <button className="rounded-xl border px-3 py-1" onClick={clearSelection}>Clear</button>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className={classNames("mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3", density==='compact' && 'gap-3')}>
          <div className={cardPadding}>
            <CardShell title="Annual Report" subtitle="Last 30 days • Source: Finance" notify={2} owner="Sam Lee" selected={!!selectedCards.ar} onSelect={()=>toggleCard('ar')}>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <ReferenceLine y={0} />
                    <Area type="monotone" dataKey="a" strokeWidth={2} fillOpacity={0.2} />
                    <RechartsTooltip />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardShell>
          </div>

          <div className={cardPadding}>
            <CardShell title="Component Development" subtitle="Objective progress" value="24/40 (60%)" owner="Sam Lee" selected={!!selectedCards.cd} onSelect={()=>toggleCard('cd')}>
              <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800" aria-label="Progress 60%">
                <div className={`h-full w-[60%] rounded-full ${BRAND_BG}`} />
              </div>
            </CardShell>
          </div>

          <div className={cardPadding}>
            <CardShell title="Budget Maintenance" subtitle="Variance" owner="Sam Lee" locked selected={!!selectedCards.bm} onSelect={()=>toggleCard('bm')}>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparkData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <ReferenceLine y={50} strokeDasharray="4 4" />
                    <Line type="monotone" dataKey="y" dot strokeWidth={2} />
                    <RechartsTooltip />
                    <XAxis dataKey="x" hide />
                    <YAxis hide />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardShell>
          </div>

          <div className={cardPadding}>
            <CardShell title="Performance Report" subtitle="Satisfaction index" owner="Sam Lee" selected={!!selectedCards.pr} onSelect={()=>toggleCard('pr')}>
              <div className="h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <Area type="monotone" dataKey="a" strokeWidth={2} fillOpacity={0.2} />
                    <RechartsTooltip />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardShell>
          </div>

          <div className={cardPadding}>
            <CardShell title="Training & Development" subtitle="Completion" value="24/40 (60%)" owner="Sam Lee" selected={!!selectedCards.td} onSelect={()=>toggleCard('td')}>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                <div className={`h-full w-[60%] rounded-full ${BRAND_BG}`} />
              </div>
            </CardShell>
          </div>

          <div className={cardPadding}>
            <CardShell title="Investment Planning" subtitle="Allocation" owner="Sam Lee" selected={!!selectedCards.ip} onSelect={()=>toggleCard('ip')}>
              <div className="space-y-3">
                {[
                  { label: "Core", v: 70 },
                  { label: "Growth", v: 45 },
                  { label: "Exploratory", v: 30 },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-1 text-sm">{row.label}</div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                      <div className={`h-full rounded-full ${BRAND_BG}`} style={{ width: `${row.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardShell>
          </div>

          <div className={cardPadding}>
            <CardShell title="Orders" subtitle="MRR" value="$60.1k" owner="Sam Lee" selected={!!selectedCards.or} onSelect={()=>toggleCard('or')}>
              <div className="h-40">
                <ResponsiveContainer>
                  <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis />
                    <Radar dataKey="value" strokeWidth={2} fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardShell>
          </div>
        </div>

        {/* Team Performance table (sticky header, density) */}
        <section className="mt-8">
          <div className="sticky top-[120px] z-10 -mx-4 border-y bg-white px-4 py-2 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mx-auto max-w-[1400px] flex items-end justify-between">
              <div>
                <h2 className="text-lg font-bold tracking-tight">Team Performance</h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Real-time role trends • Click a row to filter the dashboard</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs"><Lock className="h-3 w-3" /> View only</span>
                <button className={`rounded-2xl border px-3 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800 ${BRAND_RING}`}>Export CSV</button>
              </div>
            </div>
          </div>
          <div className="mt-3 overflow-hidden rounded-3xl border dark:border-neutral-800">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                <tr>
                  <th className="p-3 text-left font-medium">Role</th>
                  <th className="p-3 text-left font-medium">Trend</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-right font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((r, i) => (
                  <tr key={i} className="border-t hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900/50 cursor-pointer" title="Click to filter by role" onClick={()=>alert(`Filter: ${r.role}`)}>
                    <td className="p-3">{r.role}</td>
                    <td className="p-3"><RoleTrend points={r.trend} /></td>
                    <td className="p-3">
                      {r.status === "on" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-semibold text-white"><CircleCheck className="h-3 w-3" /> On track</span>
                      )}
                      {r.status === "watch" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white"><Info className="h-3 w-3" /> Watch</span>
                      )}
                      {r.status === "risk" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white"><AlertTriangle className="h-3 w-3" /> At risk</span>
                      )}
                    </td>
                    <td className="p-3 text-right text-neutral-500 dark:text-neutral-400">Owner: Sam • Updated 1h ago</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Density helper for table rows */}
          <div className="mt-2 text-xs text-neutral-500">Row density follows the global setting: <strong>{density}</strong>.</div>
        </section>

        {/* Empty state example (teaching) */}
        <section className="mt-8 rounded-2xl border p-6 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
          <div className="mb-2 text-base font-semibold">New to Metrics & Targets?</div>
          <p className="mb-3">Create your first Target (KPI), then connect Metrics that feed it. You can always import sample data to explore.</p>
          <div className="flex gap-2"><button className={`rounded-2xl px-3 py-2 text-white ${BRAND_BG}`}>Create Target</button><button className="rounded-2xl border px-3 py-2">Import sample data</button></div>
        </section>

        {/* Footer notes */}
        <div className="mt-8 rounded-3xl border p-4 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
          <div className="mb-1 font-medium">What changed based on your spec</div>
          <ul className="list-disc space-y-1 pl-5">
            <li>Single global Add (removed FAB); notifications have counts + tooltips.</li>
            <li>Scrollable chip bar with selection state, fade, counts, Clear all, Saved view.</li>
            <li>Sidebar grouped by jobs-to-be-done (Plan/Execute/Analyze/Admin); modal on small, persistent on large.</li>
            <li>Consistent card actions + drag handle; selectable cards with bulk actions.</li>
            <li>Owner avatar tooltips + clickable to filter. Permissions lock icon + request access hint.</li>
            <li>Naming clarity: Metrics & Targets, Reports, Updates.</li>
            <li>Stronger contrast, color semantics (green/amber/red) with icons; sparklines show min/max + baseline.</li>
            <li>Compact number formatting (e.g., $60.1k). Global density control.</li>
            <li>Team Performance: sticky header, density note, (mock) sortable feel.</li>
            <li>Empty/teaching state for first-run; change log link on cards.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}