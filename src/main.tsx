import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import DashboardPage from "./pages/dashboard-page.tsx";
import ApplyPage from "./pages/apply-page.tsx";
import ResumePage from "./pages/resume-page.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<DashboardPage />} />
          <Route path="apply" element={<ApplyPage />} />
          <Route path="resume" element={<ResumePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
