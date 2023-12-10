import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/need-signin.middleware.js';

const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const authController = new AuthController();

/** 회원가입 API **/
router.post('/sign-up', authController.signUp);

/** 로그인 API **/
router.post('/sign-in', authController.signIn);

/** 로그아웃 API **/
router.post('/sign-out', authMiddleware, authController.signOut);

/** 회원탈퇴 API **/
router.delete('/resign', authMiddleware, authController.resign);

export default router;
