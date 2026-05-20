import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/** Режим, выбранный пользователем. 'system' — следовать настройке iOS. */
export type ThemeMode = 'system' | 'light' | 'dark';
/** Фактическая тема после разрешения 'system'. */
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'onda_theme_mode';

interface ThemeContextValue {
  /** Выбор пользователя: system | light | dark. */
  mode: ThemeMode;
  /** Что реально отрисовано: light | dark. */
  resolved: ResolvedTheme;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredMode(): ThemeMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    /* localStorage недоступен — падать в 'system' */
  }
  return 'system';
}

function systemTheme(): ResolvedTheme {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark';
}

/**
 * Синхронизирует нативный статус-бар Capacitor с темой (best-effort).
 * Плагин @capacitor/status-bar в проект пока не добавлен — импорт скрыт
 * от бандлера (@vite-ignore), при отсутствии плагина просто игнорируется.
 * Когда плагин установят, синхронизация заработает автоматически.
 */
function syncStatusBar(resolved: ResolvedTheme): void {
  const pkg = '@capacitor/status-bar';
  import(/* @vite-ignore */ pkg)
    .then((m: any) => {
      // Style.Dark = светлый текст (для тёмного фона), Style.Light = тёмный текст.
      const style = resolved === 'dark' ? m.Style?.Dark : m.Style?.Light;
      m.StatusBar?.setStyle({ style }).catch(() => {});
    })
    .catch(() => {
      /* плагин не установлен / не нативная среда — игнорируем */
    });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);
  const [resolved, setResolved] = useState<ResolvedTheme>(() =>
    readStoredMode() === 'system' ? systemTheme() : (readStoredMode() as ResolvedTheme),
  );

  // Пересчёт фактической темы при смене режима или системной настройки.
  useEffect(() => {
    const apply = () => setResolved(mode === 'system' ? systemTheme() : mode);
    apply();
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [mode]);

  // Применяем тему к <html> и статус-бару.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolved);
    syncStatusBar(resolved);
  }, [resolved]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* не критично */
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolved, setMode }),
    [mode, resolved, setMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Доступ к теме. Вне ThemeProvider бросает понятную ошибку. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}
