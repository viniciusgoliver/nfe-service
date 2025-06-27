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
import { SessionUserDTO } from './dtos/session-user.dto';
import { SessionUserService } from './session-user.service';
import { SessionReturnSessionUserDTO } from './dtos/return-session-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../guards/roles.guard';
import { Role } from '../../decorator/role.decorator';
import { UserRole } from '@prisma/client';
import { SessionUserEntity } from './session-user.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'session-users', version: '1' })
@ApiTags('session-users')
export class SessionUserController {
  constructor(private sessionUserService: SessionUserService) {}

  @Post()
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiCreatedResponse({ type: SessionUserEntity })
  async create(@Body(ValidationPipe) sessionUserDto: SessionUserDTO): Promise<object> {
    const sessionUser = await this.sessionUserService.create(sessionUserDto);
    return {
      sessionUser,
      message: 'Registro inserido com sucesso',
    };
  }

  @Get()
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: SessionUserEntity, isArray: true })
  async findAll(): Promise<SessionReturnSessionUserDTO[]> {
    return await this.sessionUserService.findAll();
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: SessionUserEntity })
  async findById(
    @Param('id') id: number,    
  ): Promise<SessionReturnSessionUserDTO | { message: string }> {
    return await this.sessionUserService.findById(id).catch((error) => {
      return {
        message: error,
      };
    });
  }

  @Patch(':id')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: SessionUserEntity })
  async update(
    @Body(ValidationPipe) body: SessionUserDTO,
    @Param('id') id: number,    
  ): Promise<SessionReturnSessionUserDTO | { message: string }> {
    return await this.sessionUserService.update(id, body).catch((error) => {
      return {
        message: error,
      };
    });
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: SessionUserEntity })
  async delete(
    @Param('id') id: number,    
  ): Promise<{ message: string }> {
    await this.sessionUserService.delete(id);

    return {
      message: 'Registro removido com sucesso',
    };
  }  
}
