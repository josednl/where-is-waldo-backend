import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const submitScore = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { name, time } = req.body;

  if (!name || typeof time !== 'number') {
    return res.status(400).json({ error: 'Name and time are required' });
  }

  try {
    const game = await prisma.game.findUnique({
      where: { slug },
    });
    if (!game) {
      return res.status(404).json({ error: "Game not found." });
    }

    const entry = await prisma.leaderboardEntry.create({
      data: {
        playerName: name,
        time: time,
        gameId: game.id,
      }
    })

    res.status(201).json({ message: 'Score submitted', entry });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ error: "Failed to save score." });
  }
}

export const getAllLeaderboards = async (req: Request, res: Response) => {
  try {
    const gamesWithLeaderboards = await prisma.game.findMany({
      include: {
        leaderboards: {
          orderBy: { time: "asc" },
          take: 10,
        },
      },
    });

    const formatted = gamesWithLeaderboards.map((game) => ({
      gameId: game.id,
      gameName: game.name,
      difficulty: game.difficulty,
      leaderboards: game.leaderboards.map((entry) => ({
        playerName: entry.playerName,
        time: entry.time,
        createdAt: entry.createdAt,
      })),
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching all leaderboards:", error);
    res.status(500).json({ error: "Failed to fetch all leaderboards." });
  }
};
