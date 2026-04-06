#!/usr/bin/env node
// Build script: generates index.html from content.json + templates
// Usage: node build.js

const fs = require('fs');
const path = require('path');

const content = JSON.parse(fs.readFileSync(path.join(__dirname, 'content.json'), 'utf8'));
const css = fs.readFileSync(path.join(__dirname, 'assets/css/style.css'), 'utf8');
const mainJs = fs.readFileSync(path.join(__dirname, 'assets/js/main.js'), 'utf8');

// Escape for HTML attributes (href, src, alt, title, etc.)
function a(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Text content — pass through UTF-8 as-is
function t(s) { return s || ''; }

// Raw HTML (authors with <strong>, footer with ©)
function raw(s) { return s || ''; }

function isExternal(url) {
  return url && (url.startsWith('http') || url.startsWith('mailto:'));
}

function renderProjectCard(p) {
  const links = (p.links || []).map(l => {
    const tgt = isExternal(l.url) ? ' target="_blank"' : '';
    return `                            <a href="${a(l.url)}"${tgt} title="${a(l.title)}"><i class="${a(l.icon)}"></i></a>`;
  }).join('\n');

  const img = p.screenshot
    ? `                    <img src="${a(p.screenshot)}" alt="${a(p.title)}" class="project-screenshot"${p.screenshotStyle ? ` style="${a(p.screenshotStyle)}"` : ''}>`
    : '';

  const tags = (p.tags || []).map(tag => `                        <span>${t(tag)}</span>`).join('\n');

  return `                <div class="project-card">
                    <div class="project-top">
                        <span class="project-year">${t(p.year)}</span>
                        <div class="project-links">
${links}
                        </div>
                    </div>
                    <h3>${t(p.title)}</h3>
${img ? img + '\n' : ''}                    <p>${t(p.description)}</p>
                    <div class="project-tags">
${tags}
                    </div>
                </div>`;
}

function renderTimelineItem(item) {
  return `                <div class="timeline-item">
                    <h3>${t(item.title)}</h3>
                    <div class="timeline-meta">${t(item.meta)}</div>
                    <p>${t(item.description)}</p>
                </div>`;
}

function renderHonor(h) {
  if (h.url) {
    return `                        <a href="${a(h.url)}" target="_blank">${t(h.text)}</a>`;
  }
  return `                        <span>${t(h.text)}</span>`;
}

function renderEduCard(card) {
  const honors = (card.honors || []).map(renderHonor).join('\n');
  const idAttr = card.id ? ` id="${a(card.id)}" style="position:relative"` : '';

  return `                <div class="edu-card"${idAttr}>
                    <h3>${t(card.degree)}</h3>
                    <div class="edu-school">${t(card.meta)}</div>
                    <p>${t(card.description)}</p>
                    <div class="edu-honors">
${honors}
                    </div>
                </div>`;
}

function renderSkillGroup(g) {
  return `                <div class="skill-group">
                    <h3>${t(g.title)}</h3>
                    <p>${t(g.content)}</p>
                </div>`;
}

function renderContactCard(c) {
  const tgt = isExternal(c.url) ? ' target="_blank"' : '';
  return `                <a href="${a(c.url)}"${tgt} class="contact-card">
                    <i class="${a(c.icon)}"></i>
                    <span>${t(c.text)}</span>
                </a>`;
}

// Split school name for accent
const schoolParts = content.education.schoolName.split(content.education.schoolNameAccent);
const schoolTitle = `${t(schoolParts[0])}<span>${t(content.education.schoolNameAccent)}</span>${t(schoolParts[1] || '')}`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t(content.meta.title)}</title>
    <link rel="icon" type="image/jpeg" href="${a(content.meta.favicon)}">
${content.meta.gaId ? `    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${a(content.meta.gaId)}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${a(content.meta.gaId)}');</script>` : ''}
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
${css}
    </style>
</head>
<body>
    <!-- Loading screen -->
    <div id="loading-screen">
        <canvas id="loading-canvas"></canvas>
        <div class="load-backdrop"></div>
        <h1 class="load-name">${t(content.loading.name)}</h1>
        <p class="load-label">${t(content.loading.label)}</p>
        <p class="load-enter">${t(content.loading.enterText)}</p>
    </div>

    <div id="site-wrapper">
    <canvas id="particles-canvas"></canvas>

    <nav>
        <div class="nav-logo">${t(content.nav.logo)}</div>
        <ul class="nav-links">
