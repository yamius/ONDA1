import { Monitor, Sun, Moon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme, type ThemeMode } from '../theme/ThemeProvider';

const OPTIONS: { mode: ThemeMode; labelKey: string; Icon: typeof Sun }[] = [
  { mode: 'system', labelKey: 'theme.system', Icon: Monitor },
  { mode: 'light', labelKey: 'theme.light', Icon: Sun },
  { mode: 'dark', labelKey: 'theme.dark', Icon: Moon },
];

/** Сегментированный переключатель темы: Система / Светлая / Тёмная. */
export default function ThemeToggle() {
  const { t } = useTranslation();
  const { mode, setMode, resolved } = useTheme();
  const isLight = resolved === 'light';

  return (
    <div
      role="radiogroup"
      aria-label={t('theme.title')}
      className="grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1"
    >
      {OPTIONS.map(({ mode: m, labelKey, Icon }) => {
        const active = mode === m;
        return (
          <button
            key={m}
            role="radio"
            aria-checked={active}
            onClick={() => setMode(m)}
            className={`flex flex-col items-center gap-1 rounded-lg py-2 px-1 text-xs font-medium transition-colors border ${
              active
                ? isLight
                  ? 'bg-indigo-500/15 border-indigo-400/40 text-slate-800'
                  : 'bg-accent border-transparent text-white shadow'
                : 'border-transparent text-text-secondary hover:bg-border/10'
            }`}
          >
            <Icon className="w-4 h-4" />
            {t(labelKey)}
          </button>
        );
      })}
    </div>
  );
}
