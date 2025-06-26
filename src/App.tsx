import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import FontLibrary from './components/FontLibrary';
import Collections from './components/Collections';
import FontDetail from './components/FontDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="fonts" element={<FontLibrary />} />
          <Route path="fonts/:id" element={<FontDetail />} />
          <Route path="collections" element={<Collections />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;