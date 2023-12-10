import { UserRepository } from '../repositories/users.repository.js';
import bcrypt from 'bcrypt';

export class UserService {
  userRepository = new UserRepository();

  //내정보 조회
  readUser = async userId => {
    const user = await this.userRepository.FindUser(userId);
    return {
      userId: user.userId,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      products: {
        productId: user.products.productId,
        productName: user.products.productName,
      },
    };
  };

  //내 정보 수정
  updateUser = async (userId, name, currentPassword, newPassword, confirmNewPassword) => {
    //이름 유효성
    const validname = name => {
      const nameRegex = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,10}$/i;
      return nameRegex.test(name);
    };
    if (!validname(name)) {
      return 'failedName';
    }

    //비밀번호 수정 부분(셋 중 하나라도 채워져있으면 비밀번호 변경 실행)
    let newHashedPassword;
    if (currentPassword || newPassword || confirmNewPassword) {
      //셋 중 하나라도 없을 때
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return 'noPassword';
      }
      //이전 비밀번호가 맞지 않는 경우
      const user = await this.userRepository.FindUser(userId);
      const passwordCorrect = await bcrypt.compare(currentPassword, user.password);
      if (!passwordCorrect) {
        return 'passwordDiff';
      }
      //새로운 비밀번호의 형식이 올바르지 않은 경우
      const validPassword = newPassword => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/i;
        return passwordRegex.test(newPassword);
      };
      if (!validPassword(newPassword)) {
        return 'failedPassword';
      }
      //비밀번호 확인과 맞지 않는 경우
      if (newPassword !== confirmNewPassword) {
        return 'failedConfirm';
      }
      //다 통과하면 새 비밀번호 해시
      newHashedPassword = bcrypt.hashSync(newPassword, 10);
    }

    //수정하기
    const updatedUser = await this.userRepository.updateUser(userId, name, newHashedPassword);
    return updatedUser;
  };
}
