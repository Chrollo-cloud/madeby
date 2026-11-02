import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MarketplaceProvider } from "./context/MarketplaceContext";
import { CatalogueProvider } from "./context/CatalogueContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ProductProvider } from "./utils/ProductContext";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30000, retry: 1 } },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ProductProvider>
            <MarketplaceProvider>
              <CatalogueProvider>
                <App />
              </CatalogueProvider>
            </MarketplaceProvider>
          </ProductProvider>
        </AuthProvider>
        <Toaster position="top-right" />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
