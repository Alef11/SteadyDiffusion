import { useState, useEffect, useCallback } from 'react';
import { getJobStatus } from '@/lib/api';
import type { JobStatusResponse } from '@/types/api.types';

export const useJobPolling = (jobId: string | null, intervalMs: number = 2000) => {
  const [jobStatus, setJobStatus] = useState<JobStatusResponse | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  useEffect(() => {
    if (!jobId) {
      return;
    }

    setIsPolling(true);
    setError(null);

    const pollJobStatus = async () => {
      try {
        const status = await getJobStatus(jobId);
        setJobStatus(status);

        // Stop polling if job is completed or failed
        if (status.status === 'completed' || status.status === 'failed') {
          setIsPolling(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch job status');
        setIsPolling(false);
      }
    };

    // Poll immediately
    pollJobStatus();

    // Set up interval only if still generating
    let interval: NodeJS.Timeout | null = null;
    if (isPolling) {
      interval = setInterval(() => {
        if (jobStatus?.status === 'generating') {
          pollJobStatus();
        }
      }, intervalMs);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [jobId, intervalMs, isPolling, jobStatus?.status]);

  return { jobStatus, isPolling, error, stopPolling };
};
