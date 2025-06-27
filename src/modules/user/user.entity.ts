import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  password: string;

  @ApiProperty()
  salt: string;

  @ApiProperty()
  confirmationToken: string;

  @ApiProperty()
  recoverToken: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
