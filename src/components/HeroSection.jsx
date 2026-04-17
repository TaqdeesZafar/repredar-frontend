import MyGlobe from "./MyGlobe";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <main className="container mx-auto px-4 py-16 md:py-24">
      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <h2 className="text-4xl md:text-4xl font-bold mb-6">
            {/* Restore Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Online Reputation
            </span>{" "}
            Instantly with Reputation Return! */}
            What Are People Saying About You?{" "}
          </h2>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Find Out Right Now for {" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            FREE!
          </span>{" "}
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            {/* Monitor Global Conversations About{' '}
            <span className='text-blue-600 font-semibold'>
              Companies & Personalities
            </span>{' '}
            Across Social Media */}
            {/* Monitor Your Online Reputation and Outsmart Competitors by Analyzing
            Their Social Media Presence */}
            You also have an option to compare yourself to your biggest competitors.
          </p>

          <SearchBar placeholder="Enter a business or person name..." />
          <p className="text-sm text-gray-500 mt-2">
            Discover what people are saying about businesses and public figures
            anywhere in the world
          </p>

          <div className="mt-12 flex items-center gap-8 grayscale opacity-70">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Forbes_logo.svg" alt="Forbes" className="h-6" />
             <img src="https://upload.wikimedia.org/wikipedia/commons/0/02/The_New_York_Times_Logo.svg" alt="NYT" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a2/BBC_News_2019.svg" alt="BBC" className="h-4" />
          </div>
        </div>

        <div className="hidden md:block md:w-1/2">
          <div
            className="relative flex items-center justify-center"
            style={{ height: "400px" }}
          >
            {/* <MyGlobe /> */}
            <div className="w-full h-full relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <iframe
                className="relative w-full h-full rounded-lg shadow-2xl"
                src="https://www.youtube.com/embed/tQXE3IxaOgI"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24 grid md:grid-cols-3 gap-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <h3 className="text-xl font-bold mb-2">1. Search</h3>
          <p className="text-gray-600">Enter any name, brand, or social handle to start scanning.</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <h3 className="text-xl font-bold mb-2">2. Analyze</h3>
          <p className="text-gray-600">Our AI scans across 6+ major platforms for sentiment and reach.</p>
        </div>
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h3 className="text-xl font-bold mb-2">3. Report</h3>
          <p className="text-gray-600">Download a professional PDF report with actionable insights.</p>
        </div>
      </div>
    </main>
  );
};

export default Hero;
