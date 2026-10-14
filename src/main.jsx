import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/main.css";
import { BollywoodProvider } from "./context/BollywoodContext";
import { WatchlistProvider } from "./context/WatchlistContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter
    future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
  >
    <BollywoodProvider>
      <WatchlistProvider>
        <div id="content">
          <App />
        </div>
      </WatchlistProvider>
    </BollywoodProvider>
  </BrowserRouter>,
);
