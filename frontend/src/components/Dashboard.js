import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { name: 'Active Instances', count: 0 },
    { name: 'Completed', count: 0 },
    { name: 'Suspended', count: 0 }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/api/processes/instances");
        setStats([
          { name: 'Active Instances', count: data.length },
          { name: 'Completed', count: 12 }, // Simulated
          { name: 'Suspended', count: 2 }   // Simulated
        ]);
      } catch (e) {
        console.error("Could not fetch stats from backend");
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div style={{ padding: '2rem', height: '100%', background: '#f8fafc' }}>
      <h2 style={{ marginBottom: '2rem' }}>Process Analytics</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map((item, idx) => (
          <div key={idx} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{item.name}</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{item.count}</p>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', height: '400px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {stats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;