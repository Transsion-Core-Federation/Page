/**
 * md-render.js
 * Handles fetching markdown files from the server
 * and rendering dynamic content elements via [data-md-content] attributes.
 * Depends on: GlobalState, parseMarkdown
 */

async function fetchMarkdown(url) {
    const processedUrl = url.replace('{lang}', GlobalState.lang);
    try {
        const response = await fetch(processedUrl);
        if (response.ok) {
            const text = await response.text();
            // Prevent Vite SPA fallback from injecting index.html on missing markdown
            if (text.trim().toLowerCase().startsWith('<!doctype html>') || text.trim().toLowerCase().startsWith('<html')) {
                console.warn(`Vite SPA fallback intercepted for: ${processedUrl}`);
                return '';
            }
            return text;
        }
    } catch (error) {
        // Handled silently
    }
    return '';
}

function initDynamicContent() {
    const elements = document.querySelectorAll('[data-md-content]');
    elements.forEach(async (el) => {
        const sourceUrl = el.getAttribute('data-md-content');
        if (sourceUrl) {
            const sourcePath = sourceUrl.replace(/\/(id|en)\//, `/${GlobalState.lang}/`);
            const md = await fetchMarkdown(sourcePath);
            if (md) {
                let html = parseMarkdown(md);
                // Promote first paragraph to sub-header-page inside page headers
                if (el.tagName === 'HEADER' || el.classList.contains('rules-header')) {
                    html = html.replace('class="content"', 'class="sub-header-page"');
                }
                el.innerHTML = html;
            }
        }
    });
}
