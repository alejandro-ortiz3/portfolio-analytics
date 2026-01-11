import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { D3CorrelationMatrix } from './components/D3CorrelationMatrix';
import { CanvasChart } from './components/CanvasChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, PieChart, BarChart3 } from 'lucide-react';
import { SectorAllocationChart } from './components/SectorAllocationChart';
import { VirtualizedTable } from './components/VirtualizedTable';
import { CorrelationMatrix } from './components/CorrelationMatrix';
import { RiskExposureChart } from './components/RiskExposureChart';
import { StatsCard } from './components/StatsCard';
import type { Security, ChartDataPoint } from './types';
import { generateSecurities, updateSecurityPrices, SECTOR_LIST } from './utils/dataGenerator';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';
import { PerformanceMonitor } from './components/PerformanceMonitor';

export default function App() {
  const [securities, setSecurities] = useState<Security[]>(() => generateSecurities(10000));
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<keyof Security>('ticker');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [displayCount, setDisplayCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const { metrics } = usePerformanceMonitor();
  
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      setSecurities(prev => updateSecurityPrices(prev));
      setTimeout(() => setIsUpdating(false), 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Counting animation on load
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = securities.length / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= securities.length) {
        setDisplayCount(securities.length);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [securities.length]);

  const handleSort = useCallback((key: keyof Security) => {
    if (sortBy === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDir('asc');
    }
  }, [sortBy]);

  const stats = useMemo(() => {
    const totalValue = securities.reduce((sum, s) => sum + s.price * s.volume, 0);
    const avgChange = securities.reduce((sum, s) => sum + s.change, 0) / securities.length;
    const topGainer = securities.reduce((max, s) => s.change > max.change ? s : max);
    const topLoser = securities.reduce((min, s) => s.change < min.change ? s : min);
    return { totalValue, avgChange, topGainer, topLoser };
  }, [securities]);

  const chartData: ChartDataPoint[] = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      time: i,
      value: 100 * Math.exp(0.001 * i + Math.random() * 0.05)
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      <div className="max-w-7xl mx-auto px-8 py-12 space-y-12">
        
        {/* Header - Fade in */}
        <div className="flex justify-between items-start animate-fade-in">
          <div className="text-center flex-1 space-y-3">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full bg-green-500 ${isUpdating ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-medium text-gray-500">Live Data</span>
            </div>
            <h1 className="text-6xl font-semibold tracking-tight text-gray-900 transition-all duration-300 hover:scale-105">
              Portfolio Analytics
            </h1>
            <p className="text-xl text-gray-500">
              Real-time monitoring of <span className="font-semibold text-gray-700">{displayCount.toLocaleString()}</span> securities
            </p>
          </div>
           
          {/* Dark Mode Toggle */}
          {/* <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-4 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-200"
          >
            {darkMode ? '☀️' : '🌙'}
          </button */}
          </div>

        {/* Stats Grid - Staggered animation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Value */}
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-blue-100/50 animate-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-6">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Value</p>
              <p className="text-3xl font-semibold text-gray-900 transition-all duration-300">
                ${(stats.totalValue / 1e9).toFixed(2)}B
              </p>
            </div>
          </div>

          {/* Avg Change */}
          <div className={`rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 animate-slide-up ${
            stats.avgChange >= 0 
              ? 'bg-gradient-to-br from-white to-green-50 border border-green-100/50' 
              : 'bg-gradient-to-br from-white to-red-50 border border-red-100/50'
          }`} style={{ animationDelay: '100ms' }}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 ${stats.avgChange >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {stats.avgChange >= 0 ? 
                  <TrendingUp className="w-6 h-6 text-green-600" /> : 
                  <TrendingDown className="w-6 h-6 text-red-600" />
                }
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Avg Change</p>
              <p className={`text-3xl font-semibold transition-all duration-300 ${stats.avgChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Top Gainer */}
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-100/50 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-6">
                <PieChart className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Top Gainer</p>
              <p className="text-2xl font-semibold text-gray-900 transition-all duration-300">{stats.topGainer.ticker}</p>
              <p className="text-sm font-medium text-emerald-600 mt-1">
                +{stats.topGainer.change.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Top Loser */}
          <div className="bg-gradient-to-br from-white to-rose-50 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-rose-100/50 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-6">
                <BarChart3 className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Top Loser</p>
              <p className="text-2xl font-semibold text-gray-900 transition-all duration-300">{stats.topLoser.ticker}</p>
              <p className="text-sm font-medium text-rose-600 mt-1">
                {stats.topLoser.change.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
          {/* Performance Chart */}
          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Portfolio Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#9ca3af" 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
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
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2.5} 
                  dot={false}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Risk Exposure */}
          <RiskExposureChart data={securities} />
        </div>

       {/* Sector Analysis Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
          {/* D3 Correlation Matrix */}
          <D3CorrelationMatrix sectors={SECTOR_LIST} />
          
          {/* Sector Allocation */}
          <SectorAllocationChart securities={securities} />
        </div>

        {/* High-Performance Canvas Chart - Load on Demand */}
        <div className="animate-fade-in" style={{ animationDelay: '550ms' }}>
          <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Market Cap Weighted Index
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Custom index tracking 10,000 securities weighted by market capitalization
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-4 py-2 bg-green-50 rounded-full">
                  <span className="text-sm font-semibold text-green-700">Canvas</span>
                </div>
              </div>
            </div>
            
            {!showCanvas ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <p className="text-gray-500">Render 10,000 data points using high-performance Canvas API</p>
                <button
                  onClick={() => setShowCanvas(true)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Load Canvas Chart
                </button>
              </div>
            ) : (
              <>
                <CanvasChart 
                  data={(() => {
                    const totalMarketCap = securities.reduce((sum, s) => sum + s.marketCap, 0);
                    let indexValue = 1000;
                    const indexHistory = [];
                    
                    for (let i = 0; i < 10000; i++) {
                      const periodReturn = securities.reduce((sum, s) => {
                        const weight = s.marketCap / totalMarketCap;
                        const dailyReturn = (Math.random() - 0.48) * 0.02;
                        return sum + (dailyReturn * weight);
                      }, 0);
                      
                      indexValue *= (1 + periodReturn);
                      indexHistory.push({ x: i, y: indexValue });
                    }
                    
                    return indexHistory;
                  })()}
                  width={1000}
                  height={350}
                  color="#3b82f6"
                />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">10,000 data points rendered</span>
                  <button
                    onClick={() => setShowCanvas(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300"
                  >
                    Unload Chart
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="animate-fade-in" style={{ animationDelay: '700ms' }}>
          <VirtualizedTable
            data={securities}
            filter={filter}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={handleSort}
          />
        </div>

        {/* Performance Monitor */}
        <PerformanceMonitor 
          fps={metrics.fps}
          renderTime={metrics.renderTime}
          avgRenderTime={metrics.avgRenderTime}
        />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}