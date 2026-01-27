import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Search from "./pages/Search";
import ActorDetails from "./pages/ActorDetails";
import WebSeries from "./pages/WebSeries";
import SeriesDetails from "./pages/SeriesDetails";

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/actor/:id" element={<ActorDetails />} />
        <Route path="/series" element={<WebSeries />} />
        <Route path="/series/:id" element={<SeriesDetails />} />
      </Routes>
    </div>
  );
}

export default App;
