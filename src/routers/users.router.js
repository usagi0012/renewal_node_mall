import express from 'express';
const router = express.Router();

import { prisma } from '../utils/prisma/index.js';

import authMiddleware from '../middlewares/need-signin.middleware.js';

//내 정보 조회 API
router.get('/users', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await prisma.users.findFirst({
      where: { userId: +userId },
      select: {
        userId: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        products: {
          select: {
            productId: true,
            productName: true,
          },
        },
      },
    });
    return res.status(200).json({ data: user });
  } catch (err) {
    next(err);
  }
});

export default router;
