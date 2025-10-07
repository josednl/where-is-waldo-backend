import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /games
export const getAllGames = async (req: Request, res: Response) => {
  try {
    const games = await prisma.game.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Error fetching games' });
  }
};

// GET /games/:slug
export const getGameBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const game = await prisma.game.findUnique({
      where: { slug: slug},
    });

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Error fetching game' });
  }
};
