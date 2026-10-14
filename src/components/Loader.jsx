function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 glass-panel rounded-3xl px-10 py-10 shadow-glow border border-white/10">
        <img
          src="/Icon.png"
          alt="Reelify"
          className="h-24 w-24 object-contain animate-logo-pulse"
          style={{ filter: "drop-shadow(2px 4px 6px black)" }}
        />

        <p className="text-gray-200 text-sm tracking-wide">
          Loading…
        </p>
      </div>
    </div>
  );
}

export default Loader;
