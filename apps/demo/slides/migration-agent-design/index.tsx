import {
  type DesignSystem,
  type Page,
  type SlideMeta,
  Step,
  Steps,
  useSlidePageNumber,
} from '@open-slide/core';
import type { CSSProperties, ReactNode } from 'react';

export const design: DesignSystem = {
  palette: { bg: '#A4DBE8', text: '#000000', accent: '#A4DBE8' },
  fonts: {
    display: "'Arial Black', 'Archivo Black', Arial, sans-serif",
    body: 'Arial, Helvetica, sans-serif',
  },
  typeScale: { hero: 132, body: 28 },
  radius: 0,
};

const BLUE = '#A4DBE8';
const MINT = '#BDE9C9';
const SAND = '#F8E08E';
const LAVENDER = '#DECDE7';
const ORANGE = '#FFBF3F';
const INK = '#000000';
const PAPER = '#FFFFFF';
const MUTED = '#6B6B6B';
const LINE = '#D9D9D9';

const DISPLAY = 'var(--osd-font-display)';
const BODY = 'var(--osd-font-body)';
const DECK_LABEL = 'Migration agent — September 2026';

const Header = ({ label = DECK_LABEL, color = INK }: { label?: string; color?: string }) => (
  <div
    style={{
      position: 'absolute',
      top: 36,
      left: 80,
      right: 80,
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'baseline',
      color,
    }}
  >
    <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 20, letterSpacing: '0.02em' }}>
      PRESTASHOP
    </span>
    <span style={{ fontFamily: BODY, fontSize: 16, textTransform: 'uppercase' }}>{label}</span>
    <span />
  </div>
);

const Footer = ({ color = INK }: { color?: string }) => {
  const { current } = useSlidePageNumber();
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        bottom: 36,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'baseline',
        fontFamily: BODY,
        color,
      }}
    >
      <span />
      <span style={{ fontSize: 13 }}>
        © 2026 PrestaShop - a Fortidia Company. This document contains confidential information.
        Reproduction and distribution are not authorized.
      </span>
      <span style={{ fontSize: 16, textAlign: 'right' }}>{current}</span>
    </div>
  );
};

const Title = ({
  children,
  size = 132,
  color = INK,
}: {
  children: ReactNode;
  size?: number;
  color?: string;
}) => (
  <h1
    style={{
      fontFamily: DISPLAY,
      fontWeight: 900,
      fontSize: size,
      lineHeight: 1,
      textTransform: 'uppercase',
      margin: 0,
      color,
    }}
  >
    {children}
  </h1>
);

const Subtitle = ({
  children,
  size = 30,
  color = INK,
}: {
  children: ReactNode;
  size?: number;
  color?: string;
}) => (
  <p style={{ fontFamily: BODY, fontSize: size, lineHeight: 1.3, margin: '12px 0 0', color }}>
    {children}
  </p>
);

const Canvas = ({
  bg,
  dark = false,
  centered = false,
  children,
}: {
  bg: string;
  dark?: boolean;
  centered?: boolean;
  children: ReactNode;
}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: bg,
      color: dark ? PAPER : INK,
      fontFamily: BODY,
      padding: centered ? '0 80px' : '150px 80px 0',
      boxSizing: 'border-box',
      ...(centered ? { display: 'flex', flexDirection: 'column', justifyContent: 'center' } : null),
    }}
  >
    <Header color={dark ? PAPER : INK} />
    {children}
    <Footer color={dark ? PAPER : INK} />
  </div>
);

