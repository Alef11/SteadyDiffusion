import { useState, useEffect } from 'react';
import { checkHealth } from '@/lib/api';

export const useHealthCheck = (intervalMs: number = 10000) => {
  const [isHealthy, setIsHealthy] = useState<boolean>(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        await checkHealth();
        setIsHealthy(true);
        setLastCheck(new Date());
      } catch (error) {
        setIsHealthy(false);
        setLastCheck(new Date());
      }
    };

    // Check immediately
    checkApiHealth();

    // Set up interval
    const interval = setInterval(checkApiHealth, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return { isHealthy, lastCheck };
};
