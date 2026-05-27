# Life section assets

## Paintings (gallery images)

**Originals (full HD):** `public/assets/life/paintings/`  
**Thumbnails (tiles):** `public/assets/life/paintings/thumbs/` — generated, do not edit by hand

| Original file | Piece |
|---------------|--------|
| `temple.jpeg` | Temple cityscape at night (large tile) |
| `women in red.jpeg` | Woman in red |
| `laughing.jpeg` | Laughing sketch |
| `rembrandt.jpeg` | Self-portrait study |
| `green hooded.jpeg` | Green hooded portrait |
| `madonna.jpeg` | Madonna and child |
| `mother and child.jpeg` | Mother and child (6th grid tile) |

After adding or replacing an original, compress for web (optional if files are already small) and regenerate thumbnails:

```bash
npm run life:compress
npm run life:thumbs
```

Gallery tiles load thumbs (~640px). Clicking a tile opens the full original in a new tab.

Update paths in `src/data/lifeStudio.ts` if you rename files.

## Videos & external links (no file upload)

**File:** `src/data/lifeLinks.ts`

- `linkedInSpotlight` — LinkedIn post URL for the Cornell spotlight card
- `pianoRecital` — Recital recording URL (YouTube, Vimeo, Google Drive share link, etc.)

Links appear on the site only when the string is non-empty. Do **not** commit video files to the repo — use YouTube/Vimeo/Drive URLs in `lifeLinks.ts` instead (keeps deploy size small).
