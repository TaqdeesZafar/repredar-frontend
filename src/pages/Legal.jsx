// Lightweight legal pages (Privacy + Terms). One component, two modes.
// Plain, honest, app-specific copy — not boilerplate that overpromises.

const wrap = {
  maxWidth: 800, margin: "0 auto", padding: "56px 24px 80px",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};
const h1 = { fontSize: 32, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.02em", margin: "0 0 8px" };
const meta = { fontSize: 13, color: "var(--text-3)", margin: "0 0 36px" };
const h2 = { fontSize: 18, fontWeight: 700, color: "var(--text-1)", margin: "32px 0 10px" };
const p  = { fontSize: 15, color: "var(--text-2)", lineHeight: 1.7, margin: "0 0 14px" };

function Page({ title, children }) {
  return (
    <div style={{ background: "var(--bg-page)", minHeight: "70vh" }}>
      <div style={wrap}>
        <h1 style={h1}>{title}</h1>
        <p style={meta}>Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        {children}
      </div>
    </div>
  );
}

export function PrivacyPolicy() {
  return (
    <Page title="Privacy Policy">
      <p style={p}>Rep Radar (“we”, “us”), a service of Reputation Return, respects your privacy. This policy explains what we collect and how we use it.</p>

      <h2 style={h2}>What we analyse</h2>
      <p style={p}>Rep Radar analyses <strong>publicly available information only</strong> — public social media posts, comments, reviews, news coverage and web search results. We never access private accounts, never post on your behalf, and never log into anything.</p>

      <h2 style={h2}>Information you provide</h2>
      <p style={p}>When you request a full report we ask for your email address so we can send you a copy of the PDF. If you create an account, we store your email and the reports you generate. That’s it — we don’t ask for payment information to use the free tool.</p>

      <h2 style={h2}>How we use your information</h2>
      <p style={p}>We use your email to deliver your report and, where relevant, to share related insights or offers from Reputation Return. You can unsubscribe from any email at any time using the link in the footer of that email.</p>

      <h2 style={h2}>Sharing</h2>
      <p style={p}>We do not sell your data. We share your email only with the service providers that help us operate (e.g. our email/CRM platform) strictly to deliver the service.</p>

      <h2 style={h2}>Data retention</h2>
      <p style={p}>Generated reports are cached temporarily and removed automatically. Account data is kept while your account is active. Contact us to request deletion.</p>

      <h2 style={h2}>Contact</h2>
      <p style={p}>Questions about privacy? Email <a href="mailto:support@reputationreturn.com" style={{ color: "var(--accent)" }}>support@reputationreturn.com</a>.</p>
    </Page>
  );
}

export function TermsOfService() {
  return (
    <Page title="Terms of Service">
      <p style={p}>By using Rep Radar (a service of Reputation Return), you agree to these terms.</p>

      <h2 style={h2}>What Rep Radar does</h2>
      <p style={p}>Rep Radar generates an AI-assisted reputation report based on publicly available information. Reports are provided for informational purposes and reflect AI analysis of public signals at the time of the scan.</p>

      <h2 style={h2}>Accuracy</h2>
      <p style={p}>We work hard to make reports accurate, but they are AI-generated estimates, not guarantees. Scores, sentiment and findings should be treated as guidance, not definitive fact. You are responsible for how you act on the information.</p>

      <h2 style={h2}>Acceptable use</h2>
      <p style={p}>You agree to use Rep Radar lawfully and not to use it to harass, defame, or harm others. We may decline to process certain searches at our discretion.</p>

      <h2 style={h2}>Free service</h2>
      <p style={p}>Rep Radar is provided free of charge. We may change, limit, or discontinue features at any time.</p>

      <h2 style={h2}>Liability</h2>
      <p style={p}>Rep Radar is provided “as is.” To the maximum extent permitted by law, we are not liable for any decisions made based on a report or for any indirect or consequential damages.</p>

      <h2 style={h2}>Contact</h2>
      <p style={p}>Questions about these terms? Email <a href="mailto:support@reputationreturn.com" style={{ color: "var(--accent)" }}>support@reputationreturn.com</a>.</p>
    </Page>
  );
}
