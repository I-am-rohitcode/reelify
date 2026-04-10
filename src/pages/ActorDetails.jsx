import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPersonDetails, getPersonMovies, IMG_URL } from "../api/tmdb";
import { FaArrowLeft } from "react-icons/fa";
import Loader from "../components/Loader";
import MovieGrid from "../components/MovieGrid";

function ActorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actor, setActor] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActor = async () => {
      try {
        setLoading(true);

        const [a, m] = await Promise.all([
          getPersonDetails(id),
          getPersonMovies(id),
        ]);

        setActor(a.data);
        setMovies(m.data.cast);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActor();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Loader />;
  if (!actor) return <div className="text-center p-20 text-xl text-gray-400">Actor not found.</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pt-24 pb-12 selection:bg-[#E50914]/40">
      <button
  onClick={() => navigate(-1)}
  className="hidden md:flex fixed top-24 left-6 lg:left-10 z-50 items-center gap-2 px-5 py-2.5 rounded-full glass-panel hover:bg-white/10 transition-colors shadow-lg shadow-black/50 text-sm font-medium"
>
  <FaArrowLeft /> Back
</button>

      <div className="max-w-[1600px] mx-auto animate-fade-in-up">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-start px-6 md:px-12 lg:px-16 mb-20 pt-10">
          
          {/* Actor Headshot */}
          <div className="flex-none w-[200px] md:w-[280px] mx-auto md:mx-0">
            <img
              src={actor.profile_path ? IMG_URL + actor.profile_path : "https://via.placeholder.com/300x450?text=No+Photo"}
              alt={actor.name}
              className="w-full h-auto rounded-xl shadow-[0_20px_50px_rgba(229,9,20,0.2)] object-cover"
            />
          </div>

          {/* Actor Info */}
          <div className="flex-1 space-y-6">
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

            <div className="pt-4">
               <h3 className="text-xl md:text-2xl font-bold mb-4 border-b border-gray-800 pb-2">Biography</h3>
               <p className="text-gray-300 text-sm md:text-base leading-relaxed font-light">
                  {actor.biography || "No biography available for this actor."}
               </p>
            </div>
          </div>
        </div>

        {/* Movies Row */}
        {movies.length > 0 && (
          <div className="-mx-4 md:mx-0">
             <MovieGrid title={`Known For`} movies={movies} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ActorDetails;
