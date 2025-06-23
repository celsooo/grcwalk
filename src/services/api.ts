const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Risk API methods
  async getRisks() {
    return this.request('/risks');
  }

  async getRisk(id: string) {
    return this.request(`/risks/${id}`);
  }

  async createRisk(risk: any) {
    return this.request('/risks', {
      method: 'POST',
      body: JSON.stringify(risk),
    });
  }

  async updateRisk(id: string, risk: any) {
    return this.request(`/risks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(risk),
    });
  }

  async deleteRisk(id: string) {
    return this.request(`/risks/${id}`, {
      method: 'DELETE',
    });
  }

  // Control API methods
  async getControls() {
    return this.request('/controls');
  }

  async getControl(id: string) {
    return this.request(`/controls/${id}`);
  }

  async createControl(control: any) {
    return this.request('/controls', {
      method: 'POST',
      body: JSON.stringify(control),
    });
  }

  async updateControl(id: string, control: any) {
    return this.request(`/controls/${id}`, {
      method: 'PUT',
      body: JSON.stringify(control),
    });
  }

  async deleteControl(id: string) {
    return this.request(`/controls/${id}`, {
      method: 'DELETE',
    });
  }

  // Bow-tie API methods
  async getRiskFactors() {
    return this.request('/bowtie/factors');
  }

  async getConsequences() {
    return this.request('/bowtie/consequences');
  }

  async getBowTieRelationships() {
    return this.request('/bowtie/relationships');
  }

  async createRiskFactor(factor: any) {
    return this.request('/bowtie/factors', {
      method: 'POST',
      body: JSON.stringify(factor),
    });
  }

  async createConsequence(consequence: any) {
    return this.request('/bowtie/consequences', {
      method: 'POST',
      body: JSON.stringify(consequence),
    });
  }

  async createBowTieRelationship(relationship: any) {
    return this.request('/bowtie/relationships', {
      method: 'POST',
      body: JSON.stringify(relationship),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiService = new ApiService();