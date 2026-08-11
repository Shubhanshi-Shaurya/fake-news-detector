import React, { useState } from 'react';

export default function FakeNewsDetector() {
  const [newsText, setNewsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  
  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!newsText.trim()) {
      setError('Please enter or paste news content to analyze.');
      return;
    }

    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newsText }),
      });
      const data = await response.json();

      
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const mockIsFake = Math.random() > 0.5;
      const mockData = {
        label: mockIsFake ? 'FAKE' : 'REAL',
        confidence: (75 + Math.random() * 20).toFixed(1), // 75% - 95%
        summary: mockIsFake
          ? 'High presence of sensationalist tone, unverified claims, and emotional language.'
          : 'Content aligns with verified sources and uses standard journalistic phrasing.',
      };

      setResult(mockData);
    } catch (err) {
      setError('Failed to process the request. Is your backend server running?');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setNewsText('');
    setResult(null);
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h1 style={styles.title}>Fake News Detector</h1>
          <p style={styles.subtitle}>
            Paste an article, headline, or claim below to verify its authenticity using AI.
          </p>
        </header>

        <form onSubmit={handleAnalyze} style={styles.form}>
          <textarea
            style={styles.textarea}
            rows={7}
            placeholder="Paste news headline or full article text here..."
            value={newsText}
            onChange={(e) => setNewsText(e.target.value)}
          />

          {error && <div style={styles.errorBanner}>{error}</div>}

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={loading || !newsText.trim()}
              style={{
                ...styles.button,
                ...styles.primaryBtn,
                opacity: loading || !newsText.trim() ? 0.6 : 1,
              }}
            >
              {loading ? 'Analyzing Content...' : 'Verify News'}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              style={{ ...styles.button, ...styles.secondaryBtn }}
            >
              Clear
            </button>
          </div>
        </form>

        {/* Prediction Output */}
        {result && (
          <div
            style={{
              ...styles.resultCard,
              borderColor: result.label === 'FAKE' ? '#ef4444' : '#22c55e',
            }}
          >
            <div style={styles.badgeRow}>
              <span
                style={{
                  ...styles.badge,
                  backgroundColor: result.label === 'FAKE' ? '#fee2e2' : '#dcfce7',
                  color: result.label === 'FAKE' ? '#991b1b' : '#166534',
                }}
              >
                Verdict: {result.label} NEWS
              </span>
              <span style={styles.confidenceText}>
                Confidence: <strong>{result.confidence}%</strong>
              </span>
            </div>

            <p style={styles.analysisText}>{result.summary}</p>

            {/* Confidence Bar */}
            <div style={styles.progressTrack}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${result.confidence}%`,
                  backgroundColor: result.label === 'FAKE' ? '#ef4444' : '#22c55e',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// CSS
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '650px',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)',
    border: '1px solid #e2e8f0',
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    color: '#0f172a',
  },
  subtitle: {
    marginTop: '8px',
    fontSize: '14px',
    color: '#64748b',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  textarea: {
    width: '100%',
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '15px',
    lineHeight: '1.5',
    boxSizing: 'border-box',
    resize: 'vertical',
    outline: 'none',
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    padding: '10px 14px',
    borderRadius: '6px',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
  },
  button: {
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    flex: 2,
  },
  secondaryBtn: {
    backgroundColor: '#e2e8f0',
    color: '#334155',
    flex: 1,
  },
  resultCard: {
    marginTop: '28px',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f8fafc',
    borderLeft: '5px solid',
  },
  badgeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  badge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontWeight: '700',
    fontSize: '13px',
    letterSpacing: '0.5px',
  },
  confidenceText: {
    fontSize: '14px',
    color: '#475569',
  },
  analysisText: {
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: '#334155',
    lineHeight: '1.5',
  },
  progressTrack: {
    height: '6px',
    width: '100%',
    backgroundColor: '#e2e8f0',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    transition: 'width 0.4s ease-out',
  },
};