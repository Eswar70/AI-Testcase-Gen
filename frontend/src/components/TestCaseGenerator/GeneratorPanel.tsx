import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, TestTube, Loader2, AlertCircle, Upload, FileText, Play, CheckCircle2, PieChart, ChevronDown, ChevronRight, Folder, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { TestAppService, WS_URL } from '../../services/api';
import type { TestCase } from '../../types/testcaseTypes';
import TestCaseTable from '../TestCaseTable/TestCaseTable';

interface Props {
  onRefresh: () => void;
}

export default function GeneratorPanel({ onRefresh }: Props) {
  const [requirement, setRequirement] = useState('');
  const [url, setUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  const [isExecuting, setIsExecuting] = useState(false);
  const [executionIndex, setExecutionIndex] = useState(-1);
  const [isDone, setIsDone] = useState(false);

  const handleGenerate = async () => {
    if (!requirement.trim() && !selectedFile && !url.trim()) {
      setError('Please enter a requirement, a website URL, or upload a CSV/JSON file.');
      return;
    }
    setError('');
    setIsGenerating(true);
    setTestCases([]);

    try {
      let response;
      if (selectedFile) {
        response = await TestAppService.generateFromFile(selectedFile);
      } else if (url.trim()) {
        response = await TestAppService.generateFromUrl(url.trim());
      } else {
        response = await TestAppService.generateTestCases({ requirement });
      }
      setTestCases(response.test_cases);
      setIsDone(false);
      setExecutionIndex(-1);
      toast.success("Test cases generated successfully!");
      setSelectedFile(null); // Clear file after success
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || err.message || 'Failed to generate test cases.';
      setError(errorMsg);
      if (errorMsg === "I cannot process login-required websites.") {
        toast.error(errorMsg);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type === "application/json" || file.name.endsWith(".json") || file.type === "text/csv" || file.name.endsWith(".csv")) {
          setSelectedFile(file);
          setRequirement(''); // Clear text if file is uploaded
          setError('');
      } else {
          setError("Only CSV and JSON files are supported.");
          e.target.value = '';
      }
    }
  };

  const handleRunSuite = async () => {
    setIsExecuting(true);
    setExecutionIndex(0);
    setIsDone(false);

    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      socket.send(JSON.stringify({ test_cases: testCases }));
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      
      if (data.status === 'executing') {
        setExecutionIndex(data.index);
        toast.loading(data.message, { id: `exe-${data.index}`, duration: 1000 });
      } else if (data.status === 'completed') {
        toast.success(`Executed ${data.test_id}: ${data.result}!`, { id: `exe-${data.index}`, icon: '🚀' });
      } else if (data.status === 'done') {
        setExecutionIndex(testCases.length);
        setIsExecuting(false);
        setIsDone(true);
        socket.close();
        
        try {
          const suiteName = url ? url : selectedFile ? selectedFile.name : requirement ? requirement.slice(0, 60) + (requirement.length > 60 ? '...' : '') : "Generated Suite";
          await TestAppService.saveTestCases(suiteName, testCases);
          toast.success("Execution Complete. Reports saved to History!", { duration: 4000, icon: '📊' });
          onRefresh();
        } catch(err) {
          toast.error("Execution complete, but failed to save to History database.");
        }
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("Execution failed due to connection error.");
      setIsExecuting(false);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-4 sm:p-6 border border-white/5 shadow-xl">
        <label htmlFor="requirement" className="block text-sm font-medium text-foreground mb-2 flex items-center">
          <TestTube className="w-4 h-4 mr-2 text-primary" />
          Input Requirement
        </label>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
                <label htmlFor="url" className="block text-sm font-medium text-foreground mb-2 flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-primary" />
                    Website URL
                </label>
                <input
                    id="url"
                    type="text"
                    disabled={!!selectedFile || !!requirement}
                    className="w-full bg-background/50 border border-white/10 rounded-lg p-3 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
            </div>
            <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-2 flex items-center">
                    <Upload className="w-4 h-4 mr-2 text-primary" />
                    Upload File
                </label>
                <div className="relative border-2 border-dashed border-white/20 rounded-lg p-2.5 text-center hover:bg-white/5 hover:border-primary/50 transition-colors cursor-pointer min-h-[50px] flex items-center justify-center">
                    <input 
                        type="file" 
                        onChange={handleFileChange}
                        accept=".json, .csv, application/json, text/csv"
                        disabled={!!url || !!requirement}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex items-center space-x-2 pointer-events-none">
                         {selectedFile ? (
                             <>
                                <FileText className="h-4 w-4 text-green-400" />
                                <span className="text-xs font-medium truncate max-w-[150px]">{selectedFile.name}</span>
                                <span className="text-[10px] text-red-400 cursor-pointer pointer-events-auto" onClick={(e) => { e.preventDefault(); setSelectedFile(null); }}>Remove</span>
                             </>
                         ) : (
                             <>
                                <Upload className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-foreground">Click/Drag CSV/JSON</span>
                             </>
                         )}
                    </div>
                </div>
            </div>
        </div>

        <label htmlFor="requirement" className="block text-sm font-medium text-foreground mb-2 flex items-center">
          <TestTube className="w-4 h-4 mr-2 text-primary" />
          Detail Requirements
        </label>
        <textarea
          id="requirement"
          rows={3}
          disabled={!!selectedFile || !!url}
          className="w-full bg-background/50 border border-white/10 rounded-lg p-4 text-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none mb-4 disabled:opacity-50"
          placeholder="e.g., As a user I should be able to login using email and password."
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
        />
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center text-sm">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 h-10 px-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing AI...
              </>
            ) : (
              <>
                Generate Tests
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {testCases.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass rounded-xl overflow-hidden border border-white/5 shadow-sm">
            <div 
              className="p-4 bg-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center cursor-pointer hover:bg-white/10 transition-colors gap-4"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="flex items-center space-x-3 w-full sm:w-auto overflow-hidden">
                 {isExpanded ? <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                 <Folder className="w-5 h-5 text-primary flex-shrink-0" />
                 <div className="truncate">
                    <h3 className="font-semibold text-foreground text-md truncate pr-4">
                       {url ? url : selectedFile ? selectedFile.name : requirement ? requirement : "Generated Suite"}
                    </h3>
                    <p className="text-xs text-muted-foreground">{testCases.length} test cases • Ready to Run</p>
                 </div>
              </div>
              <div className="flex flex-shrink-0 items-center space-x-3 w-full sm:w-auto justify-end">
                 {!isExecuting && !isDone && (
                   <button 
                     onClick={(e) => { e.stopPropagation(); handleRunSuite(); }} 
                   className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-green-500/20 transition-all w-full sm:w-auto justify-center"
                   >
                     <Play className="w-4 h-4 mr-2" /> Test Run
                   </button>
                 )}
                 {isDone && (
                   <button 
                     onClick={(e) => { e.stopPropagation(); window.dispatchEvent(new CustomEvent('switch-tab', { detail: 'reports' })); setTestCases([]); }} 
                     className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-all w-full sm:w-auto justify-center"
                   >
                     <PieChart className="w-4 h-4 mr-2" /> View Reports
                   </button>
                 )}
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/5"
                >
                  <div className="p-4">
                      {(isExecuting || isDone) && (
                         <div className="glass p-4 rounded-xl border border-white/10 mb-4">
                           <div className="flex justify-between text-sm mb-2">
                             <span className="text-muted-foreground flex items-center">
                               {isExecuting ? <Loader2 className="w-4 h-4 mr-2 animate-spin text-primary" /> : <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />}
                               {isExecuting ? `Running Test ${executionIndex + 1} of ${testCases.length}...` : 'Execution Finished'}
                             </span>
                             <span className="font-mono text-primary">{Math.round((Math.max(0, executionIndex) / testCases.length) * 100)}%</span>
                           </div>
                           <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                               className="h-full bg-primary"
                               initial={{ width: 0 }}
                               animate={{ width: `${(Math.max(0, executionIndex) / testCases.length) * 100}%` }}
                             />
                           </div>
                         </div>
                      )}
                      
                      <TestCaseTable testCases={testCases} editable={false} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {isGenerating && (
        <div className="flex flex-col space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-24 bg-white/5 animate-pulse rounded-xl border border-white/5"></div>
          ))}
        </div>
      )}
    </div>
  );
}
