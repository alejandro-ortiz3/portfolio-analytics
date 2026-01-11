# Portfolio Analytics Engine

Hi! I felt like building a real-time financial dashboard so here it is! Monitors 10,000 securities with really fun advanced visualizations and some neat performance optimization.

![Portfolio Analytics](https://img.shields.io/badge/React-18.x-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## Features

- **Real-Time Data Processing** - Monitors 10,000 securities with live updates every 3 seconds
- **High-Performance Rendering** - Canvas API achieving 60fps with sub-100ms render times
- **Interactive Visualizations** - D3.js correlation matrices with zoom/pan controls
- **Virtualized Scrolling** - Efficiently renders massive datasets without performance degradation
- **Advanced Analytics** - Market cap weighted index, sector allocation, risk exposure analysis
- **Performance Monitoring** - Real-time FPS and render time tracking

## Tech Stack

- **Frontend:** React 18, TypeScript
- **Visualization:** D3.js, Recharts, Canvas API
- **Styling:** Tailwind CSS
- **Performance:** useMemo, useCallback, virtualization
- **Build Tool:** Vite

## Key Components

### Market Cap Weighted Index
Custom stock market index calculated from 10,000 securities weighted by market capitalization, rendered using Canvas API for optimal performance.

### D3.js Correlation Matrix
Interactive sector correlation heatmap with:
- Drag to pan
- Scroll to zoom
- Hover tooltips
- Color-coded correlations

### Virtualized Table
Handles 10,000+ rows with:
- Smooth scrolling
- Real-time filtering
- Multi-column sorting
- Sub-100ms render times

### Performance Optimization
- React memoization patterns (useMemo, useCallback)
- Component-level optimization
- Real-time performance metrics display
- Efficient state management

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/portfolio-analytics.git

# Navigate to project directory
cd portfolio-analytics

# Install dependencies
npm install

# Start development server
npm run dev
```

## Build
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## Performance Metrics

Had fun focusing on performance this time around
- **Initial Load:** < 2 seconds
- **FPS:** Consistent 60fps
- **Render Time:** < 100ms average
- **Data Points:** 10,000+ securities processed in real-time

## Architecture
```
src/
├── components/       # React components
│   ├── CanvasChart.tsx
│   ├── D3CorrelationMatrix.tsx
│   ├── VirtualizedTable.tsx
│   └── ...
├── hooks/           # Custom React hooks
│   └── usePerformanceMonitor.ts
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── App.tsx          # Main application
```

## Key Learnings

Learned quite a bit, 
- Implemented virtualized scrolling for handling large datasets
- Optimized React rendering using memoization patterns
- Built interactive D3.js visualizations with zoom/pan
- Achieved 60fps performance with Canvas API
- Designed responsive layouts with Tailwind CSS

**Made by me! (Alejandro Ortiz)**
- GitHub: [@alejandro-ortiz3](https://github.com/alejandro-ortiz3)
- LinkedIn: (https://linkedin.com/in/alejandroivanortiz)

---

Built with ❤️ using React, TypeScript, and D3.js