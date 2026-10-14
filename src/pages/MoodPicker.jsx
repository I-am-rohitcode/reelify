import { useCallback, useEffect, useRef, useState } from "react";
import { discoverMovies } from "../api/tmdb";
import { useBollywood } from "../context/BollywoodContext";
import MovieCard from "../components/MovieCard";
import SEO from "../components/SEO";
import { PRODUCTION_URL } from "../utils/slug";

// Mood -> TMDB genre IDs
const MOODS = [
  { id: "laugh", label: "😂 Need a laugh", genres: "35", extra: {} },
  {
    id: "cry",
    label: "😭 Feel something",
    genres: "18,10749",
    extra: { "vote_average.gte": 7 },
  },
  {
    id: "thrill",
    label: "😰 Edge of my seat",
    genres: "53,9648",
    extra: {},
  },
  { id: "action", label: "💥 Adrenaline", genres: "28,12", extra: {} },
  {
    id: "mind",
    label: "🤯 Mind-bending",
    genres: "878,9648",
    extra: { "vote_average.gte": 7 },
  },
  { id: "family", label: "🧸 Family night", genres: "16,10751", extra: {} },
  { id: "scare", label: "👻 Scare me", genres: "27", extra: {} },
  { id: "true", label: "📚 Based on real life", genres: "36,99", extra: {} },
];

const TIMES = [
  { label: "Any length", v: null },
  { label: "Under 100 min", v: 100 },
  { label: "Under 2 hours", v: 120 },
  { label: "Under 2.5 hours", v: 150 },
];

const chip = (on) =>
  `rounded-full px-4 py-2 text-sm font-medium border transition focus-ring ${
    on
      ? "bg-white text-black border-white"
      : "bg-white/5 text-gray-200 border-white/15 hover:bg-white/10"
  }`;

// Show a compact page range around the active page.
function getPageNumbers(currentPage, totalPages) {
  const pages = new Set([1, totalPages]);

  for (
    let page = Math.max(1, currentPage - 2);
    page <= Math.min(totalPages, currentPage + 2);
    page++
  ) {
    pages.add(page);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const output = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      output.push("ellipsis-" + page);
    }
    output.push(page);
  });

  return output;
}

