# AI Coding Agent Instructions for aayush26.github.io

## Project Overview
A personal portfolio website using **vanilla JavaScript** (no frameworks), Jekyll configuration, and GitHub Pages hosting. Single-page application with dynamic content loading via a `Portfolio` class.

## Architecture & Data Flow

### Content Structure
- **Root**: `index.html` - Entry point with nav tabs and content area
- **Static pages** (`content/*.html`): About, Papers, Projects, Contact
- **Blog system** (`blog/index.json` + `blog/*.html`): JSON index drives dynamic blog list rendering
- **Styling** (`css/styles.css`): Monolithic stylesheet; uses CSS Grid for projects, flexbox for navigation

### JavaScript Implementation
The `Portfolio` class (`js/main.js`) orchestrates everything:
1. **Tab switching**: Click handlers update active button state, call `loadTab()`
2. **Content loading**: Fetches `.html` files, caches results, applies fade-in animation
3. **Blog list rendering**: Parses `blog/index.json`, dynamically generates list HTML from post metadata
4. **Blog post navigation**: Detects clicks on "Read more" links, loads individual `blog/[slug].html` files

**Key pattern**: When content is missing (e.g., blog post file exists but not in index.json), the system falls back gracefully with default post metadata hardcoded in `loadBlogIndex()` fallback array.

## Adding Content

### New Static Page
1. Create `content/[name].html` with semantic HTML
2. Add tab button in `index.html`: `<button class="tab-button" data-tab="[name]">[Name]</button>`
3. No JavaScript changes needed—`loadTab()` auto-fetches by filename

### New Blog Post
1. Create `blog/[slug].html` with article content (h1, p, code blocks, etc.; see `css/styles.css` for `.blog-post-*` classes)
2. Add entry to `blog/index.json`:
   ```json
   { "slug": "[slug]", "title": "...", "date": "YYYY-MM-DD", "readTime": "X min read", "description": "..." }
   ```
3. `loadBlogList()` auto-discovers via JSON fetch

**Important**: The portfolio has *two sources of truth* for blog posts:
- Primary: `blog/index.json` (loaded first)
- Fallback: Hardcoded array in `loadBlogIndex()` (if JSON fetch fails)
- Keep both in sync when adding posts, or file-only solutions may break

## Styling Conventions

### CSS Organization
- **Classes use kebab-case** (`blog-title`, `project-card`, `fade-in`)
- **Layout**: Flexbox for navigation, CSS Grid for project cards (auto-fit, minmax)
- **Colors**: Hardcoded hex (`#333`, `#007acc`); no CSS variables
- **Animations**: Single fade-in keyframe for page transitions

### Responsive Breakpoint
Single media query at **768px** for mobile. Adjusts padding, font sizes, wraps nav tabs, and collapses project grid to single column.

## Development Considerations

### No Build Step
This is a static site—no bundler, no npm scripts. All changes are live after file edits.

### Caching Strategy
`Portfolio.cache` stores fetched HTML to avoid re-fetching tabs. Cleared implicitly on page reload; intentional by design (no cache invalidation UI).

### Error Handling
Missing files/network errors display fallback error UI. No logging beyond `console.error()`. Graceful degradation is key.

### Mobile View
Verify responsive layout at **768px and below**. The site uses `height: 100vh` with `overflow: hidden` for a fixed-height container on desktop; ensure mobile doesn't break layout.

## Common Tasks

- **Adjust colors**: Update hex codes in `css/styles.css` (e.g., `#007acc` for links)
- **Fix tab navigation**: Check `data-tab` attributes in `index.html` match content filenames
- **Debug missing blog**: Verify `blog/index.json` entry AND `blog/[slug].html` file both exist
- **Add skill tags**: See `.skills-list` in About content; format as `<span class="skill-tag">Skill</span>`
