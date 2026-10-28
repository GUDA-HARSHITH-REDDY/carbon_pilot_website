import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { LiveSimulator } from './components/LiveSimulator';
import { LiveDashboard } from './components/LiveDashboard';
import { CrdInspector } from './components/CrdInspector';
import { TechStackMatrix } from './components/TechStackMatrix';
import { BenchmarkEvaluation } from './components/BenchmarkEvaluation';
import { Footer } from './components/Footer';
import { INITIAL_REGIONS, INITIAL_MICROSERVICES } from './data/mockData';
import { GridRegion, MicroserviceDeployment, ThemeColor } from './types';

export function App() {
  const [regions, setRegions] = useState<GridRegion[]>(INITIAL_REGIONS);
  const [activeRegion, setActiveRegion] = useState<GridRegion>(INITIAL_REGIONS[0]);
  const [microservices, setMicroservices] = useState<MicroserviceDeployment[]>(INITIAL_MICROSERVICES);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [themeColor, setThemeColor] = useState<ThemeColor>('emerald');

  const toggleSimulation = () => {
    setIsSimulating((prev) => !prev);
  };

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col font-sans theme-${themeColor}`}>
      {/* Top Navbar */}
      <Navbar
        regions={regions}
        activeRegion={activeRegion}
        onSelectRegion={setActiveRegion}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSimulating={isSimulating}
        toggleSimulation={toggleSimulation}
        themeColor={themeColor}
        setThemeColor={setThemeColor}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          activeRegion={activeRegion}
          onExploreArchitecture={() => setActiveTab('architecture')}
          onLaunchSimulator={() => setActiveTab('simulator')}
          onOpenDashboard={() => setActiveTab('dashboard')}
          themeColor={themeColor}
        />

        {/* Tab-driven Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
          
          {/* Section: Overview (All high-level highlights) */}
          {activeTab === 'overview' && (
            <div className="space-y-12">
              <section id="architecture-preview">
                <ArchitectureViewer />
              </section>

              <section id="simulator-preview">
                <LiveSimulator
                  activeRegion={activeRegion}
                  microservices={microservices}
                  onUpdateServices={setMicroservices}
                  isSimulating={isSimulating}
                />
              </section>

              <section id="dashboard-preview">
                <LiveDashboard
                  activeRegion={activeRegion}
                  microservices={microservices}
                />
              </section>

              <section id="crd-preview">
                <CrdInspector />
              </section>

              <section id="techstack-preview">
                <TechStackMatrix />
              </section>

              <section id="benchmark-preview">
                <BenchmarkEvaluation />
              </section>
            </div>
          )}

          {/* Section: Architecture only */}
          {activeTab === 'architecture' && (
            <div className="animate-fade-in">
              <ArchitectureViewer />
            </div>
          )}

          {/* Section: Simulator only */}
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

          {/* Section: Live Dashboard only */}
          {activeTab === 'dashboard' && (
            <div className="animate-fade-in">
              <LiveDashboard
                activeRegion={activeRegion}
                microservices={microservices}
              />
            </div>
          )}

          {/* Section: CRD Configurator */}
          {activeTab === 'crd' && (
            <div className="animate-fade-in">
              <CrdInspector />
            </div>
          )}

          {/* Section: Tech Stack */}
          {activeTab === 'techstack' && (
            <div className="animate-fade-in">
              <TechStackMatrix />
            </div>
          )}

          {/* Section: Evaluation Benchmark */}
          {activeTab === 'benchmark' && (
            <div className="animate-fade-in">
              <BenchmarkEvaluation />
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