const Tag = ({
  children,
  bg,
  color = INK,
}: {
  children: ReactNode;
  bg: string;
  color?: string;
}) => (
  <span
    style={{
      display: 'inline-block',
      background: bg,
      color,
      fontFamily: DISPLAY,
      fontWeight: 900,
      fontSize: 15,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      padding: '6px 12px',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </span>
);

const label: CSSProperties = {
  fontFamily: DISPLAY,
  fontWeight: 900,
  fontSize: 22,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
};

const Cover: Page = () => (
  <Canvas bg="var(--osd-bg)" centered>
    <Title>
      Migration agent
      <br />
      the design part
    </Title>
    <Subtitle size={48}>Migration POC · PrestaShop 9</Subtitle>
  </Canvas>
);

const ToolCard = ({
  name,
  meta,
  detail,
  bg,
}: {
  name: string;
  meta: string;
  detail: string;
  bg: string;
}) => (
  <div
    style={{
      background: bg,
      padding: '64px 56px',
      minHeight: 420,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <div style={{ ...label, fontSize: 40 }}>{name}</div>
    <div style={{ fontSize: 30, fontWeight: 700, marginTop: 28 }}>{meta}</div>
    <div style={{ fontSize: 28, marginTop: 12 }}>{detail}</div>
  </div>
);

const TwoTools: Page = () => (
  <Canvas bg={PAPER}>
    <Title size={48}>Two tools doing the same job</Title>
    <Subtitle>Same goal, built separately</Subtitle>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 220px 1fr',
        alignItems: 'center',
        marginTop: 130,
      }}
    >
      <ToolCard
        name="Migration pipeline"
        meta="n8n · 14 workflows"
        detail="Generated CSS on top of Classic"
        bg={BLUE}
      />
      <Steps>
        <Step>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: `4px dashed ${INK}`, margin: '0 24px' }} />
            <div style={{ ...label, marginTop: 18 }}>No link</div>
          </div>
        </Step>
      </Steps>
      <ToolCard name="Skills" meta="13 skills · own repo" detail="Run by hand" bg={MINT} />
    </div>
  </Canvas>
);

const LiveDemo: Page = () => (
  <Canvas bg={INK} dark centered>
    <div style={{ alignSelf: 'flex-start' }}>
      <Tag bg={BLUE}>Live · dashboard</Tag>
    </div>
    <div style={{ marginTop: 32 }}>
      <Title size={132} color={BLUE}>
        Live demo
      </Title>
    </div>
    <Subtitle size={48} color={PAPER}>
      Let's start a real run.
    </Subtitle>
    <Subtitle size={32} color={PAPER}>
      Then your turn: give us a website. Results after all the demos.
    </Subtitle>
  </Canvas>
);

type Verdict = 'Duplicate' | 'Complementary' | 'Gap' | 'POC only';

const VERDICT_BG: Record<Verdict, string> = {
  Duplicate: BLUE,
  Complementary: MINT,
  Gap: ORANGE,
  'POC only': LAVENDER,
};

const MAPPING: { step: string; skill?: string; verdict: Verdict; focus?: boolean }[] = [
  { step: 'Trigger', verdict: 'POC only' },
  { step: 'Pre-flight cleanup', verdict: 'POC only' },
  { step: 'Provision PS9', skill: 'install', verdict: 'Duplicate' },
  { step: 'Inject import module', skill: 'module', verdict: 'Complementary' },
  { step: 'Upgrade or rebuild?', skill: 'migration-audit', verdict: 'Gap' },
  { step: 'Extract source data', skill: 'migration-audit', verdict: 'Complementary' },
  { step: 'Upgrade 1.7 → 8 → 9', skill: 'migration-etl', verdict: 'Duplicate' },
  { step: 'Visual scraping', skill: 'theme', verdict: 'Complementary' },
  { step: 'AI equivalence plan', verdict: 'POC only' },
  { step: 'Install modules', skill: 'module', verdict: 'Duplicate' },
  { step: 'Configure the core', skill: 'shop-config', verdict: 'Duplicate' },
  { step: 'Import data', skill: 'catalog', verdict: 'Complementary' },
  { step: 'Generate the theme', skill: 'theme', verdict: 'Duplicate', focus: true },
  { step: 'Wrap-up', verdict: 'POC only' },
  { step: 'Final verification', skill: 'migration-acceptance', verdict: 'Gap' },
  { step: 'Legal content / GDPR', skill: 'legal', verdict: 'Gap' },
];

