import React from 'react';
import { GRCProvider } from './context/GRCContext';
import Layout from './components/common/Layout';

function App() {
  return (
    <GRCProvider>
      <Layout />
    </GRCProvider>
  );
}

export default App;