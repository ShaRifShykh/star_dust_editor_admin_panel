import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Trash2, Download, Eye } from 'lucide-react';

export default function EffectsList() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [effects, setEffects] = useState([]);

    const API = import.meta.env.VITE_API_BASE_URL;

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API}/categories`);
                setCategories(res.data);
            } catch (err) {
                console.error('Error fetching categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch effects from API
    useEffect(() => {
        const fetchEffects = async () => {
            try {
                const res = await axios.get(`${API}/effects`, {
                    params: selectedCategory === 'All' ? {} : { category_id: selectedCategory }
                });
                setEffects(res.data);
            } catch (err) {
                console.error('Error fetching effects:', err);
            }
        };
        fetchEffects();
    }, [selectedCategory]);

    // Delete effect
    const deleteEffect = async (id) => {
        try {
            await axios.delete(`${API}/effects/${id}`);
            alert("Effect Deleted.")
            setEffects(prev => prev.filter(effect => effect.id !== id));
        } catch (err) {
            console.error('Error deleting effect:', err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Effects Gallery</h2>
                    <p style={{ color: '#8088e2' }}>Manage your uploaded animation effects</p>
                </div>
                <div className="text-right">
                    <p className="text-sm" style={{ color: '#8088e2' }}>Total Effects</p>
                    <p className="text-white text-2xl font-bold">{effects.length}</p>
                </div>
            </div>

            {/* Category Filter */}
            <div className="rounded-xl p-4 border" style={{ backgroundColor: '#0d0b13', borderColor: '#8088e2' }}>
                <div className="flex gap-2 overflow-x-auto">
                    <button
                        onClick={() => setSelectedCategory('All')}
                        className={`px-4 cursor-pointer py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedCategory === 'All'
                            ? 'bg-gradient-to-r from-[#8088e2] to-[#6b7ddc] text-white shadow-lg'
                            : 'bg-[#191626] text-[#c5c8fa] hover:bg-[#282544]'
                            }`}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-4 py-2 cursor-pointer rounded-lg font-medium whitespace-nowrap transition-all ${selectedCategory === category.id
                                ? 'bg-gradient-to-r from-[#8088e2] to-[#6b7ddc] text-white shadow-lg'
                                : 'bg-[#191626] text-[#c5c8fa] hover:bg-[#282544]'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Effects Grid */}
            <div className="grid grid-cols-3 gap-6">
                {effects.map((effect) => (
                    <div
                        key={effect.id}
                        className="rounded-xl overflow-hidden border transition-all group"
                        style={{ backgroundColor: '#0d0b13', borderColor: '#8088e2' }}
                    >
                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden" style={{ backgroundColor: '#191626' }}>
                            {/* GIF or Video Preview */}
                            {effect.file_type === 'gif' ? (
                                <img
                                    src={`${API.replace('/api', '')}/${effect.thumbnail}`}
                                    alt={effect.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <video
                                    src={`${API.replace('/api', '')}/${effect.effect}`}
                                    className="w-full h-full object-cover"
                                    muted
                                    autoPlay
                                    loop
                                />
                            )}

                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                <button className="cursor-pointer opacity-0 group-hover:opacity-100 transition-all p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full hover:bg-opacity-30">
                                    <Play className="text-white" size={24} />
                                </button>
                            </div>
                            <div className="absolute top-2 right-2">
                                <span className="px-2 py-1 bg-[#0d0b13] bg-opacity-80 text-white text-xs rounded uppercase">
                                    {effect.file_type}
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            <h3 className="text-white font-semibold mb-1 truncate">{effect.name}</h3>
                            <div className="flex items-center justify-between text-sm mb-3" style={{ color: '#8088e2' }}>
                                <span>{effect.category.name}</span>
                                <span>{parseFloat(effect.size || 0).toFixed(2)} MB</span>
                            </div>
                            <p className="text-xs mb-4" style={{ color: '#a3a7ec' }}>
                                Uploaded: {new Date(effect.created_at).toLocaleDateString()}
                            </p>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {/* View Button */}
                                <a
                                    href={`${API.replace('/api', '')}/${effect.effect}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#191626] hover:bg-[#282544] text-white rounded-lg transition-all"
                                >
                                    <Eye size={16} />
                                    <span className="text-sm">View</span>
                                </a>

                                {/* Download Button */}
                                <a
                                    href={`${API.replace('/api', '')}/${effect.effect}`}
                                    download
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#191626] hover:bg-[#282544] text-white rounded-lg transition-all"
                                >
                                    <Download size={16} />
                                    <span className="text-sm">Download</span>
                                </a>
                                <button
                                    onClick={() => deleteEffect(effect.id)}
                                    className="px-3 cursor-pointer py-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-red-500 rounded-lg transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {effects.length === 0 && (
                <div className="rounded-xl p-12 border text-center" style={{ backgroundColor: '#0d0b13', borderColor: '#8088e2' }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#191626' }}>
                        <Eye className="text-[#8088e2]" size={32} />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">No Effects Found</h3>
                    <p style={{ color: '#8088e2' }}>No effects in this category yet.</p>
                </div>
            )}
        </div>
    );
}
