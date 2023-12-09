import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import AuthRouter from './src/routers/auth.router.js';
import UsersRouter from './src/routers/users.router.js';
// import UsersRouter from "./routes/posts.router.js";

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(express.json());
app.use('/api', [AuthRouter], [UsersRouter]);
// app.use("/api", [PostsRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
