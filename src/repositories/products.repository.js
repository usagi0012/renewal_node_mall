import { prisma } from '../utils/prisma/index.js';

export class ProductRepository {
  //상품 목록 조회
  findAllProducts = async () => {
    const products = await prisma.products.findMany();

    return products;
  };

  //상품 상세 조회
  findOneProduct = async productId => {
    const product = await prisma.products.findFirst({
      where: {
        productId: +productId,
      },
    });
    return product;
  };

  //상품 생성
  createProduct = async (productName, productContent, userId) => {
    const createdProduct = await prisma.products.create({
      data: {
        productName,
        productContent,
        userId,
      },
    });

    return createdProduct;
  };

  //상품 수정
  updateProduct = async (productId, productName, productContent, productStatus) => {
    const updatedProduct = await prisma.products.update({
      where: { productId: +productId },
      data: {
        productName,
        productContent,
        productStatus,
      },
    });
    return updatedProduct;
  };

  //상품 삭제
  deleteProduct = async productId => {
    return await prisma.products.delete({ where: { productId: +productId } });
  };
}
