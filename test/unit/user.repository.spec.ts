import { UserRepository } from '../../src/modules/user/user.repository';
import { UserDTO } from '../../src/modules/user/dtos/user.dto';
import { ReturnUserDTO } from '../../src/modules/user/dtos/return-user.dto';
import { ResetPasswordDTO } from '../../src/modules/auth/dtos/reset-password.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { NotFoundException } from '@nestjs/common';

// Mock de PrismaService
const prismaServiceMock = {
  users: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository(prismaServiceMock as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar uma lista de usuários', async () => {
      const mockReturnUser: ReturnUserDTO = {
        id: 1,
        guid: 'guid',
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN',
        status: true,
      };
      prismaServiceMock.users.findMany.mockResolvedValueOnce([mockReturnUser]);

      const result = await userRepository.findAll();
      result.users.map((user) => delete user.updatedAt);
      result.users.map((user) => delete user.createdAt);

      expect(result.users).toEqual([mockReturnUser]);
    });

    it('deve lançar NotFoundException se nenhum usuário for encontrado', async () => {
      prismaServiceMock.users.findMany.mockResolvedValueOnce([]);

      await expect(userRepository.findAll()).rejects.toThrow(
        'Nenhum usuário encontrado',
      );
    });
  });

  describe('findById', () => {
    it('deve retornar um usuário pelo ID', async () => {
      const mockReturnUser: ReturnUserDTO = {
        id: 1,
        guid: 'guid',
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN',
        status: true,
      };
      prismaServiceMock.users.findUnique.mockResolvedValueOnce(mockReturnUser);

      const result = await userRepository.findById(1);
      delete result.createdAt;
      delete result.updatedAt;

      expect(result).toEqual(mockReturnUser);
    });

    it('deve lançar NotFoundException se nenhum usuário for encontrado', async () => {
      prismaServiceMock.users.findUnique.mockResolvedValueOnce(null);

      await expect(userRepository.findById(1)).rejects.toThrow(
        'Usuário não encontrado',
      );
    });
  });

  describe('create', () => {
    it('deve criar um novo usuário', async () => {
      const mockCreateDto: UserDTO = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
        role: 'ADMIN',
        status: true,
      };
      const mockCreatedUser: ReturnUserDTO = {
        id: 1,
        guid: 'guid',
        email: 'test@example.com',
        name: 'Test User',
        role: 'ADMIN',
        status: true,
      };
      const mockHashedPassword = 'password';
      const mockSalt = 'salt';
      const mockHashPassword = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue(mockHashedPassword as never);

      prismaServiceMock.users.create.mockResolvedValueOnce(mockCreatedUser);

      const result = await userRepository.create(mockCreateDto);
      delete result.createdAt;
      delete result.updatedAt;

      expect(result).toEqual(mockCreatedUser);
      expect(mockHashPassword).toHaveBeenCalledWith(
        mockCreateDto.password,
        mockSalt,
      );
      expect(prismaServiceMock.users.create).toHaveBeenCalledWith({
        data: {
          ...mockCreateDto,
          password: mockHashedPassword,
          salt: mockSalt,
        },
      });
    });

    it('deve lançar um erro se a criação do usuário falhar', async () => {
      const mockCreateDto: UserDTO = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
        role: 'ADMIN',
        status: true,
      };

      prismaServiceMock.users.create.mockRejectedValueOnce(new Error());

      await expect(userRepository.create(mockCreateDto)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário pelo ID', async () => {
      const mockUpdateDto: UserDTO = {
        email: 'updated@example.com',
        name: 'Updated User',
        role: 'ADMIN',
        status: true,
        password: 'password',
      };
      const mockUpdatedUser: ReturnUserDTO = {
        id: 1,
        guid: 'guid',
        email: 'updated@example.com',
        name: 'Updated User',
        role: 'ADMIN',
        status: true,
      };

      prismaServiceMock.users.update.mockResolvedValueOnce(mockUpdatedUser);

      const result = await userRepository.update(1, mockUpdateDto);
      delete result.createdAt;
      delete result.updatedAt;

      expect(result).toEqual(mockUpdatedUser);
      expect(prismaServiceMock.users.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: mockUpdateDto,
      });
    });

    it('deve lançar NotFoundException se nenhum usuário for encontrado para atualizar', async () => {
      const mockUpdateDto: UserDTO = {
        email: 'updated@example.com',
        name: 'Updated User',
        role: 'ADMIN',
        status: true,
        password: 'password',
      };

      prismaServiceMock.users.update.mockResolvedValueOnce(null);

      await expect(
        userRepository.update(1, mockUpdateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('deve excluir um usuário pelo ID', async () => {
      await userRepository.delete(1);

      expect(prismaServiceMock.users.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('confirmationEmail', () => {
    it('deve confirmar o email de um usuário pelo token', async () => {
      prismaServiceMock.users.findMany.mockResolvedValueOnce([
        { id: '1', email: 'test@example.com' },
      ]);

      await userRepository.confirmationEmail('confirmationToken');

      expect(prismaServiceMock.users.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { confirmationToken: null },
      });
    });

    it('deve lançar NotFoundException se nenhum usuário for encontrado pelo token', async () => {
      prismaServiceMock.users.findMany.mockResolvedValueOnce([]);

      await expect(
        userRepository.confirmationEmail('invalidToken'),
      ).rejects.toThrow('Id de Token inválido');
    });
  });

  describe('recoverPasswordEmail', () => {
    it('deve gerar um token de recuperação de senha e atualizar o usuário com esse token', async () => {
      prismaServiceMock.users.findMany.mockResolvedValueOnce([
        { id: '1', email: 'test@example.com' },
      ]);
      const mockToken = 'recoveryToken';
      const mockRandomBytes = jest
        .spyOn(crypto, 'randomBytes')
        .mockReturnValue(void Buffer.from(mockToken));

      const result =
        await userRepository.recoverPasswordEmail('test@example.com');

      expect(result).toEqual(mockToken);
      expect(prismaServiceMock.users.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { recoverToken: mockToken },
      });
      expect(mockRandomBytes).toHaveBeenCalledWith(32);

      expect(prismaServiceMock.users.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { recoverToken: mockToken },
      });
    });

    it('deve lançar NotFoundException se nenhum usuário for encontrado pelo email', async () => {
      prismaServiceMock.users.findMany.mockResolvedValueOnce([]);

      await expect(
        userRepository.recoverPasswordEmail('invalid@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('resetPassword', () => {
    it('deve redefinir a senha de um usuário pelo token', async () => {
      prismaServiceMock.users.findMany.mockResolvedValueOnce([
        { id: '1', email: 'test@example.com', salt: 'salt' },
      ]);
      const mockResetPasswordDto: ResetPasswordDTO = {
        password: 'newPassword',
        passwordConfirmation: 'newPassword',
      };
      const mockHashedPassword = 'hashedPassword';
      const mockHashPassword = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue(mockHashedPassword as never);

      await userRepository.resetPassword('recoveryToken', mockResetPasswordDto);

      expect(mockHashPassword).toHaveBeenCalledWith(
        mockResetPasswordDto.password,
        'salt',
      );
      expect(prismaServiceMock.users.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          password: mockHashedPassword,
          recoverToken: null,
          salt: 'salt',
        },
      });
    });

    it('deve lançar NotFoundException se nenhum usuário for encontrado pelo token', async () => {
      prismaServiceMock.users.findMany.mockResolvedValueOnce([]);

      await expect(
        userRepository.resetPassword('invalidToken', {
          password: 'newPassword',
          passwordConfirmation: 'newPassword',
        }),
      ).rejects.toThrow('Id de Token inválido');
    });

    it('deve lançar NotFoundException se as senhas não conferirem', async () => {
      prismaServiceMock.users.findMany.mockResolvedValueOnce([
        { id: '1', email: 'test@example.com' },
      ]);

      await expect(
        userRepository.resetPassword('recoveryToken', {
          password: 'newPassword',
          passwordConfirmation: 'wrongPassword',
        }),
      ).rejects.toThrow('As senhas não conferem');
    });
  });

  describe('changePassword', () => {
    it('deve alterar a senha de um usuário', async () => {
      const mockResetPasswordDto: ResetPasswordDTO = {
        password: 'newPassword',
        passwordConfirmation: 'newPassword',
      };
      const mockUser = { id: '1', salt: 'salt' };
      const mockHashedPassword = 'hashedPassword';
      const mockHashPassword = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue(mockHashedPassword as never);

      prismaServiceMock.users.findMany.mockResolvedValueOnce([mockUser]);

      await userRepository.changePassword(1, mockResetPasswordDto);

      expect(mockHashPassword).toHaveBeenCalledWith(
        mockResetPasswordDto.password,
        'salt',
      );
      expect(prismaServiceMock.users.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          password: mockHashedPassword,
          salt: 'salt',
        },
      });
    });

    it('deve lançar NotFoundException se nenhum usuário for encontrado', async () => {
      prismaServiceMock.users.findMany.mockResolvedValueOnce([]);

      await expect(
        userRepository.changePassword(1, {
          password: 'newPassword',
          passwordConfirmation: 'newPassword',
        }),
      ).rejects.toThrow('Usuário não encontrado');
    });

    it('deve lançar NotFoundException se as senhas não conferirem', async () => {
      prismaServiceMock.users.findMany.mockResolvedValueOnce([
        { id: '1', email: 'test@example.com' },
      ]);

      await expect(
        userRepository.changePassword(1, {
          password: 'newPassword',
          passwordConfirmation: 'wrongPassword',
        }),
      ).rejects.toThrow('As senhas não conferem');
    });
  });
});
