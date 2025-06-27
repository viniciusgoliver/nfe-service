import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';
import { environmentConfig } from '../configs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    const environment = JSON.parse(JSON.stringify(environmentConfig()));
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.app.jwtSecret,
    });
  }

  async validate(payload: { id: number, session_state: string }) {
    const { id, session_state } = payload;
    const session = await this.authService.findSessionUser(session_state);
    const user = await this.authService.verifyUserById(id);

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    if (!session) {
      throw new UnauthorizedException('Sessão não encontrada');
    }

    return user;
  }
}
