/* eslint-disable react-hooks/purity */
import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  renderTime: number;
  avgRenderTime: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    renderTime: 0,
    avgRenderTime: 0
  });

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const renderTimesRef = useRef<number[]>([]);
  const rafIdRef = useRef<number>(0);
  
  useEffect(() => {
    const measureFrame = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;

      frameCountRef.current++;

      // Update FPS every second
      if (delta >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / delta);
        frameCountRef.current = 0;
        lastTimeRef.current = now;

        // Calculate average render time
        const avgRenderTime = renderTimesRef.current.length > 0
          ? renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length
          : 0;

        setMetrics(prev => ({
          ...prev,
          fps,
          avgRenderTime: Math.round(avgRenderTime * 100) / 100
        }));

        // Reset render times array
        renderTimesRef.current = [];
      }

      rafIdRef.current = requestAnimationFrame(measureFrame);
    };

    rafIdRef.current = requestAnimationFrame(measureFrame);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  const measureRender = (callback: () => void) => {
    const start = performance.now();
    callback();
    const end = performance.now();
    const renderTime = end - start;

    renderTimesRef.current.push(renderTime);
    setMetrics(prev => ({ ...prev, renderTime: Math.round(renderTime * 100) / 100 }));
  };

  return { metrics, measureRender };
};