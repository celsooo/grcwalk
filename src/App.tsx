import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GRCProvider } from './context/GRCContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/common/Layout';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <GRCProvider>
          <Layout />
        </GRCProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;