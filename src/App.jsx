import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingChatbot from "./components/FloatingChatbot";
import Loader from "./components/Loader";

// Route-level code splitting for enhanced Core Web Vitals and initial load speed
const Home = lazy(() => import("./pages/Home"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const Search = lazy(() => import("./pages/Search"));
const ActorDetails = lazy(() => import("./pages/ActorDetails"));
const WebSeries = lazy(() => import("./pages/WebSeries"));
const SeriesDetails = lazy(() => import("./pages/SeriesDetails"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <div className="min-h-screen text-white grainy">
      <Navbar />

      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/actor/:id" element={<ActorDetails />} />
          <Route path="/series" element={<WebSeries />} />
          <Route path="/series/:id" element={<SeriesDetails />} />
          <Route path="/chatbot" element={<Chatbot />} />
          {/* Catch-all 404 handler for invalid routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <FloatingChatbot />
      <Footer />
    </div>
  );
}

export default App;
