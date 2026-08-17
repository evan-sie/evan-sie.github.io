# evan-sie.github.io

Personal portfolio for Evan Sie — mechanical engineering senior at UT Dallas.

Built with Next.js 16 (App Router) and React 19, statically exported and served
from GitHub Pages.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run check    # lint + typecheck + build
```

## How it works

The home page layers three things to produce the masked-video effect:

1. **Video layer** — a fixed, muted, looping B&W clip behind everything.
2. **Content layer** — black background, white text, `mix-blend-mode: multiply`.
   Multiply keeps black black and turns white text pixels into windows onto the
   video, so the type is literally a video mask.
3. **Grain layer** — an inline SVG `feTurbulence` filter over the whole page.

The bio is a tree of nested reveal pills. Every pill's continuation is always in
the DOM; when closed it renders blurred, so the unread text reads as ghosted
video. The counter in the corner tracks how many are open.

Scrolling past the bio moves into the Works grid, which shares the page rather
than living on its own route. Tiles scale in as they enter, tilt toward the
pointer, and the whole page wraps around at either end.

## Layout

| Path | What |
| --- | --- |
| `src/app/page.tsx` | Home — bio and works on one scroll |
| `src/app/works/[slug]/` | Project pages, prerendered per entry |
| `src/lib/content.ts` | All project copy, images, and galleries |
| `src/components/home/` | Reveal pills, background video, scroll effects |
| `src/components/works/` | Works grid |
| `src/app/globals.css` | The whole design system |

To add or edit a project, change `src/lib/content.ts` — the tiles, the routes,
and the pages all read from it.

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
static export and publishes it to GitHub Pages.

## Assets and licensing

Type is Inter, Instrument Serif, and Geist Mono, all under the SIL Open Font
License and self-hosted at build time by `next/font` — no font files in this
repo and no runtime requests to Google.

Photography and video are Evan's own.
