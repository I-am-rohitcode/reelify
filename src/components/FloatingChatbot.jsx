import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import {
  FaPaperPlane,
  FaTimes,
  FaRobot,
  FaUser,
  FaKey,
  FaFilm,
  FaTv,
  FaStar,
  FaInfoCircle,
  FaCog,
  FaTrash,
  FaCommentDots,
  FaMinus,
} from "react-icons/fa";
import {
  getGeminiApiKey,
  extractMovieTitle,
  generateChatResponse,
} from "../api/gemini";
import { searchMulti, IMG_URL } from "../api/tmdb";

function FloatingChatbot() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [showKeySettings, setShowKeySettings] = useState(false);
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [inputKey, setInputKey] = useState("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Message history (stored in state; could load from sessionStorage if desired)
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi there! I'm **Reelify AI**, your personal movie companion. Ask me anything about movies, actors, or TV series. 🍿",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      movieCard: null,
    },
  ]);

  // Sync apiKey state if VITE_GEMINI_API_KEY changes or user saves a key
  useEffect(() => {
    setApiKey(getGeminiApiKey());
    const localKey = localStorage.getItem("reelify_gemini_key");
    if (localKey) {
      setInputKey(localKey);
    }
  }, [isOpen]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => chatInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle Save API Key
  const handleSaveApiKey = (e) => {
    e.preventDefault();
    const cleanKey = inputKey.trim();
    if (cleanKey) {
      localStorage.setItem("reelify_gemini_key", cleanKey);
      setApiKey(cleanKey);
      setShowKeySettings(false);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          text: "🔑 API Key saved! Ask me about any movie.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  // Handle Remove API Key
  const handleRemoveApiKey = () => {
    localStorage.removeItem("reelify_gemini_key");
    setApiKey("");
    setInputKey("");
  };

  // Simple formatter for **bold text**
  const formatMessageText = (text) => {
    if (!text) return "";
    return text.split("\n").map((line, idx) => {
      const parts = line.split(/\*\*([^*]+)\*\*/g);
      return (
        <span key={idx} className="block min-h-[1em]">
          {parts.map((part, index) => {
            if (index % 2 === 1) {
              return (
                <strong key={index} className="text-neon-cyan font-bold">
                  {part}
                </strong>
              );
            }
            return part;
          })}
        </span>
      );
    });
  };

  // Send message handler
  const handleSend = async () => {
    const queryText = input.trim();
    if (!queryText) return;

    setInput("");

    // Verify key
    const activeKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
    if (!activeKey) {
      setShowKeySettings(true);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-user",
          role: "user",
          text: queryText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        {
          id: Date.now().toString() + "-error",
          role: "assistant",
          text: "⚠️ **Gemini API Key is missing!** Open chatbot settings (gear icon) to save your key.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      return;
    }

    // Add user message
    const userMsgId = Date.now().toString();
    const currentTimeStr = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: "user",
        text: queryText,
        timestamp: currentTimeStr,
      },
    ]);

    setIsLoading(true);

    try {
      let movieContext = null;

      // Step 1: Detect movie/show name
      const titleExtraction = await extractMovieTitle(queryText, activeKey);

      // Step 2: Search TMDB
      if (titleExtraction.hasMovie && titleExtraction.title) {
        const tmdbRes = await searchMulti(titleExtraction.title);
        const results = tmdbRes.data.results || [];
        const filtered = results.filter(
          (item) => item.media_type === "movie" || item.media_type === "tv",
        );

        if (filtered.length > 0) {
          const match = filtered[0];
          movieContext = {
            title: match.title || match.name,
            media_type: match.media_type,
            release_date: match.release_date || match.first_air_date,
            overview: match.overview,
            vote_average: match.vote_average,
            id: match.id,
            poster_path: match.poster_path,
          };
        }
      }

      // Step 3 & 4: Get Gemini AI Response
      const aiResponse = await generateChatResponse(
        queryText,
        movieContext,
        activeKey,
      );

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-ai",
          role: "assistant",
          text: aiResponse,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          movieCard: movieContext,
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-err",
          role: "assistant",
          text: "❌ Service unavailable. Please check your network or API Key.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieCardClick = (movie) => {
    const isTv =
      movie.media_type === "tv" ||
      (!movie.media_type && (movie.first_air_date || movie.name));
    navigate(isTv ? `/series/${movie.id}` : `/movie/${movie.id}`);
    // Optional: Minimize chat window upon clicking details to show page
    setIsOpen(false);
  };

  const isEnvKeyConfigured = !!import.meta.env.VITE_GEMINI_API_KEY;

  return (
    <>
      {/* FLOATING ACTION BUTTON (TRIGGER) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full z-[999] flex items-center justify-center text-white transition-all duration-300 transform hover:scale-105 active:scale-95 focus-ring ${
          isOpen
            ? "bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)] rotate-90"
            : "bg-ink-900 border border-white/10 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:border-red-500/40 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
        }`}
        aria-label={isOpen ? "Close chat assistant" : "Open AI Movie assistant"}
        title={isOpen ? "Close Chat" : "Open Chat"}
      >
        {isOpen ? (
          <FaTimes className="text-xl" />
        ) : (
          <div className="relative flex items-center justify-center">
            <img
              src="/AI_Icon.png"
              alt="Chatbot"
              className="w-12 h-12 cursor-pointer hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
      </button>

      {/* FLOATING CHAT WINDOW CONTAINER */}
      <div
        className={`fixed bottom-24 right-6 w-[340px] sm:w-[380px] h-[480px] max-h-[calc(100vh-120px)] z-[999] rounded-3xl border border-white/10 shadow-glow flex flex-col overflow-hidden transition-all duration-300 ease-out origin-bottom-right ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-90 pointer-events-none"
        }`}
        style={{ background: "rgba(0, 0, 0, 1)" }}
      >
        {/* HEADER */}
        <div className="bg-[#0a0a0c] border-b border-white/10 px-4 py-3.5 flex items-center justify-between flex-none">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-red-500/30 flex items-center justify-center text-red-500">
              {/* <FaRobot className="text-sm" /> */}
              <img
                src="/AI_Icon.png"
                alt="Chatbot"
                className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5 leading-none">
                <span>Reelify AI</span>
                <span className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse"></span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Movie Expert Assistant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-gray-400">
            {/* Gear Settings Button */}
            <button
              onClick={() => setShowKeySettings(!showKeySettings)}
              className={`hover:text-white transition p-1.5 rounded-md focus-ring ${
                showKeySettings ? "text-red-500" : ""
              }`}
              aria-label="Toggle API Key settings"
              title="API Key Settings"
            >
              <FaCog className="text-sm" />
            </button>
            {/* Minimize Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="hover:text-white transition p-1.5 rounded-md focus-ring"
              aria-label="Minimize Chat"
              title="Minimize"
            >
              <FaMinus className="text-xs" />
            </button>
          </div>
        </div>

        {/* API KEY PANEL (Slide-down Menu) */}
        {showKeySettings && (
          <div className="bg-[#0a0c16] border-b border-white/10 p-3.5 flex-none animate-fade-in space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <FaKey className="text-red-500 text-[10px]" /> Gemini API Key
              </span>
              {/*<button
                onClick={() => {
                  if (window.confirm("Clear chat history?")) {
                    setMessages([
                      {
                        id: "welcome",
                        role: "assistant",
                        text: "Hi there! I'm **Reelify AI**, your personal movie companion. Ask me anything about movies, actors, or TV series. 🍿",
                        timestamp: new Date().toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        }),
                      },
                    ]);
                  }
                }}
                className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
              >
                <FaTrash className="text-[9px]" /> Clear Chat
              </button>*/}
            </div>

            {isEnvKeyConfigured ? (
              <div className="bg-neon-lime/10 border border-neon-lime/20 text-neon-lime text-[10px] px-2.5 py-1.5 rounded-lg">
                Loaded securely from system settings
              </div>
            ) : (
              <div className="space-y-2">
                {apiKey ? (
                  <div className="flex items-center justify-between bg-red-500/5 border border-red-500/15 rounded-lg px-2.5 py-1.5">
                    <span className="text-[10px] text-gray-400 truncate max-w-[150px]">
                      Key: {apiKey.slice(0, 8)}...
                    </span>
                    <button
                      onClick={handleRemoveApiKey}
                      className="text-[10px] text-red-400 hover:text-red-300 font-bold"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSaveApiKey} className="flex gap-2">
                    <input
                      type="password"
                      placeholder="Enter API Key (AIzaSy...)"
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      className="bg-black border border-white/10 focus:border-red-500/40 text-[11px] text-white px-2 py-1.5 rounded-lg outline-none flex-1 focus-ring"
                    />
                    <button
                      type="submit"
                      className="bg-red-500 text-white hover:bg-red-600 px-3 py-1.5 font-bold rounded-lg text-[10px] transition focus-ring"
                    >
                      Save
                    </button>
                  </form>
                )}
                <a
                  href="https://aistudio.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[9px] text-neon-magenta hover:underline text-center font-medium"
                >
                  Click here to generate a free Gemini API Key
                </a>
              </div>
            )}
          </div>
        )}

        {/* CHAT MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[85%] ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              } animate-fade-in-up`}
            >
              {/* Profile/Bot icon */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-none shadow-sm text-xs ${
                  msg.role === "user"
                    ? "bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan"
                    : "bg-neon-magenta/20 border border-neon-magenta/40 text-neon-magenta"
                }`}
              >
                {msg.role === "user" ? (
                  <img
                    src="/User_Icon.png"
                    alt="Chatbot"
                    className="w-7 h-7 cursor-pointer hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <img
                    src="/AI_Icon.png"
                    alt="Chatbot"
                    className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-300"
                  />
                )}
              </div>

              {/* Message Content */}
              <div className="space-y-2">
                <div
                  className={`p-3 rounded-2xl text-[13px] leading-relaxed border transition shadow-sm ${
                    msg.role === "user"
                      ? "bg-white/5 border-red-700 text-white rounded-tr-none"
                      : "bg-white/5 border-white/5 text-gray-200 rounded-tl-none"
                  }`}
                >
                  {formatMessageText(msg.text)}
                </div>

                {/* Timestamps */}
                {msg.timestamp && (
                  <span
                    className={`block text-[9px] text-gray-500 mt-1 ${
                      msg.role === "user" ? "text-right mr-1" : "text-left ml-1"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                )}

                {/* Attached Interactive Movie Card */}
                {msg.movieCard && (
                  <div
                    onClick={() => handleMovieCardClick(msg.movieCard)}
                    className="glass-panel border border-white/10 hover:border-neon-cyan/30 hover:bg-white/10 rounded-xl p-2.5 flex gap-3 cursor-pointer transition transform hover:scale-[1.01] max-w-sm shadow-md"
                  >
                    {/* Poster image */}
                    <div className="w-11 h-16 rounded-md overflow-hidden flex-none bg-[#0a0a0c] border border-white/10">
                      <img
                        src={
                          msg.movieCard.poster_path
                            ? `${IMG_URL}${msg.movieCard.poster_path}`
                            : "https://via.placeholder.com/300x450?text=No+Image"
                        }
                        alt={msg.movieCard.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Title & Metadata */}
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <h5 className="font-bold text-white text-xs truncate leading-tight">
                        {msg.movieCard.title}
                      </h5>
                      {msg.movieCard.release_date && (
                        <span className="text-[10px] text-gray-400 mt-0.5">
                          {msg.movieCard.release_date.split("-")[0]}
                        </span>
                      )}
                      <div className="flex items-center gap-3 mt-1.5">
                        {msg.movieCard.vote_average && (
                          <span className="flex items-center gap-0.5 text-[10px] text-yellow-500 font-bold bg-yellow-500/10 px-1 py-0.2 rounded">
                            <FaStar className="text-[8px]" />
                            {msg.movieCard.vote_average.toFixed(1)}
                          </span>
                        )}
                        <span className="text-[10px] text-neon-cyan hover:underline flex items-center gap-0.5 font-bold">
                          <FaInfoCircle className="text-[8px]" /> View
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Loading Indicator */}
          {isLoading && (
            <div className="flex gap-2.5 max-w-[80%] mr-auto animate-pulse">
              <div className="w-7 h-7 rounded-full bg-neon-magenta/20 border border-neon-magenta/40 text-neon-magenta flex items-center justify-center flex-none">
                <img
                    src="/AI_Icon.png"
                    alt="Chatbot"
                    className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-300"
                  />
              </div>
              <div className="bg-white/5 border border-white/5 px-3 py-2.5 rounded-2xl rounded-tl-none text-gray-400 flex items-center gap-2">
                <img
                    src="/AI_Icon.png"
                    alt="Chatbot"
                    className="w-8 h-8 cursor-pointer hover:scale-110 transition-transform duration-300"
                  />
                <span className="text-[11px]">Typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT BOX FOOTER */}
        <div className="p-3 bg-black border-t border-white/10 flex-none relative z-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative flex items-center"
          >
            <input
              ref={chatInputRef}
              type="text"
              placeholder="Ask Reelify AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-red-500/40 text-white pl-4 pr-10 py-2.5 rounded-xl outline-none text-xs sm:text-sm transition focus-ring"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 text-red-500 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed w-7 h-7 flex items-center justify-center focus-ring"
              aria-label="Send query"
            >
              <IoSend className="text-sm" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default FloatingChatbot;
