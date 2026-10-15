function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6 glass-panel rounded-3xl px-10 py-10 shadow-glow border border-white/10">
        <img
          src="/reelify-loader.svg"
          alt="Reelify is loading"
          className="w-64 sm:w-80 h-auto object-contain"
          style={{
            filter: "drop-shadow(2px 4px 12px rgba(239, 68, 68, 0.25))",
          }}
        />
      </div>
    </div>
  );
}

export default Loader;
