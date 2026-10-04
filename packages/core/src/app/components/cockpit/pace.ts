export type Pace = {
  pageBudget: number;
  remaining: number;
  status: 'ahead' | 'behind' | 'on-track';
  delta: number;
};

// Pages without an explicit budget split whatever the explicit ones leave of
// the target, so setting one page's budget never moves the overall target.
export function computePace({
  target,
  budgets,
  total,
  index,
  elapsed,
}: {
  target: number;
  budgets: Record<number, number>;
  total: number;
  index: number;
  elapsed: number;
}): Pace {
  let explicitSum = 0;
  let explicitCount = 0;
  for (let i = 0; i < total; i++) {
    const b = budgets[i];
    if (b === undefined) continue;
    explicitSum += b;
    explicitCount++;
  }
  const autoCount = total - explicitCount;
  const autoBudget = autoCount > 0 ? Math.max(0, (target - explicitSum) / autoCount) : 0;
  const budgetOf = (i: number) => budgets[i] ?? autoBudget;

  let before = 0;
  for (let i = 0; i < index; i++) before += budgetOf(i);
  const pageBudget = budgetOf(index);
  const through = before + pageBudget;

  const remaining = target - elapsed;
  if (elapsed < before) return { pageBudget, remaining, status: 'ahead', delta: before - elapsed };
  if (elapsed > through) {
    return { pageBudget, remaining, status: 'behind', delta: elapsed - through };
  }
  return { pageBudget, remaining, status: 'on-track', delta: 0 };
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}
