import { ApiProperty } from '@nestjs/swagger'

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
  cfop: string

  @ApiProperty()
  cst: string

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  updatedAt: string
}
