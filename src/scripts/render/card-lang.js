/**
 * card-lang.js
 * Manages per-card language state for rules and appeal pages.
 * Provides createLangMenu() to create independent language selectors per card.
 */

const LangState = {
    appeal: {
        'appeal-guide': localStorage.getItem('tcf-lang') || 'en',
        'appeal-format': localStorage.getItem('tcf-lang') || 'en'
    },
    rules: {}
};

const createLangMenu = (cardId, stateStore, renderFn) => {
    const currentLang = stateStore[cardId];
    const menuWrapper = document.createElement('div');
    menuWrapper.className = 'card-lang-menu';

    menuWrapper.innerHTML = `
        <button class="lang-menu-btn">
            <span>${Dictionary.langLabel || 'Language'}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <div class="lang-dropdown">
            <div class="lang-dropdown-option ${currentLang === 'id' ? 'active' : ''}" data-lang="id">
                ${Dictionary.langIndo || 'Indonesia'} ${currentLang === 'id' ? '✓' : ''}
            </div>
            <div class="lang-dropdown-option ${currentLang === 'en' ? 'active' : ''}" data-lang="en">
                ${Dictionary.langEnglish || 'English'} ${currentLang === 'en' ? '✓' : ''}
            </div>
        </div>
    `;

    const btn = menuWrapper.querySelector('.lang-menu-btn');
    const dropdown = menuWrapper.querySelector('.lang-dropdown');

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.lang-dropdown.active').forEach(d => {
            if (d !== dropdown) d.classList.remove('active');
        });
        dropdown.classList.toggle('active');
    });

    menuWrapper.querySelectorAll('.lang-dropdown-option').forEach(opt => {
        opt.addEventListener('click', async () => {
            const newLang = opt.getAttribute('data-lang');
            if (newLang !== stateStore[cardId]) {
                stateStore[cardId] = newLang;
                await renderFn(document.getElementById(cardId));
            }
        });
    });

    return menuWrapper;
};

// Close all card dropdowns on outside click
document.addEventListener('click', () => {
    document.querySelectorAll('.lang-dropdown.active').forEach(d => d.classList.remove('active'));
});
