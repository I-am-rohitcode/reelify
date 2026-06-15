import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaFacebookF, FaInstagram, FaGithub } from "react-icons/fa";
import { useBollywood } from "../context/BollywoodContext";
import avatarImg from "../assets/img.jpg";

function Navbar() {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { bollywoodOnly, setBollywoodOnly } = useBollywood();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Search debounce
  useEffect(() => {
    if (query.trim().length > 2 && location.pathname === "/search") {
      const timer = setTimeout(() => {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [query, navigate, location.pathname]);

  // Close menu only when route changes
useEffect(() => {
  setMenuOpen(false);
}, [location.pathname]);
  const navLinkClass = ({ isActive }) =>
    `relative text-sm font-medium transition-all duration-300 ${
      isActive ? "text-white" : "text-gray-300 hover:text-gray-100"
    } after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-neon-cyan after:to-neon-magenta after:transition-transform after:duration-300 ${
      isActive ? "after:scale-x-100" : "hover:after:scale-x-100"
    }`;

  return (
    <nav className="fixed top-0 w-full z-50">
      {/* Skip link */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] glass-panel rounded-full px-4 py-2 text-sm"
      >
        Skip to content
      </a>

      {/* Navbar background */}
      <div
        className={`transition-all duration-500 ${
          isScrolled
            ? "bg-ink-950/70 backdrop-blur-xl border-b border-white/10"
            : "bg-gradient-to-b from-ink-950/70 to-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1600px] px-4 md:px-12 lg:px-16 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* LEFT SECTION */}
            <div className="flex items-center gap-10">
              <Link to="/" onClick={() => setQuery("")} className="rounded-2xl">
                <div className="flex items-center gap-3 group">
                  <img
                    src="/Logo.png"
                    alt="Reelify"
                    className="h-12 md:h-18 object-contain"
                  />
                  {/* <span className="hidden lg:block font-bold tracking-widest text-lg text-white/90 group-hover:text-white transition">
                    REELIFY
                  </span> */}
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                <NavLink to="/" className={navLinkClass}>
                  Home
                </NavLink>
                <NavLink to="/series" className={navLinkClass}>
                  Web Series
                </NavLink>
                {/* <NavLink to="/chatbot" className={navLinkClass}>
                  AI Chatbot
                </NavLink> */}
              </div>
            </div>

            {/* RIGHT SECTION (desktop) */}
            <div className="hidden md:flex items-center gap-6">
              {/* Search */}
              <div className="relative group">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (location.pathname !== "/search") navigate("/search");
                  }}
                  className="bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2 rounded-full w-52 focus:w-72 transition-all outline-none text-sm"
                />
              </div>

              {/* Bollywood Toggle */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-200">Bollywood</span>
                <button
                  onClick={() => setBollywoodOnly(!bollywoodOnly)}
                  className={`w-11 h-6 rounded-full flex items-center px-1 transition border ${
                    bollywoodOnly ? "bg-green-400/30" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full transition ${
                      bollywoodOnly ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Profile Avatar (FIXED) */}
              <div className="relative group w-9 h-9">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full overflow-hidden cursor-pointer border border-white/10 hover:border-cyan-400 transition-all">
                  <img
                    src={avatarImg}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Dropdown (fixed hover area with transparent bridge) */}
                <div
                  className="absolute right-0 top-full pt-3 hidden group-hover:flex flex-col z-50"
                >
                  <div
                    className={`w-48 rounded-xl shadow-2xl border border-white/10 p-3 gap-1.5 flex flex-col backdrop-blur-xl transition-all duration-300 ${
                      isScrolled
                        ? "bg-[#0d0d11]/95"
                        : "bg-[#0d0d11]/85"
                    }`}
                  >
                    {/* Header */}
                    <div className="px-2 pb-1.5 mb-1 border-b border-white/5">
                      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                        Developer
                      </p>
                    </div>

                    <a
                      href="https://www.facebook.com/profile.php?id=100014727486421"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-[#1877F2]/10 hover:shadow-[0_0_15px_rgba(24,119,242,0.2)] border border-white/5 hover:border-[#1877F2]/30 transition-all duration-300 group/item"
                    >
                      <FaFacebookF className="text-[#1877F2] text-sm group-hover/item:scale-110 transition-transform duration-300" />
                      <span className="font-semibold">Facebook</span>
                    </a>

                    <a
                      href="https://instagram.com/rohi.t6460"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-[#E4405F]/10 hover:shadow-[0_0_15px_rgba(228,64,95,0.2)] border border-white/5 hover:border-[#E4405F]/30 transition-all duration-300 group/item"
                    >
                      <FaInstagram className="text-[#E4405F] text-sm group-hover/item:scale-110 transition-transform duration-300" />
                      <span className="font-semibold">Instagram</span>
                    </a>

                    <a
                      href="https://github.com/I-am-rohitcode"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/5 hover:border-white/20 transition-all duration-300 group/item"
                    >
                      <FaGithub className="text-white text-sm group-hover/item:scale-110 transition-transform duration-300" />
                      <span className="font-semibold">GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden glass-panel rounded-full w-11 h-11 grid place-items-center text-white text-xl border border-white/10 hover:border-white/20 transition focus-ring"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 z-[60]">
            {/* overlay */}
            <div
  className="absolute inset-0 bg-black/70 backdrop-blur-sm"
  onClick={() => setMenuOpen(false)}
/>

            {/* sheet */}
            <div className="absolute top-3 left-3 right-3 rounded-3xl glass-panel shadow-glow border border-white/10 overflow-hidden">
              <div className="px-4 py-4 flex items-center justify-between">
                <span className="font-display tracking-widest text-white/90">
                  <img
                    src="/Logo.png"
                    alt="Reelify"
                    className="h-12 md:h-18 object-contain"
                  />
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full w-10 h-10 grid place-items-center bg-white/5 border border-white/10 focus-ring"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              <div className="px-4 pb-5 space-y-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      if (location.pathname !== "/search") navigate("/search");
                    }}
                    className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-neon-cyan/40 text-white pl-10 pr-4 py-3 rounded-2xl outline-none placeholder-gray-400 focus-ring"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <NavLink
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-2xl px-2.5 py-3 text-xs sm:text-sm font-semibold text-center border transition ${
                        isActive
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
                      }`
                    }
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/series"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-2xl px-2.5 py-3 text-xs sm:text-sm font-semibold text-center border transition ${
                        isActive
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
                      }`
                    }
                  >
                    Web Series
                  </NavLink>
                  {/* <NavLink
                    to="/chatbot"
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `rounded-2xl px-2.5 py-3 text-xs sm:text-sm font-semibold text-center border transition ${
                        isActive
                          ? "bg-white/10 border-white/20 text-white"
                          : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
                      }`
                    }
                  >
                    AI Chatbot
                  </NavLink>*/}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-sm font-medium text-gray-200">
                    Bollywood only
                  </span>
                  <button
                    onClick={() => setBollywoodOnly(!bollywoodOnly)}
                    className={`w-12 h-7 rounded-full flex items-center px-1 transition duration-300 border ${
                      bollywoodOnly
                        ? "bg-neon-lime/20 border-neon-lime/30"
                        : "bg-white/5 border-white/15"
                    } focus-ring`}
                    aria-pressed={bollywoodOnly}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                        bollywoodOnly ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Developer Section */}
                <div className="pt-3.5 border-t border-white/10 space-y-2">
                  <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase block px-1">
                    Developer
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href="https://www.facebook.com/profile.php?id=100014727486421"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-xs font-semibold border bg-white/5 border-white/10 text-gray-200 hover:bg-[#1877F2]/10 hover:border-[#1877F2]/30 active:bg-[#1877F2]/20 transition"
                    >
                      <FaFacebookF className="text-[#1877F2] text-sm" />
                      <span>Facebook</span>
                    </a>
                    <a
                      href="https://instagram.com/rohi.t6460"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-xs font-semibold border bg-white/5 border-white/10 text-gray-200 hover:bg-[#E4405F]/10 hover:border-[#E4405F]/30 active:bg-[#E4405F]/20 transition"
                    >
                      <FaInstagram className="text-[#E4405F] text-sm" />
                      <span>Instagram</span>
                    </a>
                    <a
                      href="https://github.com/I-am-rohitcode"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-3 text-xs font-semibold border bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/20 active:bg-white/20 transition"
                    >
                      <FaGithub className="text-white text-sm" />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
