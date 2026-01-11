import React, { useRef, useEffect, useCallback } from 'react';

interface DataPoint {
  x: number;
  y: number;
}

interface CanvasChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
}

export const CanvasChart: React.FC<CanvasChartProps> = ({
  data,
  width = 800,
  height = 300,
  color = '#3b82f6'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Calculate scales
    const xMin = Math.min(...data.map(d => d.x));
    const xMax = Math.max(...data.map(d => d.x));
    const yMin = Math.min(...data.map(d => d.y));
    const yMax = Math.max(...data.map(d => d.y));

    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const xScale = (x: number) => ((x - xMin) / (xMax - xMin)) * chartWidth + padding;
    const yScale = (y: number) => height - (((y - yMin) / (yMax - yMin)) * chartHeight + padding);

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    data.forEach((point, i) => {
      const x = xScale(point.x);
      const y = yScale(point.y);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw gradient fill
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(xScale(data[0].x), height - padding);
    
    data.forEach(point => {
      ctx.lineTo(xScale(point.x), yScale(point.y));
    });
    
    ctx.lineTo(xScale(data[data.length - 1].x), height - padding);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Draw labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = yMin + ((yMax - yMin) / 5) * i;
      const y = yScale(value);
      ctx.fillText(value.toFixed(0), padding - 20, y + 4);
    }

    // X-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = xMin + ((xMax - xMin) / 5) * i;
      const x = xScale(value);
      ctx.fillText(value.toFixed(0), x, height - padding + 20);
    }

  }, [data, width, height, color]);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <div ref={containerRef} className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto"
      />
    </div>
  );
};