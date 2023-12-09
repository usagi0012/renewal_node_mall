import express from 'express';
const router = express.Router();

import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/need-signin.middleware.js';

//상품 생성 API
router.post('/products', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productName, productContent } = req.body;

    //제목이나 내용 입력 안했을 때
    if (!productName || !productContent) {
      return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

    //맞게 입력됐다면 생성
    const products = await prisma.products.create({
      data: {
        productName,
        productContent,
        userId,
      },
    });

    res.status(201).json({
      products: products,
      message: '판매 상품을 등록하였습니다.',
    });
  } catch (err) {
    next(err);
  }
});

//상품 수정 API
router.put('/products/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;
    const { productName, productContent, productStatus } = req.body;
    const updateProduct = await prisma.products.findFirst({ where: { productId: +productId } });

    //상품이 있는지 조회
    if (!updateProduct) {
      return res.status(404).json({ Message: '상품 조회에 실패하였습니다.' });
    }

    //있으면 본인이 등록한 상품인지 확인
    if (updateProduct.userId !== userId) {
      return res.status(401).json({ Message: '상품을 수정할 권한이 존재하지 않습니다.' });
    }

    //인증되었으면 상품 수정
    await prisma.products.update({
      where: { productId: +productId },
      data: {
        productName,
        productContent,
        productStatus,
      },
    });
    res.status(200).json({ Message: '상품정보를 수정하였습니다.' });
  } catch (err) {
    next(err);
  }
});

//상품 삭제 API
router.delete('/products/:productId', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;
    const deleteProduct = await prisma.products.findFirst({ where: { productId: +productId } });

    //상품이 있는지 조회
    if (!deleteProduct) {
      return res.status(404).json({ Message: '상품 조회에 실패하였습니다.' });
    }

    //있으면 본인이 등록한 상품인지 확인
    if (deleteProduct.userId !== userId) {
      return res.status(401).json({ Message: '상품을 삭제할 권한이 존재하지 않습니다.' });
    }

    //인증되었으면 상품 삭제
    await prisma.products.delete({ where: { productId: +productId } });
    res.status(200).json({ Message: '상품을 삭제하였습니다.' });
  } catch (err) {
    next(err);
  }
});

//상품 목록 조회 API
router.get('/products//:sort', async (req, res) => {
  try {
    const { sort } = req.params;

    //asc면 과거순 정렬
    if (sort == 'ASC') {
      const products = await prisma.products.findMany({
        select: {
          productId: true,
          productName: true,
          productStatus: true,
          userId: true,
          createdAt: true,
        },
        orderBy: {
          productId: 'asc',
        },
      });
      return res.status(200).json({ data: products });
    } else {
      //나머지 경우에는 전부 최신순
      const products = await prisma.products.findMany({
        select: {
          productId: true,
          productName: true,
          productStatus: true,
          userId: true,
          createdAt: true,
        },
        orderBy: {
          productId: 'desc',
        },
      });
      return res.status(200).json({ data: products });
    }
  } catch (err) {
    next(err);
  }
});

//상품 상세 조회 API
router.get('/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    const detailProduct = await prisma.products.findFirst({
      where: {
        productId: +productId,
      },
    });

    //상품이 없을때
    if (!detailProduct) {
      return res.status(404).json({ Message: '상품 조회에 실패하였습니다.' });
    }

    res.status(200).json({ data: detailProduct });
  } catch (err) {
    next(err);
  }
});

export default router;
