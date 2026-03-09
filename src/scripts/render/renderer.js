/**
 * renderer.js
 * Orchestrates page-specific content rendering for all pages.
 * Depends on: GlobalState, Dictionary, fetchMarkdown, parseMarkdown,
 *             LangState, createLangMenu, initDynamicContent, initRulesCompiler
 */

async function renderAllContent() {
    await fetchDictionary();
    initStaticLanguageSelector();
    initDynamicContent();
    initSpecificPages();
}

function initSpecificPages() {
    initHeroContent();
    initFeaturesContent();
    initRulesCompiler();
    initHubsContent();
    initAboutContent();
    initAppealContent();
    initJoinUsContent();
    initFooterContent();
}

async function initHeroContent() {
    const heroContainer = document.getElementById('hero-content-container');
    if (!heroContainer) return;

    const sourcePath = heroContainer.getAttribute('data-source').replace(/\/(id|en)\//, `/${GlobalState.lang}/`);
    const md = await fetchMarkdown(sourcePath);
    if (!md) return;

    const lines = md.split('\n');
    let h1 = '';
    let p = '';

    lines.forEach(line => {
        if (line.startsWith('# ')) {
            const text = line.replace('# ', '').trim();
            const lastSpace = text.lastIndexOf(' ');
            if (lastSpace !== -1) {
                h1 = `<span>${text.substring(0, lastSpace)}</span><span>${text.substring(lastSpace + 1)}</span>`;
            } else {
                h1 = `<span>${text}</span>`;
            }
        } else if (line.trim() !== '' && !line.startsWith('- ')) {
            p += line + ' ';
        }
    });

    const t = Dictionary;
    heroContainer.innerHTML = `
        <span class="hero-badge">${t.heroBadge}</span>
        <h1 class="hero-title header-page">${h1}</h1>
        <p class="hero-desc sub-header-page">${p}</p>
        <div class="hero-actions">
            <a href="#visi" class="btn btn-primary hover-scale hover-glow" style="display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                ${t.btnVisi}
            </a>
            <a href="src/join-us.html" class="btn btn-primary hover-scale hover-glow" style="display: flex; align-items: center; gap: 8px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                ${t.btnJoin || 'Join Us'}
            </a>
        </div>
    `;
}

async function initFeaturesContent() {
    const featuresContainer = document.getElementById('features-content-container');
    if (!featuresContainer) return;

    const sourcePath = featuresContainer.getAttribute('data-source').replace(/\/(id|en)\//, `/${GlobalState.lang}/`);
    const md = await fetchMarkdown(sourcePath);
    if (!md) return;

    let headerTitle = '';
    let headerSub = '';
    let cardsHtml = '';

    const lines = md.split('\n');
    let currentSection = 'header';
    let cardTitle = '';
    let cardDesc = '';
    let cardIndex = 0;

    const icons = [
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
    ];

    lines.forEach(line => {
        if (line.startsWith('# ')) {
            headerTitle = line.replace('# ', '');
        } else if (line.startsWith('## ')) {
            if (cardTitle) {
                cardsHtml += `<div class="card-v1 feature-card hover-scale"><div class="feature-icon">${icons[cardIndex] || ''}</div><h3 class="feature-title">${cardTitle}</h3><p class="feature-desc">${cardDesc}</p></div>`;
                cardIndex++;
                cardDesc = '';
            }
            cardTitle = line.replace('## ', '').trim();
            currentSection = 'card';
        } else if (line.trim() !== '') {
            if (currentSection === 'header' && !headerTitle.includes(line)) {
                headerSub += line;
            } else if (currentSection === 'card') {
                cardDesc += line + ' ';
            }
        }
    });

    if (cardTitle) {
        cardsHtml += `<div class="card-v1 feature-card hover-scale"><div class="feature-icon">${icons[cardIndex] || ''}</div><h3 class="feature-title">${cardTitle}</h3><p class="feature-desc">${cardDesc}</p></div>`;
    }

    featuresContainer.innerHTML = `
        <div class="features-header">
            <span class="features-subtitle">${headerTitle}</span>
            <h2 class="features-title">${headerSub}</h2>
        </div>
        <div class="features-grid">${cardsHtml}</div>
    `;
}

async function initJoinUsContent() {
    const headEl = document.getElementById('join-header-dynamic');
    if (!headEl) return;

    const sourcePath = headEl.getAttribute('data-source').replace(/\/(id|en)\//, `/${GlobalState.lang}/`);
    const md = await fetchMarkdown(sourcePath);
    if (md) {
        let badgeText = Dictionary.defaultHubBadge || 'Community Hub';
        let titleText = 'Join Us';

        const h1Match = md.match(/# \[(.*?)\] (.*)/);
        const plainH1Match = md.match(/# (.*)/);

        if (h1Match) {
            badgeText = h1Match[1];
            titleText = h1Match[2];
        } else if (plainH1Match) {
            titleText = plainH1Match[1];
        }

        const lines = md.split('\n');
        const descText = lines.filter((l, i) => i > 0 && l.trim() !== '' && !l.startsWith('#')).join(' ').trim();

        headEl.innerHTML = `
            <span class="join-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                ${badgeText}
            </span>
            <h1 class="header-page">${titleText}</h1>
            <p class="sub-header-page">${descText}</p>
        `;
    }
}

async function initHubsContent() {
    const hubContainer = document.getElementById('dynamic-hub-container');
    if (!hubContainer) return;

    const sourcePath = hubContainer.getAttribute('data-source').replace(/\/(id|en)\//, `/${GlobalState.lang}/`);
    const md = await fetchMarkdown(sourcePath);
    if (!md) return;

    let html = '';
    const sections = md.split('## ').filter(Boolean);

    sections.forEach(sec => {
        const lines = sec.split('\n');
        const title = lines[0].trim();
        let desc = '';
        let url = '';

        lines.slice(1).forEach(l => {
            if (l.includes('](')) {
                const match = l.match(/\[(.*?)\]\((.*?)\)/);
                if (match) url = match[2];
            } else if (l.trim()) {
                desc += l.trim() + ' ';
            }
        });

        if (title && url) {
            desc = desc.replace(/<\/?p>/g, '').trim();
            const t = Dictionary;
            html += `<a href="${url}" target="_blank" rel="noopener noreferrer" class="card-v1 hub-card hover-scale">
                <h3 class="hub-title">${title}</h3>
                <p class="hub-desc">${desc}</p>
                <span class="hub-action">
                    ${t.hubAction}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
            </a>`;
        }
    });

    hubContainer.innerHTML = html;
}

async function initAboutContent() {
    const headEl = document.getElementById('about-header-dynamic');
    const visionEl = document.getElementById('about-vision-mision');
    const purposeEl = document.getElementById('about-purpose');
    const policyEl = document.getElementById('about-policy');
    const reportEl = document.getElementById('about-report');

    if (headEl) {
        const sourcePath = headEl.getAttribute('data-source').replace(/\/(id|en)\//, `/${GlobalState.lang}/`);
        const md = await fetchMarkdown(sourcePath);
        if (md) {
            let html = parseMarkdown(md);
            html = html.replace('class="content"', 'class="sub-header-page"');
            headEl.innerHTML = html;
        }
    }

    const renderSection = async (el) => {
        if (!el) return;
        const sourcePath = el.getAttribute('data-source').replace(/\/(id|en)\//, `/${GlobalState.lang}/`);
        const md = await fetchMarkdown(sourcePath);
        if (md) {
            el.classList.add('card-v1');
            el.innerHTML = parseMarkdown(md);
        }
    };

    await Promise.all([
        renderSection(visionEl),
        renderSection(purposeEl),
        renderSection(policyEl),
        renderSection(reportEl),
    ]);
}

async function initAppealContent() {
    const headerEl = document.getElementById('appeal-header');
    const container = document.getElementById('dynamic-appeal-container');
    if (!container) return;

    const loadHeader = async () => {
        if (!headerEl) return;
        const sourcePath = headerEl.getAttribute('data-source').replace(/\/(id|en)\//, `/${GlobalState.lang}/`);
        const md = await fetchMarkdown(sourcePath);
        if (md) {
            let badgeText = Dictionary.defaultAppealBadge || 'Appeal';
            let titleText = 'Appeal';

            const h1Match = md.match(/# \[(.*?)\] (.*)/);
            const plainH1Match = md.match(/# (.*)/);

            if (h1Match) { badgeText = h1Match[1]; titleText = h1Match[2]; }
            else if (plainH1Match) { titleText = plainH1Match[1]; }

            const lines = md.split('\n');
            const descText = lines.filter((l, i) => i > 0 && l.trim() !== '' && !l.startsWith('#')).join(' ').trim();

            headerEl.innerHTML = `
                <span class="appeal-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    ${badgeText}
                </span>
                <h1 class="header-page">${titleText}</h1>
                <p class="sub-header-page">${descText}</p>
            `;
        }
    };

    const components = ['guide', 'format'];
    components.forEach(comp => {
        const id = `appeal-${comp}`;
        if (!LangState.appeal[id]) LangState.appeal[id] = GlobalState.lang;
    });

    const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || !window.location.pathname.includes('/src/');
    const basePath = isRoot ? '.' : '..';

    const renderCard = async (type) => {
        const id = `appeal-${type}`;
        const lang = LangState.appeal[id] || GlobalState.lang;
        const md = await fetchMarkdown(`${basePath}/content/appeal/${lang}/${type}.md`);

        if (md) {
            let cardEl = document.getElementById(id);
            if (!cardEl) {
                cardEl = document.createElement('div');
                cardEl.id = id;
                cardEl.className = 'card-v2 card-v2-appeal appeal-content-card';
            }
            
            const rawHtml = parseMarkdown(md);
            // Wrap content in body
            cardEl.innerHTML = `<div class="card-v2-body">${rawHtml}</div>`;
            
            const h3 = cardEl.querySelector('h3');
            if (h3) {
                // Move h3 to header
                const header = document.createElement('div');
                header.className = 'card-v2-header';
                header.appendChild(h3);
                h3.appendChild(createLangMenu(id, LangState.appeal, () => renderCard(type)));
                cardEl.prepend(header);
            }
            return cardEl;
        }
        return null;
    };

    await loadHeader();
    container.innerHTML = '';
    for (const comp of components) {
        const card = await renderCard(comp);
        if (card) container.appendChild(card);
    }
}

async function initFooterContent() {
    const footerContainer = document.querySelector('.footer-container');
    if (!footerContainer) return;

    const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    const basePath = isRoot ? '.' : '..';
    const url = `${basePath}/content/common/${GlobalState.lang}/footer.md`;

    const md = await fetchMarkdown(url);
    if (!md) return;

    let logoText = '', descText = '', copyright = '';
    let columns = [], currentColumn = null;

    md.split('\n').forEach(line => {
        let l = line.trim();
        if (l.startsWith('# ')) {
            logoText = l.replace('# ', '').trim();
        } else if (l.startsWith('## ')) {
            if (currentColumn) columns.push(currentColumn);
            currentColumn = { title: l.replace('## ', '').trim(), links: [] };
        } else if (l.startsWith('- [') && currentColumn) {
            const match = l.match(/-\s*\[([^\]]+)\]\(([^)]+)\)/);
            if (match) {
                let linkPath = match[2];
                if (linkPath.startsWith('/') && !isRoot) linkPath = '..' + linkPath;
                else if (linkPath.startsWith('/') && isRoot) linkPath = '.' + linkPath;
                currentColumn.links.push({ text: match[1], url: linkPath });
            }
        } else if (l.includes('&copy;')) {
            copyright = l;
        } else if (l !== '' && !currentColumn) {
            descText += l + ' ';
        }
    });

    if (currentColumn) columns.push(currentColumn);

    let columnsHtml = '';
    columns.forEach(col => {
        let linksHtml = col.links.map(link => `<a href="${link.url}" class="footer-link">${link.text}</a>`).join('');
        columnsHtml += `<div class="footer-col"><h4 class="footer-col-title">${col.title}</h4><div class="footer-col-links">${linksHtml}</div></div>`;
    });

    footerContainer.innerHTML = `
        <div class="footer-top">
            <div class="footer-brand">
                <div class="footer-logo">${logoText}<span>.</span></div>
                <p class="footer-desc text-muted">${descText.trim()}</p>
            </div>
            <div class="footer-nav">${columnsHtml}</div>
        </div>
        <div class="footer-bottom">
            <p class="footer-text">${copyright}</p>
        </div>
    `;
}
