import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard.tsx";
import AppLayout from "./pages/appLayout.tsx";
import Members from "./pages/members/members.tsx";
import Finances from "./pages/finances/finances.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Plans from "./pages/plans/plans.tsx";
import Categories from "./pages/categories/categories.tsx";
import ScannerListener from "./components/scannerListener.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ScannerListener />
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />
            <Route path="/finances" element={<Finances />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/plans" element={<Plans />} />
          </Route>
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
