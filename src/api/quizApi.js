import axiosClient from './axiosClient';

// GET /api/quizzes
export const getAllQuizzes = () =>
  axiosClient.get('/quizzes').then((res) => res.data);

// GET /api/quizzes/{id}
export const getQuizById = (id) =>
  axiosClient.get(`/quizzes/${id}`).then((res) => res.data);

// POST /api/quizzes/create/{creatorId}
export const createQuiz = (creatorId, quiz) =>
  axiosClient.post(`/quizzes/create/${creatorId}`, quiz).then((res) => res.data);

// PUT /api/quizzes/{quizId}
export const updateQuiz = (quizId, quiz) =>
  axiosClient.put(`/quizzes/${quizId}`, quiz).then((res) => res.data);

// DELETE /api/quizzes/{quizId}
export const deleteQuiz = (quizId) =>
  axiosClient.delete(`/quizzes/${quizId}`).then((res) => res.data);

// POST /api/quizzes/{quizId}/questions
export const addQuestionToQuiz = (quizId, question) =>
  axiosClient.post(`/quizzes/${quizId}/questions`, question).then((res) => res.data);

// PUT /api/quizzes/questions/{questionId}
export const updateQuestion = (questionId, question) =>
  axiosClient.put(`/quizzes/questions/${questionId}`, question).then((res) => res.data);

// DELETE /api/quizzes/questions/{questionId}
export const deleteQuestion = (questionId) =>
  axiosClient.delete(`/quizzes/questions/${questionId}`).then((res) => res.data);

// POST /api/quizzes/{id}/submit
export const submitQuiz = (quizId, submission) =>
  axiosClient.post(`/quizzes/${quizId}/submit`, submission).then((res) => res.data);

// GET /api/quizzes/my-scores
export const getMyScores = () =>
  axiosClient.get('/quizzes/my-scores').then((res) => res.data);

// GET /api/quizzes/user/{userId}/scores
export const getUserScores = (userId) =>
  axiosClient.get(`/quizzes/user/${userId}/scores`).then((res) => res.data);
