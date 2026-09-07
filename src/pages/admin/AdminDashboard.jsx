import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllQuizzes, deleteQuiz } from '../../api/quizApi';
import Loader from '../../components/Loader';

export default function AdminDashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setQuizzes(await getAllQuizzes());
    } catch (err) {
      setError(err.message || 'Could not load quizzes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (quiz) => {
    if (!window.confirm(`Delete "${quiz.title}"? This removes its questions and options too.`)) return;
    setDeletingId(quiz.id);
    setError('');
    try {
      await deleteQuiz(quiz.id);
      setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
    } catch (err) {
      setError(err.message || 'Could not delete this quiz.');
    } finally {
      setDeletingId(null);
    }
  };

  const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questions?.length || 0), 0);

  return (
    <div className="page">
      <div className="section-head">
        <div>
          <h1>Manage quizzes</h1>
          <p>Create, edit, and retire quizzes for your students.</p>
        </div>
        <Link className="btn btn-primary" to="/admin/quiz/new">+ New quiz</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Loader label="Loading quizzes…" />
      ) : quizzes.length === 0 ? (
        <div className="empty-state card">
          <h3>No quizzes yet</h3>
          <p>Create your first quiz to get started.</p>
        </div>
      ) : (
        <>
          <div className="stat-strip">
            <div className="stat-box">
              <div className="stat-value">{quizzes.length}</div>
              <div className="stat-label">Total quizzes</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{totalQuestions}</div>
              <div className="stat-label">Total questions</div>
            </div>
          </div>

          <div className="table-wrap card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Questions</th>
                  <th>Time limit</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td>
                      <strong>{quiz.title}</strong>
                      {quiz.description && <div style={{ color: 'var(--ink-faint)', fontSize: '0.82rem' }}>{quiz.description}</div>}
                    </td>
                    <td>{quiz.questions?.length ?? 0}</td>
                    <td>{quiz.timeLimitMinutes} min</td>
                    <td>
                      <div className="row-actions">
                        <Link className="btn btn-secondary btn-sm" to={`/admin/quiz/${quiz.id}/edit`}>Edit</Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => onDelete(quiz)}
                          disabled={deletingId === quiz.id}
                        >
                          {deletingId === quiz.id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </td>
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
