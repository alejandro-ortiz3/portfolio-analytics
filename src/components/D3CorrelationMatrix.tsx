import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface D3CorrelationMatrixProps {
  sectors: string[];
}

export const D3CorrelationMatrix: React.FC<D3CorrelationMatrixProps> = ({ sectors }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Dimensions
    const margin = { top: 80, right: 20, bottom: 20, left: 80 };
    const cellSize = 70;
    const width = sectors.length * cellSize + margin.left + margin.right;
    const height = sectors.length * cellSize + margin.top + margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create main group for zoom
    const g = svg.append('g');

    // Generate correlation data
    const correlationData: Array<{ row: string; col: string; value: number }> = [];
    sectors.forEach((row) => {
      sectors.forEach((col) => {
        const value = row === col ? 1 : (Math.random() * 1.8 - 0.9);
        correlationData.push({ row, col, value });
      });
    });

    // Color scale
    const colorScale = d3.scaleLinear<string>()
      .domain([-1, 0, 1])
      .range(['#ef4444', '#f3f4f6', '#10b981']);

    // Create cells
    const cells = g.selectAll('rect')
      .data(correlationData)
      .enter()
      .append('rect')
      .attr('x', d => sectors.indexOf(d.col) * cellSize + margin.left)
      .attr('y', d => sectors.indexOf(d.row) * cellSize + margin.top)
      .attr('width', cellSize - 2)
      .attr('height', cellSize - 2)
      .attr('fill', d => colorScale(d.value))
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', '#3b82f6')
          .attr('stroke-width', 3);
        
        // Show tooltip
        tooltip
          .style('opacity', 1)
          .html(`
            <strong>${d.row} × ${d.col}</strong><br/>
            Correlation: ${d.value.toFixed(3)}
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);
        
        tooltip.style('opacity', 0);
      });

    // Add text values
    g.selectAll('text.cell-value')
      .data(correlationData)
      .enter()
      .append('text')
      .attr('class', 'cell-value')
      .attr('x', d => sectors.indexOf(d.col) * cellSize + margin.left + cellSize / 2)
      .attr('y', d => sectors.indexOf(d.row) * cellSize + margin.top + cellSize / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', d => Math.abs(d.value) > 0.5 ? '#fff' : '#1f2937')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('pointer-events', 'none')
      .text(d => d.value.toFixed(2));

    // Add row labels
    g.selectAll('text.row-label')
      .data(sectors)
      .enter()
      .append('text')
      .attr('class', 'row-label')
      .attr('x', margin.left - 10)
      .attr('y', (d, i) => i * cellSize + margin.top + cellSize / 2)
      .attr('text-anchor', 'end')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#374151')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .text(d => d);

    // Add column labels
    g.selectAll('text.col-label')
      .data(sectors)
      .enter()
      .append('text')
      .attr('class', 'col-label')
      .attr('x', (d, i) => i * cellSize + margin.left + cellSize / 2)
      .attr('y', margin.top - 10)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'baseline')
      .attr('fill', '#374151')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .text(d => d);

    // Create tooltip
    const tooltip = d3.select('body')
      .append('div')
      .attr('class', 'd3-tooltip')
      .style('position', 'absolute')
      .style('opacity', 0)
      .style('background-color', 'white')
      .style('padding', '10px')
      .style('border-radius', '8px')
      .style('box-shadow', '0 4px 6px rgba(0,0,0,0.1)')
      .style('pointer-events', 'none')
      .style('font-size', '12px')
      .style('z-index', '1000');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setIsZoomed(event.transform.k !== 1 || event.transform.x !== 0 || event.transform.y !== 0);
      });

    svg.call(zoom);

    // Cleanup
    return () => {
      tooltip.remove();
    };
  }, [sectors]);

  const handleReset = () => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.transition()
      .duration(750)
      .call(d3.zoom<SVGSVGElement, unknown>().transform as any, d3.zoomIdentity);
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Interactive Correlation Matrix
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Drag to pan, scroll to zoom • Built with D3.js
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isZoomed && (
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg transition-all duration-300"
            >
              Reset Zoom
            </button>
          )}
          <div className="px-4 py-2 bg-purple-50 rounded-full">
            <span className="text-sm font-semibold text-purple-700">D3.js</span>
          </div>
        </div>
      </div>
      <div className="overflow-auto border border-gray-100 rounded-2xl">
        <svg ref={svgRef} className="cursor-move" />
      </div>
      <div className="mt-4 flex items-center justify-center gap-8 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span>Positive Correlation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <span>No Correlation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span>Negative Correlation</span>
        </div>
      </div>
    </div>
  );
};