const MappingRow = ({ index, row }: { index: number; row: (typeof MAPPING)[number] }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '56px 1fr auto',
      alignItems: 'center',
      gap: 16,
      height: 70,
      padding: '0 20px',
      background: row.focus ? INK : 'transparent',
      color: row.focus ? PAPER : INK,
      borderBottom: `1px solid ${row.focus ? INK : LINE}`,
    }}
  >
    <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 22 }}>
      {String(index + 1).padStart(2, '0')}
    </span>
    <span style={{ fontSize: 25, fontWeight: row.focus ? 700 : 400 }}>
      {row.step}
      {row.skill && (
        <span style={{ fontSize: 18, color: row.focus ? BLUE : MUTED, marginLeft: 12 }}>
          {row.skill}
        </span>
      )}
    </span>
    <Tag bg={VERDICT_BG[row.verdict]}>{row.verdict}</Tag>
  </div>
);

const Mapping: Page = () => {
  const counts = MAPPING.reduce<Record<Verdict, number>>(
    (acc, r) => {
      acc[r.verdict]++;
      return acc;
    },
    { Duplicate: 0, Complementary: 0, Gap: 0, 'POC only': 0 },
  );
  return (
    <Canvas bg={PAPER}>
      <Title size={48}>We mapped them, step by step</Title>
      <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
        {(Object.keys(counts) as Verdict[]).map((v) => (
          <Tag key={v} bg={VERDICT_BG[v]}>
            {counts[v]} {v === 'Gap' ? 'Gap in the POC' : v}
          </Tag>
        ))}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: 64,
          marginTop: 40,
        }}
      >
        {[0, 1].map((col) => (
          <div key={col}>
            {MAPPING.slice(col * 8, col * 8 + 8).map((row, i) => (
              <MappingRow key={row.step} index={col * 8 + i} row={row} />
            ))}
          </div>
        ))}
      </div>
    </Canvas>
  );
};

const Layer = ({
  name,
  caption,
  bg,
  color = INK,
}: {
  name: string;
  caption: string;
  bg: string;
  color?: string;
}) => (
  <div
    style={{
      background: bg,
      color,
      width: 760,
      padding: '30px 44px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
    }}
  >
    <span style={{ ...label, fontSize: 34 }}>{name}</span>
    <span style={{ fontSize: 26 }}>{caption}</span>
  </div>
);

const Arrow = ({ children }: { children: ReactNode }) => (
  <div style={{ fontSize: 24, padding: '14px 0 14px 44px' }}>{children}</div>
);

const WhySkill: Page = () => (
  <Canvas bg={BLUE}>
    <Title size={48}>Why a skill, not a script?</Title>
    <Subtitle>A skill = rules the agent reads + scripts that do the work</Subtitle>
    <div style={{ display: 'flex', gap: 80, marginTop: 70, alignItems: 'flex-start' }}>
      <div>
        <Layer name="AI agent" caption="decides · sequences" bg={INK} color={PAPER} />
        <Arrow>↓ reads</Arrow>
        <Layer name="Skill" caption="rules + references" bg={PAPER} />
        <Arrow>↓ runs</Arrow>
        <Layer name="Scripts" caption="they execute" bg={PAPER} />
        <Arrow>
          ↑ report <b style={{ fontFamily: DISPLAY }}>STATUS: ok</b>
        </Arrow>
      </div>
      <div style={{ background: SAND, padding: '40px 44px', width: 620, marginTop: 120 }}>
        <div style={label}>Rule example</div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 40, marginTop: 20 }}>
          Never run cache:clear
        </div>
        <div style={{ fontSize: 26, marginTop: 20, lineHeight: 1.4 }}>
          In one of our tests, it broke the back office.
        </div>
      </div>
    </div>
  </Canvas>
);

const DUELS: { name: string; result: string; tone: 'draw' | 'win' | 'none' }[] = [
  { name: 'Install PS9', result: 'Draw', tone: 'draw' },
  { name: 'Generate the theme', result: 'Skill wins', tone: 'win' },
  { name: 'Configure the core', result: 'Not run', tone: 'none' },
  { name: 'Install modules', result: 'Not run', tone: 'none' },
  { name: 'Upgrade to 9', result: 'Not run', tone: 'none' },
];

