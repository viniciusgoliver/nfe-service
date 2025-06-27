import { PrismaClientExceptionFilter } from '../../src/modules/prisma/prisma-client-exception/prisma-client-exception.filter';

describe('PrismaClientExceptionFilter', () => {
  it('should be defined', () => {
    expect(new PrismaClientExceptionFilter()).toBeDefined();
  });
});
