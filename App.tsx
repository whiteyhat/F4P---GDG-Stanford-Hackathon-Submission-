
import React, { useState, useEffect, useRef } from 'react';

// Add this declaration for the global JSConfetti object from the CDN script
declare const JSConfetti: any;

// --- SVG Icons ---
const CreeperIcon = () => (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-48 h-48 mx-auto text-green-500">
        <rect width="32" height="32" fill="#3E7D3A"/>
        <rect x="8" y="6" width="6" height="6" fill="black"/>
        <rect x="18" y="6" width="6" height="6" fill="black"/>
        <rect x="13" y="12" width="6" height="10" fill="black"/>
        <rect x="8" y="16" width="5" height="6" fill="black"/>
        <rect x="19" y="16" width="5" height="6" fill="black"/>
    </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 transform transition-transform group-hover:translate-x-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
  </svg>
);

const LiveDotIcon = () => <div className="w-4 h-4 bg-green-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse"></div>;

const GithubIcon = () => (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
);

const WinnerStamp = () => (
    <a
        href="https://www.linkedin.com/posts/dan-goncharov_yesterdays-build-with-gemini-win-up-activity-7395918043735859200-exMe/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-8 right-[-105px] z-[100] w-80 py-2 transform rotate-45 bg-amber-400 text-black text-sm font-extrabold uppercase tracking-wider text-center shadow-lg hover:bg-amber-500 transition-colors duration-300 ease-in-out overflow-hidden"
        aria-label="View Hackathon Winner announcement on LinkedIn"
    >
       <div className="whitespace-nowrap animate-marquee-right">
            <span className="mx-4">HACKATHON WINNER: STANFORD x GOOGLE</span>
            <span className="mx-4">HACKATHON WINNER: STANFORD x GOOGLE</span>
       </div>
    </a>
);


const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsDropdownOpen(false);
          }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header className="sticky top-0 z-50 bg-gray-100/80 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-lg"></div>
                    <span className="font-bold text-xl text-gray-900">F4P</span>
                </div>
                <nav className="flex items-center gap-4">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-200"
                            aria-label="Open GitHub links"
                        >
                            <GithubIcon />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-72 origin-top-right bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                <div className="py-1">
                                    <a
                                        href="https://github.com/friends4payments/dory-x402-gemini"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                                    >
                                        Gemini Agentic Payments
                                    </a>
                                    <a
                                        href="https://github.com/whiteyhat/F4P---GDG-Stanford-Hackathon-Submission-"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                                    >
                                        Hackathon Submission Project
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                    <a href="https://dory-x402-gemini-1079989770684.europe-west1.run.app/agents/doryAgent/chat/e9a0209c-f376-4cf1-8226-8488e5168049" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors">
                        LIVE DEMO
                    </a>
                </nav>
            </div>
        </header>
    );
};

const App = () => {
  useEffect(() => {
    // Check if the library is loaded before using it
    if (typeof JSConfetti !== 'undefined') {
      const jsConfetti = new JSConfetti();
      jsConfetti.addConfetti({
        emojis: ['🏆'],
        confettiNumber: 70,
        emojiSize: 50,
      });
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div>
      <WinnerStamp />
      <Header />
      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Profile Card */}
            <div className="rounded-3xl overflow-hidden shadow-sm h-80 bg-gray-900">
              <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/Ip8j3vjuoxs?autoplay=1&mute=1&loop=1&playlist=Ip8j3vjuoxs&controls=1&si=m-Rqyi2NEW7XQTve" 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen>
              </iframe>
            </div>
            
            {/* Testimonial Card */}
            <div className="bg-gray-200 rounded-3xl p-8 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img className="w-16 h-16 rounded-full object-cover" src="https://media.licdn.com/dms/image/v2/D4E03AQFK6QBrM0jJzA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1728058358661?e=1764806400&v=beta&t=NlLWr1gPc-jnFb_8-9qa8ClG3BhAKicw9qZTHDh1i9g" alt="Carlos Roldan" />
                  <div>
                    <p className="font-bold text-gray-900">Carlos Roldan</p>
                    <p className="text-sm text-gray-600">CEO @F4P</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "Adding Gemini 2.5-flash was challenging, but not as complicated as deploying our agents in google cloud, but thanks to AI studio we made it in a few simple steps"
                </p>
              </div>
              <div className="flex justify-between items-center mt-6">
                <button className="text-gray-500 hover:text-gray-800">&lt;</button>
                <button className="text-gray-500 hover:text-gray-800">&gt;</button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Top Row: Name & Tools */}
            <div className="grid md:grid-cols-3 gap-6">
              <a 
                href="https://dory-x402-gemini-1079989770684.europe-west1.run.app/agents/doryAgent/chat/e9a0209c-f376-4cf1-8226-8488e5168049" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group md:col-span-2 bg-indigo-500 text-white rounded-3xl p-8 flex flex-col justify-center cursor-pointer hover:bg-indigo-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h1 className="text-5xl font-bold">Launch Agent LLM</h1>
                  <ArrowRightIcon />
                </div>
                <p className="mt-2 text-indigo-200">Interact with the gaming virtual companion via chat without playing games</p>
              </a>
              <div className="bg-gray-200 rounded-3xl p-8 flex flex-col justify-center">
                <h3 className="font-bold text-lg mb-2">GEMINI 2.5-flash</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Gemini 2.5 Flash powers Friends 4 Payments with low-latency multimodal AI that delivers real-time gameplay co-piloting and instant voice-activated purchases
                </p>
              </div>
            </div>

            {/* Middle Row: App Showcases */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative bg-gray-900 rounded-3xl p-8 h-80 flex flex-col justify-start items-start overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: "url('https://assets.gam3s.gg/chronosworlds_meta_image_51deeb9d2e/chronosworlds_meta_image_51deeb9d2e.jpg')" }}
                >
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                <div className="relative z-10 flex items-center gap-3">
                    <LiveDotIcon />
                    <h3 className="text-3xl font-bold text-white tracking-wide">LIVE SUPPORT</h3>
                </div>
              </div>
              <div className="relative bg-gray-900 rounded-3xl p-8 h-80 flex flex-col justify-start items-start overflow-hidden">
                <div 
                    className="absolute inset-0 bg-contain bg-no-repeat bg-center" 
                    style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Minecraft-creeper-face.jpg/500px-Minecraft-creeper-face.jpg')" }}
                >
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                <div className="relative z-10 flex items-center gap-3">
                    <LiveDotIcon />
                    <h3 className="text-3xl font-bold text-white tracking-wide">LIVE SUPPORT</h3>
                </div>
              </div>
            </div>

            {/* Bottom Row: Project Description */}
            <a 
              href="https://github.com/friends4payments/dory-x402-gemini/commit/af5246b4bdec322a0bc942636bc76722726ae485"
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
            >
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-3xl font-bold">Google Cloud Deployment Script:</h3>
                    <ArrowRightIcon />
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Deploying a Mastra AI agent on Google Cloud can involve moderate complexity, particularly for TypeScript-based setups requiring custom handling of ephemeral storage, Node.js runtime configuration, and integrations like Vertex AI for Gemini models. Challenges include adapting Mastra's local file dependencies (e.g., LibSQLStore) for serverless environments like Cloud Run and ensuring seamless API routing across providers. However, we crafted a highly effective prompt in Google AI Studio that streamlined the process: it generated optimized deployment scripts, automated containerization, and integrated observability, reducing setup time from hours to minutes while ensuring scalable, production-ready endpoints.
                </p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;