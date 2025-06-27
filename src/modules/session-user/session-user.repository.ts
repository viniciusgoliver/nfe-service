import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SessionUserDTO } from './dtos/session-user.dto';
import { ReturnSessionUserDTO } from './dtos/return-session-user.dto';

@Injectable()
export class SessionUserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<{ sessionUsers: ReturnSessionUserDTO[] }> {
    const sessionUsers = await this.prismaService.sessionUser.findMany();
    const returnSessionUsers: ReturnSessionUserDTO[] = [];
    sessionUsers.forEach((session) => {
      const returnSesisonUser: ReturnSessionUserDTO = {
        id: session.id,
        guid: session.guid,
        user_id: session.user_id,
        session_state: session.session_state,
        from_ip: session.from_ip,
        created_at: session.created_at,        
      };
      returnSessionUsers.push(returnSesisonUser);
    });

    if (returnSessionUsers.length === 0) {
      throw new NotFoundException('Nenhum registro encontrado');
    }

    return { sessionUsers: returnSessionUsers };
  }

  async findById(id: number): Promise<ReturnSessionUserDTO> {
    const sessionUser = await this.prismaService.sessionUser.findUnique({
      where: { id: Number(id) }, 
    });

    if (!sessionUser) {
      throw new NotFoundException('Registro não encontrado');
    }

    const returnSessionUser = {
      id: sessionUser.id,
      guid: sessionUser.guid,
      user_id: sessionUser.user_id,
      session_state: sessionUser.session_state,
      from_ip: sessionUser.from_ip,
      created_at: sessionUser.created_at,      
    };

    return returnSessionUser;
  }

  async create(createDto: SessionUserDTO): Promise<ReturnSessionUserDTO> {
    try {
      createDto.user_id = createDto.user_id;
      createDto.session_state = createDto.session_state;
      createDto.from_ip = createDto.from_ip;
      createDto.created_at = new Date();
      createDto.updated_at = new Date();

      const created = await this.prismaService.sessionUser.create({
        data: createDto,
      });

      const returnSessionUser = {
        id: created.id,
        guid: created.guid,
        user_id: created.user_id,
        session_state: created.session_state,
        from_ip: created.from_ip,
        created_at: created.created_at,        
      };

      return returnSessionUser;
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, updateDto: SessionUserDTO): Promise<ReturnSessionUserDTO> {
    const updated = await this.prismaService.sessionUser.update({
      where: { id: Number(id) }, 
      data: updateDto,
    });

    const returnSessionUser = {
      id: updated.id,
      guid: updated.guid,
      user_id: updated.user_id,
      session_state: updated.session_state,
      from_ip: updated.from_ip,
      updated_at: updated.updated_at,      
    };

    return returnSessionUser;
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.sessionUser.delete({
      where: { id: Number(id) }, 
    });
  }  
}
