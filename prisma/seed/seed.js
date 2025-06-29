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
          id: 1,
          name: 'User',
          email: 'user@localhost.com',
          role: UserRole.USER,
          password: passwordHash,
          salt,
        },
        {
          id: 2,
          name: 'Admin',
          email: 'admin@localhost.com',
          role: UserRole.ADMIN,
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
        { id: 'f79ce169-93e5-4158-88e4-6ddf0b8a6eb6', name: 'Pão Doce Padaria ME', cnpj: '51457887000182', ie: '723603738771' },
        { id: '36d0d382-2d6f-47c3-a2d8-df9bfee3da9c', name: 'Rango Buffet ME', cnpj: '23981958000106', ie: '999204385754' },
        { id: '653e4af5-90a4-4ef0-a380-5aa1fcbfe128', name: 'Sucesso Publicidade e Propaganda Ltda', cnpj: '14599523000100', ie: '596088975430' },
        { id: '3f14af0b-811d-41f5-81ae-6e1871cf1a99', name: 'TecBeans Informática Ltda', cnpj: '07803397000107', ie: '895518756055' },
        { id: '8004e8fc-faab-4097-b040-22bcde7d42d4', name: 'Dolls Consultoria Financeira ME', cnpj: '72711030000117', ie: '135231091684' },
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
        { id: '632278f0-dab1-452f-89c8-64231f1e5fc6', name: 'Product 1',  code: 'PROD1',  price: 10.0,  cfop: '5102', cst: '060' },
        { id: '9963f612-c66c-4d61-b408-8187e35fe607', name: 'Product 2',  code: 'PROD2',  price: 20.0,  cfop: '5102', cst: '060' },
        { id: '4bdd6aab-6c26-413c-9b03-cef913e35528', name: 'Product 3',  code: 'PROD3',  price: 30.0,  cfop: '5102', cst: '060' },
        { id: 'f79f185a-4cc9-44da-9b4b-58b9111caeed', name: 'Product 4',  code: 'PROD4',  price: 40.0,  cfop: '5102', cst: '060' },
        { id: '6d4caed1-eebf-4f47-8dda-bba63de9730a', name: 'Product 5',  code: 'PROD5',  price: 50.0,  cfop: '5102', cst: '060' },
        { id: '5cb79f1c-d2df-493c-a015-5b6e1cf5dbbe', name: 'Product 6',  code: 'PROD6',  price: 60.0,  cfop: '5102', cst: '060' },
        { id: '03e563bd-7bc5-4bc5-9ea4-a5cd814a8822', name: 'Product 7',  code: 'PROD7',  price: 70.0,  cfop: '5102', cst: '060' },
        { id: '3b7928af-b4fa-4e25-85f2-948b9f704a2f', name: 'Product 8',  code: 'PROD8',  price: 80.0,  cfop: '5102', cst: '060' },
        { id: 'c89740dd-a71f-4726-8aa5-d2f092c5df29', name: 'Product 9',  code: 'PROD9',  price: 90.0,  cfop: '5102', cst: '060' },
        { id: '132ef836-bcc6-482e-b222-029a521523e1', name: 'Product 10', code: 'PROD10', price: 100.0, cfop: '5102', cst: '060' },
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