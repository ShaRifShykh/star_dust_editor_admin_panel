import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderPlus, X, Check } from 'lucide-react';

export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [loading, setLoading] = useState(false);

    const API = import.meta.env.VITE_API_BASE_URL;

    // Fetch categories
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API}/categories`);
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    // Open modal for create/edit
    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name });
        } else {
            setEditingCategory(null);
            setFormData({ name: '' });
        }
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '' });
    };

    // Create or update category
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const options = {
                method: editingCategory ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            };

            const url = editingCategory 
                ? `${API}/categories/${editingCategory.id}` 
                : `${API}/categories`;

            const response = await fetch(url, options);
            const result = await response.json().catch(() => null);

            if (!response.ok || (result && result.success === false)) {
                const message = result?.message || 'Failed to save category. Please try again.';
                throw new Error(message);
            }

            alert(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
            fetchCategories();
            closeModal();
        } catch (err) {
            console.error('Error saving category:', err);
            alert(err.message || 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    // Delete category
    const deleteCategory = async (id) => {
        if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`${API}/categories/${id}`, { method: 'DELETE' });
            const result = await response.json().catch(() => null);

            if (!response.ok || (result && result.success === false)) {
                const message = result?.message || 'Failed to delete category. Please try again.';
                throw new Error(message);
            }

            alert('Category deleted successfully!');
            setCategories(prev => prev.filter(cat => cat.id !== id));
        } catch (err) {
            console.error('Error deleting category:', err);
            alert(err.message || 'Failed to delete category');
        }
    };

    return (
        <div className="min-h-screen ">
            <div className="mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Category Management</h1>
                        <p style={{ color: '#8088e2' }}>Create and manage effect categories</p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8088e2] to-[#6b7ddc] text-white rounded-lg font-medium hover:shadow-lg transition-all"
                    >
                        <Plus size={20} />
                        New Category
                    </button>
                </div>

                {/* Stats Card */}
                <div className="rounded-xl p-6 border" style={{ backgroundColor: '#0d0b13', borderColor: '#8088e2' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm mb-1" style={{ color: '#8088e2' }}>Total Categories</p>
                            <p className="text-white text-4xl font-bold">{categories.length}</p>
                        </div>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#191626' }}>
                            <FolderPlus className="text-[#8088e2]" size={32} />
                        </div>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="rounded-xl p-6 border transition-all hover:border-[#a3a7ec] group"
                            style={{ backgroundColor: '#0d0b13', borderColor: '#8088e2' }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#191626' }}>
                                    <FolderPlus className="text-[#8088e2]" size={24} />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button
                                        onClick={() => openModal(category)}
                                        className="p-2 bg-[#191626] hover:bg-[#282544] text-[#8088e2] rounded-lg transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(category.id)}
                                        className="p-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-red-500 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            
                            <h3 className="text-white font-semibold text-lg mb-2">{category.name}</h3>
                            <p className="text-sm mb-4" style={{ color: '#8088e2' }}>
                                {category.description || 'No description provided'}
                            </p>
                            
                            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: '#191626' }}>
                                <span className="text-xs" style={{ color: '#a3a7ec' }}>
                                    Created: {new Date(category.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {categories.length === 0 && (
                    <div className="rounded-xl p-12 border text-center" style={{ backgroundColor: '#0d0b13', borderColor: '#8088e2' }}>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#191626' }}>
                            <FolderPlus className="text-[#8088e2]" size={40} />
                        </div>
                        <h3 className="text-white font-semibold text-xl mb-2">No Categories Yet</h3>
                        <p className="mb-6" style={{ color: '#8088e2' }}>Create your first category to get started</p>
                        <button
                            onClick={() => openModal()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8088e2] to-[#6b7ddc] text-white rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                            <Plus size={20} />
                            Create Category
                        </button>
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-70 flex items-center justify-center z-50 p-4">
                        <div className="rounded-xl border max-w-md w-full" style={{ backgroundColor: '#0d0b13', borderColor: '#8088e2' }}>
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: '#191626' }}>
                                <h2 className="text-xl font-bold text-white">
                                    {editingCategory ? 'Edit Category' : 'Create New Category'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-[#191626] rounded-lg transition-all"
                                >
                                    <X className="text-[#8088e2]" size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-white font-medium mb-2">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-[#a3a7ec] transition-all text-white"
                                        style={{ backgroundColor: '#191626', borderColor: '#8088e2' }}
                                        placeholder="Enter category name"
                                    />
                                </div>

                                {/* Modal Footer */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-3 bg-[#191626] hover:bg-[#282544] text-white rounded-lg font-medium transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={loading || !formData.name.trim()}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#8088e2] to-[#6b7ddc] text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                                    >
                                        <Check size={20} />
                                        {loading ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
