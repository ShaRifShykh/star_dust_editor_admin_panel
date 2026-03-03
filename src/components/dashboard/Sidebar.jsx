import React  from "react";
import { Home, Upload, Image, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'upload', label: 'Upload Effects', icon: Upload },
    { id: 'gallery', label: 'Effects Gallery', icon: Image },
    { id: 'category', label: 'Upload Category', icon: Image },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 border-r" style={{ backgroundColor: '#0d0b13', borderColor: '#1a1820' }}>
      {/* Logo Section */}
      <div className="p-6 border-b" style={{ borderColor: '#1a1820' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8088e2' }}>
            <span className="text-white font-bold text-xl">⭐</span>
          </div>
          <h1 className="text-white font-bold text-xl">Stardust</h1>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className="w-full flex items-center gap-3 cursor-pointer px-4 py-3 rounded-lg transition-all"
                  style={{
                    backgroundColor: activeTab === item.id ? '#8088e2' : 'transparent',
                    color: activeTab === item.id ? '#ffffff' : '#9ca3af'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.backgroundColor = '#1a1820';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== item.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#9ca3af';
                    }
                  }}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

    </div>
  );
}