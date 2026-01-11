import React, { useState, useRef, useMemo } from 'react';
import type { Security } from '../types';

interface VirtualizedTableProps {
  data: Security[];
  filter: string;
  sortBy: keyof Security;
  sortDir: 'asc' | 'desc';
  onSort: (key: keyof Security) => void;
}

export const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  data,
  filter,
  sortBy,
  sortDir,
  onSort
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const ROW_HEIGHT = 60;
  const VISIBLE_ROWS = 12;
  const BUFFER = 5;

  const filteredData = useMemo(() => {
    return data.filter(s => 
      s.ticker.toLowerCase().includes(filter.toLowerCase()) ||
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.sector.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const multiplier = sortDir === 'asc' ? 1 : -1;
      return aVal < bVal ? -multiplier : aVal > bVal ? multiplier : 0;
    });
  }, [filteredData, sortBy, sortDir]);

  const startIdx = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIdx = Math.min(sortedData.length, startIdx + VISIBLE_ROWS + BUFFER * 2);
  const visibleData = sortedData.slice(startIdx, endIdx);
  const offsetY = startIdx * ROW_HEIGHT;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {[
                { key: 'ticker', label: 'Ticker' },
                { key: 'name', label: 'Company' },
                { key: 'sector', label: 'Sector' },
                { key: 'price', label: 'Price' },
                { key: 'change', label: 'Change' },
                { key: 'volume', label: 'Volume' },
                { key: 'volatility', label: 'Volatility' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => onSort(key as keyof Security)}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {label}
                    {sortBy === key && (
                      <span className="text-blue-500 text-sm">
                        {sortDir === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        </table>
      </div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="overflow-y-auto"
        style={{ height: `${ROW_HEIGHT * VISIBLE_ROWS}px` }}
      >
        <div style={{ height: `${sortedData.length * ROW_HEIGHT}px`, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            <table className="w-full">
              <tbody>
                {visibleData.map((security) => (
                  <tr
                    key={security.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    style={{ height: `${ROW_HEIGHT}px` }}
                  >
                    <td className="px-6 py-5 text-sm font-bold text-blue-600">
                      {security.ticker}
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-900">
                      {security.name}
                    </td>
                    <td className="px-6 py-5 text-sm">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {security.sector}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm font-semibold text-gray-900">
                      ${security.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-5 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        security.change >= 0 
                          ? 'bg-green-50 text-green-700' 
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {security.change >= 0 ? '+' : ''}{security.change.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-mono">
                      {(security.volume / 1000000).toFixed(2)}M
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-600 font-mono">
                      {(security.volatility * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">
          Showing {visibleData.length} of {sortedData.length}
        </span>
        <span className="text-sm text-gray-400">
          {data.length.toLocaleString()} total securities
        </span>
      </div>
    </div>
  );
};