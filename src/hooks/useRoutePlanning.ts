// src/hooks/useRoutePlanning.ts
import { useState } from 'react';
import { PlanResponse, Location } from '../types/api';

const API_BASE = 'http://10.81.1.76:8000';

export const useRoutePlanning = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PlanResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const planRoute = async (origin: Location, destination: Location) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`${API_BASE}/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
       body: JSON.stringify({
        /* //  ŞİMDİLİK SABİT KOORDİNAT
        origin_lat: 41.013840019867075,
        origin_lon: 28.954051946983668,
        dest_lat: 41.01623559083171,
        dest_lon: 28.972707920503694, */
        //  ARTIK KULLANICININ SEÇTİĞİ KOORDİNATLAR GÖNDERİLİYOR
          origin_lat: origin.lat,
          origin_lon: origin.lon,
          dest_lat: destination.lat,
          dest_lon: destination.lon,
      }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API hatası: ${response.status} - ${errorText}`);
      }

      const result: PlanResponse = await response.json();
      setData(result);
    } catch (err) {
      console.error('Route planning error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { planRoute, data, loading, error, reset };
};
