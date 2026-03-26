import React from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Users, Calendar, Video, FileText, Wallet, Shield,
    Sparkles, TrendingUp, Building2, CircleDollarSign, ChevronRight, Zap
} from 'lucide-react';

/* ─── Animated background blobs ─── */
const FloatingBlobs: React.FC = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-secondary-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-accent-400/15 rounded-full blur-3xl animate-blob animation-delay-4000" />
    </div>
);

/* ─── Feature card ─── */
const FeatureCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: string;
    gradient: string;
}> = ({ icon, title, description, delay, gradient }) => (
    <div className={`group relative p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 animate-slide-up-fade ${delay}`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-50/0 to-secondary-50/0 group-hover:from-primary-50/50 group-hover:to-secondary-50/30 transition-all duration-500 pointer-events-none" />
    </div>
);

/* ─── Stat counter ─── */
const StatItem: React.FC<{ value: string; label: string; delay: string }> = ({ value, label, delay }) => (
    <div className={`text-center animate-slide-up-fade ${delay}`}>
        <p className="text-3xl md:text-4xl font-bold gradient-text">{value}</p>
        <p className="text-sm text-gray-500 mt-1 font-medium">{label}</p>
    </div>
);

/* ─── Main Landing Page ─── */
export const LandingPage: React.FC = () => {
    const features = [
        {
            icon: <Users size={22} />,
            title: 'Smart Matching',
            description: 'AI-powered matching connects investors with the right startups based on industry, stage, and interests.',
            gradient: 'bg-gradient-to-br from-primary-500 to-primary-700',
        },
        {
            icon: <Calendar size={22} />,
            title: 'Meeting Calendar',
            description: 'Integrated scheduling with availability management, meeting requests, and calendar sync.',
            gradient: 'bg-gradient-to-br from-secondary-500 to-secondary-700',
        },
        {
            icon: <Video size={22} />,
            title: 'Video Calls',
            description: 'Built-in video conferencing with screen share, mic/camera controls, and PIP view.',
            gradient: 'bg-gradient-to-br from-purple-500 to-purple-700',
        },
        {
            icon: <FileText size={22} />,
            title: 'Document Chamber',
            description: 'Upload, preview, and e-sign contracts and agreements with full status tracking.',
            gradient: 'bg-gradient-to-br from-orange-500 to-orange-700',
        },
        {
            icon: <Wallet size={22} />,
            title: 'Payment Hub',
            description: 'Wallet management, transaction history, and seamless funding flows between parties.',
            gradient: 'bg-gradient-to-br from-green-500 to-green-700',
        },
        {
            icon: <Shield size={22} />,
            title: 'Secure Access',
            description: 'Two-factor authentication, password strength enforcement, and role-based access control.',
            gradient: 'bg-gradient-to-br from-red-500 to-red-700',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
            {/* ── Hero Section ── */}
            <section className="relative min-h-[90vh] flex flex-col">
                <FloatingBlobs />

                {/* Navigation */}
                <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 lg:px-20 py-5">
                    <div className="flex items-center space-x-3 animate-fade-in">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Business Nexus</span>
                    </div>

                    <div className="flex items-center space-x-3 animate-fade-in">
                        <Link
                            to="/login"
                            className="px-5 py-2.5 text-sm font-semibold text-primary-700 hover:text-primary-800 hover:bg-primary-50 rounded-xl transition-all duration-300"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 flex items-center space-x-1.5"
                        >
                            <span>Get Started</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </nav>

                {/* Hero Content */}
                <div className="relative z-10 flex-1 flex items-center">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            {/* Left side - Text */}
                            <div className="space-y-8">

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight animate-slide-up">
                                    Where <span className="gradient-text">Investors</span> Meet{' '}
                                    <span className="gradient-text">Entrepreneurs</span>
                                </h1>

                                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                    Nexus brings together visionary investors and ambitious entrepreneurs on one powerful platform — schedule meetings, negotiate deals, sign contracts, and fund startups seamlessly.
                                </p>

                                <div className="flex flex-wrap items-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                    <Link
                                        to="/register"
                                        className="group inline-flex items-center space-x-2 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        <span>Create Free Account</span>
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="group inline-flex items-center space-x-2 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:-translate-y-0.5"
                                    >
                                        <span>Sign In</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-primary-500" />
                                    </Link>
                                </div>

                                {/* Trust indicators */}
                                <div className="flex items-center space-x-6 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                                    <span className="flex items-center space-x-1.5">
                                        <Shield size={14} className="text-green-500" />
                                        <span>2FA Secured</span>
                                    </span>
                                    <span className="flex items-center space-x-1.5">
                                        <Zap size={14} className="text-amber-500" />
                                        <span>Instant Setup</span>
                                    </span>
                                    <span className="flex items-center space-x-1.5">
                                        <TrendingUp size={14} className="text-primary-500" />
                                        <span>Real-time Analytics</span>
                                    </span>
                                </div>
                            </div>

                            {/* Right side - Visual cards */}
                            <div className="hidden lg:block relative">
                                <div className="relative space-y-4">
                                    {/* Entrepreneur card */}
                                    <div className="ml-8 glass-card p-5 max-w-sm animate-slide-up-fade delay-200 hover:shadow-xl transition-shadow duration-500">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shadow-lg">
                                                <Building2 size={18} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">Entrepreneur Dashboard</p>
                                                <p className="text-xs text-gray-500">Manage your startup journey</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="bg-green-50 rounded-lg py-2">
                                                <p className="text-sm font-bold text-green-700">$1.5M</p>
                                                <p className="text-[10px] text-green-600">Funded</p>
                                            </div>
                                            <div className="bg-blue-50 rounded-lg py-2">
                                                <p className="text-sm font-bold text-blue-700">12</p>
                                                <p className="text-[10px] text-blue-600">Meetings</p>
                                            </div>
                                            <div className="bg-purple-50 rounded-lg py-2">
                                                <p className="text-sm font-bold text-purple-700">8</p>
                                                <p className="text-[10px] text-purple-600">Investors</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Investor card */}
                                    <div className="mr-8 ml-auto glass-card p-5 max-w-sm animate-slide-up-fade delay-400 hover:shadow-xl transition-shadow duration-500">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
                                                <CircleDollarSign size={18} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">Investor Portfolio</p>
                                                <p className="text-xs text-gray-500">Track your investments</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="bg-amber-50 rounded-lg py-2">
                                                <p className="text-sm font-bold text-amber-700">$4.2M</p>
                                                <p className="text-[10px] text-amber-600">Invested</p>
                                            </div>
                                            <div className="bg-teal-50 rounded-lg py-2">
                                                <p className="text-sm font-bold text-teal-700">5</p>
                                                <p className="text-[10px] text-teal-600">Startups</p>
                                            </div>
                                            <div className="bg-rose-50 rounded-lg py-2">
                                                <p className="text-sm font-bold text-rose-700">18%</p>
                                                <p className="text-[10px] text-rose-600">ROI</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating notification */}
                                    <div className="absolute -top-4 right-0 glass-card px-4 py-2.5 max-w-[220px] animate-float">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                            <p className="text-xs font-medium text-gray-700">New meeting request received</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Stats Section ── */}
            <section className="py-16 px-6 md:px-12 lg:px-20 bg-white border-y border-gray-100">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatItem value="500+" label="Active Users" delay="delay-100" />
                    <StatItem value="$12M+" label="Deals Funded" delay="delay-200" />
                    <StatItem value="1,200+" label="Meetings Held" delay="delay-300" />
                    <StatItem value="98%" label="Satisfaction" delay="delay-400" />
                </div>
            </section>

            {/* ── Features Section ── */}
            <section className="py-20 px-6 md:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 animate-fade-in">
                            Everything You Need in <span className="gradient-text">One Platform</span>
                        </h2>
                        <p className="text-gray-600 mt-3 max-w-xl mx-auto text-base animate-fade-in" style={{ animationDelay: '0.15s' }}>
                            From first introduction to funding — Nexus handles the entire investor-entrepreneur lifecycle.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <FeatureCard
                                key={feature.title}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                gradient={feature.gradient}
                                delay={`delay-${(i + 1) * 100}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How It Works Section ── */}
            <section className="py-20 px-6 md:px-12 lg:px-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-extrabold animate-fade-in">How Nexus Works</h2>
                        <p className="text-primary-200 mt-3 max-w-lg mx-auto">Get started in minutes — no complex setup required.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Create Your Profile', desc: 'Sign up as an Investor or Entrepreneur and set up your profile with your interests and goals.', icon: <Users size={24} /> },
                            { step: '02', title: 'Discover & Connect', desc: 'Browse matching profiles, send collaboration requests, and schedule meetings through the calendar.', icon: <Sparkles size={24} /> },
                            { step: '03', title: 'Fund & Grow', desc: 'Hold video calls, negotiate deals, sign contracts, and manage payments — all in one place.', icon: <TrendingUp size={24} /> },
                        ].map((item, i) => (
                            <div key={item.step} className={`text-center space-y-4 animate-slide-up-fade delay-${(i + 1) * 100}`}>
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg">
                                    {item.icon}
                                </div>
                                <div className="text-xs font-bold text-primary-300 tracking-widest uppercase">Step {item.step}</div>
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                <p className="text-sm text-primary-200 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="py-20 px-6 md:px-12 lg:px-20">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 animate-fade-in">
                        Ready to Transform Your <span className="gradient-text">Investment Journey</span>?
                    </h2>
                    <p className="text-gray-600 text-lg animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        Join hundreds of investors and entrepreneurs already collaborating on Nexus.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link
                            to="/register"
                            className="group inline-flex items-center space-x-2 px-10 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all duration-300 hover:-translate-y-1"
                        >
                            <span>Sign Up Free</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="group inline-flex items-center space-x-2 px-10 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl shadow-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:-translate-y-1"
                        >
                            <span>Sign In</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-primary-500" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-8 px-6 md:px-12 lg:px-20 border-t border-gray-100 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                                <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">Business Nexus</span>
                    </div>
                    <p className="text-xs text-gray-500">© 2026 Business Nexus. All rights reserved.</p>
                    <div className="flex items-center space-x-6">
                        <a href="#" className="text-xs text-gray-500 hover:text-primary-600 transition-colors">Privacy</a>
                        <a href="#" className="text-xs text-gray-500 hover:text-primary-600 transition-colors">Terms</a>
                        <a href="mailto:support@businessnexus.com" className="text-xs text-gray-500 hover:text-primary-600 transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
