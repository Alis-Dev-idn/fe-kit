import { useState, useEffect, useRef, useCallback } from "react";
import { RealtimeOptions } from "../types";

export function useRealtimeData<T>(
  initialData: T[],
  options?: RealtimeOptions<T>
) {
  const [data, setData] = useState<T[]>(initialData);
  const [isStreaming, setIsStreaming] = useState(options?.enabled ?? false);
  const isPausedRef = useRef(false);
  const bufferRef = useRef<T[]>(initialData);
  const throttleTimeoutRef = useRef<number | null>(null);

  const maxPoints = options?.maxPoints ?? 50;
  const throttleMs = options?.throttleMs ?? 100;

  // Manual update function (used by stream or polling)
  const pushData = useCallback((newData: T | T[]) => {
    if (isPausedRef.current) return;

    const items = Array.isArray(newData) ? newData : [newData];
    
    // Update buffer
    const nextBuffer = [...bufferRef.current, ...items].slice(-maxPoints);
    bufferRef.current = nextBuffer;

    // Throttle state update
    if (!throttleTimeoutRef.current) {
      throttleTimeoutRef.current = window.setTimeout(() => {
        setData(bufferRef.current);
        throttleTimeoutRef.current = null;
      }, throttleMs);
    }
  }, [maxPoints, throttleMs]);

  // Handle stream subscription
  useEffect(() => {
    if (!isStreaming || !options?.stream) return;

    const unsubscribe = options.stream.subscribe(pushData);
    return () => {
      unsubscribe();
      if (throttleTimeoutRef.current) {
        window.clearTimeout(throttleTimeoutRef.current);
      }
    };
  }, [isStreaming, options?.stream, pushData]);

  // Handle polling fallback
  useEffect(() => {
    if (!isStreaming || !options?.polling || options?.stream) return;

    const { interval, fetcher } = options.polling;
    let isActive = true;

    const poll = async () => {
      try {
        const result = await fetcher();
        if (isActive) pushData(result);
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    const timerId = setInterval(poll, interval);
    return () => {
      isActive = false;
      clearInterval(timerId);
    };
  }, [isStreaming, options?.polling, options?.stream, pushData]);

  // If initialData changes significantly (e.g., from an external fetch), reset buffer
  useEffect(() => {
    if (initialData.length > 0 && initialData !== bufferRef.current) {
      bufferRef.current = initialData;
      setData(initialData);
    }
  }, [initialData]);

  const pause = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const resume = useCallback(() => {
    isPausedRef.current = false;
    // Force immediate update on resume if buffer changed
    setData([...bufferRef.current]);
  }, []);

  const reset = useCallback(() => {
    bufferRef.current = [];
    setData([]);
  }, []);

  return {
    data,
    isStreaming,
    pause,
    resume,
    reset,
    setIsStreaming,
  };
}
