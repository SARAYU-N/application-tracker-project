// navbar.js - Dynamically injects the premium top navigation bar into all pages

document.addEventListener('DOMContentLoaded', () => {
    // Find the container where the navbar should be injected
    let container = document.getElementById('navbar-container');
    if (!container) {
        // Fallback: prepend to body if container is not specified
        container = document.createElement('div');
        container.id = 'navbar-container';
        document.body.insertBefore(container, document.body.firstChild);
    }

    // Determine current page filename to set the active state
    const path = window.location.pathname;
    const pageName = path.split('/').pop() || 'home.html';

    // Build the navbar HTML
    container.innerHTML = `
        <nav class="glass-nav">
            <div class="nav-brand" onclick="window.location.href='home.html'">
                <span class="brand-icon">✦</span>
                <span class="brand-name">Antigravity Tracker</span>
            </div>
            <button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <ul class="nav-links" id="nav-links">
                <li><a href="home.html" class="nav-link ${pageName === 'home.html' ? 'active' : ''}">Home</a></li>
                <li><a href="dashboard.html" class="nav-link ${pageName === 'dashboard.html' ? 'active' : ''}">Dashboard</a></li>
                <li><a href="addApplication.html" class="nav-link ${pageName === 'addApplication.html' ? 'active' : ''}">Add Application</a></li>
                <li><a href="applicationDetails.html" class="nav-link ${pageName === 'applicationDetails.html' ? 'active' : ''}">Application Details</a></li>
                <li><a href="profile.html" class="nav-link ${pageName === 'profile.html' ? 'active' : ''}">Profile</a></li>
            </ul>
        </nav>
    `;

    // Mobile menu toggle implementation
    const toggleButton = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (toggleButton && navLinks) {
        toggleButton.addEventListener('click', () => {
            toggleButton.classList.toggle('open');
            navLinks.classList.toggle('show');
        });
    }

    // Add a scroll effect to add solid shadow/opacity when user scrolls down
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.glass-nav');
        if (nav) {
            if (window.scrollY > 20) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });
});
