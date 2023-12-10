import { ProductRepository } from '../repositories/products.repository.js';

export class ProductService {
  productRepository = new ProductRepository();

  //상품 목록 조회
  findAllProducts = async sort => {
    const products = await this.productRepository.findAllProducts();

    //불러온 데이터 정렬
    if (sort == 'ASC') {
      products.sort((a, b) => {
        return a.createdAt - b.createdAt;
      });
    } else {
      products.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
    }
    return products.map(product => {
      return {
        productId: product.productId,
        productName: product.productName,
        productStatus: product.productStatus,
        userId: product.userId,
        createdAt: product.createdAt,
      };
    });
  };

  //상품 상세 조회
  findOneProduct = async productId => {
    const product = await this.productRepository.findOneProduct(productId);
    return product;
  };

  //상품 생성
  createProduct = async (productName, productContent, userId) => {
    const createdProduct = await this.productRepository.createProduct(productName, productContent, userId);

    return {
      productName: createdProduct.productName,
      productContent: createdProduct.productContent,
      userId: createdProduct.userId,
    };
  };

  //상품 수정
  updateProduct = async (productId, userId, productName, productContent, productStatus) => {
    const product = await this.productRepository.findOneProduct(productId);
    //상품 없을 때
    if (!product) {
      return 'noProduct';
    }
    //본인 등록 상품이 아닐 때
    if (product.userId != userId) {
      return 'userErr';
    }
    const updatedProduct = await this.productRepository.updateProduct(
      productId,
      productName,
      productContent,
      productStatus,
    );
    return {
      productName: updatedProduct.productName,
      productContent: updatedProduct.productContent,
      productStatus: updatedProduct.productStatus,
    };
  };

  //상품 삭제
  deleteProduct = async (productId, userId) => {
    const product = await this.productRepository.findOneProduct(productId);
    //상품 없을 때
    if (!product) {
      return 'noProduct';
    }
    //본인 등록 상품이 아닐 때
    if (product.userId != userId) {
      return 'userErr';
    }
    return await this.productRepository.deleteProduct(productId);
  };
}
