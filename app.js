import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

import ErrorHandlingMiddleware from './src/middlewares/error-handler.middleware.js';
import AuthRouter from './src/routers/auth.router.js';
import UsersRouter from './src/routers/users.router.js';

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(express.json());
app.use(cookieParser());
app.use('/api', [AuthRouter], [UsersRouter]);
app.use(ErrorHandlingMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
