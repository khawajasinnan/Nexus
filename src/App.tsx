import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MeetingProvider } from './context/MeetingContext';
import { PaymentProvider } from './context/PaymentContext';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Dashboard Pages
import { EntrepreneurDashboard } from './pages/dashboard/EntrepreneurDashboard';
import { InvestorDashboard } from './pages/dashboard/InvestorDashboard';

// Profile Pages
import { EntrepreneurProfile } from './pages/profile/EntrepreneurProfile';
import { InvestorProfile } from './pages/profile/InvestorProfile';

// Feature Pages
import { InvestorsPage } from './pages/investors/InvestorsPage';
import { EntrepreneursPage } from './pages/entrepreneurs/EntrepreneursPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { HelpPage } from './pages/help/HelpPage';
import { DealsPage } from './pages/deals/DealsPage';

// Calendar & Meeting Pages
import { CalendarPage } from './pages/calendar/CalendarPage';
import { MeetingsPage } from './pages/meetings/MeetingsPage';

// Video Call
import { VideoCallPage } from './pages/video/VideoCallPage';

// Chat Pages
import { ChatPage } from './pages/chat/ChatPage';

// Payment Pages
import { PaymentsPage } from './pages/payments/PaymentsPage';

// Landing Page
import { LandingPage } from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <MeetingProvider>
        <PaymentProvider>
          <Router>
            <Routes>
              {/* Authentication Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route path="entrepreneur" element={<EntrepreneurDashboard />} />
                <Route path="investor" element={<InvestorDashboard />} />
              </Route>

              {/* Profile Routes */}
              <Route path="/profile" element={<DashboardLayout />}>
                <Route path="entrepreneur/:id" element={<EntrepreneurProfile />} />
                <Route path="investor/:id" element={<InvestorProfile />} />
              </Route>

              {/* Feature Routes */}
              <Route path="/investors" element={<DashboardLayout />}>
                <Route index element={<InvestorsPage />} />
              </Route>

              <Route path="/entrepreneurs" element={<DashboardLayout />}>
                <Route index element={<EntrepreneursPage />} />
              </Route>

              <Route path="/messages" element={<DashboardLayout />}>
                <Route index element={<MessagesPage />} />
              </Route>

              <Route path="/notifications" element={<DashboardLayout />}>
                <Route index element={<NotificationsPage />} />
              </Route>

              {/* Calendar & Meetings Routes */}
              <Route path="/calendar" element={<DashboardLayout />}>
                <Route index element={<CalendarPage />} />
              </Route>

              <Route path="/meetings" element={<DashboardLayout />}>
                <Route index element={<MeetingsPage />} />
              </Route>

              <Route path="/video-call" element={<DashboardLayout />}>
                <Route index element={<VideoCallPage />} />
              </Route>

              <Route path="/documents" element={<DashboardLayout />}>
                <Route index element={<DocumentsPage />} />
              </Route>

              <Route path="/settings" element={<DashboardLayout />}>
                <Route index element={<SettingsPage />} />
              </Route>

              <Route path="/help" element={<DashboardLayout />}>
                <Route index element={<HelpPage />} />
              </Route>

              <Route path="/deals" element={<DashboardLayout />}>
                <Route index element={<DealsPage />} />
              </Route>

              <Route path="/payments" element={<DashboardLayout />}>
                <Route index element={<PaymentsPage />} />
              </Route>

              {/* Chat Routes */}
              <Route path="/chat" element={<DashboardLayout />}>
                <Route index element={<ChatPage />} />
                <Route path=":userId" element={<ChatPage />} />
              </Route>

              {/* Landing page */}
              <Route path="/" element={<LandingPage />} />

              {/* Catch all other routes and redirect to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </PaymentProvider>
      </MeetingProvider>
    </AuthProvider>
  );
}

export default App;