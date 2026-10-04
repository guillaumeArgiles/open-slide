import { useNotes } from '@/lib/inspector/use-notes';
import { useLiveNote } from '@/lib/live-notes';
import { format, useLocale } from '@/lib/use-locale';
import { cn } from '@/lib/utils';
import { NoteMarkdown } from '../note-markdown';

export function CockpitNotes({
  slideId,
  index,
  note,
}: {
  slideId: string;
  index: number;
  note: string | undefined;
}) {
  const t = useLocale();
  const liveNote = useLiveNote(slideId, index, note);

  return (
    <section className="flex min-h-[220px] flex-1 flex-col gap-2">
      {import.meta.env.DEV ? (
        <EditableNotes slideId={slideId} index={index} note={note} />
      ) : (
        <>
          <span className="eyebrow">{t.presenter.speakerNotes}</span>
          <div className="min-h-0 flex-1 overflow-y-auto rounded-[6px] border border-border bg-card p-3 text-[15px] leading-relaxed text-card-foreground">
            {liveNote?.trim() ? (
              <NoteMarkdown text={liveNote} />
            ) : (
              <span className="text-muted-foreground">{t.cockpit.noNotes}</span>
            )}
          </div>
        </>
      )}
    </section>
  );
}

// Seeded from the module note rather than the live one: the live value
// arrives after our own save and would overwrite whatever was typed since.
function EditableNotes({
  slideId,
  index,
  note,
}: {
  slideId: string;
  index: number;
  note: string | undefined;
}) {
  const t = useLocale();
  const { value, setValue, status, flush } = useNotes(slideId, index, note);

  const statusLabel =
    status.kind === 'saving'
      ? t.notesDrawer.statusSaving
      : status.kind === 'saved'
        ? t.notesDrawer.statusSaved
        : status.kind === 'error'
          ? format(t.notesDrawer.statusError, { msg: status.message })
          : '';

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="eyebrow">{t.presenter.speakerNotes}</span>
        <span
          aria-live="polite"
          className={cn(
            'truncate text-[11px]',
            status.kind === 'error' && 'text-destructive',
            status.kind === 'saved' && 'text-emerald-300',
            status.kind === 'saving' && 'text-muted-foreground',
          )}
        >
          {statusLabel}
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => void flush()}
        placeholder={t.notesDrawer.placeholder}
        className="min-h-0 flex-1 resize-none rounded-[6px] border border-border bg-card p-3 text-[15px] leading-relaxed text-card-foreground outline-none placeholder:text-muted-foreground focus-visible:border-foreground/30"
      />
    </>
  );
}

export function CockpitNextNotes({
  slideId,
  index,
  note,
}: {
  slideId: string;
  index: number | null;
  note: string | undefined;
}) {
  const t = useLocale();
  const liveNote = useLiveNote(slideId, index ?? -1, note);
  if (index === null) return null;
  return (
    <section className="flex flex-col gap-2">
      <span className="eyebrow">{t.cockpit.nextNotes}</span>
      <div className="max-h-40 overflow-y-auto rounded-[6px] border border-border bg-card/60 p-3 text-[13px] leading-relaxed text-muted-foreground">
        {liveNote?.trim() ? <NoteMarkdown text={liveNote} /> : <span>{t.cockpit.noNotes}</span>}
      </div>
    </section>
  );
}
