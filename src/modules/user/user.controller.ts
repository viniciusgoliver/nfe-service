import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  ValidationPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UserDTO } from './dtos/user.dto';
import { UserService } from './user.service';
import { ReturnUserDTO } from './dtos/return-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../guards/roles.guard';
import { Role } from '../../decorator/role.decorator';
import { UserRole } from '@prisma/client';
import { ResetPasswordDTO } from '../auth/dtos/reset-password.dto';
import { UserUpdateDTO } from './dtos/user-update.dto';
import { UserEntity } from './user.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/decorator/get-user.decorator';
import { ReturnUserinfoDTO } from './dtos/return-userinfo.dto';

@Controller({ path: 'users', version: '1' })
@ApiTags('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body(ValidationPipe) userDto: UserDTO): Promise<object> {
    const user = await this.userService.create(userDto);
    return {
      user,
      message: 'Usuário cadastrado com sucesso',
    };
  }

  @Get()
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll(): Promise<ReturnUserDTO[]> {
    return await this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: UserEntity })
  async findById(
    @Param('id') id: number,
    @GetUser() user: ReturnUserinfoDTO,
  ): Promise<ReturnUserDTO | { message: string }> {
    if (user.id !== id && user.role !== UserRole.ADMIN) {
      return {
        message: 'Você não tem permissão para acessar este recurso',
      };
    }
    return await this.userService.findById(id).catch((error) => {
      return {
        message: error,
      };
    });
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: UserEntity })
  async update(
    @Body(ValidationPipe) body: UserUpdateDTO,
    @Param('id') id: number,
    @GetUser() user: ReturnUserinfoDTO,
  ): Promise<ReturnUserDTO | { message: string }> {
    if (user.id !== id && user.role !== UserRole.ADMIN) {
      return {
        message: 'Você não tem permissão para acessar este recurso',
      };
    }
    return await this.userService.update(id, body).catch((error) => {
      return {
        message: error,
      };
    });
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: UserEntity })
  async delete(
    @Param('id') id: number,
    @GetUser() user: ReturnUserinfoDTO,
  ): Promise<{ message: string }> {
    if (user.id === id) {
      return {
        message: 'Você não pode remover seu próprio usuário',
      };
    }
    await this.userService.delete(id);

    return {
      message: 'Usuário removido com sucesso',
    };
  }

  @Patch(':id/change-password')  
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: UserEntity })
  async changePassword(
    @Body(ValidationPipe) body: ResetPasswordDTO,
    @Param('id') id: number,
    @GetUser() user: ReturnUserinfoDTO,
  ): Promise<{ message: string }> {
    if (user.id !== id && user.role !== UserRole.ADMIN) {
      return {
        message: 'Você não tem permissão para acessar este recurso',
      };
    }
    await this.userService.changePassword(id, body).catch((error) => {
      return {
        message: error,
      };
    });

    return {
      message: 'Senha alterada com sucesso',
    };
  }
}
