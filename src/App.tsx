import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { LiveSimulator } from './components/LiveSimulator';
import { LiveDashboard } from './components/LiveDashboard';
import { CrdInspector } from './components/CrdInspector';
import { TechStackMatrix } from './components/TechStackMatrix';
import { BenchmarkEvaluation } from './components/BenchmarkEvaluation';
import { PresentationDeck } from './components/PresentationDeck';
import { DemoScriptModal } from './components/DemoScriptModal';
import { Footer } from './components/Footer';
import { INITIAL_REGIONS, INITIAL_MICROSERVICES } from './data/mockData';
import { GridRegion, MicroserviceDeployment } from './types';

export function App() {
  const [regions, setRegions] = useState<GridRegion[]>(INITIAL_REGIONS);
  const [activeRegion, setActiveRegion] = useState<GridRegion>(INITIAL_REGIONS[0]);
  const [microservices, setMicroservices] = useState<MicroserviceDeployment[]>(INITIAL_MICROSERVICES);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);

  const toggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Top Navigation Shell */}
      <Navbar
        regions={regions}
        activeRegion={activeRegion}
        onSelectRegion={setActiveRegion}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSimulating={isSimulating}
        toggleSimulation={toggleSimulation}
        onStartDemoWalkthrough={() => setIsDemoModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <HeroSection
          activeRegion={activeRegion}
          onExploreArchitecture={() => setActiveTab('architecture')}
          onLaunchSimulator={() => setActiveTab('simulator')}
          onOpenDashboard={() => setActiveTab('dashboard')}
          onOpenEvaluation={() => setActiveTab('evaluation')}
        />

        {/* Tab-driven Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          
          {/* TAB: Overview (Full integrated control center) */}
          {activeTab === 'overview' && (
            <div className="space-y-10 animate-fade-in">
              <section id="simulator-overview">
                <LiveSimulator
                  activeRegion={activeRegion}
                  microservices={microservices}
                  onUpdateServices={setMicroservices}
                  isSimulating={isSimulating}
                />
              </section>

              <section id="dashboard-overview">
                <LiveDashboard
                  activeRegion={activeRegion}
                  microservices={microservices}
                />
              </section>

              <section id="architecture-overview">
                <ArchitectureViewer />
              </section>

              <section id="evaluation-overview">
                <BenchmarkEvaluation />
              </section>

              <section id="crd-overview">
                <CrdInspector />
              </section>

              <section id="techstack-overview">
                <TechStackMatrix />
              </section>
            </div>
          )}

          {/* TAB: Presentation Deck (KLH Review Deck) */}
          {activeTab === 'presentation' && (
            <div className="animate-fade-in">
              <PresentationDeck />
            </div>
          )}

          {/* TAB: Architecture Only */}
          {activeTab === 'architecture' && (
            <div className="animate-fade-in">
              <ArchitectureViewer />
            </div>
          )}

          {/* TAB: Simulator Only */}
          {activeTab === 'simulator' && (
            <div className="animate-fade-in">
              <LiveSimulator
                activeRegion={activeRegion}
                microservices={microservices}
                onUpdateServices={setMicroservices}
                isSimulating={isSimulating}
              />
            </div>
          )}

          {/* TAB: Live Telemetry Dashboard Only */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              <LiveDashboard
                activeRegion={activeRegion}
                microservices={microservices}
              />
            </div>
          )}

          {/* TAB: CRD Configurator */}
          {activeTab === 'crd' && (
            <div className="animate-fade-in">
              <CrdInspector />
            </div>
          )}

          {/* TAB: Evaluation Benchmark Results */}
          {activeTab === 'evaluation' && (
            <div className="animate-fade-in">
              <BenchmarkEvaluation />
            </div>
          )}

          {/* TAB: Tech Stack */}
          {activeTab === 'techstack' && (
            <div className="animate-fade-in">
              <TechStackMatrix />
            </div>
          )}

        </div>
      </main>

      {/* Interactive Hackathon Demo Script Modal */}
      <DemoScriptModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        setActiveTab={setActiveTab}
      />

      {/* Global Application Footer */}
      <Footer />
    </div>
  );
}

export default App;
