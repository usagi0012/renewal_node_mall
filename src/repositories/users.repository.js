import { prisma } from '../utils/prisma/index.js';

export class UserRepository {
  //이메일로 회원 조회
  ExitUser = async email => {
    const exituser = await prisma.users.findFirst({
      where: { email },
    });
    return exituser;
  };

  //회원 가입
  signUp = async (email, hash, name) => {
    await prisma.users.create({
      data: { email, password: hash, name },
    });
  };

  //회원 탈퇴
  resign = async userId => {
    await prisma.users.delete({
      where: { userId: +userId },
    });
  };
}
