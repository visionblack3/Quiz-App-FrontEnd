import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getQuizById, createQuiz, updateQuiz } from '../../api/quizApi';
import Loader from '../../components/Loader';

let keyCounter = 0;
const nextKey = () => `k${Date.now()}_${keyCounter++}`;

function blankOption() {
  return { _key: nextKey(), optionText: '', isCorrect: false };
}

function blankQuestion() {
  return { _key: nextKey(), questionText: '', options: [blankOption(), blankOption()] };
}

// Strip client-only fields and drop empty ids so new items aren't sent with a fake id.
function toPayload(questions) {
  return questions.map((q) => {
    const question = { questionText: q.questionText, options: q.options.map((o) => ({
      optionText: o.optionText,
      isCorrect: !!o.isCorrect,
      ...(o.id ? { id: o.id } : {}),
    })) };
    if (q.id) question.id = q.id;
    return question;
  });
}

export default function QuizEditorPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(10);
  const [questions, setQuestions] = useState([blankQuestion()]);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      try {
        const quiz = await getQuizById(id);
        setTitle(quiz.title || '');
        setDescription(quiz.description || '');
        setTimeLimitMinutes(quiz.timeLimitMinutes || 10);
        setQuestions(
          (quiz.questions || []).map((q) => ({
            _key: nextKey(),
            id: q.id,
            questionText: q.questionText,
            options: (q.options || []).map((o) => ({
              _key: nextKey(),
              id: o.id,
              optionText: o.optionText,
              isCorrect: !!o.isCorrect,
            })),
          }))
        );
      } catch (err) {
        setError(err.message || 'Could not load this quiz.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEditing]);

  const updateQuestionText = (qKey, text) =>
    setQuestions((prev) => prev.map((q) => (q._key === qKey ? { ...q, questionText: text } : q)));

  const addQuestion = () => setQuestions((prev) => [...prev, blankQuestion()]);

  const removeQuestion = (qKey) =>
    setQuestions((prev) => prev.filter((q) => q._key !== qKey));

  const addOption = (qKey) =>
    setQuestions((prev) =>
      prev.map((q) => (q._key === qKey ? { ...q, options: [...q.options, blankOption()] } : q))
    );

  const removeOption = (qKey, oKey) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q._key === qKey ? { ...q, options: q.options.filter((o) => o._key !== oKey) } : q
      )
    );

  const updateOptionText = (qKey, oKey, text) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q._key !== qKey
          ? q
          : { ...q, options: q.options.map((o) => (o._key === oKey ? { ...o, optionText: text } : o)) }
      )
    );

  const setCorrectOption = (qKey, oKey) =>
    setQuestions((prev) =>
      prev.map((q) =>
        q._key !== qKey
          ? q
          : { ...q, options: q.options.map((o) => ({ ...o, isCorrect: o._key === oKey })) }
      )
    );

  const validate = () => {
    if (!title.trim()) return 'Give the quiz a title.';
    if (!timeLimitMinutes || timeLimitMinutes <= 0) return 'Time limit must be greater than 0.';
    if (questions.length === 0) return 'Add at least one question.';
    for (const q of questions) {
      if (!q.questionText.trim()) return 'Every question needs text.';
      if (q.options.length < 2) return `"${q.questionText || 'Untitled question'}" needs at least 2 options.`;
      if (q.options.some((o) => !o.optionText.trim())) return 'Every option needs text.';
      if (!q.options.some((o) => o.isCorrect)) return `Mark a correct answer for "${q.questionText}".`;
    }
    return '';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    const payload = { title, description, timeLimitMinutes: Number(timeLimitMinutes), questions: toPayload(questions) };
    try {
      if (isEditing) {
        await updateQuiz(id, payload);
      } else {
        await createQuiz(user.userId, payload);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Could not save this quiz.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page"><Loader label="Loading quiz…" /></div>;

  return (
    <div className="page">
      <div className="section-head">
        <div>
          <h1>{isEditing ? 'Edit quiz' : 'New quiz'}</h1>
          <p>Build out the quiz, its questions, and mark one correct option per question.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="field" style={{ maxWidth: 220 }}>
            <label htmlFor="timeLimit">Time limit (minutes)</label>
            <input
              id="timeLimit"
              type="number"
              min={1}
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(e.target.value)}
              required
            />
          </div>
        </div>

        {questions.map((q, qIdx) => (
          <div className="editor-question" key={q._key}>
            <div className="editor-question-head">
              <strong>Question {qIdx + 1}</strong>
              {questions.length > 1 && (
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeQuestion(q._key)}>
                  Remove question
                </button>
              )}
            </div>

            <div className="field">
              <input
                placeholder="Question text"
                value={q.questionText}
                onChange={(e) => updateQuestionText(q._key, e.target.value)}
                required
              />
            </div>

            {q.options.map((o) => (
              <div className="editor-option-row" key={o._key}>
                <input
                  type="radio"
                  name={`correct-${q._key}`}
                  checked={o.isCorrect}
                  onChange={() => setCorrectOption(q._key, o._key)}
                  title="Mark as correct answer"
                />
                <input
                  type="text"
                  placeholder="Option text"
                  value={o.optionText}
                  onChange={(e) => updateOptionText(q._key, o._key, e.target.value)}
                  required
                />
                {q.options.length > 2 && (
                  <button type="button" className="btn-ghost btn-sm" onClick={() => removeOption(q._key, o._key)}>
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => addOption(q._key)}>
              + Add option
            </button>
          </div>
        ))}

        <button type="button" className="btn btn-secondary" onClick={addQuestion} style={{ marginBottom: 20 }}>
          + Add question
        </button>

        <div className="row-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create quiz'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
