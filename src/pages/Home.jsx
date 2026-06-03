import Hero from "../components/HeroSection";

const Home = () => {
  return (
    <main>
      {/* SEO/accessibility heading — read by crawlers & screen readers, visually hidden.
          Keeps the keyword-rich H1 in the DOM without altering the visual design. */}
      <h1 style={{
        position: "absolute", width: 1, height: 1, padding: 0, margin: -1,
        overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0,
      }}>
        Rep Radar — Free AI Online Reputation Checker. Check your reputation score across
        X, Instagram, TikTok, Facebook, LinkedIn and Google with sentiment analysis,
        competitor benchmarks and a full PDF report.
      </h1>
      <Hero />
    </main>
  );
};

export default Home;
