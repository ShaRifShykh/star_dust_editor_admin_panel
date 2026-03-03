import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, X, CheckCircle } from 'lucide-react';

export default function UploadEffects() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [files, setFiles] = useState([]);
    const [dragActive, setDragActive] = useState(false);

    const API = import.meta.env.VITE_API_BASE_URL;

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API}/categories`);
                setCategories(res.data);
                setSelectedCategory(res.data[0]?.id || null);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (fileList) => {
        const validFiles = Array.from(fileList).filter(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            return ext === 'gif' || ext === 'webm';
        });

        const newFiles = validFiles.map((file, index) => ({
            id: Date.now() + index,
            file: file,
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            type: file.type,
            status: 'ready',
            preview: URL.createObjectURL(file)
        }));

        setFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const uploadFiles = async () => {
        setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' })));

        const uploaded = [];

        for (let file of files) {
            const formData = new FormData();
            formData.append('name', file.name);
            formData.append('category_id', selectedCategory);
            formData.append('file', file.file);

            try {
                await axios.post(`${API}/effects`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                uploaded.push({ ...file, status: 'success' });
            } catch (err) {
                console.error('Upload error:', err);
                uploaded.push({ ...file, status: 'error' });
            }
        }

        setFiles(uploaded);
    };

    return (
        <div className="space-y-6" style={{ backgroundColor: '#0d0b13', minHeight: '100vh' }}>
            <div>
                <h2 className="text-2xl font-bold mb-2 text-white">Upload Effects</h2>
                <p style={{ color: '#8088e2' }}>Upload animation effects in GIF or WebM format</p>
            </div>

            {/* Category Selection */}
            <div style={{ backgroundColor: '#0d0b13', borderColor: '#8088e2' }} className="rounded-xl p-6 border">
                <label className="block text-white font-medium mb-3">Select Category</label>
                <div className="grid grid-cols-5 gap-3">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            style={{
                                backgroundColor: selectedCategory === category.id ? '#8088e2' : '#1a1727',
                                color: selectedCategory === category.id ? '#fff' : '#c0c0f0'
                            }}
                            className="px-4 cursor-pointer py-2 rounded-lg font-medium transition-all"
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Upload Area */}
            <div
                className={`rounded-xl p-12 border-2 border-dashed transition-all`}
                style={{
                    borderColor: dragActive ? '#8088e2' : '#2a273b',
                    backgroundColor: dragActive ? '#1c1a2b' : '#0d0b13'
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="text-center">
                    <div style={{ background: '#8088e2' }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="text-white" size={32} />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">Drag & Drop Files Here</h3>
                    <p style={{ color: '#8088e2' }} className="mb-4">or</p>
                    <label className="inline-block">
                        <input
                            type="file"
                            multiple
                            accept=".gif,.webm"
                            onChange={handleChange}
                            className="hidden"
                        />
                        <span className="px-6 py-3 rounded-lg font-medium cursor-pointer hover:shadow-lg transition-all inline-block"
                            style={{ background: '#8088e2', color: 'white' }}>
                            Browse Files
                        </span>
                    </label>
                    <p className="text-sm mt-4" style={{ color: '#8088e2' }}>Supported formats: GIF, WebM</p>
                </div>
            </div>

            {/* Files List */}
            {files.length > 0 && (
                <div className="rounded-xl p-6 border" style={{ backgroundColor: '#0d0b13', borderColor: '#8088e2' }}>
                    <h3 className="text-white font-semibold mb-4">Files ({files.length})</h3>
                    <div className="space-y-3">
                        {files.map((file) => (
                            <div key={file.id} className="flex items-center gap-4 rounded-lg p-4" style={{ backgroundColor: '#1a1727' }}>
                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: '#2a273b' }}>
                                    {file.type.includes('gif') && (
                                        <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                                    )}
                                    {file.type.includes('webm') && (
                                        <video src={file.preview} className="w-full h-full object-cover" muted />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{file.name}</p>
                                    <p style={{ color: '#8088e2' }} className="text-sm">{file.size}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {file.status === 'ready' && (
                                        <span style={{ color: '#8088e2' }} className="text-sm">Ready</span>
                                    )}
                                    {file.status === 'uploading' && (
                                        <div className="w-5 h-5 border-2 border-[#8088e2] border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                    {file.status === 'success' && (
                                        <CheckCircle className="text-green-500" size={20} />
                                    )}
                                    {file.status === 'error' && (
                                        <span className="text-red-500 text-sm">Failed</span>
                                    )}

                                    <button
                                        onClick={() => removeFile(file.id)}
                                        className="p-1 hover:text-red-500 hover:bg-[#2a273b] rounded transition-all"
                                        style={{ color: '#8088e2' }}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={uploadFiles}
                        disabled={files.every(f => f.status !== 'ready')}
                        className="w-full mt-4 px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: '#8088e2',
                            color: 'white'
                        }}
                    >
                        Upload All Files
                    </button>
                </div>
            )}
        </div>
    );
}