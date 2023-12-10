import { UserRepository } from '../repositories/users.repository.js';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export class AuthService {
  userRepository = new UserRepository();

  //회원가입
  signUp = async (email, password, confirmPassword, name) => {
    //이메일 유효성 검사 (형식)
    const validEmail = email => {
      const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      return emailRegex.test(email);
    };
    if (!validEmail(email)) {
      return 'failedEmail';
    }

    //이메일 유효성 검사 (중복)
    const existuser = await this.userRepository.ExitUser(email);
    if (existuser) {
      return 'sameEmail';
    }

    //비밀번호 유효성 검사
    const validPassword = password => {
      const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,20}$/i;
      return passwordRegex.test(password);
    };
    if (!validPassword(password)) {
      return 'failedPassword';
    }

    //비밀번호 확인과 불일치
    if (password !== confirmPassword) {
      return 'failedConfirmPassword';
    }

    //이름 유효성 검사 함수
    const validname = name => {
      const nameRegex = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{1,10}$/i;
      return nameRegex.test(name);
    };
    if (!validname(name)) {
      return 'failedName';
    }

    //Users 테이블에 사용자를 추가 (회원가입 성공)
    const hash = await bcrypt.hash(password, 10);
    return await this.userRepository.signUp(email, hash, name);
  };

  //로그인
  signIn = async (email, password) => {
    //이메일 없는 경우
    const existuser = await this.userRepository.ExitUser(email);
    if (!existuser) {
      return 'noUser';
    }

    //비밀번호 틀린 경우
    if (!(await bcrypt.compare(password, existuser.password))) {
      return 'failedPassword';
    }

    //사용자의 userId를 바탕으로 토큰 생성 (로그인 성공)
    const token = jwt.sign({ userId: existuser.userId }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '6h' });
    return token;
  };

  //회원탈퇴
  resign = async userId => {
    return await this.userRepository.resign(userId);
  };
}
