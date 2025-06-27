import { ApiProperty } from '@nestjs/swagger';

export class SessionUserEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  guid: string;
  
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  session_state: string;

  @ApiProperty()
  from_ip: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
  
}
