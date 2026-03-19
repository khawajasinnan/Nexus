export type UserRole = 'entrepreneur' | 'investor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  bio: string;
  isOnline?: boolean;
  createdAt: string;
}

export interface Entrepreneur extends User {
  role: 'entrepreneur';
  startupName: string;
  pitchSummary: string;
  fundingNeeded: string;
  industry: string;
  location: string;
  foundedYear: number;
  teamSize: number;
}

export interface Investor extends User {
  role: 'investor';
  investmentInterests: string[];
  investmentStage: string[];
  portfolioCompanies: string[];
  totalInvestments: number;
  minimumInvestment: string;
  maximumInvestment: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface CollaborationRequest {
  id: string;
  investorId: string;
  entrepreneurId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  url: string;
  ownerId: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Calendar & Meeting Types

export interface AvailabilitySlot {
  id: string;
  userId: string;
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
  startTime: string; // "HH:mm" format
  endTime: string;   // "HH:mm" format
  isRecurring: boolean;
}

export type MeetingRequestStatus = 'pending' | 'accepted' | 'declined';

export interface MeetingRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  proposedDate: string; // ISO date string
  proposedStartTime: string; // "HH:mm"
  proposedEndTime: string;   // "HH:mm"
  message: string;
  status: MeetingRequestStatus;
  createdAt: string;
}

export type MeetingStatus = 'confirmed' | 'cancelled';

export interface Meeting {
  id: string;
  requestId: string;
  participants: string[]; // user IDs
  title: string;
  date: string;       // ISO date string
  startTime: string;  // "HH:mm"
  endTime: string;    // "HH:mm"
  status: MeetingStatus;
  notes?: string;
}

export interface MeetingContextType {
  availabilitySlots: AvailabilitySlot[];
  meetingRequests: MeetingRequest[];
  meetings: Meeting[];
  addSlot: (slot: Omit<AvailabilitySlot, 'id'>) => void;
  updateSlot: (id: string, updates: Partial<AvailabilitySlot>) => void;
  removeSlot: (id: string) => void;
  sendRequest: (request: Omit<MeetingRequest, 'id' | 'status' | 'createdAt'>) => void;
  acceptRequest: (requestId: string) => void;
  declineRequest: (requestId: string) => void;
  getUserMeetings: (userId: string) => Meeting[];
  getUserRequests: (userId: string) => { incoming: MeetingRequest[]; outgoing: MeetingRequest[] };
  getUserSlots: (userId: string) => AvailabilitySlot[];
}

// Document Chamber Types

export type DocumentStatus = 'draft' | 'in_review' | 'signed';

export interface DealDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'contract' | 'agreement';
  size: string;
  status: DocumentStatus;
  ownerId: string;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
  signatureData?: string; // base64 signature image
  signedBy?: string[];
  notes?: string;
}