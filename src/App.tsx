import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Budget from './pages/Budget';
import Goals from './pages/Goals';
import Investments from './pages/Investments';
import Debt from './pages/Debt';
import Tax from './pages/Tax';
import Calculators from './pages/Calculators';
import Chat from './pages/Chat';
import Scenarios from './pages/Scenarios';
import { FinancialProvider } from './context/FinancialContext';
import Disclaimer from './components/Disclaimer';

function App() {
  return (
    <FinancialProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <Navbar />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="pt-16"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/investments" element={<Investments />} />
              <Route path="/debt" element={<Debt />} />
              <Route path="/tax" element={<Tax />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/scenarios" element={<Scenarios />} />
            </Routes>
          </motion.main>
          <Disclaimer />
        </div>
      </Router>
    </FinancialProvider>
  );
}

export default App;