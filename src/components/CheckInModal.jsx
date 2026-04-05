import { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, Scan, Image as ImageIcon } from 'lucide-react';
import './CheckInModal.css';

export default function CheckInModal({ onClose, onConfirm }) {
    const [stream, setStream] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [facingMode, setFacingMode] = useState('user');
    const [error, setError] = useState('');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // Initialize camera
    useEffect(() => {
        async function startCamera() {
            try {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode }
                });
                setStream(newStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;
                }
                setError('');
            } catch (err) {
                console.error("Camera error:", err);
                setError('Camera access denied or unavailable. Tap to use a mocked photo instead.');
            }
        }
        
        if (!photo) startCamera();

        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facingMode, photo]);

    function takePhoto() {
        if (!stream) {
            // Mock photo fallback
            setPhoto('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop');
            return;
        }
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0);
        setPhoto(canvas.toDataURL('image/jpeg', 0.8));
    }

    function switchCamera() {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    }

    function submit() {
        if (photo) {
            onConfirm(photo);
        }
    }

    return (
        <div className="checkin-overlay">
            <div className="checkin-modal">
                {/* Header */}
                <div className="checkin-header">
                    <div className="checkin-title">
                        <Scan size={18} color="var(--c-volt)" /> Time to be real.
                    </div>
                    <button className="checkin-close" onClick={onClose}><X size={20} /></button>
                </div>

                {/* Viewport */}
                <div className="checkin-viewport">
                    {!photo ? (
                        <>
                            <video ref={videoRef} autoPlay playsInline muted className="checkin-video" />
                            {error && (
                                <div className="checkin-error-overlay" onClick={takePhoto}>
                                    <ImageIcon size={32} opacity={0.5} />
                                    <p>{error}</p>
                                </div>
                            )}
                            <div className="checkin-hud">
                                <div className="hud-corner top-left" />
                                <div className="hud-corner top-right" />
                                <div className="hud-corner bottom-left" />
                                <div className="hud-corner bottom-right" />
                            </div>
                        </>
                    ) : (
                        <div className="checkin-preview">
                            <img src={photo} alt="Check in" className="checkin-photo" />
                            <div className="checkin-stamp">
                                <div>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                <div style={{ fontSize: 10, opacity: 0.8 }}>AJWAA GYM CHECK-IN</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="checkin-controls">
                    {!photo ? (
                        <>
                            <button className="checkin-btn-secondary" onClick={switchCamera}>
                                Flip
                            </button>
                            <button className="checkin-shutter" onClick={takePhoto}>
                                <div className="checkin-shutter-inner" />
                            </button>
                            <div className="checkin-btn-spacer" />
                        </>
                    ) : (
                        <>
                            <button className="checkin-btn-secondary" onClick={() => setPhoto(null)}>
                                Retake
                            </button>
                            <button className="checkin-btn-primary" onClick={submit}>
                                <Check size={18} /> Post Check-in
                            </button>
                        </>
                    )}
                </div>

                {/* Hidden canvas for capture */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
        </div>
    );
}
