import { ChevronLeft, ChevronRight, LayoutGrid, Square, Sun } from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { hasModifier, isBackwardKey, isForwardKey, isTypingTarget } from '@/lib/keys';
import { useDocumentTitle } from '@/lib/use-document-title';
import { format, useLocale } from '@/lib/use-locale';
import { cn, pad2 } from '@/lib/utils';
import { CockpitNextNotes, CockpitNotes } from '../components/cockpit/cockpit-notes';
import { CockpitTimer } from '../components/cockpit/cockpit-timer';
import { usePresenterMirror } from '../components/cockpit/use-presenter-mirror';
import { OverviewGrid } from '../components/overview-grid';
import { SlideCanvas } from '../components/slide-canvas';
import { isDeckWarmed, markDeckWarmed, SlidePreloadLayer } from '../components/slide-preload-layer';
import { SlidePageProvider } from '../lib/page-context';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../lib/sdk';
import { slideIds } from '../lib/slides';
import { useSlideModule } from '../lib/use-slide-module';
import { Clock, DeckSwitcher, PreviewStepHost, SectionLabel } from './presenter';

export function Cockpit() {
  const { slideId = '' } = useParams();
  const { slide, error } = useSlideModule(slideId);
  useDocumentTitle(slide?.meta?.title);
  const t = useLocale();
  const navigate = useNavigate();
  const { state, linked, send } = usePresenterMirror(slideId);
  const [localStart] = useState(() => Date.now());
  const [resetAt, setResetAt] = useState(0);
  const [overviewOpen, setOverviewOpen] = useState(false);
  const [, setWarmedTick] = useState(0);
  const handleAssetsWarmed = useCallback(() => {
    markDeckWarmed(slideId);
    setWarmedTick((n) => n + 1);
  }, [slideId]);

  const goPrev = useCallback(() => send({ type: 'prev' }), [send]);
  const goNext = useCallback(() => send({ type: 'next' }), [send]);
  const goTo = useCallback((i: number) => send({ type: 'goto', index: i }), [send]);
  const toggleBlack = useCallback(() => send({ type: 'toggle-blackout', mode: 'black' }), [send]);
  const toggleWhite = useCallback(() => send({ type: 'toggle-blackout', mode: 'white' }), [send]);
  const switchDeck = useCallback(
    (id: string) => {
      if (id === slideId) return;
      send({ type: 'switch-slide', slideId: id });
      navigate(`/s/${encodeURIComponent(id)}/cockpit`, { replace: true });
    },
    [slideId, send, navigate],
  );

  const total = slide?.default.length ?? 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (overviewOpen || e.defaultPrevented) return;
      if (isTypingTarget(e.target) || hasModifier(e)) return;
      if (isForwardKey(e)) {
        e.preventDefault();
        goNext();
      } else if (isBackwardKey(e)) {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        if (total > 0) goTo(total - 1);
      } else if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        toggleBlack();
      } else if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        toggleWhite();
      } else if (e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        setOverviewOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [overviewOpen, goNext, goPrev, goTo, toggleBlack, toggleWhite, total]);

  if (error) {
    return (
      <div className="dark grid h-dvh place-items-center bg-background p-8 text-foreground">
        <div className="max-w-md text-center">
          <span className="eyebrow text-destructive/80">{t.common.loadFailed}</span>
          <h2 className="mt-2 font-heading text-xl font-semibold">{t.common.failedToLoadSlide}</h2>
          <pre className="mt-4 overflow-auto rounded-[6px] border border-border bg-card p-4 text-left text-[11.5px] whitespace-pre-wrap shadow-edge">
            {error}
          </pre>
        </div>
      </div>
    );
  }

  if (!slide || !isDeckWarmed(slideId)) {
    return (
      <div className="dark grid h-dvh place-items-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-px w-56 overflow-hidden bg-border">
            <span
              aria-hidden
              className="line-loader-bar absolute inset-y-[-0.5px] left-0 w-1/4 bg-foreground"
            />
          </div>
          <div className="text-[11.5px]">
            {slide ? t.presenter.loadingAssets : format(t.presenter.loadingSlide, { slideId })}
          </div>
        </div>
        {slide && (
          <SlidePreloadLayer
            pages={slide.default}
            index={Math.max(0, Math.min(total - 1, state?.index ?? 0))}
            design={slide.design}
            includeCurrent
            onDone={handleAssetsWarmed}
          />
        )}
      </div>
    );
  }

  const pages = slide.default;
  const index = Math.max(0, Math.min(total - 1, state?.index ?? 0));
  const blackout = state?.blackout ?? null;
  const startedAt = Math.max(state?.startedAt ?? localStart, resetAt);
  const stepIndex = Math.max(0, state?.stepIndex ?? 0);
  const stepCount = Math.max(0, state?.stepCount ?? 0);

  const stepsRemaining = stepIndex < stepCount;
  const hasNextSlide = index < total - 1;
  const hasNext = stepsRemaining || hasNextSlide;
  const hasPrev = index > 0 || stepIndex > 0;
  const nextPageIndex = stepsRemaining ? index : Math.min(total - 1, index + 1);
  const nextRevealed = stepsRemaining ? stepIndex + 1 : 0;

  const CurrentPage = pages[index];
  const NextPage = hasNext ? pages[nextPageIndex] : null;

  return (
    <div className="dark relative flex h-dvh w-screen flex-col overflow-hidden bg-background text-foreground">
      <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-hairline px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <span className="eyebrow hidden text-white/45 sm:inline">{t.cockpit.eyebrow}</span>
          {slideIds.length > 1 ? (
            <DeckSwitcher
              slideId={slideId}
              slideTitle={slide.meta?.title ?? slideId}
              onSwitchDeck={switchDeck}
            />
          ) : (
            <span className="truncate font-heading text-[14px] font-semibold tracking-tight">
              {slide.meta?.title ?? slideId}
            </span>
          )}
          {!linked && (
            <span className="shrink-0 rounded-[3px] border border-amber-300/30 bg-amber-300/10 px-1.5 py-0.5 font-mono text-[10px] tracking-[0.06em] uppercase text-amber-200/85">
              {t.presenter.notLinked}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <span className="hidden sm:inline">
            <Clock />
          </span>
          {stepCount > 0 && (
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
              {format(t.cockpit.step, { n: stepIndex, total: stepCount })}
            </span>
          )}
          <div className="font-mono text-[18px] tabular-nums">
            <span className="text-foreground">{pad2(index + 1)}</span>
            <span className="text-foreground/30"> / </span>
            <span className="text-muted-foreground">{pad2(total)}</span>
          </div>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-5 overflow-y-auto p-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)] lg:overflow-hidden lg:px-6">
        <div className="flex min-h-0 flex-col gap-4">
          <section className="flex flex-col gap-2 lg:min-h-0 lg:flex-1">
            <SectionLabel>{t.presenter.nowShowing}</SectionLabel>
            <SlideFrame fill>
              <SlideCanvas flat design={slide.design}>
                <SlidePageProvider index={index} total={total}>
                  <PreviewStepHost revealed={stepIndex}>
                    <CurrentPage />
                  </PreviewStepHost>
                </SlidePageProvider>
              </SlideCanvas>
              {blackout && (
                <div
                  aria-hidden
                  className={cn(
                    'pointer-events-none absolute inset-0 grid place-items-center text-[11px] tracking-[0.08em] uppercase',
                    blackout === 'black' ? 'bg-black text-white/35' : 'bg-white text-black/35',
                  )}
                >
                  {blackout === 'black' ? t.presenter.blackScreen : t.presenter.whiteScreen}
                </div>
              )}
            </SlideFrame>
          </section>

          <div className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <section className="flex flex-col gap-2">
              <SectionLabel>{hasNext ? t.presenter.upNext : t.presenter.lastSlide}</SectionLabel>
              <SlideFrame>
                {NextPage ? (
                  <SlideCanvas flat freezeMotion design={slide.design}>
                    <SlidePageProvider index={nextPageIndex} total={total}>
                      <PreviewStepHost revealed={nextRevealed}>
                        <NextPage />
                      </PreviewStepHost>
                    </SlidePageProvider>
                  </SlideCanvas>
                ) : (
                  <div className="grid h-full place-items-center text-[11.5px] text-muted-foreground">
                    {t.presenter.endOfDeck}
                  </div>
                )}
              </SlideFrame>
            </section>
            <CockpitTimer
              slideId={slideId}
              index={index}
              total={total}
              startedAt={startedAt}
              resetKey={resetAt}
              onReset={() => setResetAt(Date.now())}
            />
          </div>
        </div>

        <aside className="flex min-h-0 flex-col gap-4">
          <CockpitNotes slideId={slideId} index={index} note={slide.notes?.[index]} />
          <CockpitNextNotes
            slideId={slideId}
            index={hasNextSlide ? index + 1 : null}
            note={hasNextSlide ? slide.notes?.[index + 1] : undefined}
          />
        </aside>
      </main>

      <footer className="flex shrink-0 items-center gap-2 border-t border-hairline p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:px-6">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={!hasPrev}
          className="h-14 flex-1 text-[15px] lg:h-9 lg:flex-none"
        >
          <ChevronLeft className="size-5" /> {t.presenter.prev}
        </Button>
        <Button
          variant="brand"
          onClick={goNext}
          disabled={!hasNext}
          className="h-14 flex-[2] text-[15px] lg:h-9 lg:flex-none"
        >
          {t.presenter.next} <ChevronRight className="size-5" />
        </Button>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setOverviewOpen(true)}
            title={t.cockpit.overviewShortcut}
            aria-label={t.cockpit.overview}
            className="h-14 lg:h-9"
          >
            <LayoutGrid className="size-4" />
            <span className="hidden lg:inline">{t.cockpit.overview}</span>
          </Button>
          <Button
            variant={blackout === 'black' ? 'brand' : 'outline'}
            onClick={toggleBlack}
            aria-pressed={blackout === 'black'}
            aria-label={t.presenter.black}
            className="h-14 lg:h-9"
          >
            <Square className="size-4 fill-current" />
            <span className="hidden lg:inline">{t.presenter.black}</span>
          </Button>
          <Button
            variant={blackout === 'white' ? 'brand' : 'outline'}
            onClick={toggleWhite}
            aria-pressed={blackout === 'white'}
            aria-label={t.presenter.white}
            className="h-14 lg:h-9"
          >
            <Sun className="size-4" />
            <span className="hidden lg:inline">{t.presenter.white}</span>
          </Button>
        </div>
      </footer>

      <OverviewGrid
        pages={pages}
        design={slide.design}
        open={overviewOpen}
        current={index}
        onClose={() => setOverviewOpen(false)}
        onSelect={goTo}
        variant="present"
        moduleTransition={slide.transition}
      />
    </div>
  );
}

// `fill` lets the frame take the remaining height on desktop, where the
// canvas letterboxes itself; elsewhere it keeps the deck's aspect ratio.
function SlideFrame({ fill = false, children }: { fill?: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-[8px] bg-black ring-1 ring-border',
        fill && 'lg:aspect-auto! lg:min-h-0 lg:flex-1',
      )}
      style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
    >
      {children}
    </div>
  );
}
