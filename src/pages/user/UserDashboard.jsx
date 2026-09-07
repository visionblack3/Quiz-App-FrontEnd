import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllQuizzes, getMyScores } from '../../api/quizApi';
import Loader from '../../components/Loader';

export default function UserDashboard() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [completedQuizIds, setCompletedQuizIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [quizList, scores] = await Promise.all([getAllQuizzes(), getMyScores()]);
        setQuizzes(quizList);
        // Track completed quizzes by quizId (fallback to quizTitle if quizId not in DTO)
        const ids = new Set(scores.map((s) => s.quizId || s.quizTitle));
        setCompletedQuizIds(ids);
      } catch (err) {
        setError(err.message || 'Could not load quizzes.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="page">
      <div className="section-head">
        <div>
          <h1>Available quizzes</h1>
          <p>Pick a quiz to start. Once you begin, the clock runs until you submit or time runs out.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Loader label="Loading quizzes…" />
      ) : quizzes.length === 0 ? (
        <div className="empty-state card">
          <h3>No quizzes yet</h3>
          <p>Check back once your admin publishes one.</p>
        </div>
      ) : (
        quizzes.map((quiz) => {
          const done = completedQuizIds.has(quiz.id) || completedQuizIds.has(quiz.title);
          return (
            <div key={quiz.id} className={`quiz-card card ${done ? 'status-done' : 'status-new'}`}>
              <div className="quiz-card-main">
                <div className="quiz-card-title">{quiz.title}</div>
                <div className="quiz-card-meta">
                  <span>{quiz.questions?.length ?? 0} questions</span>
                  <span>{quiz.timeLimitMinutes} min limit</span>
                  {quiz.description && <span>{quiz.description}</span>}
                </div>
              </div>
              <span className={`badge ${done ? 'badge-done' : 'badge-new'}`}>{done ? 'Completed' : 'New'}</span>
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/quiz/${quiz.id}/take`)}>
                {done ? 'Retake' : 'Start quiz'}
              </button>
            </div>
          );
        })
      )}
    </div>
  );
}
