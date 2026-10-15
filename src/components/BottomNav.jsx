import { NavLink } from "react-router-dom";
import { House, Tv, WandSparkles, Search, Bookmark } from "lucide-react";
import { useWatchlist } from "../context/WatchlistContext";

const tabs = [
  { to: "/", label: "Home", Icon: House },
  { to: "/series", label: "Series", Icon: Tv },
  { to: "/mood", label: "Mood", Icon: WandSparkles },
  { to: "/search", label: "Search", Icon: Search },
  { to: "/watchlist", label: "Saved", Icon: Bookmark },
];

export default function BottomNav() {
  const { items } = useWatchlist();

  return (
    <nav
      aria-label="Primary navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-50
        border-t border-white/10 bg-black/90 backdrop-blur-xl
        pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === "/"}
              aria-label={label}
              className={({ isActive }) =>
                `group relative flex flex-col items-center justify-center
                gap-1 py-3 text-[11px] font-medium
                transition-all duration-300
                ${isActive ? "text-red-500" : "text-gray-400 hover:text-white"}`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator */}
                  <span
                    className={`absolute top-0 h-[2px] w-8 rounded-full
                      bg-red-500 transition-all duration-300
                      ${
                        isActive
                          ? "opacity-100 shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                          : "opacity-0"
                      }`}
                    aria-hidden="true"
                  />

                  {/* Icon */}
                  <span className="relative">
                    <Icon
                      size={21}
                      strokeWidth={isActive ? 2.5 : 1.8}
                      className={`transition-all duration-300
                        ${
                          isActive
                            ? "drop-shadow-[0_0_6px_rgba(239,68,68,0.45)]"
                            : "group-hover:scale-110"
                        }`}
                      aria-hidden="true"
                    />

                    {/* Watchlist count */}
                    {to === "/watchlist" && items.length > 0 && (
                      <span
                        className="absolute -right-2 -top-2
                          flex h-4 min-w-4 items-center justify-center
                          rounded-full bg-red-500 px-1 text-[9px]
                          font-bold text-white ring-2 ring-black"
                      >
                        {items.length > 99 ? "99+" : items.length}
                      </span>
                    )}
                  </span>

                  {/* Label */}
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
