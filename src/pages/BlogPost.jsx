import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PortableText } from "@portabletext/react";
import { sanity, urlFor, POST_QUERY, sanityConfigured } from "../lib/sanityClient";

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// Set/replace a meta tag in <head> for per-post SEO.
function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute("content", content);
}

// How Sanity rich text ("portable text") renders into styled HTML.
const components = {
  block: {
    h2: ({ children }) => <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-1)", margin: "32px 0 12px", letterSpacing: "-0.02em" }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{ fontSize: 19, fontWeight: 700, color: "var(--text-1)", margin: "26px 0 10px" }}>{children}</h3>,
    h4: ({ children }) => <h4 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", margin: "22px 0 8px" }}>{children}</h4>,
    blockquote: ({ children }) => <blockquote style={{ borderLeft: "3px solid var(--accent)", paddingLeft: 18, margin: "20px 0", color: "var(--text-2)", fontStyle: "italic", fontSize: 16 }}>{children}</blockquote>,
    normal: ({ children }) => <p style={{ fontSize: 16, color: "var(--text-2)", lineHeight: 1.75, margin: "0 0 18px" }}>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul style={{ margin: "0 0 18px", paddingLeft: 22, color: "var(--text-2)", fontSize: 16, lineHeight: 1.7 }}>{children}</ul>,
    number: ({ children }) => <ol style={{ margin: "0 0 18px", paddingLeft: 22, color: "var(--text-2)", fontSize: 16, lineHeight: 1.7 }}>{children}</ol>,
  },
  listItem: { bullet: ({ children }) => <li style={{ marginBottom: 6 }}>{children}</li>, number: ({ children }) => <li style={{ marginBottom: 6 }}>{children}</li> },
  marks: {
    strong: ({ children }) => <strong style={{ color: "var(--text-1)", fontWeight: 700 }}>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>{children}</a>
    ),
  },
  types: {
    image: ({ value }) => (
      <img src={urlFor(value).width(900).url()} alt={value.alt || ""} loading="lazy"
           style={{ width: "100%", borderRadius: 12, margin: "24px 0", border: "1px solid var(--border)" }} />
    ),
  },
};

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost]  = useState(null);
  const [loading, setLoad] = useState(true);
  const [notFound, setNF] = useState(false);

  useEffect(() => {
    if (!sanityConfigured) { setLoad(false); setNF(true); return; }
    sanity.fetch(POST_QUERY, { slug })
      .then(data => {
        if (!data) { setNF(true); setLoad(false); return; }
        setPost(data); setLoad(false);
        // Per-post SEO
        const title = data.seoTitle || `${data.title} — Rep Radar`;
        document.title = title;
        setMeta("name", "description", data.seoDescription || data.excerpt || "");
        setMeta("property", "og:title", title);
        setMeta("property", "og:description", data.seoDescription || data.excerpt || "");
        setMeta("property", "og:type", "article");
        if (data.mainImage) setMeta("property", "og:image", urlFor(data.mainImage).width(1200).height(630).fit("crop").url());
      })
      .catch(() => { setNF(true); setLoad(false); });
  }, [slug]);

  if (loading) {
    return (
      <div style={{ background: "var(--bg-page)", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin .8s linear infinite" }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ background: "var(--bg-page)", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center", padding: 24 }}>
        <div style={{ fontSize: 40 }}>🔍</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-1)", margin: 0 }}>Post not found</h1>
        <Link to="/blog" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>← Back to the blog</Link>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "70vh" }}>
      <article style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 72px" }}>
        <Link to="/blog" style={{ color: "var(--accent)", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
          ← Back to the blog
        </Link>

        {post.categories?.[0] && (
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>{post.categories[0]}</div>
        )}
        <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.03em", lineHeight: 1.15, margin: "0 0 14px" }}>{post.title}</h1>
        <div style={{ fontSize: 13.5, color: "var(--text-3)", marginBottom: 28 }}>
          {post.author && <span>By {post.author} · </span>}{fmtDate(post.publishedAt)}
        </div>

        {post.mainImage && (
          <img src={urlFor(post.mainImage).width(1200).url()} alt={post.title} loading="lazy"
               style={{ width: "100%", borderRadius: 16, marginBottom: 32, border: "1px solid var(--border)" }} />
        )}

        <div className="blog-body">
          <PortableText value={post.body || []} components={components} />
        </div>

        {/* CTA back into the tool */}
        <div style={{ marginTop: 44, padding: 28, borderRadius: 16, background: "linear-gradient(135deg, #2563EB, #7C3AED)", textAlign: "center" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>See your own reputation score — free</h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", margin: "0 0 18px" }}>Scan 6 platforms in 60 seconds. No signup required.</p>
          <button onClick={() => navigate("/")} style={{ background: "#fff", color: "var(--accent)", border: "none", padding: "13px 30px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Check Your Reputation →
          </button>
        </div>
      </article>
    </div>
  );
}
