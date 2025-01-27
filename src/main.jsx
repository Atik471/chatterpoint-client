import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import LocationProvider from "./contexts/LocationProvider";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import AuthProvider from "./contexts/AuthProvider";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AnnouncementProvider from "./contexts/AnnouncementProvider";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
      <AnnouncementProvider>
        <LocationProvider>
          <AuthProvider>
            
            <>
              <ToastContainer></ToastContainer>
              <RouterProvider router={router} />
            </>
            
          </AuthProvider>
        </LocationProvider>
        </AnnouncementProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
