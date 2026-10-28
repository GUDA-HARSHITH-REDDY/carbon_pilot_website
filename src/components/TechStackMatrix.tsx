import React, { useState } from 'react';
import { TECH_STACK_DATA } from '../data/mockData';
import { TechStackItem } from '../types';
import { Layers, CheckCircle2, Code2, Server, Globe, Cpu, Wrench } from 'lucide-react';

export const TechStackMatrix: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<TechStackItem>(TECH_STACK_DATA[0]);

  const categories = ['All', 'Frontend', 'Backend / Core', 'DevOps & Infra', 'Alternative Stack'];

  const filteredItems = TECH_STACK_DATA.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Technology Stack Architecture
              </span>
              <span className="text-xs text-slate-400">Section 3 Review Specification</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              End-to-End Cloud-Native Stack
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              Engineered with production-grade Kubernetes tooling: Go operators with Kubebuilder, Prometheus telemetry, and a high-performance React dashboard.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Tech Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((tech, idx) => (
          <div
            key={idx}
            onClick={() => setActiveItem(tech)}
            className={`cursor-pointer rounded-2xl p-5 border transition-all ${
              activeItem.name === tech.name
                ? 'bg-slate-900 border-emerald-500/50 glow-emerald scale-[1.01]'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 font-mono">
                  {tech.badge}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{tech.name}</h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                {tech.category}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              {tech.role}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
              {tech.keyFeatures.map((feat, fIdx) => (
                <div key={fIdx} className="flex items-center gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {tech.codeExample && (
              <div className="mt-3.5 pt-2 border-t border-slate-800/60 font-mono text-[10px] text-slate-400 truncate">
                <code className="text-emerald-300">{tech.codeExample}</code>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Architectural Stack Note (Section 3 Note on Go vs Python) */}
      <div className="glass-panel rounded-2xl p-5 border-slate-800 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Wrench className="w-4 h-4 text-emerald-400" />
          <span>Architectural Rationale: Why Go + Kubebuilder for Kubernetes Operators</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Go is the conventional, industry-standard language for Kubernetes operators (leveraged by Kubebuilder and the Operator SDK) because it compiles to native machine binaries, shares the core Kubernetes ecosystem libraries (client-go, api-machinery), and provides sub-millisecond reconciliation performance without garbage collection pauses. For machine learning or research prototypes, the Python Kopf framework is supported as a modular alternative paired with FastAPI.
        </p>
      </div>
    </div>
  );
};
