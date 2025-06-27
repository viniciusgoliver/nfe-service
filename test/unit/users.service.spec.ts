import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../src/modules/user/user.repository';
import { UserService } from '../../src/modules/user/user.service';
import { UserDTO } from '../../src/modules/user/dtos/user.dto';
import { UserRole } from '@prisma/client';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

const mockUserRepository = () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('UsersService', () => {
  let userRepository;
  let service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useFactory: mockUserRepository,
        },
      ],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
    service = await module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('createUser', () => {
    let mockCreateUserDto: UserDTO;

    beforeEach(() => {
      mockCreateUserDto = {
        email: 'mock@email.com',
        name: 'Mock User',
        status: true,
        role: 'ADMIN',
        password: 'mockPassword',
        passwordConfirmation: 'mockPassword',
      };
    });

    it('should create an user if passwords match', async () => {
      userRepository.create.mockResolvedValue('mockUser');
      const result = await service.create(mockCreateUserDto);

      expect(userRepository.create).toHaveBeenCalledWith({
        ...mockCreateUserDto,
        role: UserRole.ADMIN,
      });
      expect(result).toEqual('mockUser');
    });

    it('should throw an error if passwords doesnt match', async () => {
      mockCreateUserDto.passwordConfirmation = 'wrongPassword';
      expect(service.create(mockCreateUserDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('findUserById', () => {
    it('should return the found user', async () => {
      userRepository.findById.mockResolvedValue('mockUser');
      const result = await service.findById('mockId');

      expect(userRepository.findById).toHaveBeenCalledWith('mockId');
      expect(result).toEqual('mockUser');
    });

    it('should throw an error if user not found', async () => {
      userRepository.findById.mockResolvedValue(null);
      expect(service.findById('mockId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete the user', async () => {
      const user = userRepository.findById.mockResolvedValue('mockUser');

      if (!user) {
        expect(userRepository.delete('mockId')).rejects.toThrow(
          NotFoundException,
        );
      }

      userRepository.delete.mockResolvedValue({ affected: 1 });
      await service.delete('mockId');

      expect(userRepository.delete).toHaveBeenCalledWith('mockId');
    });

    it('should throw an error if user not found', async () => {
      userRepository.delete.mockResolvedValue({ affected: 0 });
      expect(service.delete('mockId')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUsers', () => {
    it('should call the findAll method of the userRepository', async () => {
      userRepository.findAll.mockResolvedValue({
        users: 'mockUsers',
      });
      const result = await service.findAll();

      expect(userRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual('mockUsers');
    });
  });

  describe('updateUser', () => {
    it('should return affected > 0 users', () => {
      const user = userRepository.findById.mockResolvedValue('mockUser');

      if (!user) {
        expect(userRepository.delete('mockId')).rejects.toThrow(
          NotFoundException,
        );
      }
      userRepository.update.mockResolvedValue({ affected: 1 });
      expect(
        service.update('mockId', {
          name: 'mockName',
        }),
      ).resolves.toEqual({ affected: 1 });
    });

    it('should throw an error if no row is affected in the DB', async () => {
      userRepository.update.mockResolvedValue({ affected: 0 });
      expect(
        service.update('mockId', {
          name: 'mockName',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
