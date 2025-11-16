export type DaySleep = {
  date: string;
  sleepStart: string;
  wakeTime: string;
  durationMin: number;
};

const KEY = "rhythm_days_v1";

function load(): DaySleep[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function save(days: DaySleep[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(days));
}

function hmToMin(x: string) {
  const [h, m] = x.split(":").map(Number);
  return h * 60 + m;
}

function stddev(arr: number[]) {
  if (!arr.length) return 0;
  const m = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((s, x) => s + (x - m) * (x - m), 0) / arr.length);
}

export const rhythmStore = {
  addDay(d: DaySleep) {
    const days = load().filter((x) => x.date !== d.date);
    days.push(d);
    days.sort((a, b) => a.date.localeCompare(b.date));
    save(days);
  },
  getLog(): DaySleep[] {
    return load();
  },
  reset() {
    save([]);
  },
  progress(): number {
    const days = load();
    if (!days.length) return 0;

    const tail = days.slice(-14);
    let best = 0;

    for (let i = 0; i < tail.length; i++) {
      const window = tail.slice(Math.max(0, i - 6), i + 1);
      const starts = window.map((d) => hmToMin(d.sleepStart));
      const wakes = window.map((d) => hmToMin(d.wakeTime));
      const durOK = window.every((d) => d.durationMin >= 360);

      const ok = stddev(starts) <= 30 && stddev(wakes) <= 30 && durOK;
      if (ok) {
        const cur = Math.min(window.length, 7);
        if (cur > best) best = cur;
      }
    }
    return Math.min(best, 7);
  }
};
