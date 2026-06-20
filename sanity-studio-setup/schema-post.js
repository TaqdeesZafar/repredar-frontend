// ─────────────────────────────────────────────────────────────────────────────
// Rep Radar — Sanity blog schema
// Paste this into your Sanity Studio as schemaTypes/post.js (see SETUP.md).
// It defines the "Post" type plus Author and Category, and the SEO fields
// the rep-radar.com blog reads.
// ─────────────────────────────────────────────────────────────────────────────

export const post = {
  name: "post",
  title: "Blog Post",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description: "The URL of the post, e.g. /blog/how-to-check-your-reputation",
    },
    {
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary shown on the blog list and used as the meta description fallback.",
    },
    {
      name: "mainImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    },
    {
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    },
    {
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },               // rich text: headings, bold, links, lists
        { type: "image", options: { hotspot: true }, fields: [{ name: "alt", type: "string", title: "Alt text" }] },
      ],
    },
    // ── SEO ──
    {
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Optional. Overrides the browser tab / search title. Leave blank to use the post title.",
    },
    {
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      description: "Optional. The meta description for search engines. Leave blank to use the excerpt.",
    },
  ],
  preview: {
    select: { title: "title", media: "mainImage", subtitle: "publishedAt" },
  },
};

export const author = {
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (Rule) => Rule.required() },
    { name: "image", title: "Photo", type: "image", options: { hotspot: true } },
  ],
};

export const category = {
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() },
  ],
};
