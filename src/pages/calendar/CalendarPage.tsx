import React, { useState, useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Plus, Calendar, Video } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AvailabilityManager } from '../../components/calendar/AvailabilityManager';
import { SendMeetingRequestModal } from '../../components/calendar/SendMeetingRequestModal';
import { useMeetings } from '../../context/MeetingContext';
import { useAuth } from '../../context/AuthContext';
import { findUserById } from '../../data/users';


export const CalendarPage: React.FC = () => {
    const { user } = useAuth();
    const { getUserMeetings, getUserSlots } = useMeetings();
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [prefillDate, setPrefillDate] = useState('');
    const [prefillTime, setPrefillTime] = useState('');

    if (!user) return null;

    const myMeetings = getUserMeetings(user.id);
    const mySlots = getUserSlots(user.id);

    // Build FullCalendar events
    const events = useMemo(() => {
        const meetingEvents = myMeetings.map(m => {
            const otherParticipantId = m.participants.find(p => p !== user.id) || '';
            const otherUser = findUserById(otherParticipantId);
            return {
                id: m.id,
                title: m.title,
                start: `${m.date}T${m.startTime}`,
                end: `${m.date}T${m.endTime}`,
                backgroundColor: '#3B82F6',
                borderColor: '#2563EB',
                textColor: '#ffffff',
                extendedProps: {
                    type: 'meeting',
                    participant: otherUser?.name || 'Unknown',
                    notes: m.notes,
                },
            };
        });

        // Generate recurring slot events for next 4 weeks
        const slotEvents: any[] = [];
        const today = new Date();
        for (const slot of mySlots) {
            for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
                const date = new Date(today);
                // find the next occurrence of this dayOfWeek
                const diff = (slot.dayOfWeek - today.getDay() + 7) % 7;
                date.setDate(today.getDate() + diff + weekOffset * 7);
                const dateStr = date.toISOString().split('T')[0];

                slotEvents.push({
                    id: `${slot.id}-w${weekOffset}`,
                    title: 'Available',
                    start: `${dateStr}T${slot.startTime}`,
                    end: `${dateStr}T${slot.endTime}`,
                    backgroundColor: '#CCFBF1',
                    borderColor: '#14B8A6',
                    textColor: '#0F766E',
                    display: 'block',
                    extendedProps: {
                        type: 'availability',
                    },
                });

                if (!slot.isRecurring) break;
            }
        }

        return [...meetingEvents, ...slotEvents];
    }, [myMeetings, mySlots, user.id]);

    const handleDateClick = (arg: any) => {
        setPrefillDate(arg.dateStr.split('T')[0]);
        setPrefillTime(arg.dateStr.includes('T') ? arg.dateStr.split('T')[1]?.substring(0, 5) : '');
        setShowRequestModal(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                        <Calendar size={24} className="text-primary-600" />
                        <span>Calendar</span>
                    </h1>
                    <p className="text-gray-600 mt-1">Manage your availability and meetings</p>
                </div>
                <Button
                    leftIcon={<Plus size={18} />}
                    onClick={() => {
                        setPrefillDate('');
                        setPrefillTime('');
                        setShowRequestModal(true);
                    }}
                >
                    New Meeting Request
                </Button>
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-sm bg-primary-500" />
                    <span className="text-xs text-gray-600">Confirmed Meetings</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-sm bg-secondary-200 border border-dashed border-secondary-400" />
                    <span className="text-xs text-gray-600">My Availability</span>
                </div>
            </div>

            {/* Calendar + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-2">
                    <Card>
                        <CardBody>
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek',
                                }}
                                events={events}
                                dateClick={handleDateClick}
                                editable={false}
                                selectable={true}
                                height="auto"
                                dayMaxEvents={3}
                                eventDisplay="block"
                                nowIndicator={true}
                            />
                        </CardBody>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Availability Manager */}
                    <Card>
                        <CardBody>
                            <AvailabilityManager />
                        </CardBody>
                    </Card>

                    {/* Upcoming meetings quick list */}
                    <Card>
                        <CardBody>
                            <div className="flex items-center space-x-2 mb-3">
                                <Video size={18} className="text-primary-600" />
                                <h3 className="text-sm font-semibold text-gray-900">Upcoming Meetings</h3>
                            </div>
                            {myMeetings.length > 0 ? (
                                <div className="space-y-2">
                                    {myMeetings.slice(0, 5).map(m => {
                                        const otherParticipantId = m.participants.find(p => p !== user.id) || '';
                                        const otherUser = findUserById(otherParticipantId);
                                        return (
                                            <div
                                                key={m.id}
                                                className="p-3 rounded-lg bg-primary-50 border border-primary-100"
                                            >
                                                <p className="text-sm font-medium text-gray-900">{m.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {new Date(m.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                                    {' · '}{m.startTime} — {m.endTime}
                                                </p>
                                                {otherUser && (
                                                    <p className="text-xs text-primary-600 mt-0.5">with {otherUser.name}</p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-500 text-center py-4">No upcoming meetings</p>
                            )}
                        </CardBody>
                    </Card>
                </div>
            </div>

            {/* Send request modal */}
            <SendMeetingRequestModal
                isOpen={showRequestModal}
                onClose={() => setShowRequestModal(false)}
                prefilledDate={prefillDate}
                prefilledTime={prefillTime}
            />
        </div>
    );
};
