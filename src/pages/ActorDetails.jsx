import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPersonDetails, getPersonMovies, IMG_URL } from "../api/tmdb";
import { FaArrowLeft } from "react-icons/fa";
import Loader from "../components/Loader";
import MovieGrid from "../components/MovieGrid";
import SEO from "../components/SEO";
import { PRODUCTION_URL } from "../utils/slug";
import { buildPersonSchema } from "../utils/structuredData";

function ActorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchActor = async () => {
      try {
        setLoading(true);
        setError(false);

        const [a, m] = await Promise.all([
          getPersonDetails(id),
          getPersonMovies(id),
        ]);

        if (!isMounted) return;

        setActor(a.data);
        setMovies(m.data.cast || []);
      } catch (err) {
        console.error("Failed to fetch actor details", err);
        if (isMounted) setError(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchActor();
    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <Loader />;

  if (error || !actor) {
    return (
      <main id="content" className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-32">
        <SEO
          title="Actor Not Found | Reelify"
          description="The requested actor or cast member could not be found. Explore trending movies and series on Reelify."
          noindex={true}
          nofollow={true}
        />
        <div className="text-center max-w-lg glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-glow">
          <h1 className="text-3xl font-bold mb-4 text-white">Actor Not Found</h1>
          <p className="text-gray-400 mb-6 text-sm md:text-base leading-relaxed">
            We couldn't retrieve details for this actor or person. The URL may be invalid.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-full font-semibold glass-panel hover:bg-white/10 transition"
            >
              Go Back
            </button>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-full font-bold bg-white text-black hover:bg-white/85 transition"
            >
              Discover Movies
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Dynamic Actor SEO
  const actorTitle = `${actor.name} - Movies, Biography & Filmography | Reelify`;
  let actorDesc = actor.biography
    ? actor.biography.trim()
    : `${actor.name} is a renowned ${actor.known_for_department || "actor"} featured on Reelify. Explore biography, filmography, and top movies.`;
  if (actorDesc.length > 160) {
    actorDesc = actorDesc.substring(0, 157) + "...";
  }

  const canonicalUrl = `${PRODUCTION_URL}/actor/${actor.id}`;
  const actorImage = actor.profile_path
    ? `${IMG_URL}${actor.profile_path}`
    : `${PRODUCTION_URL}/Icon.png`;

  const structuredData = buildPersonSchema(actor);

  return (
    <main id="content" className="min-h-screen bg-[#050505] text-white font-sans pt-24 pb-12 selection:bg-[#E50914]/40">
      <SEO
        title={actorTitle}
        description={actorDesc}
        canonical={canonicalUrl}
        image={actorImage}
        type="profile"
        structuredData={structuredData}
      />

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="hidden md:flex fixed top-24 left-6 lg:left-10 z-50 items-center gap-2 px-5 py-2.5 rounded-full glass-panel hover:bg-white/10 transition-colors shadow-lg shadow-black/50 text-sm font-medium focus-ring"
        aria-label="Go back to previous page"
      >
        <FaArrowLeft aria-hidden="true" /> Back
      </button>

      <div className="max-w-[1600px] mx-auto animate-fade-in-up">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start px-6 md:px-12 lg:px-16 mb-20 pt-10">
          {/* Actor Headshot */}
          <div className="flex-none w-[200px] md:w-[280px] mx-auto md:mx-0">
            <img
              src={
                actor.profile_path
                  ? IMG_URL + actor.profile_path
                  : "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22300%22%20height%3D%22450%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20300%20450%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22300%22%20height%3D%22450%22%20fill%3D%22%23111%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20alignment-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23555%22%20font-family%3D%22sans-serif%22%20font-size%3D%2218%22%3ENo%20Photo%3C%2Ftext%3E%3C%2Fsvg%3E"
              }
              alt={`${actor.name} portrait`}
              width="280"
              height="420"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              className="w-full h-auto rounded-xl shadow-[0_20px_50px_rgba(229,9,20,0.2)] object-cover aspect-[2/3]"
            />
          </div>

          {/* Actor Info */}
          <div className="flex-1 space-y-6">
            {/* Primary H1 for Actor Page */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-md">
              {actor.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-medium">
              {actor.known_for_department && (
                <span className="bg-[#E50914] px-4 py-1.5 rounded font-bold shadow-md">
                  {actor.known_for_department}
                </span>
              )}
              {actor.birthday && (
                <span className="text-gray-300 glass-panel px-3 py-1.5 rounded-md">
                  Born: {actor.birthday}
                </span>
              )}
              {actor.place_of_birth && (
                <span className="text-gray-400">{actor.place_of_birth}</span>
              )}
            </div>

            <section className="pt-4" aria-labelledby="bio-heading">
              <h2 id="bio-heading" className="text-xl md:text-2xl font-bold mb-4 border-b border-gray-800 pb-2">
                Biography
              </h2>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
                {actor.biography || "No biography available for this actor."}
              </p>
            </section>
          </div>
        </div>

        {/* Movies Row */}
        {movies.length > 0 && (
          <section className="-mx-4 md:mx-0" aria-label="Actor filmography">
            <MovieGrid title="Known For" movies={movies} />
          </section>
        )}
      </div>
    </main>
  );
}

export default ActorDetails;
