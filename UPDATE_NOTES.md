# Update notes - forgot password + certificate + modules & quiz

This zip is the WHOLE project. It does not contain any `.env` file, so your own `Backend/.env` and `Frontend/.env` are never overwritten.

## New in this version
* **Modules + quiz:** each course has lesson modules and a 5-question quiz (3/5 to pass). Passing completes the course.
* **Certificate:** printable certificate (Save as PDF) after passing the quiz.
* **Forgot password:** emailed one-time reset link (15 minutes) through Brevo's HTTPS API.
* Manual "+25%" / "Mark as Complete" buttons and `PATCH /api/enrollments/:id` are removed - progress is now earned.

## Extra environment variables (Backend)
`BREVO_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME` (for forgot-password emails). See `Backend/.env.example`.

## After copying the files
1. `cd Backend && npm install` (no new packages, safe to run) then `npm run seed` -> adds lessons + quizzes to your courses.
2. Test locally, then `git add . && git commit -m "Add modules, quiz, certificate, forgot password" && git push`.
3. Add the three Brevo variables on Render.
