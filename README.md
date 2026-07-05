# Yoga Shala Website

A calm, single-page website for an Ashtanga yoga shala in Vancouver, BC.
Built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com),
deployed as a fast static site.

---

## How to edit your site (no coding needed)

Everything you'll normally change lives in **one file**:

```
src/content/site.yaml
```

Open it, change the text between the quotes, and save. That's it. You never
need to touch the design or code.

**The easiest way to edit** (no software to install):

1. Open the project on GitHub in your browser.
2. Go to `src/content/site.yaml` and click the pencil (Edit) icon.
3. Change the wording you want.
4. Scroll down and click **Commit changes**.
5. Wait about a minute - the live site updates automatically.

**A few golden rules:**

- Keep the labels before the colon (like `price:` or `heading:`) exactly as they are.
- Keep the same indentation (spaces) as the lines around what you're editing.
- Wrap text in `"double quotes"` if it contains punctuation.
- Write dates as `YEAR-MONTH-DAY`, for example `2026-07-11`.

### The schedule

The schedule updates itself. You only edit the plain facts in `site.yaml`:

- **Weekday times/descriptions** - under `schedule > days`.
- **Alternating Fridays** - listed in `friday_alternates`; the site counts
  which one is on each week from `friday_anchor` (a Friday whose answer you know).
- **Themed Saturdays** - add a line under `saturday_themes` with a date and theme.
- **Full & New Moon rest days** - listed under `moon_rest_days`. It's pre-filled
  for 2026. Each year, update it from the linked moon calendar (choose Vancouver).

The "Today at the shala" banner is worked out automatically from the above,
in Vancouver time, so it's always current.

### Photos and video

- Drop image files into `public/images/` and point to them in `site.yaml`
  (for example set `teacher.image` to `/images/teacher.jpg`).
- Drop a video into `public/videos/` and set `media.intro_video` to
  `/videos/your-file.mp4`. Until then, a placeholder is shown.

### Payments

Payment is a placeholder for now. When you're ready to accept payment online
(e.g. via Square), those buttons/links can be added to the Rates and Payment
sections.

---

## Running it on your computer (optional, for developers)

```bash
npm install      # install dependencies (first time only)
npm run dev      # preview locally at http://localhost:4321
npm run build    # build the production site into dist/
npm run preview  # preview the built site
npm run check    # type-check the project
npm test         # run the schedule unit tests
```

This project uses Node 20 (pinned via [Volta](https://volta.sh)).

---

## Deploying to Netlify

1. Push this project to a GitHub repository.
2. Sign in to [Netlify](https://app.netlify.com) and choose **Add new site >
   Import an existing project**.
3. Connect your GitHub repo. Netlify reads `netlify.toml`, so the settings are
   filled in for you:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy**. You'll get a live `*.netlify.app` URL in a minute or two.
5. Every time you commit a change (including edits to `site.yaml`), Netlify
   rebuilds and republishes automatically.

To use your own domain later, add it under **Domain settings** in Netlify.
Remember to update `site` in `astro.config.mjs` to your final URL.
