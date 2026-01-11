import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { Security } from '../types';

interface SectorAllocationChartProps {
  securities: Security[];
}

export const SectorAllocationChart: React.FC<SectorAllocationChartProps> = ({ securities }) => {
  const sectorData = useMemo(() => {
    const sectorMap = new Map<string, number>();
    
    securities.forEach(s => {
      const marketValue = s.price * s.volume;
      const current = sectorMap.get(s.sector) || 0;
      sectorMap.set(s.sector, current + marketValue);
    });

    const total = Array.from(sectorMap.values()).reduce((sum, val) => sum + val, 0);

    return Array.from(sectorMap.entries())
      .map(([sector, value]) => ({
        sector,
        value,
        percentage: (value / total) * 100
      }))
      .sort((a, b) => b.value - a.value);
  }, [securities]);

  const COLORS = {
    'Technology': '#3b82f6',
    'Healthcare': '#10b981',
    'Finance': '#f59e0b',
    'Energy': '#ef4444',
    'Consumer': '#8b5cf6',
    'Industrial': '#06b6d4',
    'Materials': '#ec4899',
    'Utilities': '#84cc16'
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            ${(payload[0].value / 1e9).toFixed(2)}B
          </p>
          <p className="text-sm font-medium text-blue-600">
            {payload[0].payload.percentage.toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Sector Allocation
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Portfolio distribution by market value
          </p>
        </div>
        <div className="px-4 py-2 bg-amber-50 rounded-full border border-amber-200">
          <span className="text-sm font-semibold text-amber-700">
            {sectorData.length} Sectors
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={sectorData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ sector, percentage }) => `${sector} ${percentage.toFixed(1)}%`}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {sectorData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.sector as keyof typeof COLORS] || '#8884d8'}
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  cursor: 'pointer'
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {sectorData.map((sector) => (
          <div 
            key={sector.sector}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: COLORS[sector.sector as keyof typeof COLORS] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 truncate">
                {sector.sector}
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-900">
              {sector.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};