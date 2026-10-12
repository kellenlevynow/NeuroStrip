# Control Bionics product photography

Product photography: Control Bionics. These are Control Bionics' own NeuroStrip photos, supplied as originals in October 2026 and converted to WebP. Nothing in a photo has been edited and no overlays have been added.

| File | Source | Where it is used |
|---|---|---|
| `calves-1x.webp` | NeuroStrip-calves-03.jpg | Hero, and frame one of the animated banners |
| `rehab-leg-1x/2x.webp` | NeuroStrip-rehab-leg-01.jpg | Who we target first |
| `bicep-1x/2x.webp` | Return-to-play-bicep-1.jpg | Who we target first, sport tile |
| `patient-platform-1x/2x.webp` | NeuroStrip-rehab-patient-platform-01-1.jpg | Follow one group, the pilot step |
| `rehab-arm-1x/2x.webp` | NeuroStrip-rehab-patient-arm-02.jpg | The buying group |
| `platform-1x/2x.webp` | NeuroStrip-platform.png | What we say, beside the drawn example |
| `profiling-1x/2x.webp` | Profiling.jpg | Video storyboard frame one, carousel card three |
| `platform-05-1x/2x.webp` | NeuroStrip-platform-05-1.jpg | Video storyboard frame five, carousel card five |
| `homepage-1x/2x.webp` | NeuroStrip-homepage-1.webp | Carousel card one |
| `box-1x/2x.webp` | NeuroStrip-WhatsInTheBox.jpg | Carousel card four |
| `arm-1x/2x.webp` | NeuroStrip-arm.png | Native ad |
| `lifestyle-1x/2x.webp` | Neurostrip-Lifestyle-02.png | Conference phone ad |

Not used: `Rehabilitation-Hero.png` and `NeuroStrip-rehab-patient-01.jpg`, because the strip is not clearly visible in them. The duplicate `Return-to-play-bicep-1 (1).jpg` was skipped.

## How the files work

- Each photo has a 1x file (700 to 1000 pixels wide) and, where the original is larger, a 2x file. No file is upscaled, and the largest is under 90 KB.
- Pages use the 1x file as `src` and name the 2x file in `data-hd`. `src/js/00-core.js` adds the 2x file as a `srcset` on high-density screens. Everything below the first screen loads lazily, and the campaign photos load as that section comes near.
- `node tools/build.mjs` embeds every `src="assets/img/..."` file into `standalone.html`, so the offline copy carries the 1x photos. The photo paths in `src/js/30-campaign.js` are written out in full for that reason.
- To swap a photo, replace both WebP files with the same names and rebuild.
