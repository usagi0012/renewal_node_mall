import { prisma } from '../utils/prisma/index.js';

export class UserRepository {
  //이메일로 회원 조회
  ExitUser = async email => {
    const exituser = await prisma.users.findFirst({
      where: { email },
    });
    return exituser;
  };

  //userId로 회원 조회
  FindUser = async userId => {
    const user = await prisma.users.findFirst({
      where: { userId: +userId },
      include: { products: true },
    });
    return user;
  };

  //회원 정보 수정
  updateUser = async (userId, name, newHashedPassword) => {
    const updateduser = await prisma.users.update({
      where: {
        userId: +userId,
      },
      data: {
        name,
        password: newHashedPassword,
      },
    });
    return updateduser;
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
