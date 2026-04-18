import { useEffect, useRef, useState, useCallback } from "react";
import { PRESETS, type Preset, type DatasetExample } from "./presets";

export type LabState = {
  presetId: string | null;
  taskDescription: string;
  examples: DatasetExample[];
  baselineOutput: string;
  tunedOutput: string;
  notes: string;
  customPrompt: string;
};

export const INITIAL_STATE: LabState = {
  presetId: null,
  taskDescription: "",
  examples: [],
  baselineOutput: "",
  tunedOutput: "",
  notes: "",
  customPrompt: "",
};

export const stateFromPreset = (preset: Preset): LabState => ({
  presetId: preset.id,
  taskDescription: preset.taskDescription,
  examples: preset.examples.map((e) => ({ ...e })),
  baselineOutput: preset.baselineOutput,
  tunedOutput: preset.tunedOutput,
  notes: "",
  customPrompt: "",
});

const STORAGE_KEY = "ftlab:state:v1";
const HISTORY_KEY = "ftlab:history:v1";
const RECENT_KEY = "ftlab:recent:v1";
const THEME_KEY = "ftlab:theme:v1";

type HistoryShape = { past: LabState[]; future: LabState[] };

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, val: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* ignore */
  }
}

export function useLabStore() {
  const [state, setStateInternal] = useState<LabState>(INITIAL_STATE);
  const [history, setHistory] = useState<HistoryShape>({ past: [], future: [] });
  const [recent, setRecent] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const skipHistoryRef = useRef(false);

  useEffect(() => {
    setStateInternal(loadJSON(STORAGE_KEY, INITIAL_STATE));
    setHistory(loadJSON(HISTORY_KEY, { past: [], future: [] }));
    setRecent(loadJSON(RECENT_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveJSON(STORAGE_KEY, state);
  }, [state, hydrated]);

  useEffect(() => {
    if (hydrated) saveJSON(HISTORY_KEY, history);
  }, [history, hydrated]);

  useEffect(() => {
    if (hydrated) saveJSON(RECENT_KEY, recent);
  }, [recent, hydrated]);

  const commit = useCallback((next: LabState) => {
    setHistory((h) => ({ past: [...h.past.slice(-49), state], future: [] }));
    setStateInternal(next);
  }, [state]);

  const setState = useCallback((next: LabState | ((s: LabState) => LabState)) => {
    setStateInternal((cur) => {
      const resolved = typeof next === "function" ? (next as (s: LabState) => LabState)(cur) : next;
      if (skipHistoryRef.current) {
        skipHistoryRef.current = false;
        return resolved;
      }
      setHistory((h) => ({ past: [...h.past.slice(-49), cur], future: [] }));
      return resolved;
    });
  }, []);

  const loadPreset = useCallback((presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    commit(stateFromPreset(preset));
    setRecent((r) => [presetId, ...r.filter((x) => x !== presetId)].slice(0, 6));
  }, [commit]);

  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.past.length === 0) return h;
      const prev = h.past[h.past.length - 1];
      setStateInternal((cur) => {
        skipHistoryRef.current = true;
        setHistory((h2) => ({ past: h2.past.slice(0, -1), future: [cur, ...h2.future].slice(0, 50) }));
        return prev;
      });
      return h;
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((h) => {
      if (h.future.length === 0) return h;
      const next = h.future[0];
      setStateInternal((cur) => {
        skipHistoryRef.current = true;
        setHistory((h2) => ({ past: [...h2.past, cur].slice(-50), future: h2.future.slice(1) }));
        return next;
      });
      return h;
    });
  }, []);

  const reset = useCallback(() => {
    commit(INITIAL_STATE);
  }, [commit]);

  return {
    state,
    setState,
    loadPreset,
    undo,
    redo,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    recent,
    hydrated,
  };
}

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(THEME_KEY)) as
      | "light"
      | "dark"
      | null;
    const initial = stored ?? "light";
    setTheme(initial);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme, hydrated]);

  const toggle = useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), []);

  return { theme, toggle, hydrated };
}
