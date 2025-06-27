import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export const hashPassword = async (
  password: string,
  salt: string,
): Promise<string> => {
  return bcrypt.hash(password, salt);
};

export const validRefreshToken = (refreshToken: string): boolean => {
  if (!refreshToken) {
    throw new NotFoundException('Refresh token não encontrado');
  }    

  const countString = refreshToken.length

  if (countString < 50) {
    throw new NotFoundException('Refresh token inválido');
  }

  return true;
}
