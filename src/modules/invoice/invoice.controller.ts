import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Param,
  Res,
  HttpCode,
  HttpStatus
} from '@nestjs/common'
import { InvoiceCreateInvoiceDTO } from './dtos/create-invoice.dto'
import { InvoiceService } from './invoice.service'
import { AuthGuard } from '@nestjs/passport'
import { RolesGuard } from '../../guards/roles.guard'
import { Role } from '../../decorator/role.decorator'
import { InvoiceEntity } from './invoice.entity'
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { WebhookRetornoSefazDTO } from './dtos/webhook-retorno-sefaz.dto'
import { UserRole } from '@prisma/client'

@Controller({ path: 'nfe', version: '1' })
@ApiTags('nfe')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  @Role(UserRole.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiCreatedResponse({ type: InvoiceEntity })
  async create(@Body(ValidationPipe) createInvoiceDto: InvoiceCreateInvoiceDTO): Promise<object> {
    const invoice = await this.invoiceService.create(createInvoiceDto)
    return {
      invoice,
      message: 'Fatura criada com sucesso'
    }
  }

  @Get(':id/xml')
  @ApiOperation({ summary: 'Retorna o XML da NF-e autorizada.' })
  @UseGuards(AuthGuard())
  async getInvoiceXml(@Param('id') id: string, @Res() res): Promise<any> {
    const xml = await this.invoiceService.findByIdXml(id)
    if (!xml) {
      return res.status(404).json({ message: 'Nota não encontrada ou XML não disponível' })
    }

    return res.type('application/xml').send(xml)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna o detalhe da NF-e.' })
  @UseGuards(AuthGuard())
  async getInvoice(@Param('id') id: string): Promise<InvoiceEntity> {
    const invoice = await this.invoiceService.findById(id)

    return invoice
  }

  @Post('webhook/retorno-sefaz')
  @ApiOperation({
    summary: 'Recebe retorno (simulado) da SEFAZ e atualiza status da NF-e'
  })
  @ApiBody({
    description: 'Payload enviado pela SEFAZ com o resultado da emissão',
    type: WebhookRetornoSefazDTO
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Callback processado com sucesso',
    type: WebhookRetornoSefazDTO
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Payload inválido ou dados faltando'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'NF-e não encontrada para o invoiceId informado'
  })
  @HttpCode(HttpStatus.OK)
  async retornoSefaz(@Body() body: WebhookRetornoSefazDTO): Promise<WebhookRetornoSefazDTO> {
    const { invoiceId, status } = body
    await this.invoiceService.processSefazCallback(body)
    return { status, invoiceId }
  }
}
