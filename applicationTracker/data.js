// data.js - LocalStorage data controller for Application Tracker

const STORAGE_KEY = 'internship_applications';
const PROFILE_KEY = 'user_profile';

// Default Demo Applications
const DEMO_APPLICATIONS = [
    {
        id: 'demo-1',
        company: 'Google',
        role: 'Software Engineering Intern',
        status: 'Interviewing',
        dateApplied: '2026-05-15',
        deadline: '2026-06-30',
        location: 'Mountain View, CA (Hybrid)',
        salary: '$45/hr',
        jobLink: 'https://careers.google.com',
        notes: 'Passed the technical phone screen. Preparing for the onsite interviews next week. Focus on system design and algorithms.',
        timeline: [
            { date: '2026-05-15', event: 'Applied online' },
            { date: '2026-05-20', event: 'Received Online Assessment (OA)' },
            { date: '2026-05-22', event: 'Completed OA' },
            { date: '2026-06-05', event: 'Phone screen with recruiter' },
            { date: '2026-06-10', event: 'Scheduled technical interviews' }
        ]
    },
    {
        id: 'demo-2',
        company: 'Stripe',
        role: 'Frontend Engineering Intern',
        status: 'Offer',
        dateApplied: '2026-05-01',
        deadline: '2026-05-20',
        location: 'Seattle, WA (Remote)',
        salary: '$52/hr',
        jobLink: 'https://stripe.com/jobs',
        notes: 'Offered internship! Need to reply by June 20th. Compensation includes relocation assistance and equity details in the portal.',
        timeline: [
            { date: '2026-05-01', event: 'Applied with referral' },
            { date: '2026-05-10', event: 'Technical interview 1 (React & JS)' },
            { date: '2026-05-18', event: 'Manager fit interview' },
            { date: '2026-06-01', event: 'Offer letter received 🎉' }
        ]
    },
    {
        id: 'demo-3',
        company: 'Meta',
        role: 'Product Management Intern',
        status: 'Applied',
        dateApplied: '2026-06-10',
        deadline: '2026-07-15',
        location: 'New York, NY (On-site)',
        salary: '$48/hr',
        jobLink: 'https://metacareers.com',
        notes: 'Applied through university portal. Reached out to an alum on LinkedIn for a chat.',
        timeline: [
            { date: '2026-06-10', event: 'Applied' }
        ]
    },
    {
        id: 'demo-4',
        company: 'Netflix',
        role: 'UI/UX Design Intern',
        status: 'Rejected',
        dateApplied: '2026-04-12',
        deadline: '2026-05-05',
        location: 'Los Gatos, CA (Hybrid)',
        salary: '$50/hr',
        jobLink: 'https://netflix.com/jobs',
        notes: 'Submitted portfolio. Resume screened out. Try building more enterprise UI projects to show case studies.',
        timeline: [
            { date: '2026-04-12', event: 'Applied' },
            { date: '2026-05-05', event: 'Received rejection email' }
        ]
    }
];

// Default User Profile
const DEFAULT_PROFILE = {
    name: 'Alex Mercer',
    email: 'alex.mercer@university.edu',
    role: 'Aspiring Software Engineer & UI Enthusiast',
    location: 'San Francisco Bay Area',
    skills: 'JavaScript, HTML/CSS, React, Python, Node.js, UI/UX Design',
    resumeUrl: '',
    targetSalary: '$45/hr',
    notificationEnabled: true,
    theme: 'dark'
};

// Initialize helper
function getApplications() {
    let apps = localStorage.getItem(STORAGE_KEY);
    if (!apps) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_APPLICATIONS));
        return DEMO_APPLICATIONS;
    }
    return JSON.parse(apps);
}

function getApplicationById(id) {
    const apps = getApplications();
    return apps.find(app => app.id === id) || null;
}

function saveApplication(appData) {
    const apps = getApplications();
    if (appData.id) {
        // Edit existing
        const index = apps.findIndex(a => a.id === appData.id);
        if (index !== -1) {
            // Merge timeline
            const oldApp = apps[index];
            const newTimeline = appData.timeline || oldApp.timeline || [];
            
            // If status changed, add to timeline
            if (appData.status && oldApp.status !== appData.status) {
                const today = new Date().toISOString().split('T')[0];
                newTimeline.push({
                    date: today,
                    event: `Status changed to ${appData.status}`
                });
            }

            apps[index] = { ...oldApp, ...appData, timeline: newTimeline };
        }
    } else {
        // Create new
        const today = new Date().toISOString().split('T')[0];
        appData.id = 'app-' + Date.now();
        appData.timeline = appData.timeline || [
            { date: today, event: 'Applied & Added to Tracker' }
        ];
        apps.push(appData);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    return appData;
}

function deleteApplication(id) {
    let apps = getApplications();
    apps = apps.filter(app => app.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
}

// User Profile Helper Methods
function getUserProfile() {
    let profile = localStorage.getItem(PROFILE_KEY);
    if (!profile) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
        return DEFAULT_PROFILE;
    }
    return JSON.parse(profile);
}

function saveUserProfile(profileData) {
    const currentProfile = getUserProfile();
    const updated = { ...currentProfile, ...profileData };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    return updated;
}

function resetAllData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_APPLICATIONS));
    localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
    return { apps: DEMO_APPLICATIONS, profile: DEFAULT_PROFILE };
}

// Make functions globally accessible
window.getApplications = getApplications;
window.getApplicationById = getApplicationById;
window.saveApplication = saveApplication;
window.deleteApplication = deleteApplication;
window.getUserProfile = getUserProfile;
window.saveUserProfile = saveUserProfile;
window.resetAllData = resetAllData;
