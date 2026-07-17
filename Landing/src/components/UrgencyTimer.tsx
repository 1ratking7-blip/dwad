import { useEffect, useState } from 'react';

/**
 * Окно бонуса — повторяющийся часовой цикл, а не разовый фейковый дедлайн:
 * таймер обнуляется по кругу, что позволяет использовать urgency-механику
 * (Гипотеза 4, Analytics/HYPOTHESES.md) без риска обвинений в обмане пользователя
 * (см. GEMINI.md, п.8 — юридическая чистота).
 */
const WINDOW_DURATION_MS = 60 * 60 * 1000;
const STORAGE_KEY = 'zhelezo_bonus_window_deadline';

function readOrCreateDeadline(): number {
  const now = Date.now();
  const stored = Number(window.sessionStorage.getItem(STORAGE_KEY));

  if (stored && stored > now) {
    return stored;
  }

  const nextDeadline = now + WINDOW_DURATION_MS;
  window.sessionStorage.setItem(STORAGE_KEY, String(nextDeadline));
  return nextDeadline;
}

function formatRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function UrgencyTimer() {
  const [deadline, setDeadline] = useState(readOrCreateDeadline);
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (now >= deadline) {
      setDeadline(readOrCreateDeadline());
    }
  }, [now, deadline]);

  return <span>{formatRemaining(deadline - now)}</span>;
}
