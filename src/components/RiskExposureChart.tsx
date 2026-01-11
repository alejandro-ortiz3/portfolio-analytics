import React, { useMemo, useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Security } from '../types';

interface RiskExposureChartProps {
  data: Security[];
}

export const RiskExposureChart: React.FC<RiskExposureChartProps> = ({ data }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setAnimationComplete(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const riskData = useMemo(() => {
    return data.slice(0, 100).map(s => ({
      volatility: s.volatility * 100,
      beta: s.beta,
      name: s.ticker,
      sector: s.sector
    }));
  }, [data]);

  const sectorColors: Record<string, string> = {
    'Technology': '#3b82f6',
    'Healthcare': '#10b981',
    'Finance': '#f59e0b',
    'Energy': '#ef4444',
    'Consumer': '#8b5cf6',
    'Industrial': '#06b6d4',
    'Materials': '#ec4899',
    'Utilities': '#84cc16'
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Risk Exposure
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            type="number" 
            dataKey="volatility" 
            name="Volatility" 
            unit="%" 
            stroke="#9ca3af"
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            type="number" 
            dataKey="beta" 
            name="Beta" 
            stroke="#9ca3af"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb', 
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Scatter 
            data={riskData} 
            fill="#8884d8"
            animationDuration={1500}
            animationBegin={0}
          >
            {riskData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={sectorColors[entry.sector] || '#8884d8'}
                style={{
                  opacity: animationComplete ? 1 : 0,
                  transition: `opacity 0.5s ease-in ${index * 10}ms`
                }}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};