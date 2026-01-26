import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/main.css";
import { BollywoodProvider } from "./context/BollywoodContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <BollywoodProvider>
      <App />
    </BollywoodProvider>
  </BrowserRouter>,
);
