# Rep Radar Blog — Sanity Setup (one-time, ~20 minutes)

This gives you a WordPress-like editor to write blog posts. Posts appear
automatically on https://www.rep-radar.com/blog — no code or deploy needed
after the one-time setup.

---

## Step 1 — Create your Sanity Studio (the editor)

In a terminal, run:

```bash
npm create sanity@latest -- --template clean --create-project "Rep Radar Blog" --dataset production
```

When prompted:
- Log in / create a free account (Google or GitHub is fine)
- Output path: `rep-radar-blog-studio` (or anything)
- TypeScript: **No** (keep it simple)
- Package manager: npm

After it finishes, note the **Project ID** it prints (looks like `abc12xyz`). You'll need it in Step 4.

---

## Step 2 — Add the blog schema

1. Open the folder it created (`rep-radar-blog-studio`).
2. Copy `schema-post.js` (from this folder) into the Studio's `schemaTypes/` folder.
3. Open `schemaTypes/index.js` and replace its contents with:

```js
import { post, author, category } from "./schema-post";
export const schemaTypes = [post, author, category];
```

---

## Step 3 — Run + deploy the Studio

From inside the Studio folder:

```bash
npm run dev      # preview locally at http://localhost:3333
npm run deploy   # publishes it free at https://<your-name>.sanity.studio
```

`npm run deploy` will ask you to pick a studio hostname. After that, **bookmark
that URL — it's your blog dashboard.** Log in there anytime to write posts.

---

## Step 4 — Allow rep-radar.com to read the content (CORS)

1. Go to https://www.sanity.io/manage → your project → **API** → **CORS origins**
2. Add origin: `https://www.rep-radar.com` (and `https://rep-radar.com`) — leave "Allow credentials" OFF
3. Add `http://localhost:5173` too if you want it to work in local dev

---

## Step 5 — Connect the site (Railway env vars)

In Railway → the **frontend** service → Variables, add:

```
VITE_SANITY_PROJECT_ID = <the Project ID from Step 1>
VITE_SANITY_DATASET = production
```

Then redeploy the frontend (Vite reads these at build time).

Add the same two to a local `.env` file if you want the blog to work in `npm run dev`.

---

## Step 6 — Write your first post

1. Open your Studio URL (from Step 3)
2. Create an **Author** (your name + photo) and a **Category** (e.g. "Reputation Tips")
3. Create a **Blog Post** → write, add a featured image, set the slug, fill SEO fields → **Publish**
4. Visit https://www.rep-radar.com/blog — it's there.

That's it. From now on, writing a post = open Studio, write, Publish. Nothing else.

---

### Notes
- The blog page shows a friendly "coming soon" message until the env vars are set, so it never breaks the site.
- Each post automatically gets its own SEO title, description and Open Graph image for Google + social sharing.
- Images are hosted and CDN-served by Sanity (free tier) — you don't manage storage.
