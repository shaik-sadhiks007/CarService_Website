import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import { CarDataProvider } from "./components/CarDataContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CarDataProvider>
      <App />
    </CarDataProvider>
  </StrictMode>
);
