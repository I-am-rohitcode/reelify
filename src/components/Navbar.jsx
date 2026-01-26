import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useBollywood } from "../context/BollywoodContext";

function Navbar() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { bollywoodOnly, setBollywoodOnly } = useBollywood();

  // realtime search (debounced)
  useEffect(() => {
    if (query.trim().length > 2 && location.pathname === "/search") {
      const timer = setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(query)}`);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [query, navigate, location.pathname]);

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-gray-800 px-4 py-3">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          onClick={() => {
            setQuery("");
            setMenuOpen(false);
          }}
          className="flex items-center gap-3"
        >
          <img
            src="/Logo.png"
            alt="Reelify Logo"
            className="h-[80px] object-contain"
            style={{ filter: "drop-shadow(2px 4px 6px black)" }}
          />
          {/* <span className="hidden sm:block text-red-600 text-2xl font-bold">
            Reelify
          </span> */}
        </Link>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-6">
          {/* Search */}
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              navigate("/search");
            }}
            className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded w-64 focus:outline-none focus:border-white"
          />

          {/* Bollywood Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">Bollywood</span>
            <button
              onClick={() => setBollywoodOnly(!bollywoodOnly)}
              className={`w-12 h-6 rounded-full flex items-center px-1 transition ${
                bollywoodOnly ? "bg-red-600" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition ${
                  bollywoodOnly ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              navigate("/search");
            }}
            className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-white"
          />

          {/* Bollywood Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">Bollywood</span>
            <button
              onClick={() => setBollywoodOnly(!bollywoodOnly)}
              className={`w-12 h-6 rounded-full flex items-center px-1 transition ${
                bollywoodOnly ? "bg-red-600" : "bg-gray-600"
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition ${
                  bollywoodOnly ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
