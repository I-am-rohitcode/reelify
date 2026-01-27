function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        <img
          src="/Icon.png"
          alt="Reelify"
          className="h-24 w-24 object-contain animate-logo-pulse"
          style={{ filter: "drop-shadow(2px 4px 6px black)" }}
        />

        <p className="text-gray-400 text-sm tracking-wide">
          Loading movie details...
        </p>
      </div>
    </div>
  );
}

export default Loader;
