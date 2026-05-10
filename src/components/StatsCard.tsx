import { LucideIcon, TrendingUp } from "lucide-react";
import { cn } from "../lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: "teal" | "amber" | "indigo";
}

export default function StatsCard({ label, value, icon: Icon, trend, color = "teal" }: StatsCardProps) {
  const colors = {
    teal: "text-teal-400 bg-teal-400/10 border-teal-400/20",
    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    indigo: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  };

  return (
    <div className="glass-card flex items-center justify-between p-6">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-white">{value}</h3>
          {trend && (
            <span className="text-[10px] text-teal-400 flex items-center gap-0.5 font-medium">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className={cn("p-4 rounded-2xl border", colors[color])}>
        <Icon className="w-6 h-6 shadow-[0_0_15px_currentColor]" />
      </div>
    </div>
  );
}
