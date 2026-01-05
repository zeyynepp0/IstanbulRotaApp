import { useEffect, useState } from 'react';

export interface TrafficPlanResponse {
  [key: string]: any;
}

const useTrafficInfo = () => {
  const [data, setData] = useState<TrafficPlanResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);

        //const res = await fetch("http://10.81.1.76:8000/plan", {
        const res = await fetch('http://172.21.73.46:8000/plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            origin_lat: 41.013840019867175,
            origin_lon: 28.954051946982668,
            dest_lat: 41.07199064367534,
            dest_lon: 29.025580624941644,
          }),
        });

        const text = await res.text();
        console.log('API STATUS:', res.status);
        console.log('API RAW RESPONSE:', text);

        if (!res.ok) {
          throw new Error(
            `Sunucudan geçerli cevap gelmedi: ${res.status} - ${text}`,
          );
        }

        const json: TrafficPlanResponse = JSON.parse(text);

        if (!cancelled) {
          setData(json);
        }
      } catch (err) {
        console.error('useTrafficInfo error:', err);
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
};

export default useTrafficInfo;
