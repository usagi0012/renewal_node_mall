import { AuthService } from '..//services/auth.service.js';
export class AuthController {
  authService = new AuthService();

  //회원가입
  signUp = async (req, res, next) => {
    try {
      const { email, password, confirmPassword, name } = req.body;
      const user = await this.authService.signUp(email, password, confirmPassword, name);

      //이메일 유효성 검사 (형식)
      if (user == 'failedEmail') {
        return res.status(400).json({
          message: '잘못된 이메일 형식입니다.',
        });
      }

      //이메일 유효성 검사 (중복)
      if (user == 'sameEmail') {
        return res.status(409).json({
          message: '이미 가입된 이메일입니다.',
        });
      }

      //비밀번호 유효성 검사
      if (user == 'failedPassword') {
        return res.status(400).json({
          message: '비밀번호는 8-20자 영문, 숫자 조합으로 이루어져야 합니다.',
        });
      }

      //비밀번호 확인과 불일치
      if (user == 'failedConfirmPassword') {
        return res.status(400).json({
          message: '비밀번호를 다시 확인해주세요.',
        });
      }

      //이름 유효성 검사
      if (user == 'failedName') {
        return res.status(400).json({
          message: '이름은 한글, 영문, 숫자만 가능하며 2-10자리 사이여야 합니다.',
        });
      }

      return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
    } catch (err) {
      next(err);
    }
  };

  //로그인
  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await this.authService.signIn(email, password);

      //이메일 없는 경우
      if (user == 'noUser') {
        return res.status(401).json({ message: '유저 정보가 없습니다. 회원가입 후 이용해주세요.' });
      }

      //비밀번호 틀린 경우
      if (user == 'failedPassword') {
        return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
      }

      res.cookie('authorization', `Bearer ${user}`);
      return res.status(200).json({ message: '로그인 성공' });
    } catch (err) {
      next(err);
    }
  };

  //로그아웃
  signOut = async (req, res, next) => {
    try {
      res.clearCookie('authorization', { path: '/' });
      return res.status(200).json({
        message: '로그아웃에 성공했습니다.',
      });
    } catch (err) {
      next(err);
    }
  };

  //회원 탈퇴
  resign = async (req, res, next) => {
    try {
      const { userId } = req.user;
      await this.authService.resign(userId);
      return res.status(200).json({
        message: '탈퇴가 처리되었습니다.',
      });
    } catch (err) {
      next(err);
    }
  };
}
