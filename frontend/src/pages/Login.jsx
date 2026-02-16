import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaGlobe } from 'react-icons/fa';
import { auth } from '../firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import LoadingAnimation from '../components/LoadingAnimation';

const translations = {
  en: {
    welcome: "Welcome Back",
    email: "Email Address",
    pass: "Password",
    login: "Login",
    noAcc: "New traveler?",
    signup: "Create Account",
    tagline: "Explore South India"
  },
  ta: {
    welcome: "நல்வரவு",
    email: "மின்னஞ்சல்",
    pass: "கடவுச்சொல்",
    login: "உள்நுழை",
    noAcc: "புதிய பயணியா?",
    signup: "பதிவு செய்க",
    tagline: "தென்னிந்தியாவை ஆராயுங்கள்"
  }
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('en');
  const navigate = useNavigate();

  const t = translations[lang];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); 
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setTimeout(() => navigate("/home"), 1200);
    } catch (err) {
      setLoading(false); 
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 font-sans p-6">
      {/* Soft Background Accent */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-72 h-72 bg-teal-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-green-100/50 rounded-full blur-3xl" />
      </div>

      <AnimatePresence>
        {loading && <LoadingAnimation />}
      </AnimatePresence>

      {/* Language Toggle */}
      <button 
        onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
        className="absolute top-8 right-8 z-20 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-500 hover:text-teal-600 transition-colors"
      >
        <FaGlobe /> {lang === 'en' ? 'தமிழ்' : 'English'}
      </button>

      {/* Small Block Center Design */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[360px] z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight text-teal-900">
            TN<span className="text-green-600">Flow</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">{t.tagline}</p>
        </div>

        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">{t.welcome}</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[11px] text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1 block">
                {t.email}
              </label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                type="email" 
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="relative">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1 block">
                {t.pass}
              </label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[34px] text-slate-400 hover:text-teal-600 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={16}/> : <FaEye size={16}/>}
              </button>
            </div>

            <motion.button 
              whileTap={{ scale: 0.97 }}
              type="submit" 
              className="w-full bg-teal-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-teal-900/20 hover:bg-teal-800 transition-all text-sm mt-2"
            >
              {t.login}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-xs">
              {t.noAcc} <Link to="/signup" className="text-teal-700 font-bold hover:text-green-600 transition-colors">{t.signup}</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}