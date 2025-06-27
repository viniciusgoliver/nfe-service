import * as bcrypt from 'bcrypt';
import { hashPassword } from '../../src/utils/helpers.util';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

describe('Password Utils', () => {
  describe('hashPassword', () => {
    it('deve chamar bcrypt.hash com a senha e o sal corretos', async () => {
      const password = 'password123';
      const salt = 'salt';

      await hashPassword(password, salt);

      expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
    });

    it('deve retornar a senha hasheada', async () => {
      const password = 'password123';
      const salt = 'salt';

      const hashedPassword = await hashPassword(password, salt);

      expect(hashedPassword).toEqual('hashedPassword');
    });
  });
});
