import { ReturnSessionUserDTO } from '../modules/session-user/dtos/return-session-user.dto';
import { createParamDecorator } from '@nestjs/common';

export const GetSessionUser = createParamDecorator((data, context): ReturnSessionUserDTO => {  
  const request = context.switchToHttp().getRequest();
  const returnSessionUser = {
    id: request.sessionUser.id,
    guid: request.sessionUser.guid,
    user_id: request.sessionUser.user_id,
    session_state: request.sessionUser.session_state,
    from_ip: request.sessionUser.from_ip,    
    createdAt: request.user.createdAt,
  };
  return returnSessionUser;
});
