import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import Footer from "../components/footer";

export default function AppLayout() {
  return (
    <div className="flex w-full h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1 h-screen">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>

        <Footer />
      </div>
    </div>
  );
}
