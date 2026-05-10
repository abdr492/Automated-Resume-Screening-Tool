import { LayoutDashboard, Briefcase, Users, Settings, LogOut, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'jobs', icon: Briefcase, label: 'Job Positions', badge: '12' },
    { id: 'candidates', icon: Users, label: 'Candidates', badge: '124' },
    { id: 'insights', icon: Sparkles, label: 'AI Insights' },
    { id: 'hris', icon: Settings, label: 'HRIS Sync' },
  ];

  return (
    <aside className="w-64 glass border-r border-white/10 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-400 flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.4)]">
          <Briefcase className="text-indigo-950 w-6 h-6" />
        </div>
        <h1 className="font-extrabold text-xl tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Talent Intelligence
        </h1>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">
          Main Menu
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-medium",
              activeTab === item.id
                ? "bg-teal-400/10 text-teal-400 border border-teal-400/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-teal-400" : "text-slate-400 group-hover:text-white")} />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] bg-teal-400/20 text-teal-400 px-2 py-0.5 rounded-full border border-teal-400/20">
                {item.badge}
              </span>
            )}
          </button>
        ))}
        
        <div className="pt-8">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-4">
            Organization
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm group">
            <Settings className="w-5 h-5 group-hover:text-white" />
            <span>Settings</span>
          </button>
        </div>
      </nav>

      <div className="p-4 mt-auto space-y-4">
        <button className="w-full py-3 bg-teal-400 text-slate-950 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-teal-500/20 hover:bg-teal-300 transition-all">
          Import Resumes
        </button>

        <div className="p-4 rounded-2xl bg-teal-400/5 border border-teal-400/10">
          <p className="text-[10px] text-teal-400 font-black uppercase tracking-widest mb-1">Professional Credits</p>
          <p className="text-[10px] text-slate-500 mb-3">5,432 / 10K Remaining</p>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-teal-400 w-3/4 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
          </div>
        </div>
        
        <button className="w-full flex items-center gap-3 px-4 py-2 mt-4 rounded-xl text-slate-600 hover:text-rose-400 transition-all text-[10px] font-bold uppercase tracking-widest group">
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
