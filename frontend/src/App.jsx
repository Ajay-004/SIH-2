import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebaseConfig';

// PAGES (Ensure these files exist in src/pages/)
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import TripPlanner from './pages/TripPlanner';
import PlaceFinder from './pages/PlaceFinder';

// COMPONENTS (Ensure these exist in src/components/)
import Navbar from './components/Navbar';
import LoadingAnimation from './components/LoadingAnimation';

function App() {
  const [user, loading] = useAuthState(auth);
  const [lang, setLang] = useState('en');

  if (loading) return <LoadingAnimation />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login lang={lang} setLang={setLang} />} />
        <Route path="/signup" element={<Signup lang={lang} setLang={setLang} />} />
        
        {/* Protected Routes */}
        <Route path="/home" element={user ? <><Navbar lang={lang} setLang={setLang}/><Home lang={lang}/></> : <Navigate to="/" />} />
        <Route path="/planner" element={user ? <><Navbar lang={lang} setLang={setLang}/><TripPlanner lang={lang}/></> : <Navigate to="/" />} />
        <Route path="/finder" element={user ? <><Navbar lang={lang} setLang={setLang}/><PlaceFinder lang={lang}/></> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;