const Duels: Page = () => (
  <Canvas bg={PAPER}>
    <Title size={48}>Five duels: POC vs skill</Title>
    <Subtitle>One duel per duplicate step</Subtitle>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 24, marginTop: 90 }}>
      {DUELS.map((d, i) => {
        const win = d.tone === 'win';
        return (
          <div
            key={d.name}
            style={{
              background: win ? INK : d.tone === 'draw' ? BLUE : '#F3F3F3',
              color: win ? PAPER : d.tone === 'none' ? MUTED : INK,
              height: 380,
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ ...label, fontSize: 20 }}>Duel {i + 1}</div>
              <div style={{ fontSize: 30, fontWeight: 700, marginTop: 18, lineHeight: 1.2 }}>
                {d.name}
              </div>
            </div>
            <div
              style={{
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: 32,
                textTransform: 'uppercase',
                color: win ? BLUE : undefined,
              }}
            >
              {d.result}
            </div>
          </div>
        );
      })}
    </div>
    <div style={{ ...label, fontSize: 28, marginTop: 64 }}>Our focus now: the design</div>
  </Canvas>
);

const Check = ({ ok, children }: { ok: boolean; children: ReactNode }) => (
  <div style={{ display: 'flex', gap: 20, alignItems: 'baseline', fontSize: 32, marginTop: 28 }}>
    <span style={{ fontFamily: DISPLAY, fontWeight: 900, width: 32 }}>{ok ? '✓' : '✕'}</span>
    <span>{children}</span>
  </div>
);

const ThemeDuel: Page = () => (
  <Canvas bg={PAPER}>
    <Title size={48}>Duel 2: the theme, side by side</Title>
    <Subtitle>Tested on a real Shopify shop</Subtitle>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 80 }}>
      <div style={{ background: '#F3F3F3', padding: '48px 56px', height: 400 }}>
        <div style={{ ...label, fontSize: 36 }}>POC</div>
        <Check ok={false}>Default colours</Check>
        <Check ok={false}>Demo home, lorem ipsum</Check>
        <Check ok>Captures fonts &amp; logo</Check>
      </div>
      <div style={{ background: MINT, padding: '48px 56px', height: 400 }}>
        <div style={{ ...label, fontSize: 36 }}>Skill</div>
        <Check ok>Real brand palette</Check>
        <Check ok>Composed home, zero lorem</Check>
        <Check ok>Guardrails, verified output</Check>
      </div>
    </div>
  </Canvas>
);

const PIPELINE = ['Provision', 'Extract', 'AI plan', 'Deploy', 'Import', 'Theme', 'Close'];

const PlugIn: Page = () => (
  <Canvas bg={MINT}>
    <Title size={48}>Where skills plug into the pipeline</Title>
    <Subtitle>n8n does everything before, then hands over one step</Subtitle>
    <div style={{ display: 'flex', alignItems: 'center', marginTop: 150 }}>
      {PIPELINE.map((stage, i) => {
        const theme = stage === 'Theme';
        return (
          <div key={stage} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: theme ? 260 : 190,
                height: theme ? 150 : 110,
                background: theme ? INK : PAPER,
                color: theme ? BLUE : INK,
                display: 'grid',
                placeItems: 'center',
                fontFamily: DISPLAY,
                fontWeight: 900,
                fontSize: theme ? 36 : 24,
                textTransform: 'uppercase',
              }}
            >
              {stage}
            </div>
            {i < PIPELINE.length - 1 && (
              <div style={{ width: 34, borderTop: `4px solid ${INK}` }} />
            )}
          </div>
        );
      })}
    </div>
    <div style={{ display: 'flex', marginTop: 40, paddingLeft: 1120 }}>
      <div style={{ width: 260, textAlign: 'center' }}>
        <div style={{ ...label, fontSize: 24, whiteSpace: 'nowrap' }}>↑ Skills run here</div>
        <div style={{ fontSize: 24, marginTop: 14 }}>n8n waits → callback</div>
      </div>
    </div>
  </Canvas>
);

