/**
 * global-lang.js
 * Manages the global site language state, dictionary loading,
 * and the floating language selector UI.
 */

const GlobalState = {
    lang: localStorage.getItem('tcf-lang') || 'en'
};

let Dictionary = {};

async function fetchDictionary() {
    const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || !window.location.pathname.includes('/src/');
    const basePath = isRoot ? '.' : '..';
    const url = `${basePath}/content/common/${GlobalState.lang}/dictionary.md`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const text = await response.text();
            const lines = text.split('\n');
            const data = {};
            lines.forEach(line => {
                const parts = line.split(':');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join(':').trim();
                    data[key] = value;
                }
            });
            Dictionary = data;
        }
    } catch (e) {
        console.error('Failed to load dictionary:', e);
    }
}

function initGlobalLanguage() {
    document.documentElement.lang = GlobalState.lang;
}

async function setGlobalLanguage(newLang) {
    if (newLang === GlobalState.lang) return;
    GlobalState.lang = newLang;
    localStorage.setItem('tcf-lang', newLang);
    document.documentElement.lang = newLang;

    // Save scroll position so page doesn't jump to top
    const savedScrollY = window.scrollY;

    // Reset card-level overrides to follow the new global language
    LangState.rules = {};
    LangState.appeal = {
        'appeal-guide': newLang,
        'appeal-format': newLang
    };

    initStaticLanguageSelector();

    await renderAllContent();

    // Restore scroll position after DOM update
    requestAnimationFrame(() => {
        window.scrollTo({ top: savedScrollY, behavior: 'instant' });
    });
}

function initStaticLanguageSelector() {
    const selector = document.getElementById('global-lang-selector');
    if (!selector) return;

    const btn = selector.querySelector('.lang-dropdown-btn');
    const menu = selector.querySelector('.lang-dropdown-menu');
    const options = selector.querySelectorAll('.lang-option');
    if (!btn || !menu) return;

    const currentLang = GlobalState.lang;

    btn.innerHTML = `${currentLang.toUpperCase()} <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    options.forEach(opt => {
        const optLang = opt.getAttribute('data-lang');
        opt.classList.toggle('active', optLang === currentLang);

        if (!opt.hasAttribute('data-bound')) {
            opt.setAttribute('data-bound', 'true');
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                setGlobalLanguage(optLang);
                menu.classList.remove('active');
            });
        }
    });

    if (!btn.hasAttribute('data-bound')) {
        btn.setAttribute('data-bound', 'true');
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('active');
        });
    }
}
