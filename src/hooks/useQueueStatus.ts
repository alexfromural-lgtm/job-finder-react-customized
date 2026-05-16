import { useState, useEffect, useCallback, useRef } from 'react';
import axiosClient from '../api/axiosClient';
import type { QueueJobResponse, QueueJobStatus } from '../types';

const POLL_INTERVAL_MS = 1500;
const STATUS_COMPLETED: QueueJobStatus = 'completed';
const STATUS_FAILED: QueueJobStatus = 'failed';
const TERMINAL_STATES: QueueJobStatus[] = [STATUS_COMPLETED, STATUS_FAILED];

/**
 * Polls the queue status endpoint until the job reaches a terminal state
 * (completed or failed) or the component unmounts.
 *
 * Usage:
 *   const { status, result, error, isLoading } = useQueueStatus(queueJobId);
 */
export function useQueueStatus(queueJobId: string | null) {
  const [status, setStatus] = useState<QueueJobStatus | null>(null);
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!queueJobId) return;

    setIsLoading(true);
    setStatus(null);
    setResult(null);
    setError(null);

    const poll = async () => {
      try {
        const { data } = await axiosClient.get<QueueJobResponse>(`/queue/job/${queueJobId}`);
        setStatus(data.status);

        if (data.status === STATUS_COMPLETED) {
          setResult(data.result ?? null);
          clearPolling();
          setIsLoading(false);
        } else if (data.status === STATUS_FAILED) {
          setError(data.failedReason ?? 'Operation failed. Please try again.');
          clearPolling();
          setIsLoading(false);
        }
      } catch {
        setError('Could not check operation status.');
        clearPolling();
        setIsLoading(false);
      }
    };

    // Poll immediately then on interval
    poll();
    intervalRef.current = setInterval(() => {
      if (!TERMINAL_STATES.includes(status as QueueJobStatus)) {
        poll();
      }
    }, POLL_INTERVAL_MS);

    return () => clearPolling();
  }, [queueJobId, clearPolling]); // eslint-disable-line react-hooks/exhaustive-deps

  return { status, result, error, isLoading };
}
