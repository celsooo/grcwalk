import { Risk, RiskLevel } from '../types';

// Calculate risk level based on likelihood and impact
export const calculateRiskLevel = (likelihood: number, impact: number): RiskLevel => {
  const score = likelihood * impact;
  
  if (score >= 15) return 'Critical';
  if (score >= 8) return 'High';
  if (score >= 3) return 'Medium';
  return 'Low';
};

// Get color based on risk level
export const getRiskLevelColor = (level: RiskLevel): string => {
  switch (level) {
    case 'Critical':
      return 'bg-red-500 text-white';
    case 'High':
      return 'bg-orange-500 text-white';
    case 'Medium':
      return 'bg-amber-400 text-black';
    case 'Low':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-200 text-black';
  }
};

// Get color for heatmap cell
export const getHeatmapColor = (likelihood: number, impact: number): string => {
  const level = calculateRiskLevel(likelihood, impact);
  
  switch (level) {
    case 'Critical':
      return 'bg-red-500';
    case 'High':
      return 'bg-orange-500';
    case 'Medium':
      return 'bg-amber-400';
    case 'Low':
      return 'bg-green-500';
    default:
      return 'bg-gray-200';
  }
};

// Get count of risks by level
export const getRiskCounts = (risks: Risk[]): Record<RiskLevel, number> => {
  const counts: Record<RiskLevel, number> = {
    Critical: 0,
    High: 0,
    Medium: 0,
    Low: 0
  };

  risks.forEach(risk => {
    const level = calculateRiskLevel(risk.likelihood, risk.impact);
    counts[level]++;
  });

  return counts;
};

// Format timestamp to readable date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

// Generate a simple UUID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};