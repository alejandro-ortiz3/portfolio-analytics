export interface Security {
    id: string;
    ticker: string;
    name: string;
    sector: string;
    price: number;
    change: number;
    volume: number;
    marketCap: number;
    volatility: number;
    beta: number;
  }
  
  export interface CorrelationData {
    x: string;
    y: string;
    value: number;
  }
  
  export interface ChartDataPoint {
    time: number;
    value: number;
  }
  
  export interface RiskDataPoint {
    volatility: number;
    beta: number;
    name: string;
    sector: string;
  }