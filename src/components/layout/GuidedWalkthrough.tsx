import React, { useState, useEffect } from 'react';
import { Joyride, Step, STATUS } from 'react-joyride';
import { useAuth } from '../../context/AuthContext';

const WALKTHROUGH_KEY = 'business_nexus_walkthrough_seen';

const entrepreneurSteps: Step[] = [
    {
        target: 'body',
        content: 'Welcome to Business Nexus! Let us give you a quick tour of your dashboard and key features.',
        placement: 'center',
    },
    {
        target: '[href*="/investors"]',
        content: 'Find Investors — Browse and connect with potential investors who match your startup.',
    },
    {
        target: '[href*="/calendar"]',
        content: 'Calendar — Manage your availability and scheduled meetings with investors.',
    },
    {
        target: '[href*="/video-call"]',
        content: 'Video Call — Start face-to-face calls with your contacts using your camera.',
    },
    {
        target: '[href*="/messages"]',
        content: 'Messages — Chat with investors and other entrepreneurs in real-time.',
    },
    {
        target: '[href*="/documents"]',
        content: 'Doc Chamber — Upload, preview, sign, and manage documents and contracts.',
    },
    {
        target: '[href*="/payments"]',
        content: 'Payments — View your wallet, manage transactions, and receive funding from investors.',
    },
    {
        target: '[href*="/settings"]',
        content: 'Settings — Customize your account preferences and profile.',
    },
];

const investorSteps: Step[] = [
    {
        target: 'body',
        content: 'Welcome to Business Nexus! Let us show you around the investor dashboard.',
        placement: 'center',
    },
    {
        target: '[href*="/entrepreneurs"]',
        content: 'Find Startups — Discover promising startups and send collaboration requests.',
    },
    {
        target: '[href*="/calendar"]',
        content: 'Calendar — View your meetings and manage your availability slots.',
    },
    {
        target: '[href*="/video-call"]',
        content: 'Video Call — Connect with entrepreneurs over live video and screen share.',
    },
    {
        target: '[href*="/messages"]',
        content: 'Messages — Communicate directly with entrepreneurs.',
    },
    {
        target: '[href*="/deals"]',
        content: 'Deals — Track and manage your investment deals.',
    },
    {
        target: '[href*="/payments"]',
        content: 'Payments — Manage your wallet, send funding to startups, and view transaction history.',
    },
    {
        target: '[href*="/settings"]',
        content: 'Settings — Manage your account and preferences.',
    },
];

export const GuidedWalkthrough: React.FC = () => {
    const { user } = useAuth();
    const [run, setRun] = useState(false);

    useEffect(() => {
        if (!user) return;
        const key = `${WALKTHROUGH_KEY}_${user.id}`;
        const seen = sessionStorage.getItem(key);
        if (!seen) {
            // Small delay so DOM elements mount
            const timer = setTimeout(() => setRun(true), 800);
            return () => clearTimeout(timer);
        }
    }, [user]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCallback = (data: any) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRun(false);
            if (user) {
                sessionStorage.setItem(`${WALKTHROUGH_KEY}_${user.id}`, 'true');
            }
        }
    };
    if (!user) return null;

    const steps = user.role === 'entrepreneur' ? entrepreneurSteps : investorSteps;

    return (
        <>
            <Joyride
                steps={steps}
                run={run}
                continuous
                scrollToFirstStep
                onEvent={handleCallback}
                options={{
                    primaryColor: '#0218ddff',
                    zIndex: 10000,
                    arrowColor: '#fff',
                    backgroundColor: '#fff',
                    textColor: '#1F2937',
                    showProgress: true,
                    buttons: ['back', 'close', 'primary', 'skip'],
                }}
                styles={{
                    tooltip: {
                        borderRadius: '16px',
                        padding: '20px 24px',
                        fontSize: '14px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                        backdropFilter: 'blur(8px)',
                    },
                    tooltipContent: {
                        padding: '8px 0',
                        lineHeight: '1.6',
                    },
                    buttonNext: {
                        borderRadius: '10px',
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                        transition: 'all 0.3s ease',
                    },
                    buttonBack: {
                        color: '#6B7280',
                        fontSize: '13px',
                        marginRight: '8px',
                    },
                    buttonSkip: {
                        color: '#9CA3AF',
                        fontSize: '12px',
                    },
                    spotlight: {
                        borderRadius: '12px',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    },
                } as any}
                locale={{
                    back: 'Back',
                    close: 'Close',
                    last: 'Finish',
                    next: 'Next',
                    skip: 'Skip tour',
                }}
            />


        </>
    );
};
