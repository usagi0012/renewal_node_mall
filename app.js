import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// import PostsRouter from "./routes/posts.router.js";

const app = express();
const PORT = process.env.SERVER_PORT;

app.use(express.json());
// app.use("/api", [PostsRouter]);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
