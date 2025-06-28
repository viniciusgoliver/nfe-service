import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Param,
  Res,  
} from '@nestjs/common';
import { InvoiceCreateInvoiceDTO } from './dtos/create-invoice.dto';
import { InvoiceService } from './invoice.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../guards/roles.guard';
import { Role } from '../../decorator/role.decorator';
import { UserRole } from '@prisma/client';
import { InvoiceEntity } from './invoice.entity';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'nfe', version: '1' })
@ApiTags('nfe')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Post()
  @Role(UserRole.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiCreatedResponse({ type: InvoiceEntity })  
  async create(@Body(ValidationPipe) createInvoiceDto: InvoiceCreateInvoiceDTO): Promise<object> {
    const invoice = await this.invoiceService.create(createInvoiceDto);
    return {
      invoice,
      message: 'Fatura criada com sucesso',
    };
  }  

  @Get(':id/xml')
  @ApiOperation({ summary: 'Retorna o XML da NF-e autorizada.' })
  @UseGuards(AuthGuard())
  async getInvoiceXml(@Param('id') id: string, @Res() res): Promise<any> {
    const xml = await this.invoiceService.findByIdXml(id);            
    if (!xml) {
      return res.status(404).json({ message: 'Nota não encontrada ou XML não disponível' });
    }
  
    return res.type('application/xml').send(xml);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna o detalhe da NF-e.' })
  @UseGuards(AuthGuard())
  async getInvoice(@Param('id') id: string): Promise<InvoiceEntity> {
    const invoice = await this.invoiceService.findById(id);            
      
    return invoice;
  }
}
