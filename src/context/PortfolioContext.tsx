import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PortfolioData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    youtube: string;
    profilePic: string;
    availability: string;
    summary: string;
    stats: {
      portfolioManaged: string;
      availableFrom: string;
    };
  };
  projects: any[];
  experiences: any[];
  education: any[];
  languages: any[];
  certifications: any[];
  coursework: string[];
  skills: {
    [key: string]: {
      title: string;
      items: string[];
      description: string;
    };
  };
  soft_skills: {
    category: string;
    items: string[];
    description: string;
  }[];
  learningJourney: {
    period: string;
    title: string;
    subtitle: string;
    summary: string;
    image: string;
  }[];
  deepDive: {
    approach: {
      title: string;
      intro: string;
      methodology: string;
      philosophy: string;
      lenses: { name: string; description: string }[];
      conclusion: string;
      representation: string;
    };
    pipeline: { step: string; description: string }[];
    future_direction: string;
    technical_experiments: any[];
  };
}

interface PortfolioContextType {
  data: PortfolioData | null;
  loading: boolean;
  error: string | null;
  updatePortfolio: (newData: PortfolioData, password: string) => Promise<{ success: boolean; error?: string }>;
  uploadImage: (file: File) => Promise<string | null>;
  refresh: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (!response.ok) {
        const text = await response.text();
        console.error('Fetch failed:', response.status, text.substring(0, 100));
        throw new Error(`Failed to fetch portfolio: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        const text = await response.text();
        console.error('Received HTML instead of JSON:', text.substring(0, 100));
        throw new Error('Server returned HTML instead of JSON. Check API routes.');
      }

      const json = await response.json();
      setData(json);
    } catch (err: any) {
      console.error('Portfolio fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updatePortfolio = async (newData: PortfolioData, password: string) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, data: newData }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Update failed');
      }
      setData(newData);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(err.error || 'Upload failed');
      }
      const { imageUrl } = await response.json();
      return imageUrl;
    } catch (err: any) {
      console.error('Upload error:', err);
      throw err;
    }
  };

  return (
    <PortfolioContext.Provider value={{ data, loading, error, updatePortfolio, uploadImage, refresh: fetchData }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
