import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Section 6 wrapper: the existing lore block ("Уровень 1 Тело" / "Часть 1
 * Я есть" / quote / everything below) is moved inside this accordion so
 * the home screen above the fold reads as a product (biometrics +
 * practices + progress) rather than a poem.
 *
 * Behaviour:
 * - Always starts collapsed on every screen mount — the goal is that a
 *   biohacker's first impression isn't dominated by the narrative. We
 *   do NOT persist the open/closed state.
 * - Inline expansion (the content grows the page, no separate modal).
 * - Chevron rotates 180° when open; no external icon library.
 * - Title and aria-label come from i18n (`home.journey.title`). The
 *   content inside (children) is the existing lore JSX as-is — we don't
 *   re-translate or restructure it here.
 */

interface Props {
  children: ReactNode;
  /** Override the i18n title if needed. */
  titleKey?: string;
  className?: string;
}

export function JourneyAccordion({
  children,
  titleKey = 'home.journey.title',
  className,
}: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const title = t(titleKey);
  const headerId = 'onda-journey-accordion-header';
  const panelId = 'onda-journey-accordion-panel';

  return (
    <section
      className={className}
      style={{ width: '100%' }}
      data-testid="journey-accordion"
    >
      <button
        type="button"
        id={headerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          border: 'none',
          borderRadius: 14,
          background: 'rgba(124, 124, 240, 0.10)',
          color: 'inherit',
          fontSize: 15,
          fontWeight: 500,
          cursor: 'pointer',
          textAlign: 'left',
        }}
        data-testid="journey-accordion-toggle"
      >
        <span>{title}</span>
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            transition: 'transform 180ms ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            fontSize: 12,
            opacity: 0.7,
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={headerId}
          style={{ paddingTop: 16 }}
          data-testid="journey-accordion-content"
        >
          {children}
        </div>
      )}
    </section>
  );
}

export default JourneyAccordion;
