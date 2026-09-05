import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuizById, submitQuiz } from '../../api/quizApi';
import Loader from '../../components/Loader';
import RingTimer from '../../components/RingTimer';

export default function TakeQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({}); // { questionId: optionId }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const totalSecondsRef = useRef(0);
  const submittedRef = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getQuizById(id);
        setQuiz(data);
        const total = (data.timeLimitMinutes || 0) * 60;
        totalSecondsRef.current = total;
        setSecondsLeft(total);
      } catch (err) {
        setError(err.message || 'Could not load this quiz.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const doSubmit = useCallback(
    async (submissionType) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setSubmitting(true);
      try {
        const result = await submitQuiz(id, { submissionType, selectedAnswers: answers });
        navigate(`/quiz/${id}/result`, { state: { result, quiz, selectedAnswers: answers } });
      } catch (err) {
        setError(err.message || 'Could not submit the quiz.');
        submittedRef.current = false;
        setSubmitting(false);
      }
    },
    [answers, id, navigate, quiz]
  );

  // Countdown ticker
  useEffect(() => {
    if (!quiz || submittedRef.current) return undefined;
    if (secondsLeft <= 0) {
      doSubmit('TIMEOUT');
      return undefined;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [quiz, secondsLeft, doSubmit]);

  const selectOption = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  if (loading) return <div className="page"><Loader label="Loading quiz…" /></div>;
  if (error && !quiz) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!quiz) return null;

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions?.length ?? 0;

  return (
    <div className="page">
      <div className="take-header">
        <div>
          <h1>{quiz.title}</h1>
          <p>{answeredCount} of {totalQuestions} answered</p>
        </div>
        <RingTimer secondsLeft={secondsLeft} totalSeconds={totalSecondsRef.current || 1} />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {quiz.questions?.map((q, idx) => (
        <div className="question-block" key={q.id}>
          <span className="question-index">Question {idx + 1} of {totalQuestions}</span>
          <h3>{q.questionText}</h3>
          {q.options?.map((opt) => (
            <label
              key={opt.id}
              className={`option-row ${answers[q.id] === opt.id ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name={`question-${q.id}`}
                checked={answers[q.id] === opt.id}
                onChange={() => selectOption(q.id, opt.id)}
              />
              {opt.optionText}
            </label>
          ))}
        </div>
      ))}

      <button
        className="btn btn-primary"
        onClick={() => doSubmit('VOLUNTARY')}
        disabled={submitting}
      >
        {submitting ? 'Submitting…' : 'Submit quiz'}
      </button>
    </div>
  );
}
