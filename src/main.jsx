import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import LocationProvider from "./contexts/LocationProvider";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import AuthProvider from "./contexts/AuthProvider";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <LocationProvider>
          <>
            <ToastContainer></ToastContainer>
            <RouterProvider router={router} />
          </>
        </LocationProvider>
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>
);
