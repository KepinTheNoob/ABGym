import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "../assets/sider/dashboard.svg?react";
import MembersIcon from "../assets/sider/members.svg?react";
import DollarIcon from "../assets/sider/dollar.svg?react";
import CalendarIcon from "../assets/sider/calender.svg?react";
import CogIcon from "../assets/sider/cog.svg?react";
import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      icon: DashboardIcon,
      path: "/dashboard",
    },
    {
      label: "Members",
      icon: MembersIcon,
      path: "/members",
    },
    {
      label: "Finances",
      icon: DollarIcon,
      path: "/finances",
    },
    {
      label: "Classes",
      icon: CalendarIcon,
      path: "/classes",
    },
    {
      label: "Settings",
      icon: CogIcon,
      path: "/settings",
    },
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-[#0F0F0F] flex items-center gap-4 p-4 border-b border-gray-800 z-50">
    <button onClick={() => setOpen(true)} className="text-white text-2xl">
      ☰
    </button>
    <h1 className="text-white font-semibold text-lg">AB Fitness Center</h1>
  </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 md:hidden z-40"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-[#0F0F0F] border-r border-gray-800
          flex flex-col gap-6 p-6 z-50
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0
        `}
      >
        <div className="flex items-center gap-2">
          <img src="logo.png" alt="" className="h-10 w-auto" />
          <div>
            <h1 className="text-l font-semibold text-white">
              AB Fitness Center
            </h1>
            <p className="text-[#99A1AF] text-xs">Admin Panel</p>
          </div>
        </div>

        <nav className="flex flex-col gap-3 text-gray-300">
          {navItems.map(({ label, icon: Icon, path }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                to={path}
                key={label}
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 
                  transition-all cursor-pointer
                  rounded-2xl

                  ${
                    isActive
                      ? "bg-[#F0B100] bg-opacity-10 text-[#F0B100]" // squircle highlight
                      : "text-gray-300 hover:bg-[#1a1a1c] hover:text-[#F0B100]"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "stroke-[#F0B100]" : "stroke-gray-300"
                  }`}
                />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
