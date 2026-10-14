import { BACKDROP_URL, IMG_URL } from "../api/tmdb";
import { PRODUCTION_URL, getMovieUrl, getSeriesUrl } from "./slug";

/**
 * Builds Schema.org Movie structured data.
 * Adheres strictly to TMDB data without fabricated values.
 */
export const buildMovieSchema = (movie, cast = [], trailerKey = null) => {
  if (!movie) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title || movie.name,
    url: `${PRODUCTION_URL}${getMovieUrl(movie)}`,
    description: movie.overview || undefined,
  };

  const images = [];
  if (movie.backdrop_path) images.push(`${BACKDROP_URL}${movie.backdrop_path}`);
  if (movie.poster_path) images.push(`${IMG_URL}${movie.poster_path}`);
  if (images.length > 0) schema.image = images;

  if (movie.release_date) {
    schema.datePublished = movie.release_date;
    schema.dateCreated = movie.release_date;
  }

  if (movie.genres && movie.genres.length > 0) {
    schema.genre = movie.genres.map((g) => g.name);
  }

  if (movie.runtime && movie.runtime > 0) {
    schema.duration = `PT${movie.runtime}M`;
  }

  if (movie.vote_count && movie.vote_count > 0 && movie.vote_average) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(movie.vote_average.toFixed(1)),
      bestRating: 10,
      worstRating: 1,
      ratingCount: movie.vote_count,
    };
  }

  if (cast && cast.length > 0) {
    schema.actor = cast.slice(0, 8).map((actor) => ({
      "@type": "Person",
      name: actor.name,
      url: `${PRODUCTION_URL}/actor/${actor.id}`,
    }));
  }

  if (trailerKey) {
    schema.trailer = {
      "@type": "VideoObject",
      name: `${movie.title} Official Trailer`,
      description: `Official trailer for ${movie.title}`,
      embedUrl: `https://www.youtube.com/embed/${trailerKey}`,
      thumbnailUrl: `https://img.youtube.com/vi/${trailerKey}/hqdefault.jpg`,
      uploadDate: movie.release_date || undefined,
    };
  }

  return schema;
};

/**
 * Builds Schema.org TVSeries structured data.
 */
export const buildSeriesSchema = (series) => {
  if (!series) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: series.name,
    url: `${PRODUCTION_URL}${getSeriesUrl(series)}`,
    description: series.overview || undefined,
  };

  const images = [];
  if (series.backdrop_path) images.push(`${BACKDROP_URL}${series.backdrop_path}`);
  if (series.poster_path) images.push(`${IMG_URL}${series.poster_path}`);
  if (images.length > 0) schema.image = images;

  if (series.first_air_date) {
    schema.startDate = series.first_air_date;
  }

  if (series.number_of_seasons) {
    schema.numberOfSeasons = series.number_of_seasons;
  }

  if (series.number_of_episodes) {
    schema.numberOfEpisodes = series.number_of_episodes;
  }

  if (series.genres && series.genres.length > 0) {
    schema.genre = series.genres.map((g) => g.name);
  }

  if (series.vote_count && series.vote_count > 0 && series.vote_average) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(series.vote_average.toFixed(1)),
      bestRating: 10,
      worstRating: 1,
      ratingCount: series.vote_count,
    };
  }

  return schema;
};

/**
 * Builds Schema.org Person structured data for Actors.
 */
export const buildPersonSchema = (actor) => {
  if (!actor) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: actor.name,
    url: `${PRODUCTION_URL}/actor/${actor.id}`,
    description: actor.biography || undefined,
    jobTitle: actor.known_for_department || "Actor",
  };

  if (actor.profile_path) {
    schema.image = `${IMG_URL}${actor.profile_path}`;
  }

  if (actor.birthday) {
    schema.birthDate = actor.birthday;
  }

  if (actor.place_of_birth) {
    schema.birthPlace = {
      "@type": "Place",
      name: actor.place_of_birth,
    };
  }

  return schema;
};

/**
 * Builds Schema.org WebSite structured data with SearchAction.
 */
export const buildWebSiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Reelify",
    url: `${PRODUCTION_URL}/`,
    description:
      "A neo-noir discovery experience for movies and web series with ratings, cast details, and trailers.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${PRODUCTION_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
};
