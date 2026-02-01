import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useBollywood } from "../context/BollywoodContext";

function Navbar() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { bollywoodOnly, setBollywoodOnly } = useBollywood();

  /* ================= Realtime Search ================= */
  useEffect(() => {
    if (query.trim().length > 2 && location.pathname === "/search") {
      const timer = setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [query, navigate, location.pathname]);

  /* ================= NavLink Style ================= */
  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-all duration-300
     ${isActive ? "text-red-600" : "text-gray-300 hover:text-red-500"}
     after:absolute after:left-0 after:-bottom-1 after:h-[2px]
     after:w-full after:origin-left after:scale-x-0
     after:bg-red-600 after:transition-transform after:duration-300
     hover:after:scale-x-100
     ${isActive ? "after:scale-x-100" : ""}
     hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]`;

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-gray-800 px-4 py-3">
      {/* ================= TOP BAR ================= */}
      <div className="flex items-center justify-between">
        {/* Logo */}
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
        </Link>

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:flex items-center gap-8">
          {/* Navigation */}
          <NavLink to="/" className={navLinkClass}>
            Movies
          </NavLink>

          <NavLink to="/series" className={navLinkClass}>
            Web Series
          </NavLink>

          {/* Search */}
          <input
            type="text"
            placeholder="Search movies or series..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              navigate("/search");
            }}
            className="bg-gray-900 border border-gray-700 text-white px-4 py-2
                       rounded w-64 focus:outline-none focus:border-white"
          />

          {/* Bollywood Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">Bollywood</span>
            <button
              onClick={() => setBollywoodOnly(!bollywoodOnly)}
              className={`w-12 h-6 rounded-full flex items-center px-1 transition
                ${bollywoodOnly ? "bg-red-600" : "bg-gray-600"}`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition
                  ${bollywoodOnly ? "translate-x-6" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU BUTTON ================= */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-5 pb-4">
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "text-red-600 font-medium"
                : "text-gray-300 hover:text-red-500"
            }
          >
            Movies
          </NavLink>

          <NavLink
            to="/series"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "text-red-600 font-medium"
                : "text-gray-300 hover:text-red-500"
            }
          >
            Web Series
          </NavLink>

          {/* Search */}
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              navigate("/search");
            }}
            className="bg-gray-900 border border-gray-700 text-white px-4 py-2
                       rounded focus:outline-none focus:border-white"
          />

          {/* Bollywood Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300">Bollywood</span>
            <button
              onClick={() => setBollywoodOnly(!bollywoodOnly)}
              className={`w-12 h-6 rounded-full flex items-center px-1 transition
                ${bollywoodOnly ? "bg-red-600" : "bg-gray-600"}`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition
                  ${bollywoodOnly ? "translate-x-6" : ""}`}
              />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
