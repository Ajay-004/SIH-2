import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Search, User, LogOut, X, Globe, Calendar, ChevronRight } from 'lucide-react';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

// --- Typewriter Logic ---
const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    setDisplayedText(""); 
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else { clearInterval(timer); }
    }, 30);
    return () => clearInterval(timer);
  }, [text]);
  return <span className="text-white/70">{displayedText}</span>;
};

const Home = () => {
  const [lang, setLang] = useState('en'); 
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  // Bilingual Content Dictionary
  const content = {
    en: {
      brand: "TN Flow", nav: ["Planner", "Finder", "Festivals"], id: "Identity",
      user: "Username", email: "Email", logout: "Terminate Session",
      btn: "Initiate Exploration", system: "Module Activated",
      features: [
        { 
          title: "Trip Planner", tagline: "AI-POWERED ITINERARY",
          desc: "Let AI design your perfect Tamil Nadu journey, optimized for time and local charm."
        },
        { 
          title: "Place Finder", tagline: "DESTINATION DISCOVERY",
          desc: "From the mist-covered peaks of Ooty to the sapphire waves of Dhanushkodi, find your next sanctuary."
        },
        { 
          title: "Festival Finder", tagline: "CULTURAL CALENDAR",
          desc: "Live updates on temple festivals, cultural events, and local celebrations within your radius."
        }
      ]
    },
    ta: {
      brand: "டிஎன் ஃபுளோ", nav: ["திட்டம்", "இடங்கள்", "திருவிழாக்கள்"], id: "அடையாளம்",
      user: "பயனர் பெயர்", email: "மின்னஞ்சல்", logout: "வெளியேறு",
      btn: "ஆராய்ந்து பாருங்கள்", system: "இயக்க முறைமை",
      features: [
        { 
          title: "பயணத் திட்டம்", tagline: "கலாச்சார நாட்காட்டி",
          desc: "செயற்கை நுண்ணறிவு உங்கள் பயணத்தை வடிவமைக்கட்டும், நேரம் மற்றும் அழகிற்காக மேம்படுத்தப்பட்டது."
        },
        { 
          title: "இடங்கள்", tagline: "இலக்கு கண்டுபிடிப்பு",
          desc: "ஊட்டியின் பனி மூடிய சிகரங்கள் முதல் தனுஷ்கோடியின் நீல அலைகள் வரை உங்கள் அடுத்த புகலிடத்தைக் கண்டறியவும்."
        },
        { 
          title: "திருவிழாக்கள்", tagline: "கலாச்சார நாட்காட்டி",
          desc: "கோவில் திருவிழாக்கள் மற்றும் கலாச்சார நிகழ்வுகளின் நேரலை தகவல்களை உங்கள் அருகிலேயே பெறுங்கள்."
        }
      ]
    }
  }[lang];

  const icons = [<Compass size={56} />, <Search size={56} />, <Calendar size={56} />];
  const paths = ["/planner", "/finder", "/festivals"];

  useEffect(() => {
    const timer = setInterval(() => setActiveIndex(p => (p + 1) % 3), 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      
      {/* 1. RESPONSIVE NAVBAR */}
      <nav className="fixed top-0 left-0 w-full h-20 z-50 bg-black/20 backdrop-blur-2xl border-b border-white/10 flex justify-center">
        <div className="w-full max-w-7xl px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center gap-2">
           
            <span className="text-lg md:text-xl font-black tracking-widest text-white uppercase italic">{content.brand}</span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {content.nav.map((item, i) => (
              <Link key={i} to={paths[i]} className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-cyan-400 transition-all">{item}</Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setLang(lang === 'en' ? 'ta' : 'en')} className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-all cursor-pointer">
              <Globe size={18}/> <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">{lang === 'en' ? "தமிழ்" : "English"}</span>
            </button>
            <button onClick={() => setIsProfileOpen(true)} className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-cyan-400 transition-all cursor-pointer">
              <User size={16} className="text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. IDENTITY SIDEBAR */}
      <AnimatePresence>
        {isProfileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsProfileOpen(false)} className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-md" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-sm glass rounded-none border-y-0 border-r-0 z-[70] p-10 md:p-12 flex flex-col bg-black/80">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-xl font-black uppercase tracking-[0.3em] text-white italic">{content.id}</h2>
                <X size={24} className="cursor-pointer text-white/40 hover:text-white" onClick={() => setIsProfileOpen(false)} />
              </div>
              <div className="flex-1 space-y-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-tr from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"><User size={32} className="text-white" /></div>
                  <h3 className="text-xl font-bold text-white uppercase italic tracking-tighter">Arul M</h3>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">{content.user}</p>
                    <p className="text-sm font-bold">arul_m_2026</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">{content.email}</p>
                    <p className="text-sm font-bold text-white/60">arul.tn@flow.com</p>
                  </div>
                </div>
              </div>
              <button onClick={() => signOut(auth).then(() => navigate("/"))} className="btn-pill bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white mt-auto">{content.logout}</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. RESPONSIVE HERO SECTION */}
      <main className="min-h-screen pt-24 md:pt-32 flex items-center justify-center px-6">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
          
          {/* Left Block: Visual Icon Container */}
          <div className="relative flex justify-center items-center h-[250px] md:h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div key={activeIndex} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} transition={{ duration: 0.8 }} className="absolute">
                <div className="absolute inset-0 -z-10 bg-cyan-400/20 rounded-full blur-[100px] scale-150 animate-pulse" />
                <div className="w-40 h-40 md:w-72 md:h-72 rounded-[2.5rem] md:rounded-[3.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 shadow-[0_0_80px_rgba(34,211,238,0.2)]">
                  {icons[activeIndex]}
                </div>
              </motion.div>
            </AnimatePresence>
            {/* Pagination Markers */}
            <div className="absolute bottom-0 md:bottom-4 flex gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-700 ${i === activeIndex ? 'w-12 bg-cyan-400' : 'w-4 bg-white/10'}`} />
              ))}
            </div>
          </div>

          {/* Right Block: Content with Left Border */}
          <div className="space-y-6 md:space-y-8 pl-0 md:pl-10 lg:border-l-2 border-white/20">
            <AnimatePresence mode="wait">
              <motion.div key={activeIndex} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.6 }}>
                <span className="text-[10px] md:text-xs font-black text-cyan-400 tracking-[0.5em] uppercase block mb-4">
                  {content.features[activeIndex].tagline}
                </span>
                
                {/* DYNAMIC FONT SIZE: Shrinks for Tamil to prevent overflow */}
                <h1 className={`font-black text-white italic tracking-tighter uppercase mb-6 leading-[0.9] break-words ${
                  lang === 'ta' ? 'text-4xl md:text-6xl lg:text-7xl' : 'text-5xl md:text-8xl'
                }`}>
                  {content.features[activeIndex].title}
                </h1>

                <div className="min-h-[120px] md:min-h-[160px]">
                  <p className="text-lg md:text-xl font-light text-white/40 leading-relaxed mb-10 max-w-lg">
                    <Typewriter key={activeIndex} text={content.features[activeIndex].desc} />
                  </p>
                </div>

                <motion.button onClick={() => navigate(paths[activeIndex])} whileHover={{ x: 10 }} className="group flex items-center gap-4 text-white font-black uppercase tracking-[0.3em] text-xs md:text-sm">
                  <span className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ChevronRight size={20} />
                  </span>
                  {content.btn}
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Home;