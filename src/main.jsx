import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min";
import { CarDataProvider } from "./components/CarDataContext.jsx";
import './Translation/i18n';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CarDataProvider>
      <App />
    </CarDataProvider>
  </StrictMode>
);
