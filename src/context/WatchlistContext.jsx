/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const KEY = "reelify_watchlist_v1";
const WatchlistContext = createContext(null);

const load = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
};

// Keep only the fields we render, so storage stays small.
const slim = (m) => ({
  id: m.id,
  title: m.title,
  name: m.name,
  poster_path: m.poster_path,
  vote_average: m.vote_average,
  release_date: m.release_date,
  first_air_date: m.first_air_date,
  media_type: m.media_type || (m.first_air_date || m.name ? "tv" : "movie"),
});

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* storage full or blocked: keep working in memory */
    }
  }, [items]);

  const has = useCallback((m) => items.some((i) => i.id === m?.id && i.media_type === slim(m).media_type), [items]);

  const toggle = useCallback((m) => {
    const s = slim(m);
    setItems((prev) =>
      prev.some((i) => i.id === s.id && i.media_type === s.media_type)
        ? prev.filter((i) => !(i.id === s.id && i.media_type === s.media_type))
        : [s, ...prev],
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, has, toggle, clear }), [items, has, toggle, clear]);

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export const useWatchlist = () => useContext(WatchlistContext);
