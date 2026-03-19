import React, { useState } from 'react';
import { X, Send, Calendar, Clock, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useMeetings } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';
import { users } from '../../data/users';

interface SendMeetingRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    prefilledDate?: string;
    prefilledTime?: string;
    prefilledUserId?: string;
}

export const SendMeetingRequestModal: React.FC<SendMeetingRequestModalProps> = ({
    isOpen,
    onClose,
    prefilledDate = '',
    prefilledTime = '',
    prefilledUserId = '',
}) => {
    const { user } = useAuth();
    const { sendRequest } = useMeetings();

    const [toUserId, setToUserId] = useState(prefilledUserId);
    const [proposedDate, setProposedDate] = useState(prefilledDate);
    const [proposedStartTime, setProposedStartTime] = useState(prefilledTime || '10:00');
    const [proposedEndTime, setProposedEndTime] = useState(
        prefilledTime ? incrementTime(prefilledTime, 30) : '10:30'
    );
    const [message, setMessage] = useState('');

    if (!isOpen || !user) return null;

    // Show other users only (exclude current user)
    const otherUsers = users.filter(u => u.id !== user.id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!toUserId || !proposedDate || !proposedStartTime || !proposedEndTime) return;

        sendRequest({
            fromUserId: user.id,
            toUserId,
            proposedDate,
            proposedStartTime,
            proposedEndTime,
            message,
        });

        // Reset & close
        setToUserId('');
        setProposedDate('');
        setProposedStartTime('10:00');
        setProposedEndTime('10:30');
        setMessage('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 animate-bounce-in overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700">
                    <div className="flex items-center space-x-2">
                        <Calendar size={18} className="text-white" />
                        <h2 className="text-lg font-semibold text-white">Send Meeting Request</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* To User */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                            <User size={14} className="mr-1.5" />
                            Send to
                        </label>
                        <select
                            value={toUserId}
                            onChange={e => setToUserId(e.target.value)}
                            className="w-full rounded-lg border-gray-200 text-sm py-2.5 px-3 focus:ring-primary-500 focus:border-primary-500"
                            required
                        >
                            <option value="">Select a person...</option>
                            {otherUsers.map(u => (
                                <option key={u.id} value={u.id}>
                                    {u.name} ({u.role})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date */}
                    <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                            <Calendar size={14} className="mr-1.5" />
                            Proposed Date
                        </label>
                        <input
                            type="date"
                            value={proposedDate}
                            onChange={e => setProposedDate(e.target.value)}
                            className="w-full rounded-lg border-gray-200 text-sm py-2.5 px-3 focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                    </div>

                    {/* Time */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                                <Clock size={14} className="mr-1.5" />
                                Start
                            </label>
                            <input
                                type="time"
                                value={proposedStartTime}
                                onChange={e => setProposedStartTime(e.target.value)}
                                className="w-full rounded-lg border-gray-200 text-sm py-2.5 px-3 focus:ring-primary-500 focus:border-primary-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-1.5">
                                <Clock size={14} className="mr-1.5" />
                                End
                            </label>
                            <input
                                type="time"
                                value={proposedEndTime}
                                onChange={e => setProposedEndTime(e.target.value)}
                                className="w-full rounded-lg border-gray-200 text-sm py-2.5 px-3 focus:ring-primary-500 focus:border-primary-500"
                                required
                            />
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Message (optional)</label>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Add a brief note about the meeting..."
                            rows={3}
                            className="w-full rounded-lg border-gray-200 text-sm py-2.5 px-3 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 pt-2">
                        <Button type="submit" fullWidth leftIcon={<Send size={16} />}>
                            Send Request
                        </Button>
                        <Button type="button" variant="outline" fullWidth onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Helper to increment time by N minutes
function incrementTime(time: string, minutes: number): string {
    const [h, m] = time.split(':').map(Number);
    const totalMin = h * 60 + m + minutes;
    const newH = Math.floor(totalMin / 60) % 24;
    const newM = totalMin % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}
