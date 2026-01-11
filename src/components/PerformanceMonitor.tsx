import React from 'react';
import { Activity } from 'lucide-react';

interface PerformanceMonitorProps {
  fps: number;
  renderTime: number;
  avgRenderTime: number;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  fps,
  renderTime,
  avgRenderTime
}) => {
  const fpsColor = fps >= 55 ? 'text-green-600' : fps >= 30 ? 'text-yellow-600' : 'text-red-600';
  const renderColor = avgRenderTime < 16 ? 'text-green-600' : avgRenderTime < 33 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700 z-50">      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-semibold text-gray-900 dark:text-white">Performance</span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-600 dark:text-gray-400">FPS:</span>
          <span className={`font-mono font-bold ${fpsColor}`}>{fps}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-600 dark:text-gray-400">Render:</span>
          <span className={`font-mono ${renderColor}`}>{renderTime.toFixed(2)}ms</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-600 dark:text-gray-400">Avg:</span>
          <span className={`font-mono ${renderColor}`}>{avgRenderTime.toFixed(2)}ms</span>
        </div>
      </div>
    </div>
  );
};