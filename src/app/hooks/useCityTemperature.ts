import { useEffect, useState } from 'react';

const CACHE_TTL_MS = 30 * 60 * 1000;
const cache = new Map<string, { value: number; fetchedAt: number }>();
const inflight = new Map<string, Promise<number | null>>();

async function fetchTemperature(lat: number, lon: number): Promise<number | null> {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.value;
  }

  const pending = inflight.get(key);
  if (pending) return pending;

  const request = (async () => {
    try {
      const url = new URL('https://api.open-meteo.com/v1/forecast');
      url.searchParams.set('latitude', String(lat));
      url.searchParams.set('longitude', String(lon));
      url.searchParams.set('current', 'temperature_2m');
      url.searchParams.set('timezone', 'auto');

      const response = await fetch(url);
      if (!response.ok) return null;

      const data = (await response.json()) as {
        current?: { temperature_2m?: number };
      };
      const value = data.current?.temperature_2m;
      if (typeof value !== 'number' || Number.isNaN(value)) return null;

      cache.set(key, { value, fetchedAt: Date.now() });
      return value;
    } catch {
      return null;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, request);
  return request;
}

export function useCityTemperature(lat: number, lon: number): number | null {
  const [temperature, setTemperature] = useState<number | null>(() => {
    const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    return cache.get(key)?.value ?? null;
  });

  useEffect(() => {
    let cancelled = false;

    void fetchTemperature(lat, lon).then((value) => {
      if (!cancelled && value !== null) {
        setTemperature(value);
      }
    });

    const refreshId = window.setInterval(() => {
      void fetchTemperature(lat, lon).then((value) => {
        if (!cancelled && value !== null) {
          setTemperature(value);
        }
      });
    }, CACHE_TTL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(refreshId);
    };
  }, [lat, lon]);

  return temperature;
}
