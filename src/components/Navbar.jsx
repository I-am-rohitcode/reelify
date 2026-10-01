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
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[10000] glass-panel rounded-full px-4 py-2 text-sm"
    >
      Skip to content
    </a>

    {/* ================= NAVBAR ================= */}
    <div
      className={`transition-all duration-500 ${
        isScrolled
          ? "bg-ink-950/70 backdrop-blur-xl border-b border-white/10"
          : "bg-gradient-to-b from-ink-950/70 to-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-4 md:px-12 lg:px-16 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* LEFT */}
          <div className="flex items-center gap-10">

            <Link
              to="/"
              onClick={() => setQuery("")}
              className="rounded-2xl"
            >
              <div className="flex items-center gap-3 group">
                <img
                  src="/Logo.png"
                  alt="Reelify"
                  className="h-12 md:h-18 object-contain"
                />
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6">

              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>

              <NavLink to="/series" className={navLinkClass}>
                Web Series
              </NavLink>

            </div>
          </div>


          {/* RIGHT DESKTOP */}
          <div className="hidden md:flex items-center gap-6">

            {/* Search */}
            <div className="relative group">

              <FaSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);

                  if (location.pathname !== "/search") {
                    navigate("/search");
                  }
                }}
                className="
                  bg-white/5
                  border border-white/10
                  text-white
                  pl-10
                  pr-4
                  py-2
                  rounded-full
                  w-52
                  focus:w-72
                  transition-all
                  outline-none
                  text-sm
                "
              />

            </div>


            {/* Bollywood */}
            <div className="flex items-center gap-3">

              <span className="text-sm text-gray-200">
                Bollywood
              </span>

              <button
                onClick={() => setBollywoodOnly(!bollywoodOnly)}
                className={`
                  w-11 h-6
                  rounded-full
                  flex items-center
                  px-1
                  transition
                  border
                  ${
                    bollywoodOnly
                      ? "bg-green-400/30"
                      : "bg-white/10"
                  }
                `}
              >
                <div
                  className={`
                    w-4 h-4
                    bg-white
                    rounded-full
                    transition
                    ${bollywoodOnly ? "translate-x-5" : ""}
                  `}
                />
              </button>

            </div>


            {/* Profile */}
            <div className="relative group w-9 h-9">

              <div className="
                w-9 h-9
                rounded-full
                overflow-hidden
                cursor-pointer
                border border-white/10
                hover:border-cyan-400
                transition-all
              ">
                <img
                  src={avatarImg}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* dropdown */}
              <div className="
                absolute
                right-0
                top-full
                pt-3
                hidden
                group-hover:flex
                flex-col
                z-[999]
              ">

                {/* your existing dropdown */}
                
              </div>

            </div>

          </div>


          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              md:hidden
              glass-panel
              rounded-full
              w-11 h-11
              grid place-items-center
              text-white
              text-xl
              border border-white/10
              hover:border-white/20
              transition
              focus-ring
            "
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>
      </div>
    </div>


    {/* ================================================= */}
    {/* MOBILE MENU - OUTSIDE THE BLURRED NAVBAR */}
    {/* ================================================= */}

    {menuOpen && (
      <div className="md:hidden fixed inset-0 z-[9999]">

        {/* Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-black/80
            backdrop-blur-md
          "
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu Card */}
        <div
          className="
            absolute
            top-3
            left-3
            right-3
            rounded-3xl
            bg-[#0b0b0d]/98
            backdrop-blur-2xl
            shadow-2xl
            border border-white/10
            overflow-hidden
          "
        >

          {/* Header */}
          <div className="px-4 py-4 flex items-center justify-between">

            <img
              src="/Logo.png"
              alt="Reelify"
              className="h-12 object-contain"
            />

            <button
              onClick={() => setMenuOpen(false)}
              className="
                rounded-full
                w-10 h-10
                grid place-items-center
                bg-white/5
                border border-white/10
                focus-ring
              "
              aria-label="Close menu"
            >
              ✕
            </button>

          </div>


          {/* Menu Content */}
          <div className="px-4 pb-5 space-y-3">

            {/* Search */}
            <div className="relative">

              <FaSearch
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);

                  if (location.pathname !== "/search") {
                    navigate("/search");
                  }
                }}
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  hover:border-white/20
                  focus:border-neon-cyan/40
                  text-white
                  pl-10
                  pr-4
                  py-3
                  rounded-2xl
                  outline-none
                  placeholder-gray-400
                  focus-ring
                "
              />

            </div>


            {/* Navigation */}
            <div className="grid grid-cols-3 gap-2">

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `
                  rounded-2xl
                  px-2.5
                  py-3
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-center
                  border
                  transition
                  ${
                    isActive
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
                  }
                  `
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/series"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `
                  rounded-2xl
                  px-2.5
                  py-3
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-center
                  border
                  transition
                  ${
                    isActive
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
                  }
                  `
                }
              >
                Web Series
              </NavLink>

            </div>


            {/* Bollywood */}
            <div className="
              flex
              items-center
              justify-between
              pt-3
              border-t
              border-white/10
            ">

              <span className="text-sm font-medium text-gray-200">
                Bollywood only
              </span>

              <button
                onClick={() =>
                  setBollywoodOnly(!bollywoodOnly)
                }
                className={`
                  w-12
                  h-7
                  rounded-full
                  flex
                  items-center
                  px-1
                  transition
                  duration-300
                  border
                  ${
                    bollywoodOnly
                      ? "bg-neon-lime/20 border-neon-lime/30"
                      : "bg-white/5 border-white/15"
                  }
                `}
              >

                <div
                  className={`
                    w-5
                    h-5
                    bg-white
                    rounded-full
                    transition-transform
                    duration-300
                    ${
                      bollywoodOnly
                        ? "translate-x-5"
                        : "translate-x-0"
                    }
                  `}
                />

              </button>

            </div>


            {/* Developer */}
            <div className="
              pt-3.5
              border-t
              border-white/10
              space-y-2
            ">

              <span className="
                text-[10px]
                font-bold
                tracking-widest
                text-gray-400
                uppercase
                block
                px-1
              ">
                Developer
              </span>

              <div className="grid grid-cols-3 gap-2">

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=100014727486421"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex flex-col
                    items-center
                    justify-center
                    gap-1.5
                    rounded-2xl
                    px-2
                    py-3
                    text-xs
                    font-semibold
                    border
                    bg-white/5
                    border-white/10
                    text-gray-200
                    hover:bg-[#1877F2]/10
                    hover:border-[#1877F2]/30
                    transition
                  "
                >
                  <FaFacebookF className="text-[#1877F2]" />
                  <span>Facebook</span>
                </a>


                {/* Instagram */}
                <a
                  href="https://instagram.com/rohi.t6460"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex flex-col
                    items-center
                    justify-center
                    gap-1.5
                    rounded-2xl
                    px-2
                    py-3
                    text-xs
                    font-semibold
                    border
                    bg-white/5
                    border-white/10
                    text-gray-200
                    hover:bg-[#E4405F]/10
                    hover:border-[#E4405F]/30
                    transition
                  "
                >
                  <FaInstagram className="text-[#E4405F]" />
                  <span>Instagram</span>
                </a>


                {/* Github */}
                <a
                  href="https://github.com/I-am-rohitcode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex flex-col
                    items-center
                    justify-center
                    gap-1.5
                    rounded-2xl
                    px-2
                    py-3
                    text-xs
                    font-semibold
                    border
                    bg-white/5
                    border-white/10
                    text-gray-200
                    hover:bg-white/10
                    hover:border-white/20
                    transition
                  "
                >
                  <FaGithub className="text-white" />
                  <span>GitHub</span>
                </a>

              </div>

            </div>

          </div>

        </div>

      </div>
    )}

  </nav>
);return (
  <nav className="fixed top-0 w-full z-50">

    {/* Skip link */}
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[10000] glass-panel rounded-full px-4 py-2 text-sm"
    >
      Skip to content
    </a>

    {/* ================= NAVBAR ================= */}
    <div
      className={`transition-all duration-500 ${
        isScrolled
          ? "bg-ink-950/70 backdrop-blur-xl border-b border-white/10"
          : "bg-gradient-to-b from-ink-950/70 to-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-4 md:px-12 lg:px-16 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* LEFT */}
          <div className="flex items-center gap-10">

            <Link
              to="/"
              onClick={() => setQuery("")}
              className="rounded-2xl"
            >
              <div className="flex items-center gap-3 group">
                <img
                  src="/Logo.png"
                  alt="Reelify"
                  className="h-12 md:h-18 object-contain"
                />
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-6">

              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>

              <NavLink to="/series" className={navLinkClass}>
                Web Series
              </NavLink>

            </div>
          </div>


          {/* RIGHT DESKTOP */}
          <div className="hidden md:flex items-center gap-6">

            {/* Search */}
            <div className="relative group">

              <FaSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);

                  if (location.pathname !== "/search") {
                    navigate("/search");
                  }
                }}
                className="
                  bg-white/5
                  border border-white/10
                  text-white
                  pl-10
                  pr-4
                  py-2
                  rounded-full
                  w-52
                  focus:w-72
                  transition-all
                  outline-none
                  text-sm
                "
              />

            </div>


            {/* Bollywood */}
            <div className="flex items-center gap-3">

              <span className="text-sm text-gray-200">
                Bollywood
              </span>

              <button
                onClick={() => setBollywoodOnly(!bollywoodOnly)}
                className={`
                  w-11 h-6
                  rounded-full
                  flex items-center
                  px-1
                  transition
                  border
                  ${
                    bollywoodOnly
                      ? "bg-green-400/30"
                      : "bg-white/10"
                  }
                `}
              >
                <div
                  className={`
                    w-4 h-4
                    bg-white
                    rounded-full
                    transition
                    ${bollywoodOnly ? "translate-x-5" : ""}
                  `}
                />
              </button>

            </div>


            {/* Profile */}
            <div className="relative group w-9 h-9">

              <div className="
                w-9 h-9
                rounded-full
                overflow-hidden
                cursor-pointer
                border border-white/10
                hover:border-cyan-400
                transition-all
              ">
                <img
                  src={avatarImg}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* dropdown */}
              <div className="
                absolute
                right-0
                top-full
                pt-3
                hidden
                group-hover:flex
                flex-col
                z-[999]
              ">

                {/* your existing dropdown */}
                
              </div>

            </div>

          </div>


          {/* MOBILE BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              md:hidden
              glass-panel
              rounded-full
              w-11 h-11
              grid place-items-center
              text-white
              text-xl
              border border-white/10
              hover:border-white/20
              transition
              focus-ring
            "
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>
      </div>
    </div>


    {/* ================================================= */}
    {/* MOBILE MENU - OUTSIDE THE BLURRED NAVBAR */}
    {/* ================================================= */}

    {menuOpen && (
      <div className="md:hidden fixed inset-0 z-[9999]">

        {/* Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-black/80
            backdrop-blur-md
          "
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu Card */}
        <div
          className="
            absolute
            top-3
            left-3
            right-3
            rounded-3xl
            bg-[#0b0b0d]/98
            backdrop-blur-2xl
            shadow-2xl
            border border-white/10
            overflow-hidden
          "
        >

          {/* Header */}
          <div className="px-4 py-4 flex items-center justify-between">

            <img
              src="/Logo.png"
              alt="Reelify"
              className="h-12 object-contain"
            />

            <button
              onClick={() => setMenuOpen(false)}
              className="
                rounded-full
                w-10 h-10
                grid place-items-center
                bg-white/5
                border border-white/10
                focus-ring
              "
              aria-label="Close menu"
            >
              ✕
            </button>

          </div>


          {/* Menu Content */}
          <div className="px-4 pb-5 space-y-3">

            {/* Search */}
            <div className="relative">

              <FaSearch
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);

                  if (location.pathname !== "/search") {
                    navigate("/search");
                  }
                }}
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  hover:border-white/20
                  focus:border-neon-cyan/40
                  text-white
                  pl-10
                  pr-4
                  py-3
                  rounded-2xl
                  outline-none
                  placeholder-gray-400
                  focus-ring
                "
              />

            </div>


            {/* Navigation */}
            <div className="grid grid-cols-3 gap-2">

              <NavLink
                to="/"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `
                  rounded-2xl
                  px-2.5
                  py-3
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-center
                  border
                  transition
                  ${
                    isActive
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
                  }
                  `
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/series"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `
                  rounded-2xl
                  px-2.5
                  py-3
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-center
                  border
                  transition
                  ${
                    isActive
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-white/5 border-white/10 text-gray-200 hover:bg-white/10"
                  }
                  `
                }
              >
                Web Series
              </NavLink>

            </div>


            {/* Bollywood */}
            <div className="
              flex
              items-center
              justify-between
              pt-3
              border-t
              border-white/10
            ">

              <span className="text-sm font-medium text-gray-200">
                Bollywood only
              </span>

              <button
                onClick={() =>
                  setBollywoodOnly(!bollywoodOnly)
                }
                className={`
                  w-12
                  h-7
                  rounded-full
                  flex
                  items-center
                  px-1
                  transition
                  duration-300
                  border
                  ${
                    bollywoodOnly
                      ? "bg-neon-lime/20 border-neon-lime/30"
                      : "bg-white/5 border-white/15"
                  }
                `}
              >

                <div
                  className={`
                    w-5
                    h-5
                    bg-white
                    rounded-full
                    transition-transform
                    duration-300
                    ${
                      bollywoodOnly
                        ? "translate-x-5"
                        : "translate-x-0"
                    }
                  `}
                />

              </button>

            </div>


            {/* Developer */}
            <div className="
              pt-3.5
              border-t
              border-white/10
              space-y-2
            ">

              <span className="
                text-[10px]
                font-bold
                tracking-widest
                text-gray-400
                uppercase
                block
                px-1
              ">
                Developer
              </span>

              <div className="grid grid-cols-3 gap-2">

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=100014727486421"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex flex-col
                    items-center
                    justify-center
                    gap-1.5
                    rounded-2xl
                    px-2
                    py-3
                    text-xs
                    font-semibold
                    border
                    bg-white/5
                    border-white/10
                    text-gray-200
                    hover:bg-[#1877F2]/10
                    hover:border-[#1877F2]/30
                    transition
                  "
                >
                  <FaFacebookF className="text-[#1877F2]" />
                  <span>Facebook</span>
                </a>


                {/* Instagram */}
                <a
                  href="https://instagram.com/rohi.t6460"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex flex-col
                    items-center
                    justify-center
                    gap-1.5
                    rounded-2xl
                    px-2
                    py-3
                    text-xs
                    font-semibold
                    border
                    bg-white/5
                    border-white/10
                    text-gray-200
                    hover:bg-[#E4405F]/10
                    hover:border-[#E4405F]/30
                    transition
                  "
                >
                  <FaInstagram className="text-[#E4405F]" />
                  <span>Instagram</span>
                </a>


                {/* Github */}
                <a
                  href="https://github.com/I-am-rohitcode"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex flex-col
                    items-center
                    justify-center
                    gap-1.5
                    rounded-2xl
                    px-2
                    py-3
                    text-xs
                    font-semibold
                    border
                    bg-white/5
                    border-white/10
                    text-gray-200
                    hover:bg-white/10
                    hover:border-white/20
                    transition
                  "
                >
                  <FaGithub className="text-white" />
                  <span>GitHub</span>
                </a>

              </div>

            </div>

          </div>

        </div>

      </div>
    )}

  </nav>
);

                    
}

export default Navbar;
