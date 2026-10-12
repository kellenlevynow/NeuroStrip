# Control Bionics photography: missing files

The plan page is built to use Control Bionics' own NeuroStrip photography. None of the 14 files could be downloaded when the site was rebuilt in October 2026: the build environment's network policy blocked controlbionics.com (every request returned a 403 from the proxy). Until the files are added, the page uses the drawn SVG illustrations that were already in the site, and every caption says so. No stock imagery is used anywhere.

## The 14 files

| # | Source file | Save as | Planned slot | What to check before using it |
|---|---|---|---|---|
| 1 | https://controlbionics.com/wp-content/uploads/2026/05/NeuroStrip-calves-03.jpg | `calves-1x.webp`, `calves-2x.webp` | Hero (`src/sections/00-hero.html`, `data-ph="calves"`) and the display ads | Strip clearly visible on skin, crop wide for the hero |
| 2 | https://controlbionics.com/wp-content/uploads/2026/05/NeuroStrip-rehab-leg-01.jpg | `rehab-leg-1x.webp`, `rehab-leg-2x.webp` | Who we target first (`src/sections/03-target.html`, `data-ph="rehab-leg"`) and the 15-second video storyboard | Strip visible on the leg, no patient face needed |
| 3 | https://controlbionics.com/wp-content/uploads/2026/05/NeuroStrip-WhatsInTheBox.jpg | `box-1x.webp`, `box-2x.webp` | Direct mail mockup in the campaign | Whole kit in frame |
| 4 | https://controlbionics.com/wp-content/uploads/2026/05/NeuroStrip-rehab-patient-arm-02.jpg | `rehab-arm-1x.webp`, `rehab-arm-2x.webp` | The buying group, next to the role tabs | Strip visible on the arm |
| 5 | https://controlbionics.com/wp-content/uploads/2026/05/NeuroStrip-rehab-patient-01.jpg | `rehab-patient-1x.webp`, `rehab-patient-2x.webp` | The buying group or the clinical ads | Clinic setting, strip visible |
| 6 | https://controlbionics.com/wp-content/uploads/2026/05/NeuroStrip-rehab-patient-platform-01-1.jpg | `patient-platform-1x.webp`, `patient-platform-2x.webp` | Follow one clinic (`src/sections/01-story.html`, the `.screen` figure) | Software screen readable |
| 7 | https://controlbionics.com/wp-content/uploads/2026/05/NeuroStrip-arm.png | `arm-1x.webp`, `arm-2x.webp` | Native ad | Strip visible |
| 8 | https://controlbionics.com/wp-content/uploads/2026/05/NeuroStrip-platform.png | `platform-1x.webp`, `platform-2x.webp` | What we say (`src/sections/05-message.html`, the `.screen--xl` figure) | Screen only, no added overlays |
| 9 | https://controlbionics.com/wp-content/uploads/2026/05/NeuroStrip-platform-05-1.jpg | `platform-05-1x.webp`, `platform-05-2x.webp` | Follow one clinic, second image, or the executive carousel | Screen readable |
| 10 | https://controlbionics.com/wp-content/uploads/2026/05/Neurostrip-Lifestyle-02.png | `lifestyle-1x.webp`, `lifestyle-2x.webp` | Geofenced mobile ad | Strip visible |
| 11 | https://controlbionics.com/wp-content/uploads/2026/05/Return-to-play-bicep-1.jpg | `bicep-1x.webp`, `bicep-2x.webp` | Who we target first, sport tile | Strip visible |
| 12 | https://controlbionics.com/wp-content/uploads/2026/05/Profiling.jpg | `profiling-1x.webp`, `profiling-2x.webp` | Who we target first, sport tile, or the clinical carousel | Make sure it is product photography and not a stock image |
| 13 | https://controlbionics.com/wp-content/uploads/2026/05/Rehabilitation-Hero.png | `rehab-hero-1x.webp`, `rehab-hero-2x.webp` | Who we target first, rehab tile | Make sure it is product photography and not a stock image |
| 14 | https://controlbionics.com/wp-content/uploads/2026/06/NeuroStrip-homepage-1.webp | `homepage-1x.webp`, `homepage-2x.webp` | Hero alternative | Strip clearly visible |

The slots are a proposal. Each image has to be looked at before it goes in, and any crop where the strip is not clearly visible should be dropped. Skip the Case-Study images, the "therapeutist" image and anything on the staging domain.

## How to add them

1. Allow controlbionics.com in the environment's network settings, or download the files on a normal machine.
2. Convert each to WebP at two widths and keep each file under about 300 KB:

   ```sh
   cwebp -q 78 -resize 1200 0 NeuroStrip-calves-03.jpg -o calves-1x.webp
   cwebp -q 74 -resize 2400 0 NeuroStrip-calves-03.jpg -o calves-2x.webp
   ```

   Use 1x widths of about 1200px for full-width slots and 700px for tiles.
3. Replace the SVG inside the matching `figure` with an image, keeping the figure and its classes:

   ```html
   <img src="assets/img/cb/calves-1x.webp"
        srcset="assets/img/cb/calves-1x.webp 1x, assets/img/cb/calves-2x.webp 2x"
        width="1200" height="800" loading="lazy" decoding="async"
        alt="A NeuroStrip sensor on the back of an athlete's calf">
   ```

   Leave out `loading="lazy"` on the hero only. Write alt text that says what the photo shows.
4. Change the caption under the figure from "Illustration" to the credit "Product photography: Control Bionics.", and update the footer line in `src/shell.html`.
5. Run `node tools/build.mjs`. The build embeds every `src="assets/img/..."` file into `standalone.html` as a data URI, so the offline copy keeps the 1x images. It does not read `srcset`, which is fine for an offline copy.

Do not edit the product in any photo and do not add overlays.
