import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  FileText, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Server, 
  CheckCircle2, 
  Users, 
  Award,
  BookOpen,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface Slide {
  id: number;
  slideNumber: string;
  title: string;
  category: string;
  speakerNotes: string;
  content: React.ReactNode;
}

export const PresentationDeck: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [showNotes, setShowNotes] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Keyboard navigation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const slides: Slide[] = [
    // Slide 1: Title Slide
    {
      id: 1,
      slideNumber: '01 / 16',
      title: 'Carbon Pilot',
      category: 'CNAD Project Review-2',
      speakerNotes: 'Good morning respected faculty. Today our team is presenting our CNAD Project Review-2 titled Carbon Pilot: A Carbon-Aware Auto-Scaling Orchestrator for Cloud-Native Microservices, carried out under the guidance of Dr. Patha Srilatha at KLH Bowrampet Campus.',
      content: (
        <div className="flex flex-col items-center justify-center text-center py-6 px-4 space-y-6">
          <div className="bg-white/95 p-3 rounded-xl shadow-lg border border-slate-700 max-w-sm">
            <img 
              src="/klh-logo.png" 
              alt="KLH Deemed to be University" 
              className="h-14 sm:h-16 object-contain mx-auto" 
            />
          </div>

          <div className="space-y-3 max-w-3xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
              CNAD Project Review-2 • 24th September 2026
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Carbon Pilot – A Carbon Aware Auto Scaling Orchestrator for Cloud-Native Microservices
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Department of Computer Science & Engineering • KLH CSE Bowrampet Campus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl pt-2 text-left">
            <div className="enterprise-card p-4 space-y-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-cyan-400" /> Team Members
              </span>
              <ul className="text-xs sm:text-sm text-slate-200 space-y-1 font-mono">
                <li>• K. Vishnu Vardhan <span className="text-slate-400">(2420030063)</span></li>
                <li>• L. Hrishikesh Reddy <span className="text-slate-400">(2420030455)</span></li>
                <li>• G. Harshith Reddy <span className="text-slate-400">(2420030527)</span></li>
              </ul>
            </div>

            <div className="enterprise-card p-4 space-y-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-400" /> Under the Guidance of
              </span>
              <div className="text-xs sm:text-sm text-slate-200">
                <p className="font-bold text-white">Dr. Patha Srilatha</p>
                <p className="text-xs text-slate-400">Associate Professor, Department of CSE</p>
                <p className="text-xs text-slate-400">KLH CSE Bowrampet Campus</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 2: Outline of Project Work
    {
      id: 2,
      slideNumber: '02 / 16',
      title: 'Outline of Project Work',
      category: 'Agenda & Roadmap',
      speakerNotes: 'Here is the roadmap for our review presentation today: we will cover the challenges, research objectives, literature survey, identified gaps, novelty, architecture, module implementation, closed-loop integration, demonstration, empirical results, and future work.',
      content: (
        <div className="space-y-4 py-2">
          <p className="text-xs text-slate-400">Comprehensive overview of topics covered in this technical review:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { num: '01', title: 'Challenges & Problem Statement', desc: 'Why standard HPA is carbon-blind' },
              { num: '02', title: 'Research Objectives', desc: '5 core technical milestones' },
              { num: '03', title: 'Literature Survey', desc: 'Analysis of CarbonScaler & CASA' },
              { num: '04', title: 'Problem Gap Identification', desc: 'Missing microservice orchestrator' },
              { num: '05', title: 'Innovation, Creativity & Novelty', desc: 'Adaptive thresholds & SLO guardrails' },
              { num: '06', title: 'Feasibility & Project Plan', desc: '14-week execution roadmap' },
              { num: '07', title: 'System Architecture & Design', desc: '4-layer Kubernetes control plane' },
              { num: '08', title: 'Module Design (M1 to M7)', desc: 'Engine, CRD, and REST API' },
              { num: '09', title: 'Module Integration & Flow', desc: 'Closed-loop 7-step scaling flow' },
              { num: '10', title: 'Evaluation & Benchmark Results', desc: '31.2% carbon reduction, 0 breaches' },
              { num: '11', title: 'Presentation & Demonstration', desc: 'Recommended evaluator demo sequence' },
              { num: '12', title: 'Conclusion & Future Work', desc: 'Multi-cluster & ML forecasting' },
            ].map((item) => (
              <div key={item.num} className="enterprise-card p-3 flex flex-col justify-between hover:border-slate-600 transition-colors">
                <span className="text-[11px] font-mono font-bold text-emerald-400">{item.num}</span>
                <span className="text-xs font-bold text-white mt-1">{item.title}</span>
                <span className="text-[11px] text-slate-400 mt-0.5">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    // Slide 3: Challenges & Problem Statement
    {
      id: 3,
      slideNumber: '03 / 16',
      title: 'Challenges & Problem Statement',
      category: 'Problem Formulation',
      speakerNotes: 'The problem statement is that Kubernetes HPA scales purely on CPU or memory without knowing whether the electricity is green or burning fossil fuels. Existing carbon solutions only address batch ML jobs or serverless functions, leaving always-on latency-critical microservices unsolved.',
      content: (
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs sm:text-sm text-rose-200">
            <strong className="text-white block text-sm mb-1">Core Problem Statement:</strong>
            How can an auto-scaling orchestrator fold real-time regional grid carbon-intensity signals into scaling decisions for cloud-native microservices without violating strict latency/throughput SLOs?
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="enterprise-card p-4 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
                <Zap className="w-4 h-4 text-amber-400" /> Kubernetes HPA is Carbon-Blind
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li>• Standard HPA scales microservices purely on CPU, memory, or request counts.</li>
                <li>• Clusters scale up just as aggressively during dirty peak grid hours as during clean solar hours.</li>
                <li>• Results in immense avoidable operational carbon emissions ($gCO_2e/kWh$) with zero benefit to users.</li>
              </ul>
            </div>

            <div className="enterprise-card p-4 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-cyan-400" /> Existing Solutions Don't Fit Microservices
              </h4>
              <ul className="space-y-2 text-slate-300">
                <li>• Existing algorithms (like CarbonScaler) target flexible batch jobs or ML model training with loose deadlines.</li>
                <li>• Serverless frameworks (like CASA) only address ephemeral FaaS invocations.</li>
                <li>• Cloud-native engineering teams currently have <strong>no drop-in Kubernetes controller</strong> that simultaneously optimizes carbon and protects latency-sensitive microservices.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 4: Research Objectives
    {
      id: 4,
      slideNumber: '04 / 16',
      title: 'Research Objectives',
      category: 'Research Framework',
      speakerNotes: 'We established five concrete research objectives: designing Carbon Pilot to extend HPA, integrating live carbon API feeds, developing a joint SLO-and-carbon policy engine, building it as a native Kubernetes CRD operator, and benchmarking against standard HPA.',
      content: (
        <div className="space-y-3 py-2">
          {[
            {
              step: 'O1',
              title: 'Design Carbon Pilot Orchestrator',
              desc: 'Architect an orchestrator that augments native Kubernetes HPA with real-time regional grid carbon-intensity awareness.',
            },
            {
              step: 'O2',
              title: 'Integrate Live Grid Carbon-Intensity Signals',
              desc: 'Connect live carbon data feeds (Electricity Maps / WattTime API) into the cluster scaling control loop with caching and offline fallback models.',
            },
            {
              step: 'O3',
              title: 'Develop Closed-Loop Policy Engine with SLO Guardrails',
              desc: 'Formulate a mathematical policy engine that jointly balances operational emissions reduction while enforcing strict latency/throughput SLO compliance.',
            },
            {
              step: 'O4',
              title: 'Implement as Native Kubernetes Operator & CRD',
              desc: 'Package Carbon Pilot as a Custom Resource Definition (CarbonPolicy CRD) and reconciler controller, deployable without application code modification.',
            },
            {
              step: 'O5',
              title: 'Empirical Benchmark on Polyglot Microservices',
              desc: 'Benchmark Carbon Pilot against default HPA using Google Cloud Online Boutique under realistic 24-hour diurnal workload traces.',
            },
          ].map((obj) => (
            <div key={obj.step} className="enterprise-card p-3 flex items-start gap-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
                {obj.step}
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">{obj.title}</h4>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">{obj.desc}</p>
              </div>
            </div>
          ))}
        </div>
      ),
    },

    // Slide 5: Literature Survey
    {
      id: 5,
      slideNumber: '05 / 16',
      title: 'Literature Survey',
      category: 'Prior Art Analysis',
      speakerNotes: 'In our literature survey, we analyzed three seminal works: CarbonScaler in ACM SIGMETRICS 2023, Taherizadeh and Grobelnik in 2019, and CASA on arXiv 2024. Notice how none of them solve request-driven microservices with strict SLOs on Kubernetes.',
      content: (
        <div className="overflow-x-auto py-2">
          <table className="w-full text-left text-xs border border-[#1e293b] rounded-lg overflow-hidden">
            <thead className="bg-[#090f1d] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-[#1e293b]">
              <tr>
                <th className="py-2.5 px-3">Authors & Paper</th>
                <th className="py-2.5 px-3">Methodology</th>
                <th className="py-2.5 px-3">Key Inferences</th>
                <th className="py-2.5 px-3">Identified Limitations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b] text-slate-300">
              <tr className="hover:bg-[#111a2e]/50">
                <td className="py-2.5 px-3 font-semibold text-white">
                  Hanafy et al. [1]<br />
                  <span className="text-[10px] text-slate-400">CarbonScaler (ACM SIGMETRICS 2023)</span>
                </td>
                <td className="py-2.5 px-3">
                  Greedy carbon-scaling based on marginal resource allocation on ML/MPI jobs.
                </td>
                <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                  Up to 51% carbon savings on batch workloads over static execution.
                </td>
                <td className="py-2.5 px-3 text-rose-300">
                  Targets deadline-tolerant batch jobs; inapplicable to latency-sensitive microservices.
                </td>
              </tr>
              <tr className="hover:bg-[#111a2e]/50">
                <td className="py-2.5 px-3 font-semibold text-white">
                  Taherizadeh & Grobelnik [2]<br />
                  <span className="text-[10px] text-slate-400">Adv. in Eng. Software (2019)</span>
                </td>
                <td className="py-2.5 px-3">
                  Empirical tuning of reactive HPA scaling factors for compute microservices.
                </td>
                <td className="py-2.5 px-3">
                  Improves reactive HPA tuning parameters under heavy compute load.
                </td>
                <td className="py-2.5 px-3 text-rose-300">
                  Completely carbon-agnostic; scaling logic ignores grid sustainability signals.
                </td>
              </tr>
              <tr className="hover:bg-[#111a2e]/50">
                <td className="py-2.5 px-3 font-semibold text-white">
                  Bansal et al. [3]<br />
                  <span className="text-[10px] text-slate-400">CASA (arXiv 2024)</span>
                </td>
                <td className="py-2.5 px-3">
                  Joint SLO and carbon-aware scheduler for serverless FaaS clusters.
                </td>
                <td className="py-2.5 px-3 text-emerald-400 font-semibold">
                  Cuts FaaS operational carbon by 2.6x while reducing SLO violations.
                </td>
                <td className="py-2.5 px-3 text-rose-300">
                  Confined to serverless FaaS platforms; does not handle container microservices on K8s HPA.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },

    // Slide 6: Problem Gap Identification
    {
      id: 6,
      slideNumber: '06 / 16',
      title: 'Problem Gap Identification',
      category: 'Research Void',
      speakerNotes: 'This brings us to the research gap: Kubernetes has no carbon awareness, CarbonScaler is for batch jobs, CASA is for serverless, and Taherizadeh is carbon-agnostic. No lightweight, Kubernetes-native operator exists for microservices that balances carbon and latency together.',
      content: (
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="enterprise-card p-3 border-l-4 border-l-amber-500">
              <span className="font-bold text-amber-400 block text-xs">Gap 1: HPA is Carbon-Agnostic</span>
              <p className="text-slate-300 mt-1">Native Kubernetes HPA scales only on CPU/memory utilization or custom metrics. Carbon intensity is completely absent from the decision loop.</p>
            </div>
            <div className="enterprise-card p-3 border-l-4 border-l-rose-500">
              <span className="font-bold text-rose-400 block text-xs">Gap 2: Batch Solutions Fail Microservices</span>
              <p className="text-slate-300 mt-1">Existing state-of-the-art like CarbonScaler relies on delaying work until clean grid periods—an approach that immediately causes SLO breaches for interactive microservices.</p>
            </div>
            <div className="enterprise-card p-3 border-l-4 border-l-cyan-500">
              <span className="font-bold text-cyan-400 block text-xs">Gap 3: Serverless FaaS Mismatch</span>
              <p className="text-slate-300 mt-1">Frameworks like CASA operate on ephemeral function cold-starts and request routing, rather than continuous container replica elasticity on Kubernetes clusters.</p>
            </div>
            <div className="enterprise-card p-3 border-l-4 border-l-emerald-500">
              <span className="font-bold text-emerald-400 block text-xs">Gap 4: Lack of Kubernetes-Native Add-on</span>
              <p className="text-slate-300 mt-1">DevOps teams lack a drop-in CRD/Operator solution that integrates seamlessly into existing clusters without re-architecting applications.</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/25 border border-emerald-500/30 text-xs">
            <strong className="text-emerald-300 block">The Identified Research Gap:</strong>
            <span className="text-slate-200">
              No existing solution provides a lightweight, Kubernetes-native CRD/Operator controller that dynamically shifts auto-scaling thresholds for request-driven microservices to reduce carbon emissions while strictly preserving latency and throughput SLOs.
            </span>
          </div>
        </div>
      ),
    },

    // Slide 7: Innovation, Creativity & Novelty
    {
      id: 7,
      slideNumber: '07 / 16',
      title: 'Innovation, Creativity & Novelty',
      category: 'Key Innovations',
      speakerNotes: 'Our project introduces four core innovations: treating carbon intensity as a first-class scaling metric, delivering it as a native Kubernetes CRD operator, adaptive threshold shifting, and SLO-bounded carbon throttling with non-negotiable performance guardrails.',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2 text-xs">
          <div className="enterprise-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">First-Class Carbon Signal</h4>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Treats regional grid carbon intensity ($gCO_2e/kWh$) as a co-equal scaling signal alongside CPU and latency, instead of optimizing scaling solely for resource utilization or infrastructure cost.
            </p>
          </div>

          <div className="enterprise-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Native Kubernetes CRD Operator</h4>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Delivered as a pure Kubernetes-native Operator via custom CRD (`CarbonPolicy`). Deployable on any existing cluster with `kubectl apply -f` without re-architecting microservices or deploying custom schedulers.
            </p>
          </div>

          <div className="enterprise-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Adaptive Utilization Threshold Shifting</h4>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Dynamically scales target CPU utilization between base (e.g. 60%) and high density (up to 80%) based on grid carbon intensity, maximizing workload packing during dirty grid hours.
            </p>
          </div>

          <div className="enterprise-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">SLO-Bounded Guardrail Invariant</h4>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Non-negotiable safety invariant: whenever $P_{95}$ latency approaches the configured ceiling within a safety margin, carbon optimization is instantly suspended to prioritize application performance.
            </p>
          </div>
        </div>
      ),
    },

    // Slide 8: Feasibility and Project Plan
    {
      id: 8,
      slideNumber: '08 / 16',
      title: 'Feasibility and Project Plan',
      category: 'Project Execution',
      speakerNotes: 'Here is our 14-week project execution timeline, spanning literature review, carbon API integration, policy engine design, Kubernetes cluster deployment, and empirical benchmarking on Online Boutique.',
      content: (
        <div className="space-y-4 py-2 text-xs">
          <div className="enterprise-panel p-4 overflow-x-auto">
            <div className="min-w-[500px] space-y-2.5">
              {[
                { phase: 'W1–W2', title: 'Literature Review & Requirement Analysis', prog: '100%', color: 'bg-emerald-500' },
                { phase: 'W3–W4', title: 'Carbon API Integration & Baseline HPA Setup', prog: '100%', color: 'bg-emerald-500' },
                { phase: 'W5–W7', title: 'Policy Engine & CRD/Controller Design', prog: '100%', color: 'bg-emerald-500' },
                { phase: 'W8–W10', title: 'Implementation on Kubernetes Cluster', prog: '100%', color: 'bg-emerald-500' },
                { phase: 'W11–W12', title: 'Benchmarking & Evaluation vs Baselines', prog: '100%', color: 'bg-emerald-500' },
                { phase: 'W13–W14', title: 'Documentation, Testing & Paper Writing', prog: '100%', color: 'bg-emerald-500' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-16 font-mono font-bold text-emerald-400 text-[11px]">{item.phase}</span>
                  <div className="flex-1 bg-[#090f1d] rounded-full h-4 overflow-hidden border border-[#1e293b] flex items-center px-2">
                    <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.prog }} />
                  </div>
                  <span className="text-xs text-slate-200 font-medium w-64 truncate">{item.title}</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">{item.prog}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="enterprise-card p-2.5">
              <strong className="text-white block">Docker & K8s Knowledge</strong>
              <span className="text-slate-400">Team has prior coursework experience in containers and CI/CD pipelines.</span>
            </div>
            <div className="enterprise-card p-2.5">
              <strong className="text-white block">Evaluation Benchmark</strong>
              <span className="text-slate-400">Online Boutique 10-tier polyglot microservice benchmark deployed locally.</span>
            </div>
            <div className="enterprise-card p-2.5">
              <strong className="text-white block">API Rate-Limit Mitigation</strong>
              <span className="text-slate-400">In-memory caching (TTL: 300s) + deterministic regional trace fallbacks.</span>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 9: Problem Definition & Detailed Requirements
    {
      id: 9,
      slideNumber: '09 / 16',
      title: 'Problem Definition & Detailed Requirements',
      category: 'Requirements Specification',
      speakerNotes: 'We divided our technical requirements into four categories: Functional requirements for carbon and metrics ingestion, Performance and SLO guardrails, Integration via CRDs and Prometheus, and Evaluation metrics.',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 text-xs">
          <div className="enterprise-card p-3.5 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-300">
              <Activity className="w-3.5 h-3.5" /> 1. Functional Requirements
            </h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>• Ingest real-time carbon-intensity signals ($gCO_2e/kWh$) every 15–60 seconds.</li>
              <li>• Collect CPU, memory, request rate, and $P_{95}/P_{99}$ latency metrics.</li>
              <li>• Calculate dynamically adjusted target utilization thresholds.</li>
              <li>• Adjust native HPA subresources via controller reconciliation loops.</li>
            </ul>
          </div>

          <div className="enterprise-card p-3.5 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider text-rose-300">
              <ShieldCheck className="w-3.5 h-3.5" /> 2. Performance & SLO Requirements
            </h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>• Zero SLO violations: $P_{95}$ latency must strictly not breach threshold ceiling.</li>
              <li>• Enforce hard replica boundaries [R_min, R_max] under all conditions.</li>
              <li>• Scale-up stabilization cooldown (60s) & scale-down anti-flapping (300s).</li>
              <li>• React to traffic surges without unnecessary dampening delay.</li>
            </ul>
          </div>

          <div className="enterprise-card p-3.5 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-300">
              <Layers className="w-3.5 h-3.5" /> 3. Integration Requirements
            </h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>• Expose declarative policies as Kubernetes Custom Resource (`CarbonPolicy`).</li>
              <li>• Bi-directional integration with Prometheus Operator and Metrics Server.</li>
              <li>• Expose audit events, status, and savings through a lightweight REST API.</li>
              <li>• Web-based observability dashboard for DevOps teams and stakeholders.</li>
            </ul>
          </div>

          <div className="enterprise-card p-3.5 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5 text-xs uppercase tracking-wider text-emerald-300">
              <Award className="w-3.5 h-3.5" /> 4. Evaluation Requirements
            </h4>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li>• Direct comparison against standard static HPA (60% baseline).</li>
              <li>• Quantify operational carbon emissions avoided ($gCO_2e$ and percentage).</li>
              <li>• Track energy savings in kilowatt-hours (kWh) using calibrated power models.</li>
              <li>• Export verifiable time-series logs in CSV and JSON formats.</li>
            </ul>
          </div>
        </div>
      ),
    },

    // Slide 10: System Architecture & Design
    {
      id: 10,
      slideNumber: '10 / 16',
      title: 'System Architecture & Design (Figure 1)',
      category: 'System Architecture',
      speakerNotes: 'Here is our core Figure 1 system architecture: Layer 1 is external carbon data, Layer 2 is the Carbon Pilot control plane operator, Layer 3 is the Kubernetes cluster with HPA and microservice pods, and Layer 4 is observability with our REST API and React dashboard.',
      content: (
        <div className="space-y-3 py-2 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 space-y-1.5">
              <span className="text-[10px] font-mono text-rose-400 font-bold uppercase block">Layer 1</span>
              <h5 className="font-bold text-white text-xs">External Carbon Data</h5>
              <p className="text-[11px] text-slate-300">Electricity Maps / WattTime API polling with cache and fallback models.</p>
              <span className="badge-warning text-[9px] px-1.5 py-0.5 rounded font-mono block text-center">REST / JSON (gCO₂e/kWh)</span>
            </div>

            <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/30 space-y-1.5">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block">Layer 2</span>
              <h5 className="font-bold text-white text-xs">Operator Control Plane</h5>
              <p className="text-[11px] text-slate-300">Signal Collector + Policy Engine + CarbonPolicy CRD Controller.</p>
              <span className="badge-info text-[9px] px-1.5 py-0.5 rounded font-mono block text-center">Reconciler Loop (15s)</span>
            </div>

            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-1.5">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase block">Layer 3</span>
              <h5 className="font-bold text-white text-xs">Kubernetes Cluster</h5>
              <p className="text-[11px] text-slate-300">Prometheus, Metrics Server, HPA Subresource, and Online Boutique Pods.</p>
              <span className="badge-warning text-[9px] px-1.5 py-0.5 rounded font-mono block text-center">Kube-API Server</span>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 space-y-1.5">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase block">Layer 4</span>
              <h5 className="font-bold text-white text-xs">Observability & UI</h5>
              <p className="text-[11px] text-slate-300">REST API (`/api/policies`, `/api/simulator/step`) + React Dashboard.</p>
              <span className="badge-eco text-[9px] px-1.5 py-0.5 rounded font-mono block text-center">HTTP / WebSocket</span>
            </div>
          </div>

          <div className="enterprise-subtle p-3 rounded-lg text-slate-300 text-[11px] flex items-center justify-between">
            <span className="font-semibold text-white">Core Architectural Principle:</span>
            <span>Carbon Pilot augments Kubernetes HPA — it never replaces standard autoscaling; SLO guardrails remain the final safety boundary.</span>
          </div>
        </div>
      ),
    },

    // Slide 11: Module Design & Implementation
    {
      id: 11,
      slideNumber: '11 / 16',
      title: 'Module Design & Implementation (M1–M7)',
      category: 'Implementation Stack',
      speakerNotes: 'Our platform is partitioned into seven distinct modules M1 through M7. From M1 signal collector and M3 policy engine to M4 CRD and M7 REST API dashboard. Our stack uses Go, client-go, React 19, Vite, and Prometheus.',
      content: (
        <div className="space-y-3 py-2 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="enterprise-card p-2.5">
              <strong className="text-white block text-xs">M1: Signal Collector</strong>
              <span className="text-slate-400">Polls carbon API, normalizes signal, validates schema.</span>
            </div>
            <div className="enterprise-card p-2.5">
              <strong className="text-white block text-xs">M2: Metrics Collector</strong>
              <span className="text-slate-400">Pulls CPU, memory, request rates, latency from Prometheus.</span>
            </div>
            <div className="enterprise-card p-2.5">
              <strong className="text-white block text-xs">M3: Policy Engine</strong>
              <span className="text-slate-400">Mathematical power model + SLO-bounded decision core.</span>
            </div>
            <div className="enterprise-card p-2.5">
              <strong className="text-white block text-xs">M4: CarbonPolicy CRD</strong>
              <span className="text-slate-400">OpenAPI v3 declarative Custom Resource Definition.</span>
            </div>
            <div className="enterprise-card p-2.5">
              <strong className="text-white block text-xs">M5: CRD Controller</strong>
              <span className="text-slate-400">Kubebuilder reconciler applying dynamic targets to HPA.</span>
            </div>
            <div className="enterprise-card p-2.5">
              <strong className="text-white block text-xs">M6: HPA & Microservices</strong>
              <span className="text-slate-400">10 Google Online Boutique microservice deployments.</span>
            </div>
            <div className="enterprise-card p-2.5 col-span-2">
              <strong className="text-white block text-xs">M7: REST API & Observability Dashboard</strong>
              <span className="text-slate-400">Full-stack control center with 6-point explanation traces & CSV exports.</span>
            </div>
          </div>

          <div className="p-3 rounded-lg enterprise-subtle flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="font-mono text-slate-400">
              Tech Stack: <strong className="text-white">Go (Golang 1.23)</strong> • <strong className="text-white">Kubebuilder</strong> • <strong className="text-white">client-go</strong> • <strong className="text-white">React 19 / TypeScript</strong> • <strong className="text-white">Tailwind CSS</strong> • <strong className="text-white">Prometheus</strong>
            </span>
          </div>
        </div>
      ),
    },

    // Slide 12: Module Integration & Closed-Loop Control Flow
    {
      id: 12,
      slideNumber: '12 / 16',
      title: 'Module Integration & Closed-Loop Control Flow',
      category: 'Closed-Loop Control',
      speakerNotes: 'Here is the 7-step closed-loop control flow that repeats every 15 seconds: Step 1 fetches carbon, Step 2 collects workload metrics, Step 3 policy engine computes target CPU, Step 4 updates CRD, Step 5 reconciles HPA, Step 6 scales pods, and Step 7 feeds live telemetry.',
      content: (
        <div className="space-y-3 py-2 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-1.5 text-center">
            {[
              { step: '1', title: 'Carbon API', desc: 'Latest grid carbon intensity' },
              { step: '2', title: 'Metrics', desc: 'CPU, latency, RPS from cAdvisor' },
              { step: '3', title: 'Policy Engine', desc: 'Compute target CPU & check SLO' },
              { step: '4', title: 'CarbonPolicy', desc: 'Update CRD status & spec' },
              { step: '5', title: 'Controller', desc: 'Reconcile HPA subresource' },
              { step: '6', title: 'HPA Scaling', desc: 'Pods scaled up / consolidated' },
              { step: '7', title: 'Dashboard', desc: 'Store & stream telemetry trace' },
            ].map((s) => (
              <div key={s.step} className="enterprise-card p-2 flex flex-col justify-between items-center text-center">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] flex items-center justify-center mb-1">
                  {s.step}
                </span>
                <span className="font-bold text-white text-[11px]">{s.title}</span>
                <span className="text-[10px] text-slate-400 mt-1 leading-tight">{s.desc}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-[11px]">
            <div className="enterprise-card p-3">
              <strong className="text-emerald-400 block mb-1">Closed-Loop Feedback</strong>
              <p className="text-slate-300">After scaling, new workload metrics are observed again. The next 15-second cycle recalculates the policy based on fresh state.</p>
            </div>
            <div className="enterprise-card p-3">
              <strong className="text-cyan-400 block mb-1">Pre-Execution Safety</strong>
              <p className="text-slate-300">Latency headroom and SLO limits are mathematically validated before changing any scaling target.</p>
            </div>
            <div className="enterprise-card p-3">
              <strong className="text-violet-400 block mb-1">Audit Traceability</strong>
              <p className="text-slate-300">Every scaling action generates a 6-point explanation trace logged to the reconciler event stream and stored in JSON.</p>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 13: Presentation & Demonstration Sequence
    {
      id: 13,
      slideNumber: '13 / 16',
      title: 'Presentation & Demonstration Sequence',
      category: 'Evaluator Demo Flow',
      speakerNotes: 'When demonstrating to the evaluators, we follow this exact 6-step sequence: Show cluster state, explain baseline HPA behavior, activate Carbon Pilot, simulate a dirty grid surge to show pod consolidation, trigger a traffic spike to prove the SLO guardrail override, and show the audit log.',
      content: (
        <div className="space-y-3 py-2 text-xs">
          <div className="space-y-2">
            {[
              { num: 'Step 1', title: 'Show Kubernetes Cluster State', desc: 'Display pods, HPA, and Prometheus metrics running across the 10 microservices.' },
              { num: 'Step 2', title: 'Demonstrate Baseline HPA Behavior', desc: 'Show how standard HPA remains at a static 60% CPU target, oblivious to dirty grid hours.' },
              { num: 'Step 3', title: 'Activate Carbon Pilot Orchestrator', desc: 'Deploy operator and apply the CarbonPolicy CRD with target SLA latency ceiling.' },
              { num: 'Step 4', title: 'Simulate High-Carbon Grid Event (580 gCO₂e/kWh)', desc: 'Observe target CPU adjust to 78%, consolidating idle pods from 12 down to 9 and saving power.' },
              { num: 'Step 5', title: 'Trigger Traffic Surge & Verify SLO Override', desc: 'Surge traffic to 2,500 RPS: operator immediately suspends carbon tuning and surges replicas to 18 pods to guarantee latency.' },
              { num: 'Step 6', title: 'Verify 6-Point Audit Trace & Export CSV', desc: 'Inspect the live mathematical explanation card and download evaluation benchmarks in CSV format.' },
            ].map((item) => (
              <div key={item.num} className="enterprise-card p-2.5 flex items-center justify-between gap-3">
                <span className="font-mono text-emerald-400 font-bold text-xs w-16">{item.num}</span>
                <span className="font-bold text-white text-xs w-48 sm:w-64">{item.title}</span>
                <span className="text-[11px] text-slate-400 flex-1">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    // Slide 14: Experimental Results & Benchmarking
    {
      id: 14,
      slideNumber: '14 / 16',
      title: 'Experimental Results & Benchmarking',
      category: 'Empirical Verification',
      speakerNotes: 'Here are our empirical results over a 24-hour diurnal web traffic cycle on Google Online Boutique: we achieved a 31.2% reduction in operational carbon emissions, conserved 94.4 kWh of electricity, and achieved 100% SLO compliance with zero latency breaches.',
      content: (
        <div className="space-y-4 py-2 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="enterprise-panel p-3 border-emerald-500/30 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Operational Carbon Avoided</span>
              <span className="text-2xl font-black text-emerald-400 font-sans block mt-1">-31.2%</span>
              <span className="text-[10px] text-slate-400 font-mono">44.6 kg CO₂e / day</span>
            </div>
            <div className="enterprise-panel p-3 border-cyan-500/30 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Electricity Conserved</span>
              <span className="text-2xl font-black text-cyan-400 font-sans block mt-1">94.4 kWh</span>
              <span className="text-[10px] text-slate-400 font-mono">254.1 vs 348.5 kWh base</span>
            </div>
            <div className="enterprise-panel p-3 border-violet-500/30 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">SLO Compliance Rate</span>
              <span className="text-2xl font-black text-violet-400 font-sans block mt-1">100.0%</span>
              <span className="text-[10px] text-emerald-400 font-mono">0 SLA Breaches</span>
            </div>
            <div className="enterprise-panel p-3 border-amber-500/30 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Automated Test Suite</span>
              <span className="text-2xl font-black text-white font-sans block mt-1">22 / 22</span>
              <span className="text-[10px] text-emerald-400 font-mono">100% Passing Tests</span>
            </div>
          </div>

          <div className="enterprise-panel p-3.5 space-y-2">
            <h5 className="font-bold text-white text-xs">Comparison Summary (24-Hour Diurnal Web Traffic)</h5>
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-1">
              <div className="p-2 rounded bg-[#090f1d] border border-[#1e293b]">
                <span className="text-slate-400 block text-[10px]">Standard Static HPA</span>
                <span className="font-bold text-white mt-0.5 block">142.8 kg CO₂e emitted</span>
                <span className="text-slate-500 text-[10px]">348.5 kWh consumed</span>
              </div>
              <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/40">
                <span className="text-emerald-400 block text-[10px] font-bold">Carbon Pilot Orchestrator</span>
                <span className="font-bold text-emerald-300 mt-0.5 block">98.2 kg CO₂e emitted</span>
                <span className="text-emerald-400 text-[10px]">254.1 kWh consumed</span>
              </div>
              <div className="p-2 rounded bg-[#090f1d] border border-[#1e293b]">
                <span className="text-slate-400 block text-[10px]">Net Operational Benefit</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">44.6 kg CO₂e Saved</span>
                <span className="text-emerald-400 text-[10px]">-$412/mo Cloud Cost</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // Slide 15: Conclusion & Future Work
    {
      id: 15,
      slideNumber: '15 / 16',
      title: 'Conclusion & Future Work',
      category: 'Conclusions & Scope',
      speakerNotes: 'In conclusion, Carbon Pilot proves that cloud sustainability and latency SLOs can be achieved together without compromising performance. In future work, we plan to extend this to multi-cluster geo-routing, predictive ML carbon forecasts, and hardware DVFS integration.',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2 text-xs">
          <div className="enterprise-card p-4 space-y-3">
            <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Conclusion & Key Takeaways
            </h4>
            <ul className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
              <li>• Proved that Kubernetes can be made grid-aware without rewriting microservice code or abandoning HPA.</li>
              <li>• Demonstrated that intelligent pod packing during carbon peaks achieves a <strong>31.2% carbon reduction</strong> without sacrificing latency.</li>
              <li>• Validated that the <strong>SLO guardrail invariant</strong> successfully eliminates performance degradation risks for production workloads.</li>
              <li>• Delivered a fully verifiable open-source prototype with CRD manifests and interactive observability tooling.</li>
            </ul>
          </div>

          <div className="enterprise-card p-4 space-y-3">
            <h4 className="font-bold text-cyan-400 text-sm flex items-center gap-1.5">
              <ArrowRight className="w-4 h-4" /> Future Work & Research Directions
            </h4>
            <ul className="space-y-2 text-slate-300 text-[11px] leading-relaxed">
              <li>• <strong>Multi-Region Geo-Distributed Shifting:</strong> Routing incoming user requests dynamically between cloud regions with cleaner solar grids.</li>
              <li>• <strong>Predictive ML Carbon Forecasting:</strong> Integrating Transformer-based carbon forecasts (e.g. 6-hour ahead) to proactively scale before spikes occur.</li>
              <li>• <strong>Hardware DVFS Integration:</strong> Coupling pod density scaling with bare-metal CPU frequency scaling (Dynamic Voltage & Frequency Scaling) for deeper node-level savings.</li>
            </ul>
          </div>
        </div>
      ),
    },

    // Slide 16: References & Publication Strategy
    {
      id: 16,
      slideNumber: '16 / 16',
      title: 'References & Publication Strategy',
      category: 'Academic Rigor',
      speakerNotes: 'Here are the primary literature citations supporting our research, along with our planned conference publication submission.',
      content: (
        <div className="space-y-3 py-2 text-xs">
          <div className="enterprise-card p-3.5 space-y-2">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 text-emerald-400">
              <BookOpen className="w-3.5 h-3.5" /> Primary Academic References
            </h5>
            <ol className="space-y-1.5 text-slate-300 text-[11px] font-mono list-decimal pl-4">
              <li>
                A. Hanafy et al., "CarbonScaler: Leveraging Cloud Workload Elasticity for Optimizing Carbon-Efficiency," in <em>Proc. ACM SIGMETRICS / POMACS</em>, vol. 7, no. 2, pp. 1–28, 2023.
              </li>
              <li>
                S. Taherizadeh and M. Grobelnik, "Key Influencing Factors of the Kubernetes Auto-Scaler for Computing-Intensive Microservice-Native Cloud-Based Applications," <em>Advances in Engineering Software</em>, vol. 140, p. 102734, 2020.
              </li>
              <li>
                A. Bansal et al., "CASA: A Framework for SLO and Carbon-Aware Autoscaling and Scheduling in Serverless Cloud Computing," <em>arXiv preprint arXiv:2404.12586</em>, 2024.
              </li>
              <li>
                Cloud Native Computing Foundation (CNCF), "Kubernetes Horizontal Pod Autoscaler Specification (autoscaling/v2)," 2024.
              </li>
            </ol>
          </div>

          <div className="p-3 rounded-lg enterprise-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-white block">Planned Conference / Journal Publication:</span>
              <span className="text-[11px] text-slate-400">Targeting IEEE/ACM International Conference on Utility and Cloud Computing (UCC 2026)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-eco px-2.5 py-1 rounded text-xs font-semibold">Manuscript In Preparation</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#070c18] p-6 overflow-y-auto' : ''}`}>
      
      {/* Top Slide Navigation Bar */}
      <div className="enterprise-panel p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-white/95 p-1 rounded border border-slate-700">
            <img src="/klh-logo.png" alt="KLH Logo" className="h-6 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-mono">{currentSlide.slideNumber}</span>
              <span className="text-slate-500">•</span>
              <span className="badge-violet text-[10px] px-2 py-0.5 rounded uppercase font-semibold font-mono">
                {currentSlide.category}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">
              {currentSlide.title}
            </h3>
          </div>
        </div>

        {/* Presentation Controls */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentSlideIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#090f1d] hover:bg-[#111a2e] disabled:opacity-40 disabled:cursor-not-allowed border border-[#1e293b] text-slate-200 transition-colors cursor-pointer"
            title="Previous Slide (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <select
            value={currentSlideIndex}
            onChange={(e) => setCurrentSlideIndex(Number(e.target.value))}
            className="bg-[#090f1d] border border-[#1e293b] text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {slides.map((s, idx) => (
              <option key={s.id} value={idx}>
                Slide {idx + 1}: {s.title}
              </option>
            ))}
          </select>

          <button
            onClick={() => setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1))}
            disabled={currentSlideIndex === slides.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold transition-colors cursor-pointer"
            title="Next Slide (Right Arrow or Space)"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowNotes((prev) => !prev)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              showNotes 
                ? 'bg-violet-950/60 text-violet-300 border-violet-700/50' 
                : 'bg-[#090f1d] text-slate-400 border-[#1e293b] hover:text-white'
            }`}
            title="Toggle Speaker Notes"
          >
            <FileText className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="p-1.5 rounded-lg bg-[#090f1d] hover:bg-[#111a2e] border border-[#1e293b] text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen Presentation'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Slide Card Container */}
      <div className="enterprise-panel p-6 sm:p-8 min-h-[460px] flex flex-col justify-between shadow-2xl relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="bg-white/95 px-2 py-0.5 rounded border border-slate-700">
            <img src="/klh-logo.png" alt="KLH Logo" className="h-5 object-contain" />
          </div>
        </div>

        {/* Dynamic Slide Content */}
        <div className="flex-1 flex flex-col justify-center">
          {currentSlide.content}
        </div>

        {/* Slide Progress Dots */}
        <div className="mt-6 pt-4 border-t border-[#1e293b] flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSlideIndex === idx
                    ? 'w-6 bg-emerald-400'
                    : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                }`}
                title={`Go to Slide ${idx + 1}`}
              />
            ))}
          </div>

          <span className="font-mono text-[11px] text-slate-400">
            KLH University • CNAD Review-2 • Use Left / Right arrows to navigate
          </span>
        </div>
      </div>

      {/* Interactive Speaker Notes Card */}
      {showNotes && (
        <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/30 text-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-violet-400" />
            <strong className="text-violet-300 uppercase tracking-wider text-[10px] font-mono">
              Speaker Notes (What to say to faculty on this slide):
            </strong>
          </div>
          <p className="text-slate-200 leading-relaxed font-sans text-xs sm:text-sm pl-5 border-l-2 border-violet-500/50">
            "{currentSlide.speakerNotes}"
          </p>
        </div>
      )}

    </div>
  );
};
