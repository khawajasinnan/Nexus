import { AvailabilitySlot, MeetingRequest, Meeting } from '../types';

// Seed availability slots
export const initialAvailabilitySlots: AvailabilitySlot[] = [
    {
        id: 'slot1',
        userId: 'e1',
        dayOfWeek: 1, // Monday
        startTime: '09:00',
        endTime: '11:00',
        isRecurring: true,
    },
    {
        id: 'slot2',
        userId: 'e1',
        dayOfWeek: 3, // Wednesday
        startTime: '14:00',
        endTime: '16:00',
        isRecurring: true,
    },
    {
        id: 'slot3',
        userId: 'i1',
        dayOfWeek: 2, // Tuesday
        startTime: '10:00',
        endTime: '12:00',
        isRecurring: true,
    },
    {
        id: 'slot4',
        userId: 'i2',
        dayOfWeek: 4, // Thursday
        startTime: '13:00',
        endTime: '15:00',
        isRecurring: true,
    },
    {
        id: 'slot5',
        userId: 'i1',
        dayOfWeek: 4, // Thursday
        startTime: '14:00',
        endTime: '16:00',
        isRecurring: true,
    },
    {
        id: 'slot6',
        userId: 'e2',
        dayOfWeek: 5, // Friday
        startTime: '10:00',
        endTime: '12:00',
        isRecurring: true,
    },
];

// Helper: get a future date string for a given day offset
const getFutureDate = (daysFromNow: number): string => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split('T')[0];
};

// Seed meeting requests — all use future dates
export const initialMeetingRequests: MeetingRequest[] = [
    {
        id: 'mreq1',
        fromUserId: 'i1',
        toUserId: 'e1',
        proposedDate: getFutureDate(2),
        proposedStartTime: '09:00',
        proposedEndTime: '09:30',
        message: 'Would love to discuss TechWave AI\'s roadmap and potential investment opportunities.',
        status: 'accepted',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'mreq2',
        fromUserId: 'i3',
        toUserId: 'e3',
        proposedDate: getFutureDate(4),
        proposedStartTime: '14:00',
        proposedEndTime: '14:45',
        message: 'Interested in learning more about HealthPulse\'s traction metrics.',
        status: 'pending',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'mreq3',
        fromUserId: 'i2',
        toUserId: 'e2',
        proposedDate: getFutureDate(5),
        proposedStartTime: '10:00',
        proposedEndTime: '10:30',
        message: 'Let\'s discuss scaling the biodegradable packaging line.',
        status: 'pending',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'mreq4',
        fromUserId: 'e1',
        toUserId: 'i2',
        proposedDate: getFutureDate(3),
        proposedStartTime: '11:00',
        proposedEndTime: '11:30',
        message: 'I\'d like to present our Q1 results and discuss next steps.',
        status: 'pending',
        createdAt: new Date().toISOString(),
    },
];

// Seed confirmed meetings — use future dates
export const initialMeetings: Meeting[] = [
    {
        id: 'meet1',
        requestId: 'mreq1',
        participants: ['i1', 'e1'],
        title: 'Investment Discussion — TechWave AI',
        date: getFutureDate(2),
        startTime: '09:00',
        endTime: '09:30',
        status: 'confirmed',
        notes: 'Discuss Series A roadmap and financial projections.',
    },
    {
        id: 'meet2',
        requestId: '',
        participants: ['i2', 'e2'],
        title: 'GreenLife Scaling Strategy',
        date: getFutureDate(6),
        startTime: '11:00',
        endTime: '11:45',
        status: 'confirmed',
        notes: 'Review supply chain partnerships and market expansion.',
    },
    {
        id: 'meet3',
        requestId: '',
        participants: ['i1', 'e3'],
        title: 'HealthPulse Demo Review',
        date: getFutureDate(8),
        startTime: '15:00',
        endTime: '15:45',
        status: 'confirmed',
        notes: 'Product demonstration and market fit discussion.',
    },
];

// ID counters
let slotIdCounter = initialAvailabilitySlots.length;
let requestIdCounter = initialMeetingRequests.length;
let meetingIdCounter = initialMeetings.length;

export const generateSlotId = () => `slot${++slotIdCounter}`;
export const generateRequestId = () => `mreq${++requestIdCounter}`;
export const generateMeetingId = () => `meet${++meetingIdCounter}`;
