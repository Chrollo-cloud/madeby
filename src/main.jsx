import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MarketplaceProvider } from "./context/MarketplaceContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MarketplaceProvider>
        <App />
      </MarketplaceProvider>
    </BrowserRouter>
  </StrictMode>,
);
