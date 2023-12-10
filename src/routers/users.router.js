import express from 'express';
import { UserController } from '../controllers/users.controller.js';
import authMiddleware from '../middlewares/need-signin.middleware.js';

const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const userController = new UserController();

/** 내 정보 조회 API **/
router.get('/users', authMiddleware, userController.readUser);

/** 내 정보 조회 API **/
router.put('/users', authMiddleware, userController.updateUser);

export default router;
