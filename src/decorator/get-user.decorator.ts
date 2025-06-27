import { UserReturnUserinfoDTO } from '../modules/user/dtos/return-userinfo.dto';
import { createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx): UserReturnUserinfoDTO => {  
  const request = ctx.switchToHttp().getRequest();
  const user = request.user;
  const returnUser = {
    id: user.id,
    guid: user.guid,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
  return returnUser;
});
