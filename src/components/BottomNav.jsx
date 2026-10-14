import { NavLink } from "react-router-dom";
import { FaHome, FaTv, FaMagic, FaSearch, FaBookmark } from "react-icons/fa";
import { useWatchlist } from "../context/WatchlistContext";

const tabs = [
  { to: "/", label: "Home", Icon: FaHome },
  { to: "/series", label: "Series", Icon: FaTv },
  { to: "/mood", label: "Mood", Icon: FaMagic },
  { to: "/search", label: "Search", Icon: FaSearch },
  { to: "/watchlist", label: "Saved", Icon: FaBookmark },
];

export default function BottomNav() {
  const { items } = useWatchlist();
  return (
    <nav aria-label="Primary" className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-white/10 bg-black/85 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-5">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink to={to} end={to === "/"} className={({ isActive }) => `relative flex flex-col items-center gap-1 py-2.5 text-[11px] ${isActive ? "text-white" : "text-gray-400"}`}>
              <Icon className="text-base" aria-hidden="true" />
              {label}
              {to === "/watchlist" && items.length > 0 && (
                <span className="absolute top-1 right-[28%] min-w-[16px] rounded-full bg-neon-cyan px-1 text-center text-[10px] font-bold text-black">{items.length}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
