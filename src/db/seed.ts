import { PrismaClient } from '@prisma/client';
import { loadGameData } from '../utils/loadGameData';

const prisma = new PrismaClient();

async function main() {
  const games = loadGameData();

  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {
        name: game.name,
        author: game.author,
        imageUrl: game.imageUrl,
        difficulty: game.difficulty,
        characters: game.characters,
      },
      create: {
        name: game.name,
        slug: game.slug,
        author: game.author,
        imageUrl: game.imageUrl,
        difficulty: game.difficulty,
        characters: game.characters,
      },
    });
  }

  console.log(`Seeded or updated ${games.length} games.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
