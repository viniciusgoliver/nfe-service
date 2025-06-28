import { type UserRole } from '@prisma/client'

export class UserReturnUserDTO {
  id: number
  guid: string
  email: string
  name: string
  role: UserRole
  status?: boolean
  confirmationToken?: string
  recoverToken?: string
  createdAt?: Date
  updatedAt?: Date
}
