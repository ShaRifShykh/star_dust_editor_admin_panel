import React from "react";
import { Bell, LogOut, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ admin, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    if (typeof onLogout === 'function') {
      onLogout();
    }
    navigate("/login", { replace: true });
  };

  return (
    <div className="h-16 bg-[#0d0b13] border-b border-[#8088e2] fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8088e2]"
              size={20}
            />
            <input
              type="text"
              placeholder="Search effects..."
              className="w-full bg-[#1a1822] text-white pl-10 pr-4 py-2 rounded-lg border border-[#8088e2]/40 focus:outline-none focus:border-[#8088e2] transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-[#8088e2] hover:text-white hover:bg-[#1a1822] rounded-lg transition-all">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3 px-3 py-2 text-[#8088e2] hover:text-white hover:bg-[#1a1822] rounded-lg transition-all">
              <div className="w-8 h-8 bg-gradient-to-br from-[#8088e2] to-[#5f66c2] rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="font-medium">{admin?.email ?? "Admin"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-[#8088e2] hover:text-white hover:bg-[#1a1822] rounded-lg transition-all"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
