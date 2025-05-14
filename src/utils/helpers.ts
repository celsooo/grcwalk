import { Risk, RiskLevel, ComplianceRequirement } from '../types';

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

// Export risks to JSON file
export const exportRisks = (risks: Risk[]) => {
  const dataStr = JSON.stringify(risks, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `grcwalk-risks-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Import risks from JSON file
export const importRisks = (file: File): Promise<Risk[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const risks = JSON.parse(content);
        
        // Validate imported data
        if (!Array.isArray(risks)) {
          throw new Error('Invalid format: Expected an array of risks');
        }
        
        // Validate each risk object
        risks.forEach((risk: any) => {
          if (!risk.name || !risk.description || !risk.category || 
              typeof risk.likelihood !== 'number' || typeof risk.impact !== 'number') {
            throw new Error('Invalid risk data: Missing required fields');
          }
        });
        
        resolve(risks);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};

// Export compliance requirements to JSON file
export const exportCompliance = (requirements: ComplianceRequirement[]) => {
  const dataStr = JSON.stringify(requirements, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `grcwalk-compliance-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Import compliance requirements from JSON file
export const importCompliance = (file: File): Promise<ComplianceRequirement[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const requirements = JSON.parse(content);
        
        // Validate imported data
        if (!Array.isArray(requirements)) {
          throw new Error('Invalid format: Expected an array of requirements');
        }
        
        // Validate each requirement object
        requirements.forEach((req: any) => {
          if (!req.name || !req.description || !req.framework || 
              !req.status || !req.dueDate || !req.assignee) {
            throw new Error('Invalid requirement data: Missing required fields');
          }
        });
        
        resolve(requirements);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};