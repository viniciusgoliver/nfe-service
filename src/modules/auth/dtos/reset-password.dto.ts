import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MinLength } from 'class-validator'

export class AuthResetPasswordDTO {
  @IsNotEmpty({
    message: 'Informe uma senha'
  })
  @MinLength(6, {
    message: 'A senha deve ter no mínimo 6 caracteres'
  })
  @ApiProperty()
  password: string

  @IsNotEmpty({
    message: 'Informe a confirmação de senha'
  })
  @MinLength(6, {
    message: 'A confirmação de senha deve ter no mínimo 6 caracteres'
  })
  @ApiProperty()
  passwordConfirmation?: string
}
