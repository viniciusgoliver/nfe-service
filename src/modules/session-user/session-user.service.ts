import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { SessionUserRepository } from './session-user.repository';
import { SessionUserDTO } from './dtos/session-user.dto';
import { SessionReturnSessionUserDTO } from './dtos/return-session-user.dto';

@Injectable()
export class SessionUserService {
  constructor(private readonly sessionUserRepository: SessionUserRepository) {}

  async findAll(): Promise<SessionReturnSessionUserDTO[]> {
    const { sessionUsers } = await this.sessionUserRepository.findAll();

    return sessionUsers;
  }

  async findById(id: number): Promise<SessionReturnSessionUserDTO> {
    await this.sessionUserExists(id);
    const sessionUser = await this.sessionUserRepository.findById(id);

    if (!sessionUser) {
      throw new NotFoundException('Registro não encontrado');
    }

    return sessionUser;
  }

  async create(createDto: SessionUserDTO): Promise<SessionReturnSessionUserDTO> {
    try {
      return await this.sessionUserRepository.create(createDto);
    } catch (error) {
      if (error.code === 'P2002') {
        throw new UnprocessableEntityException(
          'Já existe um registro com este state',
        );
      } else {
        throw new UnprocessableEntityException(
          'Erro ao realizar o registro',
        );
      }
    }
  }

  async update(id: number, updateDto: SessionUserDTO): Promise<SessionReturnSessionUserDTO> {
    await this.sessionUserExists(id);
    
    return await this.sessionUserRepository.update(id, updateDto);
  }

  async delete(id: number): Promise<void> {
    await this.sessionUserExists(id);
    return await this.sessionUserRepository.delete(id);
  }

  async sessionUserExists(id: number): Promise<boolean> {
    const sessionUser = await this.sessionUserRepository.findById(id);

    if (!sessionUser) {
      throw new NotFoundException('Registro não encontrado');
    }

    return true;
  }  
}
