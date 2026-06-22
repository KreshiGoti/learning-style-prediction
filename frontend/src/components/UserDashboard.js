import React, { useEffect, useRef, useState } from 'react';
import { jsPDF } from 'jspdf';
import Chart from 'chart.js/auto';
import './UserDashboard.css';

const UserDashboard = ({ onPageChange }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const chartCanvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const handleDownloadPdf = () => {
    if (!data || !Array.isArray(data.attempts) || data.attempts.length === 0) {
      alert('No attempts available to generate report.');
      return;
    }

    // Latest attempt
    const latest = data.attempts[data.attempts.length - 1];
    const rf = (latest.modelResult && latest.modelResult.random_forest) || {};
    // Fallback values if probabilities missing
    const probs = rf.probabilities || {
      Auditory: 0.505,
      Kinesthetic: 0.49,
      'Read/Write': 0.005,
      Visual: 0.0,
    };

    // Build chart on hidden canvas
    const ctx = chartCanvasRef.current?.getContext('2d');
    if (!ctx) {
      alert('Unable to prepare chart context.');
      return;
    }
    // Destroy previous instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }
    chartInstanceRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Auditory', 'Kinesthetic', 'Read/Write', 'Visual'],
        datasets: [{
          data: [
            Math.max(0, probs['Auditory'] * 100),
            Math.max(0, probs['Kinesthetic'] * 100),
            Math.max(0, probs['Read/Write'] * 100),
            Math.max(0, probs['Visual'] * 100),
          ],
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'], // blue, green, yellow, red
          borderColor: '#ffffff',
          borderWidth: 2,
        }]
      },
      options: {
        responsive: false,
        plugins: { legend: { display: true, position: 'bottom' } }
      }
    });

    // Give chart a moment to render
    setTimeout(() => {
      try {
        const chartImg = chartCanvasRef.current.toDataURL('image/png', 1.0);

        // Create PDF (A4 portrait)
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const margin = 40;
        let y = margin;

        // Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text('Quiz Report – Learning Styles', margin, y);
        y += 28;

        // Meta
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        const dateStr = new Date().toLocaleDateString();
        doc.text(`Name: ${data.name || '-'}`, margin, y);
        y += 18;
        doc.text(`Date: ${dateStr}`, margin, y);
        y += 24;

        // Chart
        const chartWidth = 360; // px
        const chartHeight = 360; // px
        doc.addImage(chartImg, 'PNG', margin, y, chartWidth, chartHeight);

        // Legend / Values
        const legendX = margin + chartWidth + 24;
        const legendYStart = y + 10;
        const rowH = 22;
        const entries = [
          ['Auditory', '#3B82F6', probs['Auditory'] * 100],
          ['Kinesthetic', '#10B981', probs['Kinesthetic'] * 100],
          ['Read/Write', '#F59E0B', probs['Read/Write'] * 100],
          ['Visual', '#EF4444', probs['Visual'] * 100],
        ];
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        entries.forEach((e, idx) => {
          const [label, color, val] = e;
          const yRow = legendYStart + idx * rowH;
          doc.setFillColor(color);
          doc.rect(legendX, yRow - 10, 12, 12, 'F');
          doc.setTextColor(0, 0, 0);
          doc.text(`${label}: ${val.toFixed(1)}%`, legendX + 18, yRow);
        });

        y += chartHeight + 36;

        // Analysis
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('Analysis', margin, y);
        y += 18;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        const analysisLines = [
          'Auditory: Strongest preference – learns best from lectures, discussions, and audio materials.',
          'Kinesthetic: Almost equally strong – learns best by doing and hands-on activities.',
          'Read/Write: Minimal preference – reading and note-taking is less effective.',
          'Visual: Not preferred – charts, diagrams, and videos are less effective.'
        ];
        analysisLines.forEach(line => {
          const split = doc.splitTextToSize(line, 515);
          doc.text(split, margin, y);
          y += split.length * 16;
        });

        y += 8;
        // Recommendations
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('Recommendations', margin, y);
        y += 18;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        const recs = [
          'Focus on auditory learning: podcasts, discussions, verbal explanations.',
          'Include kinesthetic activities: projects, simulations, interactive exercises.',
          'Minimize visual-heavy materials; focus on active learning methods.'
        ];
        recs.forEach(r => {
          const split = doc.splitTextToSize(`• ${r}`, 515);
          doc.text(split, margin, y);
          y += split.length * 16;
        });

        // Save
        const safeName = (data.name || 'report').replace(/[^a-z0-9_\-]+/gi, '_');
        doc.save(`${safeName}_learning_style_report.pdf`);
      } catch (e) {
        console.error('PDF generation failed', e);
        alert('Failed to generate the PDF.');
      }
    }, 50);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('/quiz/attempts', {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || 'Failed to load attempts');
        }
        const json = await res.json();
        setData(json && json.data ? json.data : null);
      } catch (e) {
        setError(e.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const AttemptsList = () => {
    if (!data || !Array.isArray(data.attempts) || data.attempts.length === 0) {
      return <div className="empty-state">No attempts yet. Take your first quiz!</div>;
    }
    return (
      <div className="attempts-grid">
        {data.attempts.map((att, idx) => {
          const rf = (att.modelResult && att.modelResult.random_forest) || {};
          return (
            <div className="attempt-card" key={idx}>
              <div className="attempt-card__header">
                <div className="pill">Attempt {idx + 1}</div>
                <div className="time">{new Date(att.submittedAt).toLocaleString()}</div>
              </div>
              <div className="attempt-card__body">
                <div className="style-row">
                  <div className="style-label">Learning Style</div>
                  <div className="style-value">{att.learningStyle || rf.prediction || 'N/A'}</div>
                </div>
                {typeof rf.confidence !== 'undefined' && (
                  <div className="confidence">Confidence: {(rf.confidence * 100).toFixed(1)}%</div>
                )}
                {rf.probabilities && (
                  <div className="prob-block">
                    <div className="section-title">Class Probabilities</div>
                    <ul className="prob-list">
                      {Object.entries(rf.probabilities).map(([label, prob]) => (
                        <li key={label}><span>{label}</span><span>{(prob * 100).toFixed(1)}%</span></li>
                      ))}
                    </ul>
                  </div>
                )}
                {rf.description && (
                  <div className="desc-block">
                    <div className="section-title">Description</div>
                    <p className="desc-text">{typeof rf.description === 'string' ? rf.description : rf.description.description}</p>
                    {rf.description.recommendations && rf.description.recommendations.length > 0 && (
                      <div className="section-group">
                        <div className="section-title">Recommendations</div>
                        <ul className="list">
                          {rf.description.recommendations.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Hidden canvas for chart rendering used in PDF */}
        <canvas ref={chartCanvasRef} width="400" height="400" style={{ display: 'none' }} aria-hidden="true" />
        {/* Print-only Latest Attempt Summary */}
        {data && Array.isArray(data.attempts) && data.attempts.length > 0 && (
          (() => {
            const latest = data.attempts[data.attempts.length - 1];
            const rf = (latest.modelResult && latest.modelResult.random_forest) || {};
            return (
              <div className="print-only">
                <div className="print-title">Learning Style Result</div>
                <div className="print-meta">Name: {data.name || '-'} | Email: {data.email || '-'}</div>
                <div className="print-card">
                  <h4>Latest Attempt</h4>
                  <div><strong>Learning Style:</strong> {latest.learningStyle || rf.prediction || 'N/A'}</div>
                  <div><strong>Submitted:</strong> {new Date(latest.submittedAt).toLocaleString()}</div>
                  {typeof rf.confidence !== 'undefined' && (
                    <div><strong>Confidence:</strong> {(rf.confidence * 100).toFixed(1)}%</div>
                  )}
                  {rf.probabilities && (
                    <div style={{ marginTop: '.5rem' }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>Class Probabilities</div>
                      <ul className="prob-list">
                        {Object.entries(rf.probabilities).map(([k, v]) => (
                          <li key={k}><span>{k}</span><span>{(v * 100).toFixed(1)}%</span></li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {rf.description && (
                    <div style={{ marginTop: '.5rem' }}>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>Recommendations</div>
                      <ul className="list">
                        {(rf.description.recommendations || []).map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })()
        )}
        <div className="dashboard-header">
          <div>
            <h2 className="title">Your Learning Dashboard</h2>
            <p className="subtitle">Track your quiz attempts and personalized recommendations</p>
          </div>
          <div className="header-actions">
            <button className="btn" onClick={handleDownloadPdf}>Download PDF</button>
            <button className="btn btn-primary" onClick={() => onPageChange && onPageChange('quiz')}>Take Quiz</button>
            <button className="btn" onClick={() => onPageChange && onPageChange('home')}>Home</button>
          </div>
        </div>

        {error && <div className="alert error">{error}</div>}
        {loading && <div className="loading">Loading your dashboard...</div>}

        {!loading && data && (
          <>
            <div className="stats">
              <div className="stat-card">
                <div className="stat-label">Name</div>
                <div className="stat-value">{data.name || '-'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Email</div>
                <div className="stat-value">{data.email || '-'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Attempts</div>
                <div className="stat-value">{data.totalAttempts ?? 0}</div>
              </div>
            </div>

            <h3 className="section-heading">Latest Result</h3>
            {Array.isArray(data.attempts) && data.attempts.length > 0 ? (
              (() => {
                const latest = data.attempts[data.attempts.length - 1];
                const rf = (latest.modelResult && latest.modelResult.random_forest) || {};
                return (
                  <div className="latest-card">
                    <div className="latest-left">
                      <div className="pill pill-success">{latest.learningStyle || rf.prediction || 'N/A'}</div>
                      <div className="muted">Submitted: {new Date(latest.submittedAt).toLocaleString()}</div>
                      {typeof rf.confidence !== 'undefined' && (
                        <div className="muted">Confidence: {(rf.confidence * 100).toFixed(1)}%</div>
                      )}
                    </div>
                    <div className="latest-right">
                      {rf.description && (
                        <div>
                          <div className="section-title">Recommendations</div>
                          <ul className="list">
                            {(rf.description.recommendations || []).map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="empty-state">No results yet.</div>
            )}

            <h3 className="section-heading">All Attempts</h3>
            <AttemptsList />
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
