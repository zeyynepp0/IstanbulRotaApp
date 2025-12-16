// src/hooks/useGeocoding.ts

import { useState } from 'react';
import { GeocodeResult } from '../types/api';

//const API_BASE = 'http://10.81.1.76:8000'; // Sonunda slash yok!
const API_BASE = 'http://192.168.101.100:8000'; // Sonunda slash yok!

export const useGeocoding = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const search = async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ÖNEMLİ: Doğru URL formatı
      const url = `${API_BASE}/geocode?q=${encodeURIComponent(query)}`;
      console.log('Geocoding URL:', url); // Debug için

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      console.log('Response status:', response.status); // Debug için

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API hatası: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Geocoding sonuç:', data); // Debug için

      if (data.error) {
        console.warn('Geocoding uyarısı:', data.error);
      }

      setResults(data.results || []);
    } catch (err) {
      console.error('Geocoding error:', err);
      setError(err as Error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResults([]);
    setError(null);
  };

  return { search, results, loading, error, clearResults };
};
