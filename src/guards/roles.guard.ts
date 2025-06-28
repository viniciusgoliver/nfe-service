import { Injectable, type CanActivate, type ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { type Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const userRole = request.user.role
    const authorization = request.headers.authorization
    const token = authorization.split(' ')[1]
    const tokenRole = JSON.parse(JSON.stringify(new JwtService({}).decode(token))).role

    const requiredRole = this.reflector.get<string>('role', context.getHandler())

    if (!requiredRole) return true

    if (!userRole.includes(requiredRole) || tokenRole !== requiredRole) {
      throw new UnauthorizedException('Você não tem permissão para acessar esse recurso')
    }

    return userRole === requiredRole
  }
}
