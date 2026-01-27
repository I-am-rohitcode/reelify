import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSeriesDetails,
  getSeasonEpisodes,
  getSeriesProviders,
  BACKDROP_URL,
  IMG_URL,
} from "../api/tmdb";
import Loader from "../components/Loader";

function SeriesDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        setLoading(true);

        const [s, p] = await Promise.all([
          getSeriesDetails(id),
          getSeriesProviders(id),
        ]);

        setSeries(s.data);

        setProviders(
          p.data.results?.IN?.flatrate || p.data.results?.US?.flatrate || [],
        );

        fetchEpisodes(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeries();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchEpisodes = async (season) => {
    setSelectedSeason(season);
    const ep = await getSeasonEpisodes(id, season);
    setEpisodes(ep.data.episodes || []);
  };

  if (loading) return <Loader />;
  if (!series) return <p className="p-6">Series not found</p>;

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="hidden md:flex fixed top-32 left-6 z-20 bg-black/70 text-white px-4 py-2 rounded"
      >
        ← Back
      </button>

      {/* Banner */}
      <img
        src={BACKDROP_URL + series.backdrop_path}
        alt={series.name}
        className="hero-banner"
      />

      <div className="details-body">
        <h1 className="details-title">{series.name}</h1>

        <div className="details-meta">
          <span>⭐ {series.vote_average.toFixed(1)}</span>
          <span>{series.first_air_date?.split("-")[0]}</span>
          <span>{series.number_of_seasons} Seasons</span>
        </div>

        <p className="overview">{series.overview}</p>

        {/* OTT Platforms */}
        {providers.length > 0 && (
          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-3">Available On</h3>
            <div className="flex gap-4">
              {providers.map((p) => (
                <img
                  key={p.provider_id}
                  src={IMG_URL + p.logo_path}
                  alt={p.provider_name}
                  className="h-12 rounded"
                />
              ))}
            </div>
          </div>
        )}

        {/* Seasons Selector */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Seasons</h3>
          <div className="flex gap-3 flex-wrap">
            {series.seasons.map((s) => (
              <button
                key={s.id}
                onClick={() => fetchEpisodes(s.season_number)}
                className={`px-4 py-1 rounded-full border ${
                  selectedSeason === s.season_number
                    ? "bg-red-600 text-white"
                    : "border-gray-600 text-gray-300"
                }`}
              >
                Season {s.season_number}
              </button>
            ))}
          </div>
        </div>

        {/* Episodes List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Episodes (Season {selectedSeason})
          </h3>

          <div className="space-y-4">
            {episodes.map((ep) => (
              <div
                key={ep.id}
                className="flex gap-4 bg-gray-900 p-4 rounded-lg"
              >
                <img
                  src={
                    ep.still_path
                      ? IMG_URL + ep.still_path
                      : "https://via.placeholder.com/200x120"
                  }
                  className="w-40 rounded"
                />

                <div>
                  <h4 className="font-semibold">
                    {ep.episode_number}. {ep.name}
                  </h4>
                  <p className="text-sm text-gray-400 line-clamp-3">
                    {ep.overview || "No description available."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeriesDetails;
