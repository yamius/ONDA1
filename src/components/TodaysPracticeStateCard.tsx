import { useTranslation } from 'react-i18next';

/**
 * The two non-recommendation states of the "Today's Practice" hero card:
 *
 *   (A) `empty`      — Apple Watch not connected. Points to the full
 *                      practice list below.
 *   (B) `collecting` — Watch just connected, 30 s personalisation stub.
 *
 * State (C) `recommended` is intentionally NOT handled here — the parent
 * renders its existing practice-card component with the picked id from
 * `useTodaysPractice`. Keeping (C) in the parent means we don't have to
 * fork or duplicate the existing card design.
 *
 * Visual language is kept close to the existing practice cards (rounded
 * soft surface, indigo accent) but no shared CSS module is required —
 * this card is intentionally simple so the visual contract stays loose.
 */

interface Props {
  mode: 'empty' | 'collecting';
  /** Anchor target for the "or start with any practice below" CTA. */
  onScrollToPractices?: () => void;
  className?: string;
}

export function TodaysPracticeStateCard({ mode, onScrollToPractices, className }: Props) {
  const { t } = useTranslation();

  return (
    <div
      className={className}
      style={{
        width: '100%',
        padding: '20px 18px',
        borderRadius: 20,
        background: 'rgba(124, 124, 240, 0.10)',
        border: '1px solid rgba(124, 124, 240, 0.18)',
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
      data-testid={`todays-practice-${mode}`}
    >
      <div
        style={{
          fontSize: 12,
          letterSpacing: 1,
          textTransform: 'uppercase',
          opacity: 0.55,
          marginBottom: 8,
        }}
      >
        {t('home.todays_practice.section_title')}
      </div>

      <div style={{ fontSize: 15, lineHeight: 1.4, marginBottom: mode === 'empty' ? 14 : 0 }}>
        {mode === 'empty'
          ? t('home.todays_practice.empty_body')
          : t('home.todays_practice.collecting_body')}
      </div>

      {mode === 'empty' && (
        <button
          type="button"
          onClick={onScrollToPractices}
          style={{
            background: 'rgba(124, 124, 240, 0.18)',
            color: 'inherit',
            border: 'none',
            borderRadius: 12,
            padding: '10px 18px',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
          }}
          data-testid="todays-practice-scroll-to-list"
        >
          {t('home.todays_practice.empty_cta')}
        </button>
      )}
    </div>
  );
}

export default TodaysPracticeStateCard;
