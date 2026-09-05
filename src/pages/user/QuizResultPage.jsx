import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

export default function QuizResultPage() {
  const { id } = useParams();
  const location = useLocation();
  const { result, quiz, selectedAnswers } = location.state || {};

  if (!result || !quiz) {
    return (
      <div className="page">
        <div className="empty-state card">
          <h3>No result to show</h3>
          <p>This page only shows a result right after you submit a quiz.</p>
          <Link className="btn btn-primary" to="/dashboard">Back to quizzes</Link>
        </div>
      </div>
    );
  }

  // correctAnswers keys arrive as strings from JSON (Map<Long,Long>).
  const correctAnswers = result.correctAnswers || {};

  return (
    <div className="page">
      <div className="score-hero card">
        <div>
          <div className="score-big">{result.score}/{result.totalQuestions}</div>
          <div className="score-sub">{result.percentage}% correct</div>
        </div>
        <div>
          <h2 style={{ marginBottom: 4 }}>{quiz.title}</h2>
          <p style={{ margin: 0 }}>Here's how each question broke down.</p>
        </div>
      </div>

      {quiz.questions?.map((q, idx) => {
        const correctOptionId = correctAnswers[q.id] ?? correctAnswers[String(q.id)];
        const selectedOptionId = selectedAnswers?.[q.id];
        return (
          <div className="question-block" key={q.id}>
            <span className="question-index">Question {idx + 1}</span>
            <h3>{q.questionText}</h3>
            {q.options?.map((opt) => {
              let cls = '';
              if (opt.id === correctOptionId) cls = 'correct';
              else if (opt.id === selectedOptionId) cls = 'incorrect';
              return (
                <div key={opt.id} className={`option-row ${cls}`}>
                  {opt.optionText}
                  {opt.id === correctOptionId && '  ✓ Correct answer'}
                  {opt.id === selectedOptionId && opt.id !== correctOptionId && '  · Your answer'}
                </div>
              );
            })}
          </div>
        );
      })}

      <Link className="btn btn-secondary" to="/dashboard">Back to quizzes</Link>{' '}
      <Link className="btn btn-primary" to="/my-scores">View all my scores</Link>
    </div>
  );
}
