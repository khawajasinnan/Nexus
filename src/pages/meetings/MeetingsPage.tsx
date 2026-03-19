import React, { useState } from 'react';
import { Inbox, Send, CheckCircle, Calendar, Video } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { MeetingRequestCard } from '../../components/calendar/MeetingRequestCard';
import { useMeetings } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';
import { findUserById } from '../../data/users';

type Tab = 'incoming' | 'outgoing' | 'confirmed';

export const MeetingsPage: React.FC = () => {
    const { user } = useAuth();
    const { getUserRequests, getUserMeetings, acceptRequest, declineRequest } = useMeetings();
    const [activeTab, setActiveTab] = useState<Tab>('incoming');

    if (!user) return null;

    const { incoming, outgoing } = getUserRequests(user.id);
    const confirmedMeetings = getUserMeetings(user.id);
    const pendingIncoming = incoming.filter(r => r.status === 'pending').length;

    const tabs = [
        { key: 'incoming' as Tab, label: 'Incoming', icon: <Inbox size={16} />, count: pendingIncoming },
        { key: 'outgoing' as Tab, label: 'Outgoing', icon: <Send size={16} />, count: 0 },
        { key: 'confirmed' as Tab, label: 'Confirmed', icon: <CheckCircle size={16} />, count: confirmedMeetings.length },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <Video size={24} className="text-primary-600" />
                    <span>Meetings</span>
                </h1>
                <p className="text-gray-600 mt-1">Manage your meeting requests and schedule</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center space-x-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.key
                            ? 'bg-white text-primary-700 shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                            <Badge
                                variant={activeTab === tab.key ? 'primary' : 'gray'}
                                className="text-xs ml-1"
                            >
                                {tab.count}
                            </Badge>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div>
                {activeTab === 'incoming' && (
                    <div className="space-y-3">
                        {incoming.length > 0 ? (
                            incoming
                                .sort((a, b) => {
                                    // pending first
                                    if (a.status === 'pending' && b.status !== 'pending') return -1;
                                    if (a.status !== 'pending' && b.status === 'pending') return 1;
                                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                                })
                                .map(req => (
                                    <MeetingRequestCard
                                        key={req.id}
                                        request={req}
                                        type="incoming"
                                        onAccept={acceptRequest}
                                        onDecline={declineRequest}
                                    />
                                ))
                        ) : (
                            <EmptyState message="No incoming meeting requests" />
                        )}
                    </div>
                )}

                {activeTab === 'outgoing' && (
                    <div className="space-y-3">
                        {outgoing.length > 0 ? (
                            outgoing.map(req => (
                                <MeetingRequestCard key={req.id} request={req} type="outgoing" />
                            ))
                        ) : (
                            <EmptyState message="You haven't sent any meeting requests" />
                        )}
                    </div>
                )}

                {activeTab === 'confirmed' && (
                    <div className="space-y-3">
                        {confirmedMeetings.length > 0 ? (
                            confirmedMeetings.map(meeting => {
                                const otherParticipantId = meeting.participants.find(p => p !== user.id) || '';
                                const otherUser = findUserById(otherParticipantId);
                                return (
                                    <Card key={meeting.id} className="hover:shadow-soft transition-shadow">
                                        <CardBody>
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-1">
                                                    <h3 className="text-sm font-medium text-gray-900">{meeting.title}</h3>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar size={13} className="text-gray-400" />
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(meeting.date).toLocaleDateString('en-US', {
                                                                weekday: 'long',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                        <span className="text-xs text-gray-400">·</span>
                                                        <span className="text-xs text-gray-500">
                                                            {meeting.startTime} — {meeting.endTime}
                                                        </span>
                                                    </div>
                                                    {otherUser && (
                                                        <p className="text-xs text-primary-600">with {otherUser.name}</p>
                                                    )}
                                                    {meeting.notes && (
                                                        <p className="text-xs text-gray-500 mt-1">{meeting.notes}</p>
                                                    )}
                                                </div>
                                                <Badge variant="success" className="text-xs">Confirmed</Badge>
                                            </div>
                                        </CardBody>
                                    </Card>
                                );
                            })
                        ) : (
                            <EmptyState message="No confirmed meetings yet" />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const EmptyState: React.FC<{ message: string }> = ({ message }) => (
    <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-3">
            <Calendar size={22} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-500">{message}</p>
    </div>
);
