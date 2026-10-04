import { RotateCcw, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { format, useLocale } from '@/lib/use-locale';
import { cn } from '@/lib/utils';
import { computePace, formatDuration } from './pace';

type TimerSettings = { targetMinutes: number | null; budgets: Record<number, number> };

const EMPTY_SETTINGS: TimerSettings = { targetMinutes: null, budgets: {} };

function storageKey(slideId: string) {
  return `open-slide:cockpit-timer:${slideId}`;
}

function readSettings(slideId: string): TimerSettings {
  try {
    const raw = window.localStorage.getItem(storageKey(slideId));
    if (!raw) return EMPTY_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<TimerSettings>;
    return {
      targetMinutes: typeof parsed.targetMinutes === 'number' ? parsed.targetMinutes : null,
      budgets: parsed.budgets && typeof parsed.budgets === 'object' ? parsed.budgets : {},
    };
  } catch {
    return EMPTY_SETTINGS;
  }
}

function useTimerSettings(slideId: string) {
  const [settings, setSettings] = useState(() => readSettings(slideId));
  const loadedForRef = useRef(slideId);
  if (loadedForRef.current !== slideId) {
    loadedForRef.current = slideId;
    setSettings(readSettings(slideId));
  }
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey(slideId), JSON.stringify(settings));
    } catch {}
  }, [slideId, settings]);
  return [settings, setSettings] as const;
}

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

// Time spent on each page accumulates across visits, so stepping back to a
// page resumes its clock instead of restarting it.
function usePageTime(index: number, now: number, resetKey: number) {
  const spentRef = useRef(new Map<number, number>());
  const enteredRef = useRef({ index, at: Date.now() });

  // biome-ignore lint/correctness/useExhaustiveDependencies: resetKey is a trigger
  useEffect(() => {
    spentRef.current.clear();
    enteredRef.current = { index: enteredRef.current.index, at: Date.now() };
  }, [resetKey]);

  if (enteredRef.current.index !== index) {
    const { index: prev, at } = enteredRef.current;
    const leftAt = Date.now();
    spentRef.current.set(prev, (spentRef.current.get(prev) ?? 0) + (leftAt - at));
    enteredRef.current = { index, at: leftAt };
  }
  const spent = spentRef.current.get(index) ?? 0;
  return (spent + Math.max(0, now - enteredRef.current.at)) / 1000;
}

export function CockpitTimer({
  slideId,
  index,
  total,
  startedAt,
  resetKey,
  onReset,
}: {
  slideId: string;
  index: number;
  total: number;
  startedAt: number;
  resetKey: number;
  onReset: () => void;
}) {
  const t = useLocale();
  const now = useNow();
  const [settings, setSettings] = useTimerSettings(slideId);
  const elapsed = Math.max(0, (now - startedAt) / 1000);
  const pageElapsed = usePageTime(index, now, resetKey);

  const target = settings.targetMinutes !== null ? settings.targetMinutes * 60 : null;
  const pace =
    target !== null
      ? computePace({ target, budgets: settings.budgets, total, index, elapsed })
      : null;
  const explicitBudget = settings.budgets[index];
  const pageOver = pace !== null && pageElapsed > pace.pageBudget;

  const setTarget = (raw: string) => {
    const n = Number.parseFloat(raw);
    setSettings((s) => ({ ...s, targetMinutes: Number.isFinite(n) && n > 0 ? n : null }));
  };
  const setPageBudget = (raw: string) => {
    const n = Number.parseFloat(raw);
    setSettings((s) => {
      const budgets = { ...s.budgets };
      if (Number.isFinite(n) && n >= 0) budgets[index] = Math.round(n * 60);
      else delete budgets[index];
      return { ...s, budgets };
    });
  };

  return (
    <section className="flex flex-col gap-3 rounded-[8px] border border-border bg-card p-3 text-card-foreground">
      <div className="flex items-center justify-between">
        <span className="eyebrow">{t.cockpit.timer}</span>
        <Button variant="ghost" size="xs" onClick={onReset} title={t.presenter.resetTimer}>
          <RotateCcw className="size-3.5" /> {t.presenter.reset}
        </Button>
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <time
          title={t.presenter.elapsed}
          className="font-mono text-[32px] leading-none tabular-nums text-foreground"
        >
          {formatDuration(elapsed)}
        </time>
        {pace && (
          <span
            className={cn(
              'rounded-[4px] px-2 py-1 font-mono text-[11px] tracking-[0.04em] uppercase tabular-nums',
              pace.status === 'behind' && 'bg-red-500/15 text-red-300',
              pace.status === 'ahead' && 'bg-sky-400/15 text-sky-200',
              pace.status === 'on-track' && 'bg-emerald-400/15 text-emerald-200',
            )}
          >
            {pace.status === 'on-track'
              ? t.cockpit.onTrack
              : format(pace.status === 'ahead' ? t.cockpit.ahead : t.cockpit.behind, {
                  time: formatDuration(pace.delta),
                })}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-[12px]">
        <label className="flex flex-col gap-1">
          <span className="text-muted-foreground">{t.cockpit.target}</span>
          <span className="flex items-center gap-1.5">
            <input
              type="number"
              inputMode="decimal"
              min={1}
              step={1}
              value={settings.targetMinutes ?? ''}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="—"
              className="h-8 w-20 rounded-[5px] border border-border bg-background px-2 font-mono tabular-nums outline-none focus-visible:border-foreground/30"
            />
            <span className="text-muted-foreground">{t.cockpit.minutes}</span>
          </span>
        </label>
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">{t.cockpit.remaining}</span>
          <span
            className={cn(
              'flex h-8 items-center font-mono text-[15px] tabular-nums',
              pace && pace.remaining < 0 && 'text-red-300',
            )}
          >
            {pace
              ? `${pace.remaining < 0 ? '−' : ''}${formatDuration(Math.abs(pace.remaining))}`
              : '—'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-[12px]">
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">{t.cockpit.thisSlide}</span>
          <span className={cn('font-mono tabular-nums', pageOver && 'text-red-300')}>
            {formatDuration(pageElapsed)}
            {pace && (
              <span className="text-muted-foreground"> / {formatDuration(pace.pageBudget)}</span>
            )}
          </span>
        </div>
        {pace && (
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full', pageOver ? 'bg-red-400' : 'bg-foreground/60')}
              style={{
                width: `${pace.pageBudget > 0 ? Math.min(100, (pageElapsed / pace.pageBudget) * 100) : 100}%`,
              }}
            />
          </div>
        )}
        {pace && (
          <label className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">{t.cockpit.slideBudget}</span>
            <span className="flex items-center gap-1.5">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                step={0.5}
                value={explicitBudget !== undefined ? explicitBudget / 60 : ''}
                onChange={(e) => setPageBudget(e.target.value)}
                placeholder={format(t.cockpit.autoBudget, {
                  min: (pace.pageBudget / 60).toFixed(1),
                })}
                className="h-7 w-28 rounded-[5px] border border-border bg-background px-2 font-mono tabular-nums outline-none focus-visible:border-foreground/30"
              />
              <span className="text-muted-foreground">{t.cockpit.minutes}</span>
              {explicitBudget !== undefined && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setPageBudget('')}
                  aria-label={t.cockpit.clearSlideBudget}
                  title={t.cockpit.clearSlideBudget}
                >
                  <X className="size-3.5" />
                </Button>
              )}
            </span>
          </label>
        )}
      </div>
    </section>
  );
}
