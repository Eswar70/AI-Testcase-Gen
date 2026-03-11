import { motion } from 'framer-motion';
import type { TestCase, TestCaseDBModel } from '../../types/testcaseTypes';
import { Download, Trash2 } from 'lucide-react';

interface TestCaseTableProps {
  testCases: (TestCase | TestCaseDBModel)[];
  editable?: boolean;
  onDelete?: (id: string) => void;
}

export default function TestCaseTable({ testCases, editable = false, onDelete }: TestCaseTableProps) {
  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(testCases, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "testData.json");
    dlAnchorElem.click();
  };

  const downloadCSV = () => {
    if(!testCases.length) return;
    const header = Object.keys(testCases[0]).filter(k => k !== '_id' && k !== 'id').join(",");
    const rows = testCases.map(tc => 
      Object.entries(tc)
        .filter(([k]) => k !== '_id' && k !== 'id')
        .map(([_, v]) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    ).join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + header + "\n" + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "testCases.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <button onClick={downloadJSON} className="flex items-center text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md text-foreground transition-colors border border-white/10">
          <Download className="w-3 h-3 mr-2" />
          Export JSON
        </button>
        <button onClick={downloadCSV} className="flex items-center text-xs bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md text-foreground transition-colors border border-white/10">
          <Download className="w-3 h-3 mr-2" />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/10 glass">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-black/20">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Scenario</th>
              <th className="px-6 py-4">Steps</th>
              <th className="px-6 py-4">Expected Result</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-center">Priority</th>
              {editable && <th className="px-6 py-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {testCases.map((tc, idx) => (
              <motion.tr 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={'id' in tc ? tc.id || tc.test_id : tc.test_id} 
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="px-6 py-4 font-mono text-primary font-medium whitespace-nowrap">{tc.test_id}</td>
                <td className="px-6 py-4 text-foreground min-w-[200px]">{tc.scenario}</td>
                <td className="px-6 py-4 min-w-[300px]">
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {tc.steps.map((step, i) => (
                      <li key={i} className="text-xs">{step}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 min-w-[200px] text-muted-foreground">{tc.expected_result}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-blue-400">{tc.type}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    tc.priority === 'High' ? 'bg-red-500/10 text-red-500' :
                    tc.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-green-500/10 text-green-500'
                  }`}>
                    {tc.priority}
                  </span>
                </td>
                {editable && (
                  <td className="px-6 py-4 text-right">
                    {onDelete && (
                      <button 
                        onClick={() => onDelete('_id' in tc && tc._id ? (tc._id as string) : ('id' in tc && tc.id ? tc.id as string : tc.test_id))}
                        className="text-muted-foreground hover:text-red-400 p-1.5 rounded-md hover:bg-white/5 transition-colors"
                        title="Delete Test Case"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
        {testCases.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No test cases found.
          </div>
        )}
      </div>
    </div>
  );
}
