// dashboard.js - Handles rendering, filtering, sorting, and deletion on the dashboard

document.addEventListener('DOMContentLoaded', () => {
    // DOM references
    const applicationsContainer = document.getElementById('applications-container');
    const searchBar = document.getElementById('search-bar');
    const statusFilter = document.getElementById('status-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    const statsTotal = document.getElementById('stats-total');
    const statsApplied = document.getElementById('stats-applied');
    const statsInterviewing = document.getElementById('stats-interviewing');
    const statsOffers = document.getElementById('stats-offers');

    // Toast references
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    // Load initial apps
    let applications = window.getApplications ? window.getApplications() : [];

    // Initialize display
    updateDashboard();

    // Event listeners
    if (searchBar) searchBar.addEventListener('input', updateDashboard);
    if (statusFilter) statusFilter.addEventListener('change', updateDashboard);
    if (sortFilter) sortFilter.addEventListener('change', updateDashboard);

    function updateDashboard() {
        // Fetch fresh data in case it changed
        applications = window.getApplications ? window.getApplications() : [];
        
        // Calculate stats
        calculateStats(applications);

        // Filter and sort applications
        let filteredApps = filterApplications(applications);
        filteredApps = sortApplications(filteredApps);

        // Render cards
        renderApplications(filteredApps);
    }

    function calculateStats(apps) {
        if (!statsTotal) return;
        
        const total = apps.length;
        const appliedOrPending = apps.filter(a => a.status === 'Applied').length;
        const interviewing = apps.filter(a => a.status === 'Interviewing').length;
        const offers = apps.filter(a => a.status === 'Offer').length;

        statsTotal.textContent = total;
        statsApplied.textContent = appliedOrPending;
        statsInterviewing.textContent = interviewing;
        statsOffers.textContent = offers;
    }

    function filterApplications(apps) {
        const query = searchBar ? searchBar.value.toLowerCase().trim() : '';
        const status = statusFilter ? statusFilter.value : 'All';

        return apps.filter(app => {
            const matchesQuery = 
                app.company.toLowerCase().includes(query) || 
                app.role.toLowerCase().includes(query);
            
            const matchesStatus = (status === 'All') || (app.status === status);

            return matchesQuery && matchesStatus;
        });
    }

    function sortApplications(apps) {
        const criteria = sortFilter ? sortFilter.value : 'newest';

        return [...apps].sort((a, b) => {
            if (criteria === 'newest') {
                return new Date(b.dateApplied || 0) - new Date(a.dateApplied || 0);
            } else if (criteria === 'oldest') {
                return new Date(a.dateApplied || 0) - new Date(b.dateApplied || 0);
            } else if (criteria === 'deadline') {
                // Keep blank deadlines at the very end
                const deadA = a.deadline ? new Date(a.deadline) : new Date('9999-12-31');
                const deadB = b.deadline ? new Date(b.deadline) : new Date('9999-12-31');
                return deadA - deadB;
            }
            return 0;
        });
    }

    function renderApplications(apps) {
        if (!applicationsContainer) return;
        applicationsContainer.innerHTML = '';

        if (apps.length === 0) {
            applicationsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📂</div>
                    <div class="empty-title">No Applications Found</div>
                    <div class="empty-subtitle">Try adjusting your filters, searching for something else, or add a new application.</div>
                    <a href="addApplication.html" class="btn btn-primary">+ Add New Application</a>
                </div>
            `;
            return;
        }

        apps.forEach(app => {
            const card = document.createElement('div');
            card.className = 'app-card fade-in-up';
            
            const deadlineText = app.deadline ? formatDate(app.deadline) : 'Not specified';
            const dateAppliedText = app.dateApplied ? formatDate(app.dateApplied) : 'Not specified';
            const salaryText = app.salary ? ` • ${app.salary}` : '';

            card.innerHTML = `
                <div>
                    <div class="app-card-header">
                        <div>
                            <div class="app-company">${escapeHTML(app.company)}</div>
                            <div class="app-role">${escapeHTML(app.role)}</div>
                        </div>
                        <span class="badge ${app.status.toLowerCase()}">${app.status}</span>
                    </div>
                    <div class="app-details-short">
                        <span>📍 ${escapeHTML(app.location || 'Remote/Hybrid')} ${salaryText}</span>
                        <span>📅 Applied: ${dateAppliedText}</span>
                        <span>⏳ Deadline: ${deadlineText}</span>
                    </div>
                </div>
                <div class="app-actions">
                    <button class="btn btn-secondary view-btn" data-id="${app.id}">View Details</button>
                    <button class="btn btn-danger delete-btn" data-id="${app.id}">Delete</button>
                </div>
            `;

            // Button actions
            card.querySelector('.view-btn').addEventListener('click', () => {
                window.location.href = `applicationDetails.html?id=${app.id}`;
            });

            card.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm(`Are you sure you want to delete your application for ${app.company}?`)) {
                    if (window.deleteApplication) {
                        window.deleteApplication(app.id);
                        showToast(`Deleted application for ${app.company}`, 'success');
                        updateDashboard();
                    }
                }
            });

            applicationsContainer.appendChild(card);
        });
    }

    function showToast(message, type = 'success') {
        if (!toast) return;
        toastMessage.textContent = message;
        toastIcon.textContent = type === 'success' ? '✓' : '✗';
        
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Helper functions
    function formatDate(dateStr) {
        if (!dateStr) return '';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    }

    function escapeHTML(str) {
        if (!str) return '';
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});
