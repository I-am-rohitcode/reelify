import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaFilm } from "react-icons/fa";
import SEO from "../components/SEO";

function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 py-32">
      <SEO
        title="Page Not Found (404) | Reelify"
        description="The page you are looking for does not exist on Reelify. Return to home to discover trending movies and series."
        noindex={true}
        nofollow={true}
      />

      <div className="max-w-xl w-full text-center glass-panel rounded-3xl p-8 md:p-12 border border-white/10 shadow-glow animate-fade-in-up">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
          <FaFilm className="text-4xl text-red-500" />
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-3">
          404
        </h1>

        <h2 className="text-xl md:text-2xl font-bold text-gray-200 mb-3">
          Scene Not Found
        </h2>

        <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto">
          The movie, series, or page you are looking for might have been moved, deleted, or never existed in our database.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm md:text-base font-bold bg-white text-black hover:bg-white/85 transition-colors shadow-glow"
          >
            <FaHome />
            <span>Discover Movies</span>
          </Link>

          <Link
            to="/search"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm md:text-base font-semibold glass-panel hover:bg-white/10 transition-colors border border-white/15"
          >
            <FaSearch />
            <span>Search Reelify</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
