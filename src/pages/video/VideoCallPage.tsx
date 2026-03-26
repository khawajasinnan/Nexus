import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Phone, PhoneOff, Mic, MicOff, Video, VideoOff,
    Monitor, MonitorOff, Users, Clock, Maximize2, Minimize2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { users } from '../../data/users';
import { Avatar } from '../../components/ui/Avatar';

type CallState = 'idle' | 'calling' | 'connected' | 'ended';

export const VideoCallPage: React.FC = () => {
    const { user } = useAuth();
    const [callState, setCallState] = useState<CallState>('idle');
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [selectedUser, setSelectedUser] = useState('');
    const [cameraError, setCameraError] = useState('');
    const location = useLocation();
    const locationState = location.state as { calleeId?: string } | null;

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const localStreamRef = useRef<MediaStream | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);

    const otherUsers = users.filter(u => u.id !== user?.id);
    const callee = users.find(u => u.id === selectedUser);

    // Timer effect
    useEffect(() => {
        if (callState === 'connected') {
            timerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            if (callState === 'idle') setCallDuration(0);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [callState]);

    // Auto-select callee from navigation state
    useEffect(() => {
        if (locationState?.calleeId && !selectedUser) {
            setSelectedUser(locationState.calleeId);
        }
    }, [locationState, selectedUser]);

    // Start camera
    const startCamera = useCallback(async () => {
        try {
            setCameraError('');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: 640, height: 480, facingMode: 'user' },
                audio: true,
            });
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            // Also show on remote as a mirror for demo
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }
        } catch (err: unknown) {
            console.error('Camera error:', err);
            setCameraError(err instanceof Error ? err.message : 'Could not access camera');
        }
    }, []);

    // Stop camera
    const stopCamera = useCallback(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach(track => track.stop());
            screenStreamRef.current = null;
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    }, []);

    // Toggle video
    const toggleVideo = useCallback(() => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoOn(videoTrack.enabled);
            }
        }
    }, []);

    // Toggle mic
    const toggleMic = useCallback(() => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    }, []);

    // Toggle screen share
    const toggleScreenShare = useCallback(async () => {
        if (isScreenSharing) {
            // Stop screen share, revert to camera on remote
            if (screenStreamRef.current) {
                screenStreamRef.current.getTracks().forEach(track => track.stop());
                screenStreamRef.current = null;
            }
            if (remoteVideoRef.current && localStreamRef.current) {
                remoteVideoRef.current.srcObject = localStreamRef.current;
            }
            setIsScreenSharing(false);
        } else {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: false,
                });
                screenStreamRef.current = screenStream;
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = screenStream;
                }
                setIsScreenSharing(true);
                // When user stops sharing via browser button
                screenStream.getVideoTracks()[0].onended = () => {
                    if (remoteVideoRef.current && localStreamRef.current) {
                        remoteVideoRef.current.srcObject = localStreamRef.current;
                    }
                    screenStreamRef.current = null;
                    setIsScreenSharing(false);
                };
            } catch (err) {
                console.error('Screen share error:', err);
            }
        }
    }, [isScreenSharing]);

    // Start call
    const startCall = useCallback(async () => {
        if (!selectedUser) return;
        setCallState('calling');
        await startCamera();
        setTimeout(() => setCallState('connected'), 2000);
    }, [selectedUser, startCamera]);

    // End call
    const endCall = useCallback(() => {
        setCallState('ended');
        stopCamera();
        setIsScreenSharing(false);
        setTimeout(() => {
            setCallState('idle');
            setIsMuted(false);
            setIsVideoOn(true);
            setCameraError('');
        }, 1500);
    }, [stopCamera]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, [stopCamera]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (!user) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <Video size={24} className="text-primary-600" />
                    <span>Video Call</span>
                </h1>
                <p className="text-gray-600 mt-1">Connect face-to-face with your network</p>
            </div>

            {/* Call Area */}
            <div className={`relative rounded-2xl overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
                style={isFullscreen ? {} : { aspectRatio: '16/9', maxHeight: '600px' }}
            >
                {/* Main video / dark bg */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                    <div className="absolute inset-0 opacity-5"
                        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
                    />
                </div>

                {/* Remote video (or screen share) */}
                {(callState === 'calling' || callState === 'connected') && (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                <div className="relative h-full flex flex-col" style={!isFullscreen ? { minHeight: '450px' } : {}}>
                    {/* Top bar */}
                    <div className="flex items-center justify-between p-4 z-10">
                        <div className="flex items-center space-x-3">
                            {callState === 'connected' && (
                                <>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-white/90 text-sm font-medium bg-black/30 px-2 py-0.5 rounded">Connected</span>
                                    <span className="text-white/80 text-sm flex items-center space-x-1 bg-black/30 px-2 py-0.5 rounded">
                                        <Clock size={13} />
                                        <span>{formatTime(callDuration)}</span>
                                    </span>
                                </>
                            )}
                            {callState === 'calling' && (
                                <>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
                                    <span className="text-white/90 text-sm font-medium bg-black/30 px-2 py-0.5 rounded">Calling...</span>
                                </>
                            )}
                            {callState === 'ended' && (
                                <span className="text-red-400 text-sm font-medium bg-black/30 px-2 py-0.5 rounded">Call ended</span>
                            )}
                            {isScreenSharing && callState === 'connected' && (
                                <span className="flex items-center space-x-1 bg-blue-500/30 px-2 py-0.5 rounded border border-blue-400/40">
                                    <Monitor size={13} className="text-blue-300" />
                                    <span className="text-blue-200 text-xs font-medium">Screen Sharing</span>
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 rounded-lg bg-black/30 hover:bg-black/50 text-white/80 transition-colors z-10"
                        >
                            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>

                    {/* Center content — idle/ended states */}
                    <div className="flex-1 flex items-center justify-center z-10">
                        {callState === 'idle' && (
                            <div className="text-center space-y-6 px-4">
                                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                                    <Video size={32} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Start a Video Call</h2>
                                    <p className="text-white/60 text-sm mt-1">Select a person and click Start Call</p>
                                </div>
                                <div className="max-w-xs mx-auto">
                                    <select
                                        value={selectedUser}
                                        onChange={e => setSelectedUser(e.target.value)}
                                        className="w-full rounded-xl bg-white/10 border border-white/20 text-white text-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500 backdrop-blur-sm"
                                    >
                                        <option value="" className="text-gray-900">Choose a participant...</option>
                                        {otherUsers.map(u => (
                                            <option key={u.id} value={u.id} className="text-gray-900">
                                                {u.name} ({u.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {cameraError && (
                                    <p className="text-red-400 text-xs">{cameraError}</p>
                                )}
                                <button
                                    onClick={startCall}
                                    disabled={!selectedUser}
                                    className="inline-flex items-center space-x-2 px-8 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
                                >
                                    <Phone size={18} />
                                    <span>Start Call</span>
                                </button>
                            </div>
                        )}

                        {callState === 'calling' && callee && (
                            <div className="text-center space-y-4">
                                <div className="animate-pulse">
                                    <Avatar src={callee.avatarUrl} alt={callee.name} size="lg" />
                                </div>
                                <div>
                                    <p className="text-white text-lg font-medium">{callee.name}</p>
                                    <p className="text-white/50 text-sm">Connecting camera...</p>
                                </div>
                            </div>
                        )}

                        {callState === 'ended' && (
                            <div className="text-center space-y-3">
                                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                                    <PhoneOff size={28} className="text-red-400" />
                                </div>
                                <p className="text-white/70 text-sm">Call duration: {formatTime(callDuration)}</p>
                            </div>
                        )}

                        {/* Connected state: show callee name overlay if no screen share */}
                        {callState === 'connected' && callee && !isScreenSharing && (
                            <div className="absolute top-16 left-4 z-10 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                <p className="text-white text-sm font-medium">{callee.name}</p>
                            </div>
                        )}
                    </div>

                    {/* Self-view PIP */}
                    {(callState === 'connected') && (
                        <div className="absolute bottom-24 right-4 w-44 h-32 rounded-xl border-2 border-white/20 shadow-lg overflow-hidden z-20 bg-gray-900">
                            <video
                                ref={localVideoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                                style={{ transform: 'scaleX(-1)' }}
                            />
                            {!isVideoOn && (
                                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                    <VideoOff size={20} className="text-white/40" />
                                </div>
                            )}
                            {isMuted && (
                                <div className="absolute top-1.5 right-1.5 p-1 bg-red-500 rounded-full">
                                    <MicOff size={10} className="text-white" />
                                </div>
                            )}
                            <div className="absolute bottom-1.5 left-1.5">
                                <span className="text-white/80 text-[10px] font-medium bg-black/40 px-1.5 py-0.5 rounded">You</span>
                            </div>
                        </div>
                    )}

                    {/* Controls bar */}
                    {(callState === 'connected' || callState === 'calling') && (
                        <div className="p-4 flex justify-center z-10">
                            <div className="inline-flex items-center space-x-3 px-6 py-3 bg-gray-800/80 backdrop-blur-md border border-white/10 rounded-2xl">
                                <button
                                    onClick={toggleMic}
                                    className={`p-3 rounded-xl transition-all ${isMuted ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                    title={isMuted ? 'Unmute' : 'Mute'}
                                >
                                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                                </button>

                                <button
                                    onClick={toggleVideo}
                                    className={`p-3 rounded-xl transition-all ${!isVideoOn ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                    title={isVideoOn ? 'Turn off video' : 'Turn on video'}
                                >
                                    {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                                </button>

                                <button
                                    onClick={toggleScreenShare}
                                    className={`p-3 rounded-xl transition-all ${isScreenSharing ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                    title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
                                >
                                    {isScreenSharing ? <MonitorOff size={20} /> : <Monitor size={20} />}
                                </button>

                                <div className="w-px h-8 bg-white/20" />

                                <button
                                    onClick={endCall}
                                    className="p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                                    title="End call"
                                >
                                    <PhoneOff size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Info cards — visible in idle */}
            {callState === 'idle' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                        <div className="flex items-center space-x-2">
                            <Users size={18} className="text-primary-600" />
                            <h3 className="text-sm font-semibold text-gray-900">Recent Contacts</h3>
                        </div>
                        <div className="space-y-2">
                            {otherUsers.slice(0, 4).map(u => (
                                <button
                                    key={u.id}
                                    onClick={() => setSelectedUser(u.id)}
                                    className={`w-full flex items-center space-x-3 p-2.5 rounded-lg transition-colors text-left ${selectedUser === u.id ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <Avatar src={u.avatarUrl} alt={u.name} size="sm" status={u.isOnline ? 'online' : 'offline'} />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{u.role}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900">Call Features</h3>
                        <ul className="space-y-2">
                            {[
                                { icon: <Video size={15} />, text: 'Live Camera Feed' },
                                { icon: <Monitor size={15} />, text: 'Screen Sharing' },
                                { icon: <Mic size={15} />, text: 'Audio Controls' },
                            ].map((item, i) => (
                                <li key={i} className="flex items-center space-x-2.5 text-sm text-gray-600">
                                    <span className="p-1.5 bg-primary-50 rounded-lg text-primary-600">{item.icon}</span>
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
                        <h3 className="text-sm font-semibold text-gray-900">How It Works</h3>
                        <ol className="space-y-2">
                            {['Select a participant', 'Click "Start Call" — camera activates', 'Toggle mic, video, or share your screen'].map((step, i) => (
                                <li key={i} className="flex items-start space-x-2 text-sm text-gray-600">
                                    <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            )}
        </div>
    );
};
