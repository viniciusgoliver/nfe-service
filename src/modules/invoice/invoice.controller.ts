import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { type CreateInvoiceDTO } from './dtos/create-invoice.dto';
import { InvoiceService } from './invoice.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../guards/roles.guard';
import { Role } from '../../decorator/role.decorator';
import { UserRole } from '@prisma/client';
import { InvoiceEntity } from './invoice.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller({ path: 'nfe', version: '1' })
@ApiTags('nfe')
export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  @Post()
  @Role(UserRole.USER)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiCreatedResponse({ type: InvoiceEntity })
  @ApiOkResponse({ type: InvoiceEntity, description: 'Fatura criada com sucesso' })
  async create(@Body(ValidationPipe) createInvoiceDto: CreateInvoiceDTO): Promise<object> {
    const invoice = await this.invoiceService.create(createInvoiceDto);
    return {
      invoice,
      message: 'Fatura criada com sucesso',
    };
  }  
}
