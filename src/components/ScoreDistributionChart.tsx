import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ScreeningResult } from '../types';

interface ScoreDistributionChartProps {
  results: ScreeningResult[];
}

export default function ScoreDistributionChart({ results }: ScoreDistributionChartProps) {
  const data = [
    { range: '0-20', count: 0, color: '#f43f5e' },
    { range: '21-40', count: 0, color: '#f43f5e' },
    { range: '41-60', count: 0, color: '#fbbf24' },
    { range: '61-80', count: 0, color: '#2dd4bf' },
    { range: '81-100', count: 0, color: '#2dd4bf' },
  ];

  results.forEach(r => {
    if (r.score <= 20) data[0].count++;
    else if (r.score <= 40) data[1].count++;
    else if (r.score <= 60) data[2].count++;
    else if (r.score <= 80) data[3].count++;
    else data[4].count++;
  });

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="range" 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fontWeight: 'bold' }}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-2 rounded-lg shadow-xl">
                    <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">{payload[0].payload.range} Score</p>
                    <p className="text-white font-black text-sm">{payload[0].value} Candidates</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
