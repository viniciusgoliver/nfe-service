import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { type UserDTO } from './dtos/user.dto';
import { ReturnUserDTO } from './dtos/return-user.dto';
import { ResetPasswordDTO } from '../auth/dtos/reset-password.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAll(): Promise<ReturnUserDTO[]> {
    const { users } = await this.userRepository.findAll();

    return users;
  }

  async findById(id: number): Promise<ReturnUserDTO> {
    await this.userExists(id);
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async create(createDto: UserDTO): Promise<ReturnUserDTO> {
    try {
      if (createDto.password != createDto.passwordConfirmation) {
        throw new UnprocessableEntityException('As senhas não conferem');
      }

      return await this.userRepository.create(createDto);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UnprocessableEntityException(
          'Já existe um usuário com este email',
        );
      } else {
        throw new UnprocessableEntityException(
          'Erro ao realizar o cadastro do usuário',
        );
      }
    }
  }

  async update(id: number, updateDto: UserDTO): Promise<ReturnUserDTO> {
    await this.userExists(id);
    if (updateDto.password != updateDto.passwordConfirmation) {
      throw new UnprocessableEntityException('As senhas não conferem');
    }

    return await this.userRepository.update(id, updateDto);
  }

  async delete(id: number): Promise<void> {
    await this.userExists(id);
    return await this.userRepository.delete(id);
  }

  async userExists(id: number): Promise<boolean> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return true;
  }

  async confirmationEmail(confirmationToken: string): Promise<void> {
    return await this.userRepository.confirmationEmail(confirmationToken);
  }

  async recoverPasswordEmail(email: string): Promise<string> {
    return await this.userRepository.recoverPasswordEmail(email);
  }

  async resetPassword(
    token,
    resetPasswordDto: ResetPasswordDTO,
  ): Promise<void> {
    return await this.userRepository.resetPassword(token, resetPasswordDto);
  }

  async changePassword(
    id: number,
    changePasswordDto: ResetPasswordDTO,
  ): Promise<void> {
    await this.userExists(id);
    return await this.userRepository.changePassword(id, changePasswordDto);
  }
}
