import express from 'express';
import { ProductController } from '../controllers/products.controller.js';
import authMiddleware from '../middlewares/need-signin.middleware.js';

const router = express.Router();

// PostsController의 인스턴스를 생성합니다.
const productController = new ProductController();

/** 상품 목록 조회 API **/
router.get('/products//:sort', productController.getProducts);

/** 상품 목록 조회 API **/
router.get('/products/:productId', productController.getOneProducts);

/** 상품 생성 API **/
router.post('/products', authMiddleware, productController.createProduct);

/** 상품 수정 API **/
router.put('/products/:productId', authMiddleware, productController.updateProduct);

/** 상품 삭제 API **/
router.delete('/products/:productId', authMiddleware, productController.deleteProduct);
export default router;
