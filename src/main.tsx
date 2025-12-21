import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard.tsx";
import AppLayout from "./pages/appLayout.tsx";
import Members from "./pages/members.tsx";
import Finances from "./pages/finances.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/members" element={<Members />} />
          <Route path="/finances" element={<Finances />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
