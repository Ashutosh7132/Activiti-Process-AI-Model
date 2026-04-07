import React, { useState } from 'react';
import BpmnDesigner from './components/BpmnDesigner';
import Dashboard from './components/Dashboard';
import { LayoutDashboard, PenTool } from 'lucide-react';

function App() {
  const [activeView, setActiveView] = useState('designer');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{
        padding: '1rem 2rem',
        background: '#2563eb',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Activiti AI Suite</h1>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setActiveView('designer')}
            style={navButtonStyle(activeView === 'designer')}
          >
            <PenTool size={18} /> Designer
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            style={navButtonStyle(activeView === 'dashboard')}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
        </nav>
      </header>

      <main style={{ flex: 1, overflow: 'hidden' }}>
        {activeView === 'designer' ? <BpmnDesigner /> : <Dashboard />}
      </main>
    </div>
  );
}

const navButtonStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '4px',
  background: isActive ? '#1d4ed8' : 'transparent',
  color: 'white',
  cursor: 'pointer',
  fontWeight: isActive ? 'bold' : 'normal',
  transition: 'background 0.2s'
});

export default App;