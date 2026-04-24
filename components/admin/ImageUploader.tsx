import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, AlertCircle, Trash2 } from 'lucide-react';
import { normalizeImagePath } from '../../lib/imageUtils';

interface ImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    storagePath?: string;
    label?: string;
    placeholder?: string;
    previewClass?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
    value,
    onChange,
    storagePath = 'uploads',
    label = 'Image',
    placeholder = 'https://... or /img/...',
    previewClass = 'w-24 h-24 rounded-xl object-cover border border-gray-200'
}) => {
    const [mode, setMode] = useState<'url' | 'upload'>('url');
    const [uploading, setUploading] = useState(false);
    const [imgError, setImgError] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { getFirebaseStorage } = await import('../../lib/firebase');
            const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
            const storage = await getFirebaseStorage();
            
            const storageRef = ref(storage, `${storagePath}/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            onChange(downloadURL);
            setImgError(false);
            alert('Image uploaded successfully!');
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <label className="block text-xs font-black uppercase text-slate-600 mb-2">{label}</label>

            {/* Toggle Buttons */}
            <div className="flex mb-3 bg-slate-100 rounded-xl p-1 max-w-xs">
                <button
                    type="button"
                    onClick={() => setMode('url')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${mode === 'url'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-600'
                        }`}
                >
                    <LinkIcon size={14} /> URL / Path
                </button>
                <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${mode === 'upload'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-600'
                        }`}
                >
                    <Upload size={14} /> Upload File
                </button>
            </div>

            {/* Input Area */}
            <div className="flex flex-col gap-4 items-start w-full">
                <div className="w-full relative">
                    {mode === 'url' ? (
                        <div className="relative w-full">
                            <input
                                value={value}
                                onChange={(e) => { setImgError(false); onChange(e.target.value); }}
                                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 rounded-2xl outline-none text-slate-800 transition-all pr-12"
                                placeholder={placeholder}
                            />
                            {value && (
                                <button
                                    type="button"
                                    onClick={() => { setImgError(false); onChange(''); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors p-1"
                                    title="Remove Image"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="relative w-full">
                            <div
                                onClick={() => fileRef.current?.click()}
                                className="w-full px-5 py-6 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
                            >
                                {uploading ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-sm font-bold text-blue-600">Uploading...</span>
                                    </div>
                                ) : (
                                    <>
                                        <ImageIcon size={28} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-blue-500 transition-colors">
                                            Click to choose file
                                        </span>
                                        <span className="text-[10px] text-slate-300">JPG, PNG, WEBP supported</span>
                                    </>
                                )}
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </div>
                            {value && (
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setImgError(false); onChange(''); }}
                                    className="absolute right-4 top-4 text-slate-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full shadow-sm border border-slate-200"
                                    title="Remove Image"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Preview */}
                {value && (
                    imgError ? (
                        <div className="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 border-red-300 bg-red-50 p-2 gap-1">
                            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                            <span className="text-[9px] text-red-600 text-center font-semibold leading-tight">Image not found</span>
                        </div>
                    ) : (
                        <img
                            src={normalizeImagePath(value)}
                            alt="Preview"
                            className={previewClass}
                            onError={() => setImgError(true)}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
