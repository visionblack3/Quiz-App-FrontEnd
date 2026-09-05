# Testbench — Quiz App Frontend

A React (Vite) frontend for your Spring Boot quiz backend, covering both the **USER** flow
(browse quizzes → take → see graded results → score history) and the **ADMIN** flow
(create/edit/delete quizzes with nested questions & options).

## Setup

```bash
cd quiz-app-frontend
npm install
cp .env.example .env     # then edit VITE_API_BASE_URL if your backend isn't on :8080
npm run dev
```

Runs at `http://localhost:5173` by default. Your Spring Boot app already has
`@CrossOrigin(origins = "*")` on the controllers, so no CORS changes should be needed.

## How it maps to your backend

| Frontend area | Endpoint(s) |
|---|---|
| Register / Login | `POST /api/users/register`, `POST /api/users/login` |
| Forgot / reset password | `POST /api/users/forgot-password`, `POST /api/users/reset-password` |
| Quiz list (user + admin) | `GET /api/quizzes` |
| Take a quiz | `GET /api/quizzes/{id}`, `POST /api/quizzes/{id}/submit` |
| My scores | `GET /api/quizzes/my-scores` |
| Admin create/edit quiz | `POST /api/quizzes/create/{creatorId}`, `PUT /api/quizzes/{quizId}` |
| Admin delete quiz | `DELETE /api/quizzes/{quizId}` |

The JWT returned from `/login` is stored in `localStorage` and attached as
`Authorization: Bearer <token>` on every request via an axios interceptor
(`src/api/axiosClient.js`). Role (`ADMIN`/`USER`) from the login response drives route
guarding (`src/components/RouteGuards.jsx`) and navigation.

### Editing quizzes

The editor sends the **entire** quiz (title, description, time limit, and the full
`questions[].options[]` tree) to `PUT /api/quizzes/{quizId}`, matching how
`QuizService.updateQuiz` replaces the whole question set when a non-empty `questions`
array is supplied. Your backend also exposes finer-grained endpoints
(`POST /api/quizzes/{quizId}/questions`, `PUT /api/quizzes/questions/{id}`,
`DELETE /api/quizzes/questions/{id}`) if you'd rather wire up per-question editing later —
they're already stubbed in `src/api/quizApi.js`.

## A few things worth knowing about the current backend

These aren't blockers, just worth being aware of since they affect what the frontend can/can't do:

- **`Option.isCorrect` isn't `@JsonIgnore`d**, so `GET /api/quizzes/{id}` technically returns
  the correct answer up front. The frontend never renders `isCorrect` while a quiz is in
  progress (only after submitting, using the graded `correctAnswers` map from the submit
  response) — but a user could still see it by inspecting the raw network response. Adding
  `@JsonIgnore` to `Option.isCorrect` (or a `@JsonView`) and having the frontend read
  correctness only from `ResultResponse` would close that gap server-side too.
- `UserController.registerUser` sends the welcome email twice on success (once before
  `save()`, once after) — worth a quick look on your end.
- `/api/questions/**` (in `QuestionController`) isn't explicitly restricted to `ADMIN` in
  `SecurityConfig` the way `/api/quizzes/questions/**` is — the frontend only calls the
  `/api/quizzes/...` question endpoints, which are correctly locked down.

## Project structure

```
src/
  api/            axios client + one module per controller
  context/        AuthContext (JWT/session state)
  components/     Navbar, route guards, loader, ring timer
  pages/auth/      login, register, forgot/reset password
  pages/user/      dashboard, take quiz, result, my scores
  pages/admin/     dashboard, quiz editor (create + edit)
  index.css        design tokens + all component styles
```
