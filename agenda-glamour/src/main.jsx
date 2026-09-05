import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/fonts.css";
import "./styles/theme.css";
import "./styles/index.css";
import "./styles/utilities.css";
import { SharedDataWrapper } from "./app/components/SharedDataWrapper";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SharedDataWrapper />
    </BrowserRouter>
  </StrictMode>,
);
