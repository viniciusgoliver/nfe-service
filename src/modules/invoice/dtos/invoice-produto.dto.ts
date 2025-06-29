import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length, Matches } from 'class-validator'

export class ProductDTO {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  code: string

  @ApiProperty()
  price: number

  @ApiProperty()
  @IsString()
  @Length(4, 4)
  @Matches(/^\d{4}$/)
  cfop: string

  @ApiProperty()
  @IsString()
  @Matches(/^(0\d|1\d|2[0-6]|[3-6]\d|7\d)$/)
  cst: string

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  updatedAt: string
}
