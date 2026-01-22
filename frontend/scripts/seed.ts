import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  try {
    const product = await prisma.product.create({
      data: {
        name: "Security Shield Pro",
        description: "Advanced protection for your digital assets. Enterprise grade security.",
        price: 99.99,
        imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      },
    });
    console.log("Seeded product:", product);
  } catch (error) {
    console.error("Error seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