const BUILT: [string, string?][] = [
  ['Capture the source site', 'pages · logo · texts · photos'],
  ['Shortlist the best-fitting presets'],
  ['Recolour previews', 'home · category · product'],
  ['Merchant picks a design'],
  ['Write the content', 'slider · wording · new pages'],
  ['Deploy the child theme'],
  ['Finish loop', 'render → critique → fix'],
  ['Polish loop', 'measure → judge → adjust'],
  ['Report back to n8n'],
];

const ASIDE: [string, string?][] = [
  ['Polish with the merchant', 'approve or ask for changes'],
  ['Merchant brings own images'],
  ['Legal pages / GDPR'],
  ['Final acceptance check'],
];

const DesignRun: Page = () => (
  <Canvas bg={PAPER}>
    <Title size={48}>The design run, step by step</Title>
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 80, marginTop: 44 }}>
      <div>
        <div style={label}>Built</div>
        <div style={{ marginTop: 14 }}>
          {BUILT.map(([step, detail], i) => (
            <div
              key={step}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr',
                alignItems: 'baseline',
                height: 64,
                paddingTop: 16,
                boxSizing: 'border-box',
                background: i === 3 ? SAND : 'transparent',
                borderBottom: `1px solid ${LINE}`,
                paddingLeft: 12,
              }}
            >
              <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 24 }}>{i + 1}</span>
              <span style={{ fontSize: 26, fontWeight: 700 }}>
                {step}
                {detail && (
                  <span style={{ fontWeight: 400, fontSize: 20, color: MUTED, marginLeft: 14 }}>
                    {detail}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div style={{ ...label, color: MUTED }}>Left aside, for now</div>
        <div style={{ background: '#F3F3F3', padding: '12px 32px', marginTop: 14 }}>
          {ASIDE.map(([item, detail]) => (
            <div key={item} style={{ padding: '18px 0', color: MUTED }}>
              <div style={{ fontSize: 26 }}>· {item}</div>
              {detail && (
                <div style={{ fontSize: 20, marginTop: 6, paddingLeft: 22 }}>{detail}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </Canvas>
);

const SOURCES = ['Pages', 'Logo', 'Texts', 'Photos'];

const Reads: Page = () => (
  <Canvas bg={SAND}>
    <Title size={48}>What the agent reads from the source</Title>
    <div
      style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, marginTop: 120 }}
    >
      {SOURCES.map((s) => (
        <div
          key={s}
          style={{
            background: PAPER,
            height: 280,
            display: 'grid',
            placeItems: 'center',
            fontFamily: DISPLAY,
            fontWeight: 900,
            fontSize: 48,
            textTransform: 'uppercase',
          }}
        >
          {s}
        </div>
      ))}
    </div>
    <div style={{ fontSize: 36, fontWeight: 700, marginTop: 80 }}>
      The merchant's own shop: reused as is.
    </div>
  </Canvas>
);

const Loop = ({ question, steps, bg }: { question: string; steps: string[]; bg: string }) => (
  <div style={{ background: bg, padding: '44px 52px', height: 430, boxSizing: 'border-box' }}>
    <div style={{ ...label, fontSize: 34 }}>↻ {question}</div>
    {steps.map((s, i) => (
      <div key={s} style={{ display: 'flex', gap: 22, fontSize: 30, marginTop: 34 }}>
        <span style={{ fontFamily: DISPLAY, fontWeight: 900 }}>{i + 1}</span>
        <span>{s}</span>
      </div>
    ))}
  </div>
);

const SelfCheck: Page = () => (
  <Canvas bg={PAPER}>
    <Title size={48}>Then it checks its own work</Title>
    <Subtitle>Two loops: content against the source, form against pro shops</Subtitle>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 64 }}>
      <Loop
        question="Like their shop?"
        bg={BLUE}
        steps={[
          'Screenshots: home, category, product',
          'Compare with the source site',
          'Fix texts & images',
        ]}
      />
      <Loop
        question="Looks professional?"
        bg={LAVENDER}
        steps={[
          'Measure titles, spacing, corners',
          'Compare with pro shops',
          'Adjust, then measure again',
        ]}
      />
    </div>
    <div style={{ ...label, fontSize: 26, marginTop: 44 }}>
      Max 2 rounds each: it stops, even if not perfect.
    </div>
  </Canvas>
);

const OnlyLook: Page = () => (
  <Canvas bg={LAVENDER}>
    <Title size={48}>It only changes the look</Title>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginTop: 70 }}>
      <div
        style={{ background: PAPER, padding: '44px 52px', height: 470, boxSizing: 'border-box' }}
      >
        <div style={{ ...label, fontSize: 32 }}>Changes</div>
        <Check ok>Theme &amp; colours</Check>
        <Check ok>Logo</Check>
        <Check ok>Home page content</Check>
        <Check ok>New content pages</Check>
      </div>
      <div
        style={{
          background: INK,
          color: PAPER,
          padding: '44px 52px',
          height: 470,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ ...label, fontSize: 32, color: BLUE }}>Kept as imported</div>
        {['Products & categories', 'Menus & languages', 'Existing pages'].map((s) => (
          <div key={s} style={{ fontSize: 32, marginTop: 28 }}>
            — {s}
          </div>
        ))}
      </div>
    </div>
    <div style={{ fontSize: 30, fontWeight: 700, marginTop: 48, lineHeight: 1.4 }}>
      The catalogue comes from the import. If the design fails, the previous theme comes back.
    </div>
  </Canvas>
);

