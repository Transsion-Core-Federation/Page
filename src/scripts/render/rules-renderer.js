/**
 * rules-renderer.js
 * Handles loading, parsing, and rendering of the Rules section.
 * Depends on: GlobalState, LangState, fetchMarkdown, parseMarkdown, createLangMenu, Dictionary
 */

async function initRulesCompiler() {
    const container = document.getElementById('dynamic-rules-container');
    if (!container) return;

    const categories = [
        "18-plus", "admin-federation", "admin-group", "admin-power", "cheat",
        "claiming-work", "crypto", "doxing-privacy", "drugs", "fundraising-abuse",
        "gambling", "group-ownership", "harmful-modules", "hate-speech", "keybox",
        "monopoly-hoax", "nickname-pfp", "phishing", "piracy", "politics", "promotion",
        "provocateur", "racism-sara", "root-module", "scam-ripper", "spam-flooding", "unethical-marketing"
    ];

    // Initialize per-category language state
    categories.forEach(cat => {
        if (!LangState.rules[cat]) LangState.rules[cat] = 'en';
    });

    const renderRuleCard = async (cardEl) => {
        if (!cardEl) return;
        const cat = cardEl.getAttribute('data-cat');
        const lang = LangState.rules[cat] || GlobalState.lang;
        const md = await fetchMarkdown(`../content/rules/${cat}/${lang}.md`);

        if (md) {
            let parsed = parseMarkdown(md);
            parsed = parsed.replace(/<li>\s*<p class="content">(.*?)<\/p>\s*<\/li>/gim, '<li>$1</li>');

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = parsed;
            const h1 = tempDiv.querySelector('h1');
            const titleText = h1 ? h1.innerHTML : cat;
            if (h1) h1.remove();
            const content = tempDiv.innerHTML;

            cardEl.setAttribute('data-rule-name', `${cat} ${titleText.toLowerCase()}`);
            cardEl.classList.add('card-v2', 'card-v2-rules');
            cardEl.innerHTML = `
                <div class="card-v2-header">
                    <h2 class="rules-section-title">${titleText}</h2>
                </div>
                <div class="card-v2-body rules-text">${content}</div>
            `;

            const titleHeader = cardEl.querySelector('.rules-section-title');
            if (titleHeader) {
                titleHeader.appendChild(createLangMenu(cat, LangState.rules, renderRuleCard));
            }
        }
    };

    // Create placeholders
    container.innerHTML = categories.map(cat => `<div class="rules-section" id="${cat}" data-cat="${cat}"></div>`).join('');

    // Load all cards in parallel
    const promises = categories.map(cat => renderRuleCard(document.getElementById(cat)));
    await Promise.all(promises);

    // Wire search filter
    const searchInput = document.getElementById('rules-search-input');
    const noResults = document.getElementById('rules-no-results');
    if (!searchInput) return;

    searchInput.placeholder = Dictionary.searchPlaceholder || 'Search rules...';
    if (noResults) noResults.textContent = Dictionary.noResults || 'No results found.';

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        const cards = container.querySelectorAll('.rules-section');
        let visibleCount = 0;

        cards.forEach(card => {
            const name = card.getAttribute('data-rule-name') || '';
            const text = card.textContent.toLowerCase();
            const match = !query || name.includes(query) || text.includes(query);
            card.hidden = !match;
            if (match) visibleCount++;
        });

        if (noResults) {
            noResults.classList.toggle('visible', visibleCount === 0 && query.length > 0);
        }
    });
}
