import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { prisma } from '../utils/prisma/index.js';

export default async function (req, res, next) {
  try {
    //토큰 가져오기
    const { authorization } = req.headers;
    if (!authorization) throw new Error('토큰이 존재하지 않습니다.');

    //토큰 타입과 값 나누기
    const [tokenType, token] = authorization.split(' ');

    //토큰 타입이 bearer가 아닐때
    if (tokenType !== 'Bearer') throw new Error('토큰 타입이 일치하지 않습니다.');

    //복호화 및 검증
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;

    //유저 찾기
    const user = await prisma.users.findFirst({
      where: { userId: +userId },
    });

    //유저 없을 경우
    if (!user) {
      throw new Error('토큰 사용자가 존재하지 않습니다.');
    }

    //req.user에 사용자 정보를 저장
    req.user = user;
    next();
  } catch (error) {
    // 토큰이 만료되었거나, 조작되었을 때, 에러 메시지를 다르게 출력
    switch (error.name) {
      case 'TokenExpiredError':
        return res.status(401).json({ message: '토큰이 만료되었습니다.' });
      case 'JsonWebTokenError':
        return res.status(401).json({ message: '토큰이 조작되었습니다.' });
      default:
        return res.status(401).json({ message: error.message ?? '비정상적인 요청입니다.' });
    }
  }
}
