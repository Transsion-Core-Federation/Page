/**
 * main.js
 * Application bootstrap — initializes core UI and triggers content rendering.
 * All logic has been modularized into scripts/render/ and scripts/parser/.
 *
 * Load order (via HTML):
 *   1. parser/md-parser.js
 *   2. render/global-lang.js
 *   3. render/card-lang.js
 *   4. render/md-render.js
 *   5. render/rules-renderer.js
 *   6. render/renderer.js
 *   7. main.js  ← (this file)
 */

// Import CSS files for Vite to bundle them
import '../styles/global.css';
import '../styles/common/background.css';
import '../styles/effects/glass.css';
import '../styles/effects/hover.css';
import '../styles/common/navbar.css';
import '../styles/common/langs-menu.css';
import '../styles/common/button.css';
import '../styles/common/card-v1.css';
import '../styles/common/card-v2.css';
import '../styles/common/pages-header.css';
import '../styles/common/footer.css';
import '../styles/home/home.css';
import '../styles/about/about.css';
import '../styles/appeal/appeal.css';
import '../styles/join-us/join-us.css';
import '../styles/rules/rules.css';

document.addEventListener('DOMContentLoaded', async () => {
    initGlobalLanguage();
    initAmbientBackground();
    initNavbar();
    await renderAllContent();
});

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navbarLinks = document.querySelector('.navbar-links');
    if (!navbar) return;

    // Scroll effects
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    });

    // Mobile menu toggle
    if (mobileMenuBtn && navbarLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navbarLinks.classList.toggle('active');
            const isActive = navbarLinks.classList.contains('active');
            mobileMenuBtn.innerHTML = isActive
                ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
                : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        });
    }

    // Close lang menu on scroll
    window.addEventListener('scroll', () => {
        const langMenu = document.querySelector('.lang-dropdown-menu.active');
        if (langMenu) langMenu.classList.remove('active');
    }, { passive: true });

    // Close navbar on outside click
    document.addEventListener('click', (e) => {
        if (navbarLinks && !navbar.contains(e.target)) {
            navbarLinks.classList.remove('active');
            if (mobileMenuBtn) {
                mobileMenuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
            }
        }
    });
}

function initAmbientBackground() {
    const container = document.createElement('div');
    container.className = 'ambient-background-container';

    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += `<div class="ambient-orb orb-${i}"></div>`;
    }
    html += `<div class="ambient-orb orb-interactive" id="interactive-orb"></div>`;
    container.innerHTML = html;
    document.body.prepend(container);

    const interactiveOrb = document.getElementById('interactive-orb');
    if (interactiveOrb) {
        document.addEventListener('mousemove', (e) => {
            interactiveOrb.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
        });
    }
}