const LIMITS: [string, string?][] = [
  ['Runs on the Docker host only', 'Hosted execution: DATA-4212'],
  ['Full n8n run not yet validated'],
  ["Bot-protected sites can't be read"],
];

const Limits: Page = () => (
  <Canvas bg={PAPER}>
    <Title size={48}>Known limits of this version</Title>
    <div style={{ marginTop: 90 }}>
      {LIMITS.map(([limit, detail], i) => (
        <div
          key={limit}
          style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr',
            alignItems: 'center',
            padding: '36px 0',
            borderBottom: `1px solid ${LINE}`,
          }}
        >
          <span style={{ fontFamily: DISPLAY, fontWeight: 900, fontSize: 72, color: BLUE }}>
            {i + 1}
          </span>
          <span style={{ fontSize: 40, fontWeight: 700 }}>
            {limit}
            {detail && (
              <span style={{ marginLeft: 24, verticalAlign: 'middle' }}>
                <Tag bg={ORANGE}>{detail}</Tag>
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  </Canvas>
);

const Questions: Page = () => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background: INK,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Title size={168} color={BLUE}>
      Questions?
    </Title>
    <div
      style={{
        position: 'absolute',
        bottom: 150,
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: 28,
        letterSpacing: '0.02em',
        color: BLUE,
      }}
    >
      PRESTASHOP
    </div>
  </div>
);

export const notes: (string | undefined)[] = [
  `Leave at 0:20

Now, the migration agent. Today, I focus on ONE part: the DESIGN.
When we move a shop to PrestaShop 9, the new shop must LOOK like the old one.`,
  `Leave at 0:50

When we started, we had TWO tools for the same job.
On the left, the migration pipeline, in n8n. It built a BASIC design: one CSS file on top of Classic.
On the right, our SKILLS: scripts that set up a PrestaShop shop. In a separate repo, run by hand.
And NO link between them. So we merge the skills INTO the pipeline.`,
  `Leave at 1:40 · Switch to the dashboard

Before I explain, let's start a REAL run. On a shop I already TESTED, so it runs while I talk.
[ACTION] Paste the tested shop URL, click Start, show the progress bar starting.
It's started. You can follow it LIVE, in the top-left corner.
And now, YOUR turn: give me a website. ANY online shop.
[ACTION] Start a second run with their URL.
We'll look at the result at the END of all the demos.
[IF NEEDED] If the site is protected: This one blocks bots, so we can't read it. Another one?`,
  `Leave at 2:05 · Leave 2 seconds for them to read

First, we compared the two tools, step by step.
FIVE steps are DUPLICATES: both tools do the same job.
Four are complementary. And some are GAPS: the skills do it, the pipeline doesn't.
Look at this highlighted line: GENERATE the design. That's our topic today.

Don't miss: Don't read the table: point at the highlighted line.`,
  `Leave at 2:40

A fair question: why a SKILL, and not just a script?
A skill has TWO parts: rules that the agent READS, and scripts that DO the work.
The agent DECIDES what to do. The scripts do it, and report a STATUS.
One rule, for example: NEVER clear the cache. In one of our tests, it broke the back office.

Don't miss: Example: never clear the cache — it broke the back office in a test.`,
  `Leave at 3:10

For each duplicate, we ran a DUEL: pipeline versus skill.
Duel one, installing PrestaShop: a DRAW.
Duel two, the DESIGN: the skill WINS.
The other duels are not run yet. We chose to FOCUS on the design first.

Don't miss: Duel 1 is a draw, not a loss.`,
  `Leave at 3:45

Here is duel two, tested on a REAL Shopify shop.
The pipeline kept DEFAULT colours, and a demo home page with fake text.
The skill used the REAL brand colours, and built a REAL home page.
To be fair, the pipeline was better at picking up the fonts and the logo.

Don't miss: Be fair: the POC was better at fonts and logo.`,
  `Leave at 4:10

So where do the skills plug in? Here, at the DESIGN step.
n8n does everything before: extract, plan, import.
Then it hands over the design step, and it WAITS. When we're done, we call n8n back.`,
  `Leave at 4:50 · Point at the left column, then the right one

Here is what the design run does.
It captures the source site. It picks the best presets, and shows previews in the brand colours.
Step FOUR, in yellow: the merchant picks a design.
Then it writes the content, deploys the child theme, and polishes the result.
On the right: what we left aside, for now.
Polish WITH the merchant, their own images, legal pages, and a final check.

Don't miss: Left aside: polish with the merchant, own images, legal pages, final check.`,
  `Leave at 5:10

What does the agent read? Pages, the logo, the texts, and the photos.
It's the merchant's OWN shop, so we reuse their words and photos as they are.`,
  `Leave at 5:45

Then it CHECKS its own work, in TWO loops.
The first loop asks: does it look like THEIR shop? It takes screenshots, compares them with the source site, and fixes texts and images.
The second loop asks: does it look PROFESSIONAL? It measures the titles, the spacing and the corners, compares them with real pro shops, and adjusts.
Each loop runs TWO rounds, maximum. It stops, even if it's not perfect. Without a limit, it could run forever.
[IF NEEDED] Optional: Haiku, a small model, makes the first sketch. Opus, a bigger one, builds the final design.

Don't miss: Why a limit: without it, the agent could loop forever — time and cost.`,
  `Leave at 6:15

An important point for a migration: the design run only changes the LOOK.
It changes the theme, the colours, the logo, the home page, and adds NEW pages.
Products, categories and menus come from the IMPORT, before this step. The design run keeps them AS THEY ARE.
And if it fails, the previous theme comes BACK. The shop keeps working.

Don't miss: Say it: the import brings the catalogue, the design run doesn't touch it.`,
  `Leave at 6:45

Now, the limits of this version.
One: it runs only on the Docker host, not in the cloud yet. That's DATA-4212.
Two: we tested the design run for REAL yesterday, but not yet the full run with n8n.
And last: if a site blocks bots, we can't read it.`,
  `Leave at 8:00 · Conclusion, word for word

To sum up. The migration agent now BUILDS a real theme, from one single place.
I'd love your help: send us real shops to test the migration.
Any questions?`,
];

export const meta: SlideMeta = {
  title: 'Migration agent · The design part',
  theme: 'prestashop',
  createdAt: '2026-10-04T16:27:55.451Z',
};

export default [
  Cover,
  TwoTools,
  LiveDemo,
  Mapping,
  WhySkill,
  Duels,
  ThemeDuel,
  PlugIn,
  DesignRun,
  Reads,
  SelfCheck,
  OnlyLook,
  Limits,
  Questions,
] satisfies Page[];
