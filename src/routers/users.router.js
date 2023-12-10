import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';

import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/need-signin.middleware.js';

//내 정보 수정 API
router.put('/users', authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { name, currentPassword, newPassword, confirmNewPassword } = req.body;

    //이름 유효성 검사 함수
    const validname = name => {
      const nameRegex = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,10}$/i;
      return nameRegex.test(name);
    };
    if (!validname(name)) {
      return res.status(400).json({
        message: '이름은 한글, 영문, 숫자만 가능하며 2-10자리 사이여야 합니다.',
      });
    }

    //비밀번호 수정 부분(셋 중 하나라도 채워져있으면 비밀번호 변경 실행)
    let newHashedPassword;
    if (currentPassword || newPassword || confirmNewPassword) {
      //셋 중 하나라도 없으면 오류
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({
          message: '비밀번호 변경을 위해서는 현재 비밀번호, 새 비밀번호 및 확인란을 모두 채워주세요.',
        });
      }

      //이전 비밀번호가 맞지 않는 경우
      const { password } = await prisma.users.findFirst({
        where: {
          userId: +userId,
        },
        select: {
          password: true,
        },
      });
      const passwordCorrect = await bcrypt.compare(currentPassword, password);

      if (!passwordCorrect) {
        return res.status(400).json({
          success: false,
          message: '현재 비밀번호가 일치하지 않습니다.',
        });
      }

      //새로운 비밀번호의 형식이 올바르지 않은 경우
      //비밀번호 유효성 검사 함수
      const validPassword = newPassword => {
        const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/i;
        return passwordRegex.test(newPassword);
      };
      if (!validPassword(newPassword)) {
        return res.status(400).json({
          success: false,
          message: '비밀번호는 8-20자 영문, 숫자 조합으로 이루어져야 합니다.',
        });
      }

      //비밀번호 확인과 맞지 않는 경우
      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({
          message: '비밀번호를 다시 확인해주세요.',
        });
      }
      newHashedPassword = bcrypt.hashSync(newPassword, 10);
    }

    //수정 성공
    await prisma.users.update({
      where: {
        userId: +userId,
      },
      data: {
        name,
        password: newHashedPassword,
      },
    });
    res.status(200).json({ Message: '회원정보를 수정하였습니다.' });
  } catch (err) {
    next(err);
  }
});

export default router;
