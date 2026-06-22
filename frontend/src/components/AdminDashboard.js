import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import './AdminDashboard.css';

const AdminDashboard = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, recentUsers: [] });
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [latestStyle, setLatestStyle] = useState(null);
  const [styleLoading, setStyleLoading] = useState(false);
  const [dist, setDist] = useState({ total: 0, distribution: [] });
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('/admin/stats', { credentials: 'include' });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || 'Failed to load stats');
        }
        const json = await res.json();
        setStats(json.data || { totalUsers: 0, recentUsers: [] });
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch distribution and render chart
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/admin/style-distribution', { credentials: 'include' });
        if (res.ok) {
          const json = await res.json();
          setDist(json.data || { total: 0, distribution: [] });
        }
      } catch {}
    })();
  }, []);

  // Render/Update chart when distribution changes
  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;
    const labels = dist.distribution.map(d => d.style || 'Unknown');
    const values = dist.distribution.map(d => d.count);
    const palette = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#06B6D4','#84CC16'];
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    if (labels.length === 0) return;
    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: labels.map((_, i) => palette[i % palette.length]),
          borderColor: '#ffffff',
          borderWidth: 2
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom' } },
        responsive: true
      }
    });
  }, [dist]);

  const handleSearch = async (e) => {
    e && e.preventDefault();
    try {
      setError('');
      const url = `/admin/users?query=${encodeURIComponent(query || '')}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Search failed');
      }
      const json = await res.json();
      setResults(json.data || []);
    } catch (e) {
      setError(e.message || 'Search failed');
    }
  };

  const fetchUserStyle = async (email) => {
    setStyleLoading(true);
    setLatestStyle(null);
    try {
      const res = await fetch(`/admin/user-style?email=${encodeURIComponent(email)}`, { credentials: 'include' });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to fetch user style');
      }
      const json = await res.json();
      setLatestStyle(json.data || null);
    } catch (e) {
      setError(e.message || 'Failed to fetch user style');
    } finally {
      setStyleLoading(false);
    }
  };

  const recentUsers = useMemo(() => stats.recentUsers || [], [stats]);

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h2 className="title">Admin Dashboard</h2>
            <p className="subtitle">Manage users and view learning styles</p>
          </div>
          <div className="header-actions">
            <button className="btn" onClick={() => onPageChange && onPageChange('home')}>Home</button>
          </div>
        </div>

        {error && <div className="alert error">{error}</div>}
        {loading && <div className="loading">Loading admin stats…</div>}

        {!loading && (
          <>
            <div className="cards">
              <div className="card stat">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{stats.totalUsers}</div>
              </div>
              <div className="card recent">
                <div className="section-title">Recently Joined</div>
                <ul className="list recent-list">
                  {recentUsers.length === 0 && <li className="muted">No users</li>}
                  {recentUsers.map((u, idx) => (
                    <li key={idx}>
                      <div className="name">{u.name || '-'}</div>
                      <div className="muted small">{u.email}</div>
                      <div className="muted small">Joined: {u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card dist">
                <div className="section-title">Learning Style Distribution</div>
                {(!dist.distribution || dist.distribution.length === 0) ? (
                  <div className="muted">No data available</div>
                ) : (
                  <div className="dist-wrap">
                    <canvas ref={chartRef} height="220" />
                    <ul className="dist-legend">
                      {dist.distribution.map((d, i) => (
                        <li key={i}>
                          <span className="dot" style={{ background: ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#06B6D4','#84CC16'][i % 7] }} />
                          <span className="label">{d.style || 'Unknown'}</span>
                          <span className="val">{d.count} ({d.percent}%)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="search-block">
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-primary" type="submit">Search</button>
              </form>

              <div className="results">
                {results.length === 0 ? (
                  <div className="muted">No results</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => (
                        <tr key={i}>
                          <td>{r.name || '-'}</td>
                          <td>{r.email}</td>
                          <td>{r.role || 'Student'}</td>
                          <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : '-'}</td>
                          <td>
                            <button
                              className="btn"
                              onClick={() => { setSelectedUser(r); fetchUserStyle(r.email); }}
                            >
                              View Style
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="style-panel">
              <h3 className="section-title">User Learning Style</h3>
              {!selectedUser && <div className="muted">Select a user to view their latest style.</div>}
              {selectedUser && (
                <div className="card">
                  <div className="user-row">
                    <div>
                      <div className="name">{selectedUser.name || '-'}</div>
                      <div className="muted small">{selectedUser.email}</div>
                    </div>
                  </div>
                  {styleLoading && <div className="loading">Loading latest attempt…</div>}
                  {!styleLoading && latestStyle && latestStyle.latestAttempt && (
                    (() => {
                      const latest = latestStyle.latestAttempt;
                      const rf = (latest.modelResult && latest.modelResult.random_forest) || {};
                      return (
                        <div className="latest-card">
                          <div className="pill pill-success">{latest.learningStyle || rf.prediction || 'N/A'}</div>
                          <div className="muted">Submitted: {new Date(latest.submittedAt).toLocaleString()}</div>
                          {typeof rf.confidence !== 'undefined' && (
                            <div className="muted">Confidence: {(rf.confidence * 100).toFixed(1)}%</div>
                          )}
                        </div>
                      );
                    })()
                  )}
                  {!styleLoading && !latestStyle && (
                    <div className="muted">No attempts found for this user.</div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
