import { ProductService } from '../services/products.service.js';

// Post의 컨트롤러(Controller)역할을 하는 클래스
export class ProductController {
  productService = new ProductService();

  //상품 목록 조회
  getProducts = async (req, res, next) => {
    try {
      const { sort } = req.params;
      //서비스 계층의 findAllProducts 로직
      const products = await this.productService.findAllProducts(sort);

      return res.status(200).json({ data: products });
    } catch (err) {
      next(err);
    }
  };

  //상품 상세 조회
  getOneProducts = async (req, res, next) => {
    try {
      const { productId } = req.params;
      //서비스 계층의 findOneProduct 로직
      const product = await this.productService.findOneProduct(productId);

      //상품 없으면 에러 메세지
      if (!product) {
        return res.status(404).json({ Message: '상품 조회에 실패하였습니다.' });
      }

      //있으면 상세 정보 반환
      return res.status(200).json({ data: product });
    } catch (err) {
      next(err);
    }
  };

  //상품 생성
  createProduct = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { productName, productContent } = req.body;

      //제목이나 내용 입력 안했을 때
      if (!productName || !productContent) {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
      }

      // 서비스 계층에 구현된 createPost 로직 실행
      const createdProducts = await this.productService.createProduct(productName, productContent, userId);

      return res.status(201).json({ data: createdProducts, message: '판매 상품을 등록하였습니다.' });
    } catch (err) {
      next(err);
    }
  };

  //상품 수정
  updateProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const userId = req.user.userId;
      const { productName, productContent, productStatus } = req.body;
      //서비스 계층의 updateProduct 로직
      const updatedProduct = await this.productService.updateProduct(
        productId,
        userId,
        productName,
        productContent,
        productStatus,
      );

      //상품 없으면 에러 메세지
      if (updatedProduct == 'noProduct') {
        return res.status(404).json({ Message: '상품 조회에 실패하였습니다.' });
      }
      //본인 등록 상품이 아니면 에러메세지
      if (updatedProduct == 'userErr') {
        return res.status(404).json({ Message: '상품을 수정할 권한이 존재하지 않습니다.' });
      }

      return res.status(200).json({ data: updatedProduct, Message: '상품정보를 수정하였습니다.' });
    } catch (err) {
      next(err);
    }
  };

  //상품 삭제
  deleteProduct = async (req, res, next) => {
    try {
      const { productId } = req.params;
      const userId = req.user.userId;

      //서비스 계층의 updateProduct 로직
      const deletedProduct = await this.productService.deleteProduct(productId, userId);

      //상품 없으면 에러 메세지
      if (deletedProduct == 'noProduct') {
        return res.status(404).json({ Message: '상품 조회에 실패하였습니다.' });
      }
      //본인 등록 상품이 아니면 에러메세지
      if (deletedProduct == 'userErr') {
        return res.status(404).json({ Message: '상품을 삭제할 권한이 존재하지 않습니다.' });
      }

      return res.status(200).json({ Message: '상품을 삭제하였습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
