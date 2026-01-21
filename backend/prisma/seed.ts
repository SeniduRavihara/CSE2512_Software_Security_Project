import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create sample products (shoes)
  const products = [
    {
      name: 'Nike Air Max 270',
      description: 'The Nike Air Max 270 delivers visible cushioning under every step. Featuring Nike\'s biggest heel Air unit yet for a super-soft ride.',
      price: 150,
      imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/5c79cf61-3251-4c89-aa5d-e0de9b0c2b07/AIR+MAX+270.png',
    },
    {
      name: 'Adidas Ultraboost 22',
      description: 'Experience ultimate comfort with Adidas Ultraboost 22. Premium cushioning and energy return for your everyday runs.',
      price: 190,
      imageUrl: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg',
    },
    {
      name: 'Puma RS-X³',
      description: 'Bold and unapologetic. The RS-X³ brings maximum comfort with its thick midsole and edgy design.',
      price: 110,
      imageUrl: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/371570/14/sv01/fnd/PNA/fmt/png/RS-X%C2%B3-Puzzle-Trainers',
    },
    {
      name: 'New Balance 574',
      description: 'Classic style meets modern comfort. The 574 is an iconic silhouette perfect for everyday wear.',
      price: 80,
      imageUrl: 'https://nb.scene7.com/is/image/NB/ml574evn_nb_02_i?$pdpflexf2$&wid=440&hei=440',
    },
    {
      name: 'Converse Chuck Taylor All Star',
      description: 'Timeless canvas sneaker. A must-have classic that never goes out of style.',
      price: 65,
      imageUrl: 'https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw8c0e3a3a/images/a_107/M9160_A_107X1.jpg',
    },
    {
      name: 'Vans Old Skool',
      description: 'Iconic skateboarding shoe with the classic side stripe. Durable canvas and suede construction.',
      price: 70,
      imageUrl: 'https://images.vans.com/is/image/Vans/D3HY28-HERO?wid=1600&hei=1984&fmt=jpeg&qlt=90&resMode=sharp2&op_usm=0.9,1.7,8,0',
    },
    {
      name: 'Reebok Classic Leather',
      description: 'Soft garment leather upper with a die-cut EVA midsole for lightweight cushioning.',
      price: 75,
      imageUrl: 'https://assets.reebok.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e0e29e76f7f04fca871baf4d00e8d3f4_9366/Classic_Leather_Shoes_White_49799_01_standard.jpg',
    },
    {
      name: 'Jordan Air 1 Mid',
      description: 'Inspired by the original AJ1, the Air Jordan 1 Mid offers fans a chance to follow in MJ\'s footsteps.',
      price: 120,
      imageUrl: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-665455a5-45de-40fb-945f-c1852b82400d/AIR+JORDAN+1+MID.png',
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Seed completed! Created 8 shoe products.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
