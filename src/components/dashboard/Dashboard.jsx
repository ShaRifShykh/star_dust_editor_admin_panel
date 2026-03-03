import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import UploadEffects from './UploadEffects';
import EffectsList from './EffectsList';
import axios from 'axios';
import { TrendingUp, Upload, Image, Activity } from 'lucide-react';
import Category from './Category';


function DashboardHome({ setActiveTab }) {
    const [stats, setStats] = useState([]);
    const [recent, setRecent] = useState([]);
    const API = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API}/effects/stats`);
                const s = res.data;
                setStats([
                    {
                        title: 'Total Effects',
                        value: s.total_effects,
                        change: '+12%',
                        icon: Image,
                        color: 'from-[#8088e2] to-[#6b7ddc]'
                    },
                    {
                        title: 'Uploads This Month',
                        value: s.uploads_this_month,
                        change: '+8%',
                        icon: Upload,
                        color: 'from-[#6b7ddc] to-[#5cd6e5]'
                    },
                    {
                        title: 'Categories',
                        value: s.total_categories,
                        change: '+2',
                        icon: TrendingUp,
                        color: 'from-[#5cd6e5] to-[#4fe28a]'
                    },
                    {
                        title: 'Storage Used',
                        value: s.storage_used,
                        change: '48%',
                        icon: Activity,
                        color: 'from-[#4fe28a] to-[#e2cf50]'
                    },
                ]);
            } catch (err) {
                console.error("Stats error:", err);
            }
        };

        const fetchRecent = async () => {
            try {
                const res = await axios.get(`${API}/effects`);
                setRecent(res.data.slice(0, 4)); // Show only latest 4
            } catch (err) {
                console.error("Recent error:", err);
            }
        };

        fetchStats();
        fetchRecent();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h2>
                <p style={{ color: '#8088e2' }}>Welcome back! Here's what's happening with your effects.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="rounded-xl p-6 border transition-all"
                            style={{ backgroundColor: '#0d0b13', borderColor: '#8088e2' }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <Icon className="text-white" size={24} />
                                </div>
                                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                            </div>
                            <h3 style={{ color: '#8088e2' }} className="text-sm mb-1">{stat.title}</h3>
                            <p className="text-white text-2xl font-bold">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl p-6 border" style={{ backgroundColor: '#0d0b13', borderColor: '#8088e2' }}>
                <h3 className="text-white font-semibold text-lg mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    {recent.map((effect) => (
                        <div
                            key={effect.id}
                            className="flex items-center gap-4 p-4 rounded-lg transition-all"
                            style={{ backgroundColor: '#191626' }}
                        >
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#8088e2] to-[#6b7ddc]"></div>
                            <div className="flex-1">
                                <p className="text-white font-medium">{effect.name}</p>
                                <p style={{ color: '#8088e2' }} className="text-sm">{effect.category.name} • {effect.file_type.toUpperCase()}</p>
                            </div>
                            <span className="text-gray-400 text-sm">{new Date(effect.created_at).toLocaleTimeString()}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#8088e2] to-[#6b7ddc] rounded-xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Upload New Effect</h3>
                    <p className="text-purple-100 mb-4">Add animation effects to your gallery</p>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className="px-6 cursor-pointer py-2 bg-white text-[#8088e2] rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                        Upload Now
                    </button>
                </div>
                <div className="bg-gradient-to-br from-[#5cd6e5] to-[#6b7ddc] rounded-xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">Browse Gallery</h3>
                    <p className="text-cyan-100 mb-4">View and manage your effects</p>
                    <button
                        onClick={() => setActiveTab('gallery')}
                        className="px-6 cursor-pointer py-2 bg-white text-[#5cd6e5] rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                        View Gallery
                    </button>
                </div>
            </div>
        </div>
    );
}
export default function Dashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div style={{ backgroundColor: '#0d0b13' }} className="min-h-screen">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <Navbar onLogout={onLogout} />
            <main className="ml-64 pt-16">
                <div className="p-8">
                    {activeTab === 'home' && <DashboardHome setActiveTab={setActiveTab} />}
                    {activeTab === 'upload' && <UploadEffects />}
                    {activeTab === 'gallery' && <EffectsList />}
                    {activeTab === 'category' && <Category />}
                </div>
            </main>
        </div>
    );
}