export default function MoodPicker() {
  const { bollywoodOnly } = useBollywood();

  const [mood, setMood] = useState(null);
  const [time, setTime] = useState(null);
  const [results, setResults] = useState([]);
  const [pick, setPick] = useState(null);
  const [state, setState] = useState("idle"); // idle | loading | error | done
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const reqId = useRef(0);

  const run = useCallback(
    async (requestedPage = 1) => {
      if (!mood) return;

      const requestId = ++reqId.current;
      setState("loading");

      try {
        const res = await discoverMovies({
          with_genres: mood.genres.replace(/,/g, "|"),
          page: requestedPage,
          ...mood.extra,
          ...(time ? { "with_runtime.lte": time } : {}),
          ...(bollywoodOnly
            ? { with_original_language: "hi", region: "IN" }
            : {}),
        });

        if (requestId !== reqId.current) return;

        const data = res.data;
        const list = (data.results || []).filter((movie) => movie.poster_path);
        const maxPages = Math.max(1, Math.min(data.total_pages || 1, 500));
        const safePage = Math.min(requestedPage, maxPages);

        setPage(safePage);
        setTotalPages(maxPages);
        setResults(list);
        setPick(
          list.length ? list[Math.floor(Math.random() * list.length)] : null,
        );
        setState("done");
      } catch (error) {
        if (requestId === reqId.current) {
          console.error("Failed to discover movies:", error);
          setState("error");
        }
      }
    },
    [mood, time, bollywoodOnly],
  );

  useEffect(() => {
    if (!mood) {
      setState("idle");
      setResults([]);
      setPick(null);
      setPage(1);
      setTotalPages(1);
      return;
    }

    setPage(1);
    run(1);

    return () => {
      // Ignore any response from an earlier filter or page request.
      reqId.current++;
    };
  }, [mood, time, bollywoodOnly, run]);

  const goToPage = (nextPage) => {
    if (
      state === "loading" ||
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === page
    ) {
      return;
    }

    run(nextPage);
  };

  // const reroll = () => {
  //   if (results.length < 2) return;

  //   const alternatives = results.filter((movie) => movie.id !== pick?.id);
  //   if (alternatives.length) {
  //     setPick(alternatives[Math.floor(Math.random() * alternatives.length)]);
  //   }
  // };

  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <main
      id="content"
      className="min-h-screen bg-[#050505] px-4 pt-28 pb-28 text-white md:px-12 md:pb-16 lg:px-16"
    >
      <SEO
        title="Movie Night Mood Picker – Find a Movie for Your Mood | Reelify"
        description="Tell Reelify your mood and how much time you have, and get a movie pick instantly. No more endless scrolling."
        canonical={`${PRODUCTION_URL}/mood`}
      />

      <header>
        <h1 className="text-3xl font-bold md:text-5xl">
          What's the vibe tonight?
        </h1>
        <p className="mt-2 max-w-xl text-gray-400">
          Pick a mood and how long you've got. We'll choose for you.
        </p>
      </header>

      <section aria-label="Choose a mood" className="mt-6 flex flex-wrap gap-2">
        {MOODS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={mood?.id === item.id}
            onClick={() => setMood(item)}
            className={chip(mood?.id === item.id)}
          >
            {item.label}
          </button>
        ))}
      </section>

      <section
        aria-label="Choose a movie length"
        className="mt-4 flex flex-wrap gap-2"
      >
        {TIMES.map((item) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={time === item.v}
            onClick={() => setTime(item.v)}
            className={chip(time === item.v)}
          >
            {item.label}
          </button>
        ))}
      </section>

      <div aria-live="polite" aria-busy={state === "loading"} className="mt-8">
        {state === "idle" && (
          <p className="text-gray-500">Select a mood to get started.</p>
        )}

        {state === "loading" && (
          <p className="animate-pulse text-gray-300">Finding your movies…</p>
        )}

        {state === "error" && (
          <div className="text-red-300">
            <p>Couldn't reach TMDB.</p>
            <button
              type="button"
              onClick={() => run(page)}
              className="mt-2 underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {state === "done" && !pick && (
          <p className="text-gray-300">
            No matches found. Try another mood or runtime.
          </p>
        )}

        {state === "done" && pick && (
          <>
            <div className="grid max-w-3xl items-start gap-6 md:grid-cols-[220px_1fr]">
              <div className="w-44 md:w-full">
                <MovieCard movie={pick} />
              </div>

              <div>
                <p className="text-sm font-semibold text-neon-lime">
                  Tonight's pick
                </p>
                <h2 className="mt-1 text-2xl font-bold md:text-3xl">
                  {pick.title}
                </h2>
                <p className="mt-3 line-clamp-5 text-gray-300">
                  {pick.overview || "No description available."}
                </p>

                {/* <button
                  type="button"
                  onClick={reroll}
                  disabled={results.length < 2}
                  className="mt-5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 focus-ring"
                >
                  🎲 Pick another
                </button> */}
              </div>
            </div>

            {/* Numbered pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Movie results pagination"
                className="mt-10 flex flex-wrap items-center justify-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1 || state === "loading"}
                  className="rounded-lg border border-white/15 px-3 py-2 text-sm text-gray-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {pageNumbers.map((item) =>
                  typeof item === "string" ? (
                    <span
                      key={item}
                      aria-hidden="true"
                      className="px-1 text-gray-500"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => goToPage(item)}
                      disabled={state === "loading"}
                      aria-label={`Go to page ${item}`}
                      aria-current={page === item ? "page" : undefined}
                      className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                        page === item
                          ? "border-white bg-white text-black"
                          : "border-white/15 bg-white/5 text-gray-200 hover:bg-white/10"
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages || state === "loading"}
                  className="rounded-lg border border-white/15 px-3 py-2 text-sm text-gray-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}

            <p className="mt-3 text-center text-xs text-gray-500">
              Page {page} of {totalPages}
            </p>
          </>
        )}
      </div>
    </main>
  );
}
