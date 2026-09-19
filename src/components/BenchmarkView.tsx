import React from 'react';
import { BenchmarkItem } from '../types';
import { Award, ArrowUpRight, ShieldCheck, AlertOctagon, Layers, Building2 } from 'lucide-react';

interface BenchmarkViewProps {
  benchmarks: BenchmarkItem[];
  onSelectDomain: (domain: string) => void;
}

export const BenchmarkView: React.FC<BenchmarkViewProps> = ({ benchmarks, onSelectDomain }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4" id="benchmark-view-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Indian Government Portals Accessibility Benchmark
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              National Index
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Comparative GIGW 3.0 & WCAG 2.2 accessibility readiness across key public service sectors.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-[10px] border-y border-slate-200">
            <tr>
              <th className="py-2.5 px-3">Government Portal</th>
              <th className="py-2.5 px-3">Sector</th>
              <th className="py-2.5 px-3 text-center">AccessGov Score</th>
              <th className="py-2.5 px-3">GIGW Readiness</th>
              <th className="py-2.5 px-3 text-center">Critical Blockers</th>
              <th className="py-2.5 px-3">Primary Barrier Identified</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {benchmarks.map((item) => {
              let scoreColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
              if (item.score < 55) scoreColor = 'text-rose-700 bg-rose-50 border-rose-200';
              else if (item.score < 75) scoreColor = 'text-amber-700 bg-amber-50 border-amber-200';

              let gigwBadge = 'bg-slate-100 text-slate-700';
              if (item.gigwReadiness === 'Certified / High') gigwBadge = 'bg-emerald-100 text-emerald-800 font-semibold';
              else if (item.gigwReadiness === 'Critical Gaps') gigwBadge = 'bg-rose-100 text-rose-800 font-semibold';
              else gigwBadge = 'bg-amber-100 text-amber-800 font-semibold';

              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{item.name}</div>
                    <div className="text-[11px] font-mono text-slate-500">{item.domain}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm text-[11px]">
                      {item.sector}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block font-extrabold text-xs px-2.5 py-1 rounded-md border ${scoreColor}`}>
                      {item.score}/100
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`inline-block text-[10px] uppercase px-2 py-0.5 rounded-sm ${gigwBadge}`}>
                      {item.gigwReadiness}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`font-bold ${item.criticalBlockers > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                      {item.criticalBlockers}
                    </span>
                  </td>
                  <td className="py-3 px-3 max-w-xs text-slate-600 text-[11px] leading-snug">
                    {item.primaryIssue}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectDomain(item.domain)}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-md inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Audit</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
