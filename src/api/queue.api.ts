import axiosClient from './axiosClient';

// ─── Types ────────────────────────────────────────────────────────────────────

export type QueueStatus = 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'paused';

export interface QueueJobResult {
  id: string | number;
  type: string;
  status: QueueStatus;
  attemptsMade?: number;
  createdAt?: string;
  /** Present when status === "completed" */
  result?: unknown;
  /** Present when status === "failed" */
  failedReason?: string;
}

// ─── API call ─────────────────────────────────────────────────────────────────

export const getQueueJobStatus = async (
  jobId: string | number,
  signal?: AbortSignal,
): Promise<QueueJobResult> => {
  const { data } = await axiosClient.get<QueueJobResult>(`/queue/job/${jobId}`, { signal });
  return data;
};

// ─── Polling helper ───────────────────────────────────────────────────────────

/**
 * Polls GET /api/queue/job/:jobId every `intervalMs` milliseconds until the
 * job reaches a terminal state (completed | failed), or until `timeoutMs` elapses.
 *
 * Pass an `AbortSignal` to cancel polling early (e.g. when the component unmounts).
 * Resolves with the final QueueJobResult on success.
 * Rejects with an Error on failure, timeout, or abort.
 */
export const pollUntilDone = (
  jobId: string | number,
  intervalMs = 600,
  timeoutMs = 30_000,
  signal?: AbortSignal,
): Promise<QueueJobResult> => {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + timeoutMs;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    // Reject immediately if the signal is already aborted
    if (signal?.aborted) {
      reject(new DOMException('Polling aborted', 'AbortError'));
      return;
    }

    // Stop polling when the caller aborts
    signal?.addEventListener('abort', () => {
      clearTimeout(timerId);
      reject(new DOMException('Polling aborted', 'AbortError'));
    });

    const tick = async () => {
      if (signal?.aborted) return; // guard — abort fired between ticks

      if (Date.now() >= deadline) {
        reject(new Error('Timed out waiting for the server to process your request. Please try again.'));
        return;
      }

      try {
        const jobStatus = await getQueueJobStatus(jobId, signal);

        if (jobStatus.status === 'completed') {
          resolve(jobStatus);
        } else if (jobStatus.status === 'failed') {
          reject(new Error(jobStatus.failedReason ?? 'The server could not process your request.'));
        } else {
          // still waiting or active — schedule next poll
          timerId = setTimeout(tick, intervalMs);
        }
      } catch (err) {
        reject(err);
      }
    };

    // kick off first poll immediately
    tick();
  });
};
