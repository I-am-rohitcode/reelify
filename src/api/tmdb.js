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

/* ================= COMMON FILTER ================= */

const bollywoodParams = {
  with_original_language: "hi",
  region: "IN",
};

/* ================= HOME LISTS ================= */

export const getTrendingMovies = (bollywoodOnly = false) =>
  tmdb.get("/trending/movie/week", {
    params: bollywoodOnly ? bollywoodParams : {},
  });

export const getPopularMovies = (bollywoodOnly = false) =>
  tmdb.get("/movie/popular", {
    params: bollywoodOnly ? bollywoodParams : {},
  });

export const getTopRatedMovies = (bollywoodOnly = false) =>
  tmdb.get("/movie/top_rated", {
    params: bollywoodOnly ? bollywoodParams : {},
  });

/* ================= UPCOMING & NOW PLAYING ================= */

export const getUpcomingMovies = (bollywoodOnly = false) =>
  tmdb.get("/movie/upcoming", {
    params: bollywoodOnly ? bollywoodParams : {},
  });

export const getNowPlayingMovies = (bollywoodOnly = false) =>
  tmdb.get("/movie/now_playing", {
    params: bollywoodOnly ? bollywoodParams : {},
  });

/* ================= SEARCH ================= */

export const searchMovies = (query, bollywoodOnly = false) =>
  tmdb.get("/search/movie", {
    params: {
      query,
      ...(bollywoodOnly ? bollywoodParams : {}),
    },
  });

/* ================= MOVIE DETAILS ================= */

/* Details itself cannot be filtered, it’s a single movie */
export const getMovieDetails = (id) =>
  tmdb.get(`/movie/${id}`, {
    params: {
      language: "en-IN",
    },
  });

export const getMovieCredits = (id) => tmdb.get(`/movie/${id}/credits`);

export const getMovieVideos = (id) => tmdb.get(`/movie/${id}/videos`);

/* ================= SIMILAR MOVIES ================= */

/* IMPORTANT: Similar movies MUST be filtered manually */
export const getSimilarMovies = (id, bollywoodOnly = false) =>
  tmdb.get(`/movie/${id}/similar`, {
    params: bollywoodOnly ? bollywoodParams : {},
  });

/* ================= ACTOR / PERSON ================= */

export const getPersonDetails = (id) =>
  tmdb.get(`/person/${id}`, {
    params: { language: "en-IN" },
  });

export const getPersonMovies = (id) => tmdb.get(`/person/${id}/movie_credits`);
