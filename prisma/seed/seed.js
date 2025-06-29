const { PrismaClient, UserRole } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash('123456', salt);
  
  const existingUsers = await prisma.users.findMany({
    where: {
      email: {
        in: ['admin@localhost.com', 'user@localhost.com'],
      },
    },
  });

  if (existingUsers.length === 0) {
    await prisma.users.createMany({
      data: [
        {
          name: 'Admin',
          email: 'admin@localhost.com',
          role: UserRole.ADMIN,
          password: passwordHash,
          salt,
        },
        {
          name: 'User',
          email: 'user@localhost.com',
          role: UserRole.USER,
          password: passwordHash,
          salt,
        },
      ],
      skipDuplicates: true,
    });
    console.log('Usuários fake criados.');
  } else {
    console.log('Usuários fake já existem, pulando.');
  }

  const existingClients = await prisma.client.findMany({
    where: {
      cnpj: {
        in: [
          '51457887000182',
          '23981958000106',
          '14599523000100',
          '07803397000107',
          '72711030000117',
        ],
      },
    },
  });

  if (existingClients.length === 0) {
    await prisma.client.createMany({
      data: [
        { name: 'Pão Doce Padaria ME', cnpj: '51457887000182', ie: '723603738771' },
        { name: 'Rango Buffet ME', cnpj: '23981958000106', ie: '999204385754' },
        { name: 'Sucesso Publicidade e Propaganda Ltda', cnpj: '14599523000100', ie: '596088975430' },
        { name: 'TecBeans Informática Ltda', cnpj: '07803397000107', ie: '895518756055' },
        { name: 'Dolls Consultoria Financeira ME', cnpj: '72711030000117', ie: '135231091684' },
      ],
      skipDuplicates: true,
    });
    console.log('Clientes fake criados.');
  } else {
    console.log('Clientes fake já existem, pulando.');
  }

  const existingProducts = await prisma.product.findMany({
    where: {
      code: {
        in: [
          'PROD1', 'PROD2', 'PROD3', 'PROD4', 'PROD5',
          'PROD6', 'PROD7', 'PROD8', 'PROD9', 'PROD10',
        ],
      },
    },
  });

  if (existingProducts.length === 0) {
    await prisma.product.createMany({
      data: [
        { name: 'Product 1',  code: 'PROD1',  price: 10.0,  cfop: '5102', cst: '060' },
        { name: 'Product 2',  code: 'PROD2',  price: 20.0,  cfop: '5102', cst: '060' },
        { name: 'Product 3',  code: 'PROD3',  price: 30.0,  cfop: '5102', cst: '060' },
        { name: 'Product 4',  code: 'PROD4',  price: 40.0,  cfop: '5102', cst: '060' },
        { name: 'Product 5',  code: 'PROD5',  price: 50.0,  cfop: '5102', cst: '060' },
        { name: 'Product 6',  code: 'PROD6',  price: 60.0,  cfop: '5102', cst: '060' },
        { name: 'Product 7',  code: 'PROD7',  price: 70.0,  cfop: '5102', cst: '060' },
        { name: 'Product 8',  code: 'PROD8',  price: 80.0,  cfop: '5102', cst: '060' },
        { name: 'Product 9',  code: 'PROD9',  price: 90.0,  cfop: '5102', cst: '060' },
        { name: 'Product 10', code: 'PROD10', price: 100.0, cfop: '5102', cst: '060' },
      ],
      skipDuplicates: true,
    });
    console.log('Produtos fake criados.');
  } else {
    console.log('Produtos fake já existem, pulando.');
  }
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });