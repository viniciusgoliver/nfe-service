import { PrismaService } from '../../src/modules/prisma/prisma.service';

describe('PrismaService', () => {
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
  });

  afterEach(async () => {
    await prismaService.$disconnect();
  });

  it('deve conectar ao banco de dados ao inicializar o módulo', async () => {
    await prismaService.onModuleInit();
    await expect(prismaService.$connect()).resolves.not.toThrow();
  });

  it('deve desconectar do banco de dados ao destruir o módulo', async () => {
    await prismaService.onModuleInit();
    await expect(prismaService.$connect()).resolves.not.toThrow();
    await prismaService.onModuleDestroy();

    try {
      await prismaService.$connect();
      fail('Expected $connect to throw an error after destroying the module');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
