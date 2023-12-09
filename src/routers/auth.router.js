import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { prisma } from '../utils/prisma/index.js';
import authMiddleware from '../middlewares/need-signin.middleware.js';

//회원가입 API
router.post('/sign-up', async (req, res, next) => {
  try {
    const { email, password, confirmPassword, name } = req.body;

    //이메일 유효성 검사 (형식)
    const validEmail = email => {
      const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      return emailRegex.test(email);
    };
    if (!validEmail(email)) {
      res.status(400).json({
        message: '잘못된 이메일 형식입니다.',
      });
      return;
    }

    //이메일 유효성 검사 (중복)
    const existsUsers = await prisma.users.findFirst({
      where: { email },
    });
    if (existsUsers) {
      return res.status(409).json({
        message: '이미 가입된 이메일입니다.',
      });
    }

    //비밀번호 유효성 검사
    const validPassword = password => {
      const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/i;
      return passwordRegex.test(password);
    };
    if (!validPassword(password)) {
      return res.status(400).json({
        message: '비밀번호는 8-20자 영문, 숫자 조합으로 이루어져야 합니다.',
      });
    }

    //비밀번호 확인과 불일치
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: '비밀번호를 다시 확인해주세요.',
      });
    }

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

    //Users 테이블에 사용자를 추가 (회원가입 성공)
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: { email, password: hash, name },
    });
    return res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
    });
  }
});

//로그인 API
router.post('/sign-in', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.users.findFirst({ where: { email } });

    //이메일 없는 경우
    if (!user) {
      return res.status(401).json({ message: '유저 정보가 없습니다. 회원가입 후 이용해주세요.' });
    }
    //비밀번호 틀린 경우
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    //사용자의 userId를 바탕으로 토큰 생성 (로그인 성공)
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '6h' });

    // authotization 쿠키에 Berer 토큰 형식으로 JWT를 저장
    res.cookie('authorization', `Bearer ${token}`);
    return res.status(200).json({ message: '로그인 성공' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
    });
  }
});

//로그아웃 API
router.post('/sign-out', authMiddleware, async (req, res) => {
  try {
    res.clearCookie('authorization', { path: '/' });
    return res.status(200).json({
      message: '로그아웃에 성공했습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
    });
  }
});

//회원 탈퇴 API
router.delete('/resign', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    await prisma.users.delete({ where: { userId: +userId } });
    res.status(200).json({
      message: '탈퇴가 처리되었습니다.',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: '알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.',
    });
  }
});

export default router;
