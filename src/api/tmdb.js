import axios from "axios";

/* ================= CONFIG ================= */

export const API_KEY = "f9288a8084a1fca84bbc18c781be67e2";
export const BASE_URL = "https://api.themoviedb.org/3";

export const IMG_URL = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_URL = "https://image.tmdb.org/t/p/original";

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

/* ================= HELPERS ================= */

const getTodayDate = () => new Date().toISOString().split("T")[0];

const getOneMonthAgoDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().split("T")[0];
};

const getFutureDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 3);
  return date.toISOString().split("T")[0];
};

/* ================= HOME LISTS ================= */

export const getTrendingMovies = (bollywoodOnly = false) => {
  if (bollywoodOnly) {
    return tmdb.get("/discover/movie", {
      params: {
        with_original_language: "hi",
        sort_by: "popularity.desc",
        region: "IN",
      },
    });
  }
  return tmdb.get("/trending/movie/week");
};

export const getPopularMovies = (bollywoodOnly = false) => {
  if (bollywoodOnly) {
    return tmdb.get("/discover/movie", {
      params: {
        with_original_language: "hi",
        sort_by: "popularity.desc",
        region: "IN",
      },
    });
  }
  return tmdb.get("/movie/popular");
};

export const getTopRatedMovies = (bollywoodOnly = false) => {
  if (bollywoodOnly) {
    return tmdb.get("/discover/movie", {
      params: {
        with_original_language: "hi",
        sort_by: "vote_average.desc",
        "vote_count.gte": 100,
        region: "IN",
      },
    });
  }
  return tmdb.get("/movie/top_rated");
};

/* ================= UPCOMING & NOW PLAYING ================= */

export const getUpcomingMovies = (bollywoodOnly = false) => {
  if (bollywoodOnly) {
    return tmdb.get("/discover/movie", {
      params: {
        with_original_language: "hi",
        region: "IN",
        "primary_release_date.gte": getTodayDate(),
        "primary_release_date.lte": getFutureDate(),
        sort_by: "popularity.desc",
      },
    });
  }
  return tmdb.get("/movie/upcoming", { params: { region: "IN" } });
};

export const getNowPlayingMovies = (bollywoodOnly = false) => {
  if (bollywoodOnly) {
    return tmdb.get("/discover/movie", {
      params: {
        with_original_language: "hi",
        region: "IN",
        "primary_release_date.gte": getOneMonthAgoDate(),
        "primary_release_date.lte": getTodayDate(),
        sort_by: "popularity.desc",
      },
    });
  }
  return tmdb.get("/movie/now_playing", { params: { region: "IN" } });
};

/* ================= SEARCH ================= */

export const searchMovies = (query, bollywoodOnly = false) =>
  tmdb.get("/search/movie", {
    params: {
      query,
      include_adult: false,
      ...(bollywoodOnly
        ? {
          // Search doesn't strictly support filtering by original language in the same way,
          // but we can try region. However, client-side filtering might be better for search results if strictly needed.
          // For now, let's trust the query + region hint.
          region: "IN",
          // with_original_language is NOT supported on /search/movie
        }
        : {}),
    },
  });

/* ================= MOVIE DETAILS ================= */

export const getMovieDetails = (id) =>
  tmdb.get(`/movie/${id}`, {
    params: {
      language: "en-IN",
    },
  });

export const getMovieCredits = (id) => tmdb.get(`/movie/${id}/credits`);

export const getMovieVideos = (id) => tmdb.get(`/movie/${id}/videos`);

/* ================= SIMILAR MOVIES ================= */

export const getSimilarMovies = (id, bollywoodOnly = false) => {
  // Similar movies endpoint does not support filtering by language directly
  // Returning standard similar movies.
  return tmdb.get(`/movie/${id}/similar`);
};

/* ================= ACTOR / PERSON ================= */

export const getPersonDetails = (id) =>
  tmdb.get(`/person/${id}`, {
    params: { language: "en-IN" },
  });

export const getPersonMovies = (id) => tmdb.get(`/person/${id}/movie_credits`);

/* ================= WEB SERIES (TV SHOWS) ================= */

export const getTrendingSeries = (bollywoodOnly = false) => {
  if (bollywoodOnly) {
    return tmdb.get("/discover/tv", {
      params: {
        with_original_language: "hi",
        sort_by: "popularity.desc",
        region: "IN", // useful for availability
      },
    });
  }
  return tmdb.get("/trending/tv/week");
};

export const getPopularSeries = (bollywoodOnly = false) => {
  if (bollywoodOnly) {
    return tmdb.get("/discover/tv", {
      params: {
        with_original_language: "hi",
        sort_by: "popularity.desc",
        region: "IN",
      },
    });
  }
  return tmdb.get("/tv/popular");
};

export const getTopRatedSeries = (bollywoodOnly = false) => {
  if (bollywoodOnly) {
    return tmdb.get("/discover/tv", {
      params: {
        with_original_language: "hi",
        sort_by: "vote_average.desc",
        "vote_count.gte": 50,
        region: "IN",
      },
    });
  }
  return tmdb.get("/tv/top_rated");
};

/* ================= TV SERIES DETAILS ================= */

export const getSeriesDetails = (id) =>
  tmdb.get(`/tv/${id}`, {
    params: { language: "en-IN" },
  });

export const getSeriesSeasons = (id) =>
  tmdb.get(`/tv/${id}`, {
    params: { language: "en-IN" },
  });

export const getSeasonEpisodes = (seriesId, seasonNumber) =>
  tmdb.get(`/tv/${seriesId}/season/${seasonNumber}`, {
    params: { language: "en-IN" },
  });

export const getSeriesProviders = (id) => tmdb.get(`/tv/${id}/watch/providers`);

/* ================= SEARCH (MOVIES + SERIES) ================= */

export const searchMulti = (query, bollywoodOnly = false) =>
  tmdb.get("/search/multi", {
    params: {
      query,
      include_adult: false,
      region: "IN",
      // search/multi does not support with_original_language
    },
  });

