import React, { createContext, useContext, useState, useCallback } from 'react';
import {
    AvailabilitySlot,
    MeetingRequest,
    Meeting,
    MeetingContextType,
} from '../types';
import {
    initialAvailabilitySlots,
    initialMeetingRequests,
    initialMeetings,
    generateSlotId,
    generateRequestId,
    generateMeetingId,
} from '../data/meetings';
import { findUserById } from '../data/users';

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const useMeetings = (): MeetingContextType => {
    const context = useContext(MeetingContext);
    if (!context) {
        throw new Error('useMeetings must be used within a MeetingProvider');
    }
    return context;
};

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>(initialAvailabilitySlots);
    const [meetingRequests, setMeetingRequests] = useState<MeetingRequest[]>(initialMeetingRequests);
    const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);

    const addSlot = useCallback((slot: Omit<AvailabilitySlot, 'id'>) => {
        const newSlot: AvailabilitySlot = { ...slot, id: generateSlotId() };
        setAvailabilitySlots(prev => [...prev, newSlot]);
    }, []);

    const updateSlot = useCallback((id: string, updates: Partial<AvailabilitySlot>) => {
        setAvailabilitySlots(prev =>
            prev.map(slot => (slot.id === id ? { ...slot, ...updates } : slot))
        );
    }, []);

    const removeSlot = useCallback((id: string) => {
        setAvailabilitySlots(prev => prev.filter(slot => slot.id !== id));
    }, []);

    const sendRequest = useCallback(
        (request: Omit<MeetingRequest, 'id' | 'status' | 'createdAt'>) => {
            const newRequest: MeetingRequest = {
                ...request,
                id: generateRequestId(),
                status: 'pending',
                createdAt: new Date().toISOString(),
            };
            setMeetingRequests(prev => [...prev, newRequest]);
        },
        []
    );

    const acceptRequest = useCallback(
        (requestId: string) => {
            setMeetingRequests(prev => {
                const updated = prev.map(req =>
                    req.id === requestId ? { ...req, status: 'accepted' as const } : req
                );

                // Find the accepted request and create a meeting
                const acceptedReq = updated.find(req => req.id === requestId);
                if (acceptedReq) {
                    const fromUser = findUserById(acceptedReq.fromUserId);
                    const toUser = findUserById(acceptedReq.toUserId);
                    const title = `Meeting — ${fromUser?.name || 'User'} & ${toUser?.name || 'User'}`;

                    const newMeeting: Meeting = {
                        id: generateMeetingId(),
                        requestId: acceptedReq.id,
                        participants: [acceptedReq.fromUserId, acceptedReq.toUserId],
                        title,
                        date: acceptedReq.proposedDate,
                        startTime: acceptedReq.proposedStartTime,
                        endTime: acceptedReq.proposedEndTime,
                        status: 'confirmed',
                    };
                    setMeetings(prevMeetings => [...prevMeetings, newMeeting]);
                }

                return updated;
            });
        },
        []
    );

    const declineRequest = useCallback((requestId: string) => {
        setMeetingRequests(prev =>
            prev.map(req =>
                req.id === requestId ? { ...req, status: 'declined' as const } : req
            )
        );
    }, []);

    const getUserMeetings = useCallback(
        (userId: string) =>
            meetings.filter(
                m => m.status === 'confirmed' && m.participants.includes(userId)
            ),
        [meetings]
    );

    const getUserRequests = useCallback(
        (userId: string) => ({
            incoming: meetingRequests.filter(req => req.toUserId === userId),
            outgoing: meetingRequests.filter(req => req.fromUserId === userId),
        }),
        [meetingRequests]
    );

    const getUserSlots = useCallback(
        (userId: string) => availabilitySlots.filter(slot => slot.userId === userId),
        [availabilitySlots]
    );

    return (
        <MeetingContext.Provider
            value={{
                availabilitySlots,
                meetingRequests,
                meetings,
                addSlot,
                updateSlot,
                removeSlot,
                sendRequest,
                acceptRequest,
                declineRequest,
                getUserMeetings,
                getUserRequests,
                getUserSlots,
            }}
        >
            {children}
        </MeetingContext.Provider>
    );
};
