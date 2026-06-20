import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { sanity, urlFor, POSTS_QUERY, sanityConfigured } from "../lib/sanityClient";

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function Blog() {
  const [posts, setPosts]   = useState([]);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    document.title = "Blog — Rep Radar | Online Reputation Insights";
    if (!sanityConfigured) { setLoad(false); return; }
    sanity.fetch(POSTS_QUERY)
      .then(data => { setPosts(data || []); setLoad(false); })
      .catch(() => { setError("Couldn't load posts right now."); setLoad(false); });
  }, []);

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "70vh" }}>
      {/* Header */}
      <section style={{ textAlign: "center", padding: "64px 24px 40px", position: "relative", borderBottom: "1px solid var(--border)", background: "var(--bg-surface)" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "var(--accent)" }}/>
        <span style={{
          display: "inline-block", padding: "4px 14px", borderRadius: 999,
          background: "var(--accent-dim)", border: "1px solid var(--accent-border)",
          color: "var(--accent)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", marginBottom: 16,
        }}>
          The Rep Radar Blog
        </span>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.03em", margin: "0 0 12px" }}>
          Online reputation insights
        </h1>
        <p style={{ fontSize: 16, color: "var(--text-2)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>
          Practical guides on protecting and growing your reputation — for businesses, brands and public figures.
        </p>
      </section>

      {/* Posts */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 24px 80px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-3)" }}>
            <div style={{ width: 40, height: 40, border: "3px solid var(--border)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin .8s linear infinite", margin: "0 auto" }}/>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : !sanityConfigured ? (
          <EmptyState text="Blog is being set up. Check back soon." />
        ) : error ? (
          <EmptyState text={error} />
        ) : posts.length === 0 ? (
          <EmptyState text="No posts yet — new articles coming soon." />
        ) : (
          <div className="blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            <style>{`@media (max-width: 900px){.blog-grid{grid-template-columns:1fr 1fr !important;}} @media (max-width:600px){.blog-grid{grid-template-columns:1fr !important;}}`}</style>
            {posts.map(p => (
              <Link key={p._id} to={`/blog/${p.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <article style={{
                  background: "var(--bg-surface)", border: "1px solid var(--border)",
                  borderRadius: 16, overflow: "hidden", height: "100%",
                  transition: "box-shadow .15s, transform .15s",
                }}
                  onMouseOver={e => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseOut={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                  {p.mainImage ? (
                    <img src={urlFor(p.mainImage).width(600).height(340).fit("crop").url()} alt={p.title}
                         style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} loading="lazy" />
                  ) : (
                    <div style={{ height: 180, background: "linear-gradient(135deg, #2563EB, #7C3AED)" }}/>
                  )}
                  <div style={{ padding: 20 }}>
                    {p.categories?.[0] && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{p.categories[0]}</span>
                    )}
                    <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-1)", margin: "8px 0 8px", lineHeight: 1.3 }}>{p.title}</h2>
                    {p.excerpt && <p style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6, margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.excerpt}</p>}
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>
                      {p.author && <span>{p.author} · </span>}{fmtDate(p.publishedAt)}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 24px" }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--accent-dim)", border: "1px solid var(--accent-border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 26 }}>📝</div>
      <p style={{ fontSize: 15, color: "var(--text-2)", margin: 0 }}>{text}</p>
    </div>
  );
}
