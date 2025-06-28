import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { type UserCreateDTO } from '../user/dtos/user-create.dto'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { type UserReturnUserDTO } from '../user/dtos/return-user.dto'
import { type AuthCredentialsDTO } from './dtos/credentials.dto'
import { hashPassword } from '../../utils/helpers.util'
import { type SessionUserDTO } from '../session-user/dtos/session-user.dto'
import { type SessionReturnSessionUserDTO } from '../session-user/dtos/return-session-user.dto'

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async signUp(data: UserCreateDTO): Promise<UserReturnUserDTO> {
    const createDto = JSON.parse(JSON.stringify(data)).createUserDTO
    createDto.confirmationToken = crypto.randomBytes(32).toString('hex')
    createDto.salt = await bcrypt.genSalt()
    createDto.password = await hashPassword(createDto.password, createDto.salt)

    const userData = {
      ...createDto
    }

    delete userData.passwordConfirmation

    const created = await this.prismaService.users.create({
      data: userData
    })

    const returnUser = {
      id: created.id,
      guid: created.guid,
      email: created.email,
      name: created.name,
      role: created.role,
      status: created.status,
      confirmationToken: createDto.confirmationToken,
      createdAt: created.created_at,
      updatedAt: created.updated_at
    }

    return returnUser
  }

  async checkCredentials(credentialsDto: AuthCredentialsDTO): Promise<UserReturnUserDTO> {
    const { email, password } = credentialsDto

    const user = await this.prismaService.users.findUnique({
      where: { email, status: true }
    })

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado')
    }

    const hash = await hashPassword(password, user.salt)
    const checkPassword = hash === user.password
    const checkConfirmationToken = user.confirmationToken === null

    if (!checkPassword) {
      throw new UnauthorizedException('Credenciais inválidas')
    }

    if (!checkConfirmationToken) {
      throw new UnauthorizedException('Conta de usuário não confirmada')
    }

    if (user && checkPassword) {
      const returnUser = {
        id: user.id,
        guid: user.guid,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }

      return returnUser
    } else {
      return null
    }
  }

  async findById(id: number): Promise<UserReturnUserDTO> {
    const user = await this.prismaService.users.findUnique({
      where: { id: Number(id) }
    })

    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }

    const returnUser = {
      id: user.id,
      guid: user.guid,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }

    return returnUser
  }

  async verifyUserById(id: number): Promise<UserReturnUserDTO> {
    const user = await this.prismaService.users.findUnique({
      where: { id: Number(id) }
    })

    if (!user) {
      throw new NotFoundException('Acesso não autorizado')
    }

    const returnUser = {
      id: user.id,
      guid: user.guid,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }

    return returnUser
  }

  async verifyUserByEmail(email: string): Promise<boolean> {
    const user = await this.prismaService.users.count({
      where: { email }
    })

    if (user > 0) {
      return true
    }

    return false
  }

  async createSessionUser(sessionUserDTO: SessionUserDTO): Promise<SessionReturnSessionUserDTO> {
    const created = await this.prismaService.sessionUser.create({
      data: sessionUserDTO
    })

    if (!created) {
      throw new NotFoundException('Erro ao criar sessão')
    }

    return created
  }

  async deleteSessionUser(session_state: string): Promise<void> {
    const verify = await this.prismaService.sessionUser.count({
      where: { session_state }
    })

    if (!verify) {
      throw new NotFoundException('Sessão não encontrada')
    }

    const deleted = await this.prismaService.sessionUser.delete({
      where: { session_state }
    })

    if (!deleted) {
      throw new NotFoundException('Erro ao deletar sessão')
    }
  }

  async deleteSessionUserByIdUser(user_id: number): Promise<void> {
    const deleted = await this.prismaService.sessionUser.deleteMany({
      where: { user_id }
    })

    if (!deleted) {
      throw new NotFoundException('Erro ao deletar sessão')
    }
  }

  async findSessionUser(session_state: string): Promise<boolean> {
    const sessionUser = await this.prismaService.sessionUser.count({
      where: { session_state }
    })

    if (!sessionUser) {
      return false
    }

    return true
  }
}
