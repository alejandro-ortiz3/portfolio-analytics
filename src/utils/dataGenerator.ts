import type { Security } from '../types';

const SECTORS = [
  'Technology',
  'Healthcare',
  'Finance',
  'Energy',
  'Consumer',
  'Industrial',
  'Materials',
  'Utilities'
];

// Real company names by sector
const COMPANY_NAMES: Record<string, string[]> = {
  'Technology': [
    'Apple Inc.', 'Microsoft Corp.', 'Alphabet Inc.', 'Meta Platforms', 'Amazon.com Inc.',
    'NVIDIA Corp.', 'Tesla Inc.', 'Adobe Inc.', 'Salesforce Inc.', 'Intel Corp.',
    'Oracle Corp.', 'Cisco Systems', 'IBM Corp.', 'ServiceNow Inc.', 'Qualcomm Inc.',
    'Advanced Micro Devices', 'PayPal Holdings', 'Broadcom Inc.', 'Texas Instruments', 'Applied Materials'
  ],
  'Healthcare': [
    'Johnson & Johnson', 'UnitedHealth Group', 'Pfizer Inc.', 'AbbVie Inc.', 'Merck & Co.',
    'Eli Lilly', 'Bristol-Myers Squibb', 'AstraZeneca', 'Novartis AG', 'Roche Holding',
    'Abbott Laboratories', 'Thermo Fisher Scientific', 'Danaher Corp.', 'Medtronic plc', 'CVS Health',
    'Amgen Inc.', 'Gilead Sciences', 'Stryker Corp.', 'Boston Scientific', 'Regeneron Pharmaceuticals'
  ],
  'Finance': [
    'JPMorgan Chase', 'Bank of America', 'Wells Fargo', 'Citigroup Inc.', 'Goldman Sachs',
    'Morgan Stanley', 'BlackRock Inc.', 'American Express', 'Charles Schwab', 'U.S. Bancorp',
    'PNC Financial', 'Truist Financial', 'Capital One', 'MetLife Inc.', 'Prudential Financial',
    'Travelers Companies', 'Bank of New York Mellon', 'State Street Corp.', 'Aflac Inc.', 'Progressive Corp.'
  ],
  'Energy': [
    'Exxon Mobil', 'Chevron Corp.', 'ConocoPhillips', 'EOG Resources', 'Schlumberger',
    'Marathon Petroleum', 'Phillips 66', 'Valero Energy', 'Pioneer Natural Resources', 'Occidental Petroleum',
    'Halliburton Co.', 'Baker Hughes', 'Kinder Morgan', 'Williams Companies', 'Devon Energy',
    'Hess Corp.', 'Apache Corp.', 'Marathon Oil', 'Cheniere Energy', 'EQT Corp.'
  ],
  'Consumer': [
    'Walmart Inc.', 'Procter & Gamble', 'Coca-Cola Co.', 'PepsiCo Inc.', 'Nike Inc.',
    'Home Depot', "McDonald's Corp.", 'Starbucks Corp.', 'Target Corp.', 'Costco Wholesale',
    'Netflix Inc.', 'Walt Disney Co.', 'Comcast Corp.', 'Nike Inc.', 'Booking Holdings',
    'Lowe\'s Companies', 'TJX Companies', 'Dollar General', 'General Motors', 'Ford Motor Co.'
  ],
  'Industrial': [
    'Honeywell International', 'Boeing Co.', 'Caterpillar Inc.', '3M Company', 'General Electric',
    'Lockheed Martin', 'Raytheon Technologies', 'Deere & Company', 'Union Pacific', 'United Parcel Service',
    'FedEx Corp.', 'Waste Management', 'CSX Corp.', 'Emerson Electric', 'Illinois Tool Works',
    'Eaton Corp.', 'Parker-Hannifin', 'Rockwell Automation', 'Fortive Corp.', 'Northrop Grumman'
  ],
  'Materials': [
    'Linde plc', 'Air Products', 'Sherwin-Williams', 'Freeport-McMoRan', 'Newmont Corp.',
    'DuPont de Nemours', 'Dow Inc.', 'International Paper', 'Nucor Corp.', 'Steel Dynamics',
    'Vulcan Materials', 'Martin Marietta', 'Mosaic Co.', 'Corteva Inc.', 'LyondellBasell',
    'Eastman Chemical', 'PPG Industries', 'Albemarle Corp.', 'CF Industries', 'Ball Corp.'
  ],
  'Utilities': [
    'NextEra Energy', 'Duke Energy', 'Southern Co.', 'Dominion Energy', 'American Electric Power',
    'Exelon Corp.', 'Sempra Energy', 'Public Service Enterprise', 'Consolidated Edison', 'Xcel Energy',
    'WEC Energy Group', 'Eversource Energy', 'Entergy Corp.', 'FirstEnergy Corp.', 'PPL Corp.',
    'DTE Energy', 'CenterPoint Energy', 'Ameren Corp.', 'NiSource Inc.', 'Atmos Energy'
  ]
};

export const generateSecurities = (count: number): Security[] => {
  return Array.from({ length: count }, (_, i) => {
    const sector = SECTORS[i % SECTORS.length];
    const sectorCompanies = COMPANY_NAMES[sector];
    const companyName = sectorCompanies[Math.floor(Math.random() * sectorCompanies.length)];
    
    return {
      id: `SEC${i.toString().padStart(6, '0')}`,
      ticker: `${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i * 7) % 26))}${String.fromCharCode(65 + ((i * 13) % 26))}`,
      name: `${companyName} ${i > 159 ? 'Holdings' : ''}`, // Add variation for duplicates
      sector: sector,
      price: 50 + Math.random() * 450,
      change: (Math.random() - 0.5) * 10,
      volume: Math.floor(Math.random() * 10000000),
      marketCap: Math.floor(Math.random() * 500000000000),
      volatility: Math.random() * 0.5,
      beta: 0.5 + Math.random() * 1.5
    };
  });
};

export const SECTOR_LIST = SECTORS;

export const updateSecurityPrices = (securities: Security[]): Security[] => {
  return securities.map(s => ({
    ...s,
    price: s.price * (1 + (Math.random() - 0.5) * 0.02),
    change: s.change + (Math.random() - 0.5) * 0.5
  }));
};