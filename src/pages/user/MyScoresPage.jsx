import React, { useEffect, useState } from 'react';
import { getMyScores } from '../../api/quizApi';
import Loader from '../../components/Loader';

function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString();
}

export default function MyScoresPage() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setScores(await getMyScores());
      } catch (err) {
        setError(err.message || 'Could not load your scores.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const avg = scores.length
    ? (scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length).toFixed(1)
    : '—';

  return (
    <div className="page">
      <div className="section-head">
        <div>
          <h1>My scores</h1>
          <p>Every quiz you've submitted, most recent activity included.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Loader label="Loading your history…" />
      ) : scores.length === 0 ? (
        <div className="empty-state card">
          <h3>No attempts yet</h3>
          <p>Take a quiz from your dashboard to see results here.</p>
        </div>
      ) : (
        <>
          <div className="stat-strip">
            <div className="stat-box">
              <div className="stat-value">{scores.length}</div>
              <div className="stat-label">Quizzes taken</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{avg}%</div>
              <div className="stat-label">Average score</div>
            </div>
          </div>

          <div className="table-wrap card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Score</th>
                  <th>Percentage</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {scores.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.quizTitle}</td>
                    <td>{s.score}/{s.totalQuestions}</td>
                    <td>{s.percentage}%</td>
                    <td>{formatDate(s.submittedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
