import React, { useMemo } from 'react';
import type { CorrelationData } from '../types';

interface CorrelationMatrixProps {
  sectors: string[];
}

export const CorrelationMatrix: React.FC<CorrelationMatrixProps> = ({ sectors }) => {
  const matrix = useMemo(() => {
    const data: CorrelationData[] = [];
    sectors.forEach((s1, i) => {
      sectors.forEach((s2, j) => {
        const corr = i === j ? 1 : (Math.random() * 0.8 - 0.4);
        data.push({ x: s1, y: s2, value: corr });
      });
    });
    return data;
  }, [sectors]);

  const getColor = (value: number) => {
    if (value > 0.5) return '#10b981';
    if (value > 0) return '#84cc16';
    if (value > -0.5) return '#f59e0b';
    return '#ef4444';
  };

  const cellSize = 60;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Sector Correlation Matrix</h3>
      <div className="overflow-x-auto">
        <svg width={sectors.length * cellSize + 100} height={sectors.length * cellSize + 100}>
          {sectors.map((sector, i) => (
            <text
              key={`x-${i}`}
              x={i * cellSize + cellSize / 2 + 100}
              y={20}
              textAnchor="middle"
              className="text-xs fill-gray-700 dark:fill-gray-300"
            >
              {sector.slice(0, 4)}
            </text>
          ))}
          {sectors.map((sector, i) => (
            <text
              key={`y-${i}`}
              x={90}
              y={i * cellSize + cellSize / 2 + 40}
              textAnchor="end"
              className="text-xs fill-gray-700 dark:fill-gray-300"
            >
              {sector.slice(0, 4)}
            </text>
          ))}
          {matrix.map((d, i) => {
            const xIdx = sectors.indexOf(d.x);
            const yIdx = sectors.indexOf(d.y);
            return (
              <g key={i}>
                <rect
                  x={xIdx * cellSize + 100}
                  y={yIdx * cellSize + 30}
                  width={cellSize - 2}
                  height={cellSize - 2}
                  fill={getColor(d.value)}
                  opacity={0.8}
                />
                <text
                  x={xIdx * cellSize + cellSize / 2 + 100}
                  y={yIdx * cellSize + cellSize / 2 + 35}
                  textAnchor="middle"
                  className="text-xs font-medium fill-white"
                >
                  {d.value.toFixed(2)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};