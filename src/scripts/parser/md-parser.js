/**
 * md-parser.js
 * Global Markdown to HTML parser for TCF.
 * Handles headings, bold/italic, lists, code blocks, links, and horizontal rules.
 */

function parseMarkdown(md) {
    let html = md
        .replace(/```(?:[a-z]+)?\n([\s\S]*?)```/gim, '\n\n<pre class="code-block"><code>$1</code></pre>\n\n')
        .replace(/^### (.*$)/gim, '\n\n<h3>$1</h3>\n\n')
        .replace(/^## (.*$)/gim, '\n\n<h2>$1</h2>\n\n')
        .replace(/^# (.*$)/gim, '\n\n<h1 class="header-page">$1</h1>\n\n')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(Last Updated|Terakhir Diperbarui): (.*?)\*/gim, '<em class="content-timestamp">$1: $2</em>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/^---$/gim, '\n\n<hr>\n\n')
        .replace(/→/g, '<span class="accent-symbol">→</span>')
        .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Split by lines to handle lists robustly before block building
    let lines = html.split('\n');
    let out = [];
    let inList = false;
    let listType = '';

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        let isUl = line.match(/^[-•]\s+(.*)/);
        let isOl = line.match(/^\d+\.\s+(.*)/);

        if (isUl || isOl) {
            if (!inList) {
                inList = true;
                listType = isUl ? 'ul' : 'ol';
                out.push(`\n\n<${listType}>\n`);
            }
            let content = isUl ? isUl[1] : isOl[1];
            out.push(`<li>${content}</li>\n`);
        } else {
            if (inList) {
                out.push(`</${listType}>\n\n`);
                inList = false;
            }
            out.push(lines[i]);
        }
    }
    if (inList) out.push(`</${listType}>\n\n`);

    html = out.join('\n');

    let blocks = html.split(/\n\s*\n/);
    let parsedBlocks = [];

    blocks.forEach(block => {
        block = block.trim();
        if (!block) return;
        if (
            block.match(/^<h[1-6][ >]/) ||
            block.match(/^<div/) ||
            block.match(/^<pre/) ||
            block.match(/^<ul/) ||
            block.match(/^<ol/) ||
            block.match(/^<hr/)
        ) {
            parsedBlocks.push(block);
        } else {
            const pContent = block.replace(/\n/g, ' ').trim();
            parsedBlocks.push(`<p class="content">${pContent}</p>`);
        }
    });

    return parsedBlocks.join('\n');
}
