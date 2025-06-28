import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class AuthSendRecoverEmailDTO {
  @IsNotEmpty({
    message: 'Informe um endereço de email'
  })
  @IsEmail(
    {},
    {
      message: 'Informe um endereço de email válido'
    }
  )
  @ApiProperty()
  email: string
}
