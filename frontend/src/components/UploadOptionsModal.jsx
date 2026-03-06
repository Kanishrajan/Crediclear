import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Camera, X, RefreshCw, Check, Monitor } from 'lucide-react';

export default function UploadOptionsModal({ isOpen, onClose, onFileSelected, fileInputRef }) {
    const [mode, setMode] = useState('choose'); // 'choose' | 'camera'
    const [cameraStream, setCameraStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [cameraError, setCameraError] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const stopCamera = useCallback(() => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
    }, [cameraStream]);

    const handleClose = useCallback(() => {
        stopCamera();
        setMode('choose');
        setCapturedImage(null);
        setCameraError(null);
        onClose();
    }, [stopCamera, onClose]);

    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraStream]);

    const startCamera = async () => {
        setMode('camera');
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Camera access error:', err);
            setCameraError('Unable to access camera. Please check browser permissions or use file upload instead.');
        }
    };

    // Bind stream to video element when both are ready
    useEffect(() => {
        if (videoRef.current && cameraStream) {
            videoRef.current.srcObject = cameraStream;
        }
    }, [cameraStream, mode]);

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedImage(dataUrl);
        stopCamera();
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        startCamera();
    };

    const confirmCapture = () => {
        if (!capturedImage) return;
        // Convert data URL to a File object
        const arr = capturedImage.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        const n = bstr.length;
        const u8arr = new Uint8Array(n);
        for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
        const file = new File([u8arr], `captured_document_${Date.now()}.png`, { type: mime });
        onFileSelected(file);
        handleClose();
    };

    const handleFileUpload = () => {
        if (fileInputRef?.current) {
            fileInputRef.current.click();
        }
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                animation: 'fadeIn 0.2s ease',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e0e7ff',
                width: mode === 'camera' ? '560px' : '420px',
                maxWidth: '95vw',
                boxShadow: '0 20px 60px rgba(99,102,241,0.15), 0 4px 16px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                animation: 'fadeIn 0.3s ease',
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #f5f3ff, #ecfdf5)',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #e0e7ff',
                }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e', fontFamily: 'Outfit' }}>
                        {mode === 'choose' ? 'Upload Document' : mode === 'camera' ? 'Capture Document' : 'Upload Document'}
                    </div>
                    <button
                        onClick={handleClose}
                        style={{
                            width: '28px', height: '28px', borderRadius: '6px',
                            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >
                        <X size={14} color="#6366f1" />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                    {mode === 'choose' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* File upload option */}
                            <button
                                id="upload-from-device"
                                onClick={handleFileUpload}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                    padding: '18px 20px',
                                    background: '#f8fafc',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'left',
                                    fontFamily: 'Inter',
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = '#f0f0ff'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
                                onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                            >
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.05))',
                                    border: '1px solid rgba(99,102,241,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Upload size={22} color="#6366f1" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>
                                        Upload from Device
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                                        Choose a PDF file from your device
                                    </div>
                                </div>
                            </button>

                            {/* Camera option */}
                            <button
                                id="capture-with-camera"
                                onClick={startCamera}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                    padding: '18px 20px',
                                    background: '#f8fafc',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    textAlign: 'left',
                                    fontFamily: 'Inter',
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = '#ecfdf5'; e.currentTarget.style.borderColor = '#a7f3d0'; }}
                                onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                            >
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(16,185,129,0.05))',
                                    border: '1px solid rgba(16,185,129,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <Camera size={22} color="#10b981" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#1a1a2e', marginBottom: '4px' }}>
                                        Capture using Camera
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                                        Take a photo or scan of the document
                                    </div>
                                </div>
                            </button>

                            <div style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginTop: '4px' }}>
                                Supported: PDF files • Captured images will be processed as documents
                            </div>
                        </div>
                    )}

                    {mode === 'camera' && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                            {cameraError ? (
                                <div style={{
                                    width: '100%',
                                    padding: '24px',
                                    background: 'rgba(239,68,68,0.06)',
                                    border: '1px solid rgba(239,68,68,0.2)',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                }}>
                                    <Camera size={32} color="#94a3b8" style={{ marginBottom: '12px' }} />
                                    <div style={{ fontSize: '13px', color: '#dc2626', marginBottom: '12px' }}>{cameraError}</div>
                                    <button
                                        onClick={() => { setMode('choose'); setCameraError(null); }}
                                        className="btn-secondary"
                                        style={{ fontSize: '12px' }}
                                    >
                                        <Upload size={14} /> Use File Upload
                                    </button>
                                </div>
                            ) : capturedImage ? (
                                <>
                                    <div style={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        border: '2px solid #10b981',
                                    }}>
                                        <img
                                            src={capturedImage}
                                            alt="Captured document"
                                            style={{ width: '100%', display: 'block' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                        <button
                                            onClick={retakePhoto}
                                            style={{
                                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                padding: '12px', borderRadius: '10px',
                                                background: '#f8fafc', border: '1px solid #e5e7eb',
                                                cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                                                color: '#64748b', fontFamily: 'Inter',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseOver={e => { e.currentTarget.style.background = '#f1f5f9'; }}
                                            onMouseOut={e => { e.currentTarget.style.background = '#f8fafc'; }}
                                        >
                                            <RefreshCw size={14} /> Retake
                                        </button>
                                        <button
                                            onClick={confirmCapture}
                                            style={{
                                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                padding: '12px', borderRadius: '10px',
                                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                                border: 'none',
                                                cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                                                color: 'white', fontFamily: 'Inter',
                                                transition: 'all 0.2s',
                                            }}
                                        >
                                            <Check size={14} /> Use Photo
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{
                                        width: '100%',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        background: '#000',
                                        position: 'relative',
                                        minHeight: '280px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            style={{ width: '100%', display: 'block' }}
                                        />
                                        {!cameraStream && (
                                            <div style={{
                                                position: 'absolute',
                                                display: 'flex', flexDirection: 'column',
                                                alignItems: 'center', gap: '8px',
                                            }}>
                                                <div style={{
                                                    width: '40px', height: '40px',
                                                    border: '3px solid rgba(255,255,255,0.2)',
                                                    borderTop: '3px solid white',
                                                    borderRadius: '50%',
                                                    animation: 'spin-slow 0.8s linear infinite',
                                                }} />
                                                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Starting camera...</span>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                        <button
                                            onClick={() => { stopCamera(); setMode('choose'); }}
                                            style={{
                                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                padding: '12px', borderRadius: '10px',
                                                background: '#f8fafc', border: '1px solid #e5e7eb',
                                                cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                                                color: '#64748b', fontFamily: 'Inter',
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={capturePhoto}
                                            disabled={!cameraStream}
                                            style={{
                                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                padding: '12px', borderRadius: '10px',
                                                background: cameraStream ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#e5e7eb',
                                                border: 'none',
                                                cursor: cameraStream ? 'pointer' : 'not-allowed',
                                                fontSize: '13px', fontWeight: 600,
                                                color: cameraStream ? 'white' : '#94a3b8', fontFamily: 'Inter',
                                            }}
                                        >
                                            <Camera size={14} /> Capture
                                        </button>
                                    </div>
                                </>
                            )}
                            <canvas ref={canvasRef} style={{ display: 'none' }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
