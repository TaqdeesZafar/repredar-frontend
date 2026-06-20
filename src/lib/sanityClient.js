import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// These come from your Sanity project. Set them in Railway (and .env locally):
//   VITE_SANITY_PROJECT_ID = <your project id>
//   VITE_SANITY_DATASET    = production
const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || "";
const dataset    = import.meta.env.VITE_SANITY_DATASET || "production";

export const sanityConfigured = Boolean(projectId);

export const sanity = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true, // fast, cached reads — fine for a public blog
});

const builder = imageUrlBuilder(sanity);
export const urlFor = (source) => builder.image(source);

// ─── GROQ queries ──────────────────────────────────────────────────────────────

// List of published posts (newest first), lightweight fields for cards.
export const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  mainImage,
  publishedAt,
  "author": author->name,
  "categories": categories[]->title
}`;

// A single post by slug, with full body + SEO fields.
export const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  mainImage,
  body,
  publishedAt,
  "author": author->name,
  "authorImage": author->image,
  "categories": categories[]->title,
  seoTitle,
  seoDescription
}`;
