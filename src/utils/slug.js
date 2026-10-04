/**
 * Slug & URL utilities for SEO-friendly URLs.
 * Supports patterns like /movie/inception-27205 and /series/breaking-bad-1396
 * while seamlessly extracting TMDB IDs and preserving backwards-compatibility with /movie/27205.
 */

export const createSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-alphanumeric chars except hyphen and space
    .replace(/[\s_-]+/g, "-") // collapse whitespace and underscores to single hyphen
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens
};

export const getMovieUrl = (movie) => {
  if (!movie) return "/";
  const id = movie.id;
  const title = movie.title || movie.name || "";
  const slug = createSlug(title);
  return slug ? `/movie/${slug}-${id}` : `/movie/${id}`;
};

export const getSeriesUrl = (series) => {
  if (!series) return "/";
  const id = series.id;
  const title = series.name || series.title || "";
  const slug = createSlug(title);
  return slug ? `/series/${slug}-${id}` : `/series/${id}`;
};

export const extractIdFromSlug = (param) => {
  if (!param) return "";
  // Check if string ends with -<digits> or is purely <digits>
  const match = String(param).match(/(?:^|-)(\d+)$/);
  return match ? match[1] : String(param);
};

export const PRODUCTION_URL = "https://reelify-eight.vercel.app";
