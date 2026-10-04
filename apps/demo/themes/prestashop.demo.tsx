import { type Page, useSlidePageNumber } from '@open-slide/core';
import type { ReactNode } from 'react';

const DISPLAY = "'Arial Black', 'Archivo Black', Arial, sans-serif";
const BODY = 'Arial, Helvetica, sans-serif';

const Header = ({
  label = 'TITLE — MONTH YEAR',
  color = '#000000',
}: {
  label?: string;
  color?: string;
}) => (
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

const Footer = ({ color = '#000000' }: { color?: string }) => {
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
  color = '#000000',
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
  color = '#000000',
}: {
  children: ReactNode;
  size?: number;
  color?: string;
}) => (
  <p style={{ fontFamily: BODY, fontSize: size, lineHeight: 1.3, margin: '12px 0 0', color }}>
    {children}
  </p>
);

const KeyFigure = ({
  value,
  label,
  children,
}: {
  value: string;
  label: string;
  children: ReactNode;
}) => (
  <div style={{ fontFamily: BODY, color: '#FFFFFF' }}>
    <div
      style={{
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: 168,
        lineHeight: 1,
        color: '#A4DBE8',
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 28, fontWeight: 700, color: '#A4DBE8', marginTop: 20 }}>{label}</div>
    <div style={{ fontSize: 26, lineHeight: 1.35, marginTop: 6 }}>{children}</div>
  </div>
);

const canvas = (background: string) =>
  ({
    width: '100%',
    height: '100%',
    position: 'relative',
    background,
    padding: '0 80px',
    boxSizing: 'border-box',
  }) as const;

const Cover: Page = () => (
  <div
    style={{
      ...canvas('#A4DBE8'),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <Header />
    <Title>
      Title of the
      <br />
      presentation
    </Title>
    <Subtitle size={48}>Subtitle</Subtitle>
    <Footer />
  </div>
);

const Chapter: Page = () => (
  <div
    style={{
      ...canvas('#BDE9C9'),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <Header />
    <Title size={104}>
      1.
      <br />
      Title of
      <br />
      the chapter
    </Title>
    <Footer />
  </div>
);

const Content: Page = () => (
  <div style={{ ...canvas('#FFFFFF'), paddingTop: 150 }}>
    <Header />
    <Title size={48}>Title of the slide</Title>
    <Subtitle>Subtitle</Subtitle>
    <div style={{ fontFamily: BODY, maxWidth: 1000, marginTop: 90, color: '#000000' }}>
      <p style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.3, margin: 0 }}>
        Level 1 — the one sentence the audience should remember from this slide.
      </p>
      <p style={{ fontSize: 28, lineHeight: 1.4, margin: '28px 0 0' }}>
        Level 2 — supporting context that explains why it matters for merchants.
      </p>
      <ul style={{ fontSize: 22, lineHeight: 1.5, margin: '28px 0 0', paddingLeft: 28 }}>
        <li>Level 3 — a short supporting detail</li>
        <li>Another detail, kept to one line where possible</li>
      </ul>
    </div>
    <Footer />
  </div>
);

const KeyFigures: Page = () => (
  <div style={{ ...canvas('#000000'), paddingTop: 150 }}>
    <Header color="#FFFFFF" />
    <Title size={48} color="#FFFFFF">
      Key figures
    </Title>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 80,
        marginTop: 140,
      }}
    >
      <KeyFigure value="00%" label="Label of the figure">
        One line explaining where the number comes from.
      </KeyFigure>
      <KeyFigure value="00%" label="Label of the figure">
        One line explaining where the number comes from.
      </KeyFigure>
      <KeyFigure value="00%" label="Label of the figure">
        One line explaining where the number comes from.
      </KeyFigure>
    </div>
    <Footer color="#FFFFFF" />
  </div>
);

const Closer: Page = () => (
  <div
    style={{
      ...canvas('#000000'),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Title size={168} color="#A4DBE8">
      Thank you!
    </Title>
    <div
      style={{
        position: 'absolute',
        bottom: 150,
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: 28,
        letterSpacing: '0.02em',
        color: '#A4DBE8',
      }}
    >
      PRESTASHOP
    </div>
  </div>
);

export default [Cover, Chapter, Content, KeyFigures, Closer];
