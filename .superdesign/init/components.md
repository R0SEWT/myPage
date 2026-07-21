# Shared UI components

Framework note: this Astro site has no third-party component library and no generic primitive directory. The reusable content components below are the closest shared UI building blocks. Header and Footer live in `layouts.md` because they form the shared shell.

## Hero

- Path: `site/src/components/Hero.astro`
- Description: Homepage identity, positioning, actions, and profile snapshot.
- Props: none; reads `PROFILE` and `QUICK_FACTS`.

```astro
---
import { PROFILE, QUICK_FACTS } from '../data/profile';
const headlineWords = PROFILE.headline.split(' ');
const headlineLead = headlineWords.slice(0, -1).join(' ');
const headlineTail = headlineWords.at(-1);
---
<section class="hero container">
  <div class="hero-copy">
    <p class="hero-folio mono"><span>ARV / 2026</span><span>Applied systems archive</span></p>
    <p class="badge"><span class="dot" aria-hidden="true"></span>{PROFILE.availability}</p>
    <h1>{PROFILE.name}<span>{headlineLead}</span><span>{headlineTail}</span></h1>
    <p class="mono role">{PROFILE.role}</p>
    <p class="lede">{PROFILE.summary}</p>
    <p class="ctas">
      <a href="#projects" class="cta-primary">View systems</a>
      <a href={PROFILE.links.cvEn}>CV EN</a>
      <a href={PROFILE.links.cvEs}>CV ES</a>
      <a href={PROFILE.links.github}>GitHub</a>
      <a href={PROFILE.links.linkedin}>LinkedIn</a>
    </p>
  </div>
  <aside class="hero-card" aria-label="Profile snapshot">
    <div class="hero-card-head">
      <p class="mono">Profile dossier</p>
      <span class="mono">Systems / ML</span>
    </div>
    <dl class="quick-facts">
      {QUICK_FACTS.map((f) => (<div><dt class="mono">{f.label}</dt><dd>{f.value}</dd></div>))}
    </dl>
    <img src="/assets/brand/seal-systems.svg" alt="" class="hero-seal" aria-hidden="true" />
  </aside>
</section>
```

## ProjectRow

- Path: `site/src/components/ProjectRow.astro`
- Description: Reusable project summary row with media, status, result, stack, and links.
- Props: `project: CollectionEntry<'projects'>`, `index: number`.

```astro
---
import type { CollectionEntry } from 'astro:content';
interface Props { project: CollectionEntry<'projects'>; index: number }
const { project, index } = Astro.props;
const { title, tagline, result, status, stack, links, media, mediaAlt } = project.data;
const href = `/projects/${project.id}/`;
---
<article class="project-row">
  <a href={href} class={`${media ? 'thumb' : 'thumb placeholder'} system-${index + 1}`} aria-label={`Open ${title} case study`}>
    {media
      ? <img src={media} alt={mediaAlt ?? title} loading="lazy" />
      : <>
          <span class="mono thumb-code">{String(index + 1).padStart(2, '0')}</span>
          <img src="/assets/brand/seal-systems.svg" alt="" aria-hidden="true" />
        </>}
  </a>
  <div class="project-body">
    <p class="mono project-kicker">System {String(index + 1).padStart(2, '0')}</p>
    <h3><a href={href}>{title}</a> <span class="tag mono">{status}</span></h3>
    <p>{tagline}</p>
    <p class="result">▸ {result}</p>
    <p class="mono stack">{stack.join(' · ')}</p>
    <p class="links">
      {links.github && <a href={links.github}>GitHub</a>}
      {links.demo && <a href={links.demo}>Demo</a>}
      <a href={href}>Case study →</a>
    </p>
  </div>
</article>
```

## Experience

- Path: `site/src/components/Experience.astro`
- Description: Experience list generated from profile data.
- Props: none.

```astro
---
import { EXPERIENCE } from '../data/profile';
---
<div class="experience">
  <h2>Experience</h2>
  {EXPERIENCE.map((job) => (
    <article class="job">
      <h3>{job.company}</h3>
      <p class="mono role">{job.role} · {job.period} · {job.location}</p>
      <ul>
        {job.bullets.map((bullet) => <li>{bullet}</li>)}
      </ul>
    </article>
  ))}
</div>
```

## Research

- Path: `site/src/components/Research.astro`
- Description: Research list and compact skills inventory.
- Props: none.

```astro
---
import { RESEARCH, SKILLS } from '../data/profile';
---
<div class="research">
  <h2>Research</h2>
  {RESEARCH.map((item) => (
    <article class="research-item">
      <h3>{item.title}</h3>
      <p class="mono venue">{item.venue}</p>
      <p>{item.summary}</p>
      {item.links.github && <p class="links"><a href={item.links.github}>GitHub</a></p>}
    </article>
  ))}
  <h2>Skills</h2>
  <div class="skills">
    {SKILLS.map((s) => (
      <p class="skill-row"><span class="mono skill-group">{s.group}</span> {s.items}</p>
    ))}
  </div>
</div>
```
