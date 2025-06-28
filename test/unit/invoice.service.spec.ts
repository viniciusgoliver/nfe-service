import { InvoiceService } from 'src/modules/invoice/invoice.service';
import { InvoiceRepository } from 'src/modules/invoice/invoice.repository';
import { QueueProducerService } from 'src/utils/queue/queue-producer.service';
import { InvoiceCreateInvoiceDTO } from 'src/modules/invoice/dtos/create-invoice.dto';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let repo: jest.Mocked<InvoiceRepository>;
  let queue: jest.Mocked<QueueProducerService>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
      findByIdXml: jest.fn(),
    } as any;

    queue = {
      emmitInvoice: jest.fn(),
    } as any;

    service = new InvoiceService(repo, queue);
  });

  it('deve criar uma nota fiscal com sucesso', async () => {
    const payload = {
      clientId: "be13e290-a7c6-47e6-8392-07dc2c188d59",
      userId: 1,
      items: [
        {
          productId: "9bff5e84-d8b7-46bf-a995-24e4cc7775fd",
          quantity: 2
        }
      ]
    } as InvoiceCreateInvoiceDTO;

    repo.create.mockResolvedValue({ id: 1, ...payload });
    repo.findByIdXml.mockResolvedValue({ id: 1, ...payload, xml: '<xml />' });

    const result = await service.create(payload);

    expect(result).toHaveProperty('id');
    expect(repo.create).toHaveBeenCalledWith(payload);
    expect(repo.findByIdXml).toHaveBeenCalledWith(1);
    expect(queue.emmitInvoice).toHaveBeenCalled();
  });

  it('deve lançar exceção se o payload for nulo', async () => {
    await expect(service.create(null)).rejects.toThrow();
  });
});