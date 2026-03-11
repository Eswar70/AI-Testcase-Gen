import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, PieChart, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import GeneratorPanel from '../components/TestCaseGenerator/GeneratorPanel';
import ReportDashboard from '../components/ReportDashboard/ReportDashboard';
import HistoryPanel from '../components/History/HistoryPanel';
import { TestAppService } from '../services/api';
import type { TestCaseDBModel } from '../types/testcaseTypes';

type Tab = 'generate' | 'reports' | 'history';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [history, setHistory] = useState<TestCaseDBModel[]>([]);

  const fetchHistory = async () => {
    try {
      const data = await TestAppService.getHistory();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    const handleSwitchTab = (e: any) => {
      if (e.detail && ['generate', 'reports', 'history'].includes(e.detail)) {
        setActiveTab(e.detail);
      }
    };
    window.addEventListener('switch-tab', handleSwitchTab);
    return () => window.removeEventListener('switch-tab', handleSwitchTab);
  }, []);

  const tabs = [
    { id: 'generate', label: 'Generator', icon: Layers },
    { id: 'reports', label: 'Extent Reports', icon: PieChart },
    { id: 'history', label: 'History', icon: Clock },
  ];

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Workspace
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Generate, analyze, and manage your AI-driven test cases.
          </p>
        </div>

        <div className="flex p-1 space-x-1 glass rounded-lg w-full sm:w-auto overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "relative flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap",
                  isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-primary rounded-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="relative z-10 w-4 h-4" />
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col relative">
        <div style={{ display: activeTab === 'generate' ? 'block' : 'none' }} className="flex-1 fade-in">
          <GeneratorPanel onRefresh={fetchHistory} />
        </div>
        <div style={{ display: activeTab === 'reports' ? 'block' : 'none' }} className="flex-1 fade-in">
          <ReportDashboard history={history} />
        </div>
        <div style={{ display: activeTab === 'history' ? 'block' : 'none' }} className="flex-1 fade-in">
          <HistoryPanel history={history} onRefresh={fetchHistory} />
        </div>
      </div>
    </div>
  );
}
