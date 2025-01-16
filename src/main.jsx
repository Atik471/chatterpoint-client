import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import LocationProvider from "./contexts/LocationProvider";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import AuthProvider from "./contexts/AuthProvider";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <LocationProvider>
          <QueryClientProvider client={queryClient}>
          <>
            <ToastContainer></ToastContainer>
            <RouterProvider router={router} />
          </>
          </QueryClientProvider>
        </LocationProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);
