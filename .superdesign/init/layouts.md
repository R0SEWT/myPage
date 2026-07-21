# Shared layouts

## BaseLayout

- Path: `site/src/layouts/BaseLayout.astro`
- Description: Root HTML shell with global fonts/styles, metadata, and JSON-LD.

```astro
---
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import '../styles/tokens.css';
import '../styles/global.css';

interface Props { title: string; description: string; jsonLd?: object[] }
const { title, description, jsonLd = [] } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site);
---
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="description" content={description} />
    <meta name="author" content="Rody Vilchez" />
    <meta name="theme-color" content="#101011" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
    <title>{title}</title>
    <link rel="canonical" href={canonical} />
    <link rel="help" type="text/markdown" href="/llms.txt" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="https://rosewt.dev/og-image.png" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content="Rody Vilchez" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content="https://rosewt.dev/og-image.png" />
    {jsonLd.map((obj) => (
      <script type="application/ld+json" set:html={JSON.stringify(obj)} />
    ))}
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Header

- Path: `site/src/components/Header.astro`
- Description: Sticky global navigation with wordmark, anchors, and CV action.

```astro
---
import { PROFILE } from '../data/profile';
---
<header class="topbar">
  <div class="container topbar-inner">
    <a href="/" class="mono brand"><span>RV</span><span>rosewt.dev</span></a>
    <nav aria-label="Main">
      <a href="/#projects" data-spy="projects">Projects</a>
      <a href="/#experience" data-spy="experience">Experience</a>
      <a href="/#contact" data-spy="contact">Contact</a>
      <a href={PROFILE.links.cvEn} class="cv-btn">Download CV</a>
    </nav>
  </div>
</header>
```

## Footer

- Path: `site/src/components/Footer.astro`
- Description: Contact, credentials, activities, and education footer.

```astro
---
import { PROFILE, CERTIFICATIONS, ACTIVITIES, EDUCATION } from '../data/profile';
---
<footer id="contact" class="section container">
  <h2>Contact</h2>
  <p class="contact-links">
    <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a> ·
    <a href={PROFILE.links.github}>GitHub</a> ·
    <a href={PROFILE.links.linkedin}>LinkedIn</a>
  </p>
  <ul class="dim-list">
    {CERTIFICATIONS.map((c) => <li>{c}</li>)}
    {ACTIVITIES.map((a) => <li>{a}</li>)}
    <li>{EDUCATION}</li>
  </ul>
</footer>
```