${content.nav.links.map(l => `            <li><a href="${a(l.href)}">${t(l.text)}</a></li>`).join('\n')}
        </ul>
        <button class="mobile-toggle" aria-label="Toggle menu">
            <i class="fas fa-bars"></i>
        </button>
    </nav>

    <section id="hero">
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <div class="hero-label">${t(content.hero.label)}</div>
                    <h1 class="hero-name">${t(content.hero.firstName)}<br><span class="accent">${t(content.hero.lastName)}</span></h1>
                    <p class="hero-desc">${t(content.hero.description)}</p>
                    <div class="hero-links">
${content.hero.links.map(l => `                        <a href="${a(l.href)}" ${l.href.startsWith('#') ? '' : 'target="_blank" '}class="btn btn-${a(l.style)}"><i class="${a(l.icon)}"></i> ${t(l.text)}</a>`).join('\n')}
                    </div>
                </div>
                <img src="${a(content.hero.headshot)}" alt="${a(content.hero.firstName)} ${a(content.hero.lastName)}" class="hero-headshot">
            </div>
        </div>
    </section>

    <section id="projects">
        <div class="container">
            <div class="section-header reveal">
                <div class="section-label">${t(content.projects.sectionLabel)}</div>
                <h2 class="section-title">${t(content.projects.sectionTitle)}</h2>
            </div>
            <div class="projects-grid">

${content.projects.items.map(renderProjectCard).join('\n\n')}

            </div>
        </div>
    </section>

    <!-- Publication -->
    <section id="publication">
        <div class="container">
            <div class="section-header reveal">
                <div class="section-label">${t(content.publication.sectionLabel)}</div>
                <h2 class="section-title">${t(content.publication.sectionTitle)}</h2>
            </div>
            <div class="pub-card">
                <h3>${t(content.publication.title)}</h3>
                <p class="pub-authors">${raw(content.publication.authors)}</p>
                <p class="pub-venue">${t(content.publication.venue)}</p>
                <a href="${a(content.publication.url)}" target="_blank">${t(content.publication.linkText)} <i class="fas fa-arrow-right" style="font-size:0.75rem"></i></a>
            </div>
        </div>
    </section>

    <section id="experience">
        <div class="container">
            <div class="section-header reveal">
                <div class="section-label">${t(content.experience.sectionLabel)}</div>
                <h2 class="section-title">${t(content.experience.sectionTitle)}</h2>
            </div>
            <div class="timeline">
${content.experience.items.map(renderTimelineItem).join('\n')}
            </div>
        </div>
    </section>

    <section id="education">
        <div class="container">
            <div class="edu-header-row reveal">
                <img src="${a(content.education.logo)}" alt="${a(content.education.schoolName)}" class="edu-logo">
                <div class="section-header">
                    <div class="section-label">${t(content.education.sectionLabel)}</div>
                    <h2 class="section-title">${schoolTitle}</h2>
                </div>
            </div>
            <div class="edu-grid" id="edu-grid-wrap" style="position:relative">
                <canvas id="gator-canvas" style="position:absolute;bottom:0;left:0;width:100%;height:50px;pointer-events:none;z-index:10"></canvas>
${content.education.cards.map(renderEduCard).join('\n')}
            </div>
        </div>
    </section>

    <section id="skills">
        <div class="container">
            <div class="section-header reveal">
                <div class="section-label">${t(content.skills.sectionLabel)}</div>
                <h2 class="section-title">${t(content.skills.sectionTitle)}</h2>
            </div>
            <div class="skills-grid">
${content.skills.groups.map(renderSkillGroup).join('\n')}
            </div>
        </div>
    </section>

    <section id="contact">
        <div class="container">
            <div class="section-header reveal">
                <div class="section-label">${t(content.contact.sectionLabel)}</div>
                <h2 class="section-title">${t(content.contact.sectionTitle)}</h2>
            </div>
            <div class="contact-grid">
${content.contact.items.map(renderContactCard).join('\n')}
            </div>
        </div>
    </section>

    <footer id="site-footer">
        <p>${raw(content.meta.footer)}</p>
    </footer>
    </div><!-- end site-wrapper -->

    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>

    <script>
${mainJs}
    </script>
    <script src="assets/js/gator.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('Built index.html from content.json');
