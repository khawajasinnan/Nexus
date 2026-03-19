import React from 'react';
import { Check, X, Clock, Send } from 'lucide-react';
import { MeetingRequest } from '../../types';
import { findUserById } from '../../data/users';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface MeetingRequestCardProps {
    request: MeetingRequest;
    type: 'incoming' | 'outgoing';
    onAccept?: (requestId: string) => void;
    onDecline?: (requestId: string) => void;
}

export const MeetingRequestCard: React.FC<MeetingRequestCardProps> = ({
    request,
    type,
    onAccept,
    onDecline,
}) => {
    const otherUserId = type === 'incoming' ? request.fromUserId : request.toUserId;
    const otherUser = findUserById(otherUserId);

    const statusBadge = {
        pending: <Badge variant="warning" className="text-xs">Pending</Badge>,
        accepted: <Badge variant="success" className="text-xs">Accepted</Badge>,
        declined: <Badge variant="error" className="text-xs">Declined</Badge>,
    };

    const formattedDate = new Date(request.proposedDate).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    return (
        <div className="p-4 rounded-xl border border-gray-100 bg-white hover:shadow-soft transition-all duration-200 animate-fade-in">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    <Avatar
                        src={otherUser?.avatarUrl || ''}
                        alt={otherUser?.name || 'User'}
                        size="sm"
                    />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {otherUser?.name || 'Unknown User'}
                            </p>
                            {type === 'incoming' ? (
                                <span className="text-xs text-gray-400">sent you a request</span>
                            ) : (
                                <span className="text-xs text-gray-400">
                                    <Send size={10} className="inline mr-0.5" />
                                    sent
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                            <Clock size={12} className="text-gray-400" />
                            <span className="text-xs text-gray-500">
                                {formattedDate} · {request.proposedStartTime} — {request.proposedEndTime}
                            </span>
                        </div>
                        {request.message && (
                            <p className="text-xs text-gray-600 mt-2 line-clamp-2">{request.message}</p>
                        )}
                    </div>
                </div>
                {statusBadge[request.status]}
            </div>

            {/* Actions for incoming pending requests */}
            {type === 'incoming' && request.status === 'pending' && (
                <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-50">
                    <Button
                        size="xs"
                        variant="success"
                        leftIcon={<Check size={14} />}
                        onClick={() => onAccept?.(request.id)}
                    >
                        Accept
                    </Button>
                    <Button
                        size="xs"
                        variant="error"
                        leftIcon={<X size={14} />}
                        onClick={() => onDecline?.(request.id)}
                    >
                        Decline
                    </Button>
                </div>
            )}
        </div>
    );
};
