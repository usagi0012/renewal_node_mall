// readUser;
// updateUser;
import { UserService } from '../services/users.service.js';
export class UserController {
  userService = new UserService();

  //내 정보 조회
  readUser = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const user = await this.userService.readUser(userId);
      return res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  };

  //내 정보 수정
  updateUser = async (req, res, next) => {
    try {
      const userId = req.user.userId;
      const { name, currentPassword, newPassword, confirmNewPassword } = req.body;
      const updatedUser = await this.userService.updateUser(
        userId,
        name,
        currentPassword,
        newPassword,
        confirmNewPassword,
      );
      //이름 유효성 검사 함수
      if (updatedUser == 'failedName') {
        return res.status(400).json({
          message: '이름은 한글, 영문, 숫자만 가능하며 2-10자리 사이여야 합니다.',
        });
      }
      //비밀번호 변경 시 셋 중 하나라도 없으면 오류
      if (updatedUser == 'noPassword') {
        return res.status(400).json({
          message: '비밀번호 변경을 위해서는 현재 비밀번호, 새 비밀번호 및 확인란을 모두 채워주세요.',
        });
      }
      //이전 비밀번호가 맞지 않는 경우
      if (updatedUser == 'passwordDiff') {
        return res.status(400).json({
          message: '현재 비밀번호가 일치하지 않습니다.',
        });
      }
      //새로운 비밀번호의 형식이 올바르지 않은 경우
      if (updatedUser == 'failedPassword') {
        return res.status(400).json({
          message: '비밀번호는 8-20자 영문, 숫자 조합으로 이루어져야 합니다.',
        });
      }
      //비밀번호 확인과 맞지 않는 경우
      if (updatedUser == 'failedConfirm') {
        return res.status(400).json({
          message: '비밀번호를 다시 확인해주세요.',
        });
      }
      //수정 성공
      return res.status(200).json({ Message: '회원정보를 수정하였습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
