import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaPaperPlane, FaTrash, FaRobot, FaUser, FaKey, FaFilm, FaTv, FaStar, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { getGeminiApiKey, extractMovieTitle, generateChatResponse } from "../api/gemini";
import { searchMulti, IMG_URL } from "../api/tmdb";

function Chatbot() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // States
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [inputKey, setInputKey] = useState("");

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi there! I am **Reelify AI**, your personal movie companion. Ask me anything about movies, actors, reviews, or TV series. 🍿\n\nTry asking: *'Tell me about Interstellar'* or *'Suggest some good Bollywood comedies'*.",
      movieCard: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load key from localStorage on mount if no env key
  useEffect(() => {
    const localKey = localStorage.getItem("reelify_gemini_key");
    if (localKey) {
      setInputKey(localKey);
    }
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle Save API Key
  const handleSaveApiKey = (e) => {
    e.preventDefault();
    const cleanKey = inputKey.trim();
    if (cleanKey) {
      localStorage.setItem("reelify_gemini_key", cleanKey);
      setApiKey(cleanKey);
      
      const isValidFormat = cleanKey.startsWith("AIzaSy") || cleanKey.startsWith("AQ.");
      
      // Add a system feedback message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          text: isValidFormat 
            ? "🔑 API Key saved successfully! How can I assist you with movies today?"
            : "⚠️ API Key saved! However, it doesn't seem to be a valid Gemini API Key (which typically starts with **'AIzaSy'**). If the chatbot fails to respond, please check your key.",
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

  // Helper to parse double asterisks to strong tag in text (simple bold parsing)
  const formatMessageText = (text) => {
    if (!text) return "";
    
    // Split by lines to preserve breaks
    return text.split("\n").map((line, idx) => {
      const parts = line.split(/\*\*([^*]+)\*\*/g);
      return (
        <span key={idx} className="block min-h-[1em]">
          {parts.map((part, index) => {
            // odd elements in the split are the bolded matches
            if (index % 2 === 1) {
              return <strong key={index} className="text-neon-cyan font-bold">{part}</strong>;
            }
            // formatting links in responses or bullet points
            return part;
          })}
        </span>
      );
    });
  };

  // Main chat sending logic
  const handleSend = async (textToSend) => {
    const queryText = (textToSend || input).trim();
    if (!queryText) return;

    if (!textToSend) {
      setInput("");
    }

    // Check API Key
    const key = apiKey;
    if (!key) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "user",
          text: queryText,
        },
        {
          id: Date.now().toString() + "-error",
          role: "assistant",
          text: "⚠️ **Gemini API Key is missing!** Please enter an API key in the settings sidebar to start chatting.",
        },
      ]);
      return;
    }

    // Add User Message
    const userMsgId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: "user",
        text: queryText,
      },
    ]);

    setIsLoading(true);

    try {
      let movieContext = null;
      let extractedInfo = { hasMovie: false, title: null };

      // Step 1: Detect if a movie name is mentioned
      extractedInfo = await extractMovieTitle(queryText, key);

      // Step 2: Search TMDB if title detected
      if (extractedInfo.hasMovie && extractedInfo.title) {
        try {
          const tmdbRes = await searchMulti(extractedInfo.title);
          const results = tmdbRes.data.results || [];
          
          // Filter to get only movies or tv series
          const filtered = results.filter(
            (item) => item.media_type === "movie" || item.media_type === "tv"
          );

          if (filtered.length > 0) {
            const match = filtered[0];
            // Format essential fields for Gemini context
            movieContext = {
              title: match.title || match.name,
              media_type: match.media_type,
              release_date: match.release_date || match.first_air_date,
              overview: match.overview,
              vote_average: match.vote_average,
              id: match.id,
              genre_ids: match.genre_ids,
              poster_path: match.poster_path,
              backdrop_path: match.backdrop_path,
            };
          }
        } catch (tmdbError) {
          console.error("TMDB Search failed in chatbot flow", tmdbError);
        }
      }

      // Step 3 & 4: Get Gemini AI Response with movie data context
      const aiResponse = await generateChatResponse(queryText, movieContext, key);

      // Add Assistant Message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-ai",
          role: "assistant",
          text: aiResponse,
          movieCard: movieContext,
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-error",
          role: "assistant",
          text: "❌ Something went wrong. Please check your API key or connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Prompts list
  const quickPrompts = [
    "Tell me about Interstellar",
    "Suggest some good Bollywood comedies",
    "Who directed the movie Sholay?",
    "Give me similar series like Mirzapur",
  ];

  // Helper for clicking Movie Card
  const handleMovieCardClick = (movie) => {
    const isTv = movie.media_type === "tv" || (!movie.media_type && (movie.first_air_date || movie.name));
    navigate(isTv ? `/series/${movie.id}` : `/movie/${movie.id}`);
  };

  const isEnvKeyConfigured = !!import.meta.env.VITE_GEMINI_API_KEY && (
    import.meta.env.VITE_GEMINI_API_KEY.trim().startsWith("AIzaSy") || 
    import.meta.env.VITE_GEMINI_API_KEY.trim().startsWith("AQ.")
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* SIDEBAR Toggle for Mobile */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a0a0c] border-b border-white/5 relative z-30">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-pulse"></div>
          <span className="font-bold text-sm text-gray-200">Reelify AI Assistant</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
        >
          {sidebarOpen ? "Close Menu" : "Menu & Settings"}
        </button>
      </div>

      {/* LEFT SIDEBAR (Settings & Prompts) */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:static inset-y-0 left-0 w-80 md:w-72 lg:w-80 bg-ink-900 border-r border-white/10 p-5 flex flex-col gap-6 z-40 transition-transform duration-300 ease-in-out md:pt-6 pt-24`}
      >
        <div className="hidden md:flex items-center gap-3 mb-2">
          <div className="relative">
            <div className="w-3.5 h-3.5 rounded-full bg-neon-cyan border border-[#050505]"></div>
            <div className="absolute inset-0 w-3.5 h-3.5 rounded-full bg-neon-cyan animate-ping opacity-60"></div>
          </div>
          <h2 className="font-bold text-lg text-white">Reelify AI Chatbot</h2>
        </div>

        {/* Clear Chat Option */}
        <button
          onClick={() => {
            setMessages([
              {
                id: "welcome",
                role: "assistant",
                text: "Conversation cleared. How can I help you find your next watch? 🍿",
              },
            ]);
            setSidebarOpen(false);
          }}
          className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 text-gray-300 hover:text-red-400 font-semibold transition text-sm focus-ring"
        >
          <FaTrash className="text-xs" />
          <span>Clear Chat History</span>
        </button>

        {/* Gemini API Key Management */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <FaKey className="text-neon-cyan" />
            <span>Gemini API Key</span>
          </div>

          {isEnvKeyConfigured ? (
            <div className="bg-neon-lime/10 border border-neon-lime/30 text-neon-lime text-xs px-2.5 py-2 rounded-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse"></span>
              <span>Loaded from .env file</span>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKey ? (
                <div className="flex flex-col gap-2">
                  <div className="bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-xs px-2.5 py-2 rounded-lg truncate">
                    Saved Key: {apiKey.slice(0, 8)}...
                  </div>
                  <button
                    onClick={handleRemoveApiKey}
                    className="text-xs text-red-400 hover:text-red-300 font-medium hover:underline text-left"
                  >
                    Remove Saved Key
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSaveApiKey} className="space-y-2">
                  <p className="text-[11px] text-gray-400 leading-normal">
                    Enter key to enable chat. Key is saved locally in your browser.
                  </p>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    className="w-full bg-[#050508] border border-white/15 focus:border-neon-cyan/40 text-white text-xs px-3 py-2 rounded-lg outline-none transition focus-ring"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-neon-cyan text-black hover:bg-neon-cyan/85 font-bold rounded-lg text-xs transition shadow-md focus-ring"
                  >
                    Save Key
                  </button>
                  <a
                    href="https://aistudio.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="block text-[10px] text-neon-magenta hover:underline pt-1 text-center font-medium"
                  >
                    Get a free Gemini API Key
                  </a>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Quick Suggestion Prompts */}
        <div className="flex-1 space-y-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Quick Prompts
          </span>
          <div className="flex flex-col gap-2">
            {quickPrompts.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleSend(promptText);
                  setSidebarOpen(false);
                }}
                className="text-left text-xs text-gray-300 hover:text-white bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 p-3 rounded-xl transition duration-200 leading-snug font-medium focus-ring"
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>

        {/* Info footer */}
        <div className="text-[10px] text-gray-500 leading-relaxed text-center border-t border-white/5 pt-4">
          Powered by Gemini 2.5 Flash & TMDB.
        </div>
      </div>

      {/* MAIN CHAT CONTENT */}
      <div className="flex-1 flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-80px)] overflow-hidden relative">
        
        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 scrollbar-thin">
          
          {/* Active Key Missing Warning */}
          {!apiKey && !isEnvKeyConfigured && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-xs px-4 py-3 rounded-2xl flex items-start gap-3 animate-fade-in mb-4 max-w-xl mx-auto">
              <FaExclamationTriangle className="text-lg flex-none mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">API Key Required for Chatting</p>
                <p className="text-gray-300 leading-normal">
                  To interact with Reelify AI, please enter your Gemini API Key in the left sidebar menu (or define `VITE_GEMINI_API_KEY` in your `.env` file).
                </p>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              } animate-fade-in-up`}
            >
              {/* Profile Avatar / Bot Icon */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-none shadow-md ${
                  msg.role === "user"
                    ? "bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan"
                    : "bg-neon-magenta/20 border border-neon-magenta/40 text-neon-magenta"
                }`}
              >
                {msg.role === "user" ? <FaUser className="text-xs" /> : <FaRobot className="text-sm" />}
              </div>

              {/* Message Bubble wrapper */}
              <div className="space-y-3">
                <div
                  className={`p-3.5 md:p-4 rounded-2xl text-sm leading-relaxed border transition shadow-sm ${
                    msg.role === "user"
                      ? "bg-neon-cyan/10 border-neon-cyan/20 text-white rounded-tr-none"
                      : "glass-panel text-gray-100 rounded-tl-none"
                  }`}
                >
                  {formatMessageText(msg.text)}
                </div>

                {/* Attached Interactive TMDB Movie Card */}
                {msg.movieCard && (
                  <div 
                    onClick={() => handleMovieCardClick(msg.movieCard)}
                    className="glass-panel border border-white/10 hover:border-neon-cyan/40 hover:bg-white/10 rounded-2xl p-3 flex gap-4 cursor-pointer transition duration-300 transform hover:scale-[1.02] max-w-md shadow-glow select-none"
                  >
                    {/* Poster */}
                    <div className="w-16 h-24 rounded-lg overflow-hidden flex-none bg-[#0a0a0c] border border-white/10">
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
                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <div className="flex items-center gap-1.5 text-xs text-neon-cyan font-bold uppercase tracking-wider mb-1">
                        {msg.movieCard.media_type === "tv" ? <FaTv className="text-[10px]" /> : <FaFilm className="text-[10px]" />}
                        <span>{msg.movieCard.media_type === "tv" ? "TV Series" : "Movie"}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm sm:text-base leading-tight truncate">
                        {msg.movieCard.title}
                      </h4>
                      {msg.movieCard.release_date && (
                        <span className="text-xs text-gray-400 mt-1">
                          Released: {msg.movieCard.release_date.split("-")[0]}
                        </span>
                      )}
                      
                      <div className="flex items-center gap-4 mt-2">
                        {msg.movieCard.vote_average && (
                          <span className="flex items-center gap-1 text-xs text-yellow-500 font-bold bg-yellow-500/10 px-1.5 py-0.5 rounded">
                            <FaStar className="text-[10px]" />
                            {msg.movieCard.vote_average.toFixed(1)}
                          </span>
                        )}
                        <span className="text-xs text-neon-cyan hover:underline flex items-center gap-1 font-semibold">
                          <FaInfoCircle className="text-[10px]" /> Details
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
            <div className="flex gap-3 max-w-[75%] mr-auto animate-pulse">
              <div className="w-9 h-9 rounded-full bg-neon-magenta/20 border border-neon-magenta/40 text-neon-magenta flex items-center justify-center flex-none">
                <FaRobot className="text-sm" />
              </div>
              <div className="glass-panel px-5 py-4 rounded-2xl rounded-tl-none border text-gray-300 flex items-center gap-2">
                <FaCommentDots className="animate-bounce text-neon-cyan" />
                <span className="text-xs text-gray-400 font-medium">Reelify AI is looking up data and typing...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Text Form Area */}
        <div className="p-4 md:p-6 bg-[#050505] border-t border-white/5 relative z-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="max-w-4xl mx-auto relative flex items-center"
          >
            <input
              type="text"
              placeholder="Ask about movies, TV series, actors, or directors..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/10 hover:border-white/15 focus:border-neon-cyan/40 text-white pl-5 pr-14 py-3.5 rounded-2xl outline-none placeholder-gray-400 transition text-sm focus-ring"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-neon-cyan text-black hover:bg-neon-cyan/85 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center focus-ring"
              aria-label="Send message"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </form>
          <p className="text-[10px] text-gray-500 text-center mt-2 leading-relaxed">
            Reelify AI searches real-time data from TMDb. If you ask about a movie, click the card to see trailers, cast details, or episodes.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
