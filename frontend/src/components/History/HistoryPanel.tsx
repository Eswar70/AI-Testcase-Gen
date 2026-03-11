import { useState } from 'react';
import { TestAppService } from '../../services/api';
import type { TestCaseDBModel } from '../../types/testcaseTypes';
import TestCaseTable from '../TestCaseTable/TestCaseTable';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ChevronDown, ChevronRight, Trash2, Folder } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  history: TestCaseDBModel[];
  onRefresh: () => void;
}

export default function HistoryPanel({ history, onRefresh }: Props) {
  const [expandedSuites, setExpandedSuites] = useState<Record<string, boolean>>({});

  const toggleSuite = (suiteId: string) => {
    setExpandedSuites(prev => ({ ...prev, [suiteId]: !prev[suiteId] }));
  };

  const handleDeleteSuite = async (suiteId: string) => {
    toast.promise(
      TestAppService.deleteSuite(suiteId),
      {
        loading: 'Deleting test suite...',
        success: () => {
          onRefresh();
          return 'Test suite deleted permanently.';
        },
        error: 'Failed to delete test suite 🚨'
      }
    );
  };

  const groupedHistory = history.reduce((acc, tc) => {
    const suiteId = tc.suite_id || 'unknown';
    if (!acc[suiteId]) acc[suiteId] = { suiteName: tc.suite_name || 'Legacy Individual Tests', cases: [] };
    acc[suiteId].cases.push(tc);
    return acc;
  }, {} as Record<string, { suiteName: string, cases: TestCaseDBModel[] }>);

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6 border border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-400" />
            MongoDB History Logs
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Displaying previously generated AI test suites from Atlas cluster.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedHistory).length === 0 && (
           <div className="flex justify-center items-center h-48 text-muted-foreground glass rounded-xl border border-white/5">
             No test cases found. Generate some in the Generator tab!
           </div>
        )}
        {Object.entries(groupedHistory).map(([suiteId, suite]) => (
          <motion.div key={suiteId} className="glass rounded-xl overflow-hidden border border-white/5 shadow-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div 
              className="p-4 bg-white/5 flex justify-between items-center cursor-pointer hover:bg-white/10 transition-colors"
              onClick={() => toggleSuite(suiteId)}
            >
              <div className="flex items-center space-x-3">
                 {expandedSuites[suiteId] ? <ChevronDown className="w-5 h-5 text-muted-foreground" /> : <ChevronRight className="w-5 h-5 text-muted-foreground" />}
                 <Folder className="w-5 h-5 text-primary" />
                 <div>
                    <h3 className="font-semibold text-foreground text-md">{suite.suiteName}</h3>
                    <p className="text-xs text-muted-foreground">{suite.cases.length} test cases • Group ID: {suiteId.substring(0, 8)}</p>
                 </div>
              </div>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteSuite(suiteId); }}
                  className="p-2 text-muted-foreground hover:bg-red-500/20 hover:text-red-400 rounded-md transition-colors"
                  title="Delete Entire Suite"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <AnimatePresence>
              {expandedSuites[suiteId] && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/5"
                >
                  <div className="p-4">
                    <TestCaseTable testCases={suite.cases} editable={false} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
