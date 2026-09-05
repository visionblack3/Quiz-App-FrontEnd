import axiosClient from './axiosClient';

// GET /api/quizzes -> Quiz[]
export const getAllQuizzes = () =>
  axiosClient.get('/api/quizzes').then((res) => res.data);

// GET /api/quizzes/{id} -> Quiz (with nested questions/options)
export const getQuizById = (id) =>
  axiosClient.get(`/api/quizzes/${id}`).then((res) => res.data);

// POST /api/quizzes/create/{creatorId} -> Quiz  (Admin only, enforced server-side)
export const createQuiz = (creatorId, quiz) =>
  axiosClient.post(`/api/quizzes/create/${creatorId}`, quiz).then((res) => res.data);

// PUT /api/quizzes/{quizId} -> Quiz. Sending a full `questions` array replaces
// the existing question/option set (server clears + re-saves via orphanRemoval).
export const updateQuiz = (quizId, quiz) =>
  axiosClient.put(`/api/quizzes/${quizId}`, quiz).then((res) => res.data);

// DELETE /api/quizzes/{quizId}
export const deleteQuiz = (quizId) =>
  axiosClient.delete(`/api/quizzes/${quizId}`).then((res) => res.data);

// POST /api/quizzes/{quizId}/questions -> add a single question to an existing quiz
export const addQuestionToQuiz = (quizId, question) =>
  axiosClient.post(`/api/quizzes/${quizId}/questions`, question).then((res) => res.data);

// PUT /api/quizzes/questions/{questionId} -> update a single question + its options
export const updateQuestion = (questionId, question) =>
  axiosClient.put(`/api/quizzes/questions/${questionId}`, question).then((res) => res.data);

// DELETE /api/quizzes/questions/{questionId} -> remove one question
export const deleteQuestion = (questionId) =>
  axiosClient.delete(`/api/quizzes/questions/${questionId}`).then((res) => res.data);

// POST /api/quizzes/{id}/submit  (SubmissionRequest: submissionType, selectedAnswers) -> ResultResponse
export const submitQuiz = (quizId, submission) =>
  axiosClient.post(`/api/quizzes/${quizId}/submit`, submission).then((res) => res.data);

// GET /api/quizzes/my-scores -> QuizScoreSummaryDTO[] for the authenticated user
export const getMyScores = () =>
  axiosClient.get('/api/quizzes/my-scores').then((res) => res.data);

// GET /api/quizzes/user/{userId}/scores -> QuizScoreSummaryDTO[]
export const getUserScores = (userId) =>
  axiosClient.get(`/api/quizzes/user/${userId}/scores`).then((res) => res.data);
