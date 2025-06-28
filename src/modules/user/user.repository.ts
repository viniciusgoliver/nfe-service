import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { type UserCreateDTO } from './dtos/user-create.dto'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { type UserReturnUserDTO } from './dtos/return-user.dto'
import { hashPassword } from '../../utils/helpers.util'
import { type AuthResetPasswordDTO } from '../auth/dtos/reset-password.dto'

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<{ users: UserReturnUserDTO[] }> {
    const users = await this.prismaService.users.findMany()
    const returnUsers: UserReturnUserDTO[] = []
    users.forEach((user) => {
      const returnUser: UserReturnUserDTO = {
        id: user.id,
        guid: user.guid,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
      returnUsers.push(returnUser)
    })

    if (returnUsers.length === 0) {
      throw new NotFoundException('Nenhum usuário encontrado')
    }

    return { users: returnUsers }
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

  async create(createDto: UserCreateDTO): Promise<UserReturnUserDTO> {
    try {
      createDto.confirmationToken = crypto.randomBytes(32).toString('hex')
      createDto.salt = await bcrypt.genSalt()
      createDto.password = await hashPassword(createDto.password, createDto.salt)
      delete createDto.passwordConfirmation

      const created = await this.prismaService.users.create({
        data: createDto
      })

      const returnUser = {
        id: created.id,
        guid: created.guid,
        email: created.email,
        name: created.name,
        role: created.role,
        status: created.status,
        createdAt: created.created_at,
        updatedAt: created.updated_at
      }

      return returnUser
    } catch (err) {
      throw new NotFoundException(`Erro ao criar usuário - ${err.message}`)
    }
  }

  async update(id: number, updateDto: UserCreateDTO): Promise<UserReturnUserDTO> {
    const updated = await this.prismaService.users.update({
      where: { id: Number(id) },
      data: updateDto
    })

    const returnUser = {
      id: updated.id,
      guid: updated.guid,
      email: updated.email,
      name: updated.name,
      role: updated.role,
      status: updated.status,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at
    }

    return returnUser
  }

  async delete(id: number): Promise<void> {
    await this.prismaService.users.delete({
      where: { id: Number(id) }
    })
  }

  async confirmationEmail(confirmationToken: string): Promise<void> {
    const user = await this.prismaService.users.findMany({
      where: { confirmationToken }
    })

    if (user.length === 0) {
      throw new NotFoundException('Id de Token inválido')
    }

    const id = user[0].id
    await this.prismaService.users.update({
      where: { id: Number(id) },
      data: { confirmationToken: null }
    })
  }

  async recoverPasswordEmail(email: string): Promise<string> {
    const user = await this.prismaService.users.findMany({
      where: { email }
    })

    if (user.length === 0) {
      throw new NotFoundException('Email não encontrado')
    }

    const id = user[0].id
    const recoverToken = crypto.randomBytes(32).toString('hex')
    await this.prismaService.users.update({
      where: { id: Number(id) },
      data: { recoverToken }
    })

    return recoverToken.toString()
  }

  async resetPassword(token, resetPasswordDto: AuthResetPasswordDTO): Promise<void> {
    const user = await this.prismaService.users.findMany({
      where: { recoverToken: token }
    })

    if (user.length === 0) {
      throw new NotFoundException('Id de Token inválido')
    }

    if (resetPasswordDto.password !== resetPasswordDto.passwordConfirmation) {
      throw new NotFoundException('As senhas não conferem')
    }

    const id = user[0].id
    const salt = await bcrypt.genSalt()
    const password = await hashPassword(resetPasswordDto.password, salt)
    await this.prismaService.users.update({
      where: { id: Number(id) },
      data: { password, salt, recoverToken: null }
    })
  }

  async changePassword(id: number, resetPasswordDto: AuthResetPasswordDTO): Promise<void> {
    const user = await this.prismaService.users.findMany({
      where: { id: Number(id) }
    })

    if (user.length === 0) {
      throw new NotFoundException('Usuário não encontrado')
    }

    if (resetPasswordDto.password !== resetPasswordDto.passwordConfirmation) {
      throw new NotFoundException('As senhas não conferem')
    }

    const salt = await bcrypt.genSalt()
    const password = await hashPassword(resetPasswordDto.password, salt)
    await this.prismaService.users.update({
      where: { id: Number(id) },
      data: { password, salt }
    })
  }
}
