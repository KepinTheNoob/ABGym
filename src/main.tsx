import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./pages/appLayout.tsx";
import Members from "./pages/members/members.tsx";
import Finances from "./pages/finances/finances.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Plans from "./pages/plans/plans.tsx";
import Categories from "./pages/categories/categories.tsx";
import ScannerListener from "./components/scannerListener.tsx";
import { AttendanceProvider } from "./components/attendanceContext.tsx";
import Dashboard from "./pages/dashboard/dashboard.tsx";
import LoginPage from "./pages/login/login.tsx";
import ProtectedRoute from "./pages/login/protectedRoute.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AttendanceProvider>
          <ScannerListener />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            {/* <Route element={<ProtectedRoute />}> */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/members" element={<Members />} />
                <Route path="/finances" element={<Finances />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/plans" element={<Plans />} />
              </Route>
            {/* </Route> */}
          </Routes>
        </AttendanceProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
