import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
type Point = { x: number; y: number };

type Character = {
  id: string;
  name: string;
  area?: Point[];
};


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
      where: { slug: slug },
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

function findCharacterAt(
  x: number,
  y: number,
  charactersData: Character[]
): Character | null {
  for (const character of charactersData) {
    const area = character.area;
    if (!area) continue;

    const minX = Math.min(...area.map((p) => p.x));
    const maxX = Math.max(...area.map((p) => p.x));
    const minY = Math.min(...area.map((p) => p.y));
    const maxY = Math.max(...area.map((p) => p.y));

    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      return character;
    }
  }

  return null;
}

export const validateArea = async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { characterId, x, y } = req.body;

  if (typeof x !== 'number' || typeof y !== 'number' || typeof characterId !== 'string') {
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  const game = await prisma.game.findUnique({
    where: { slug },
  });

  if (!game) {
    return res.status(404).json({ success: false, message: "Game not found" });
  }

  const characters = game.characters as {
    id: string;
    name: string;
    area: { x: number, y: number }[];
    img: string;
  }[];

  const character = characters.find((char) => char.id === characterId);

  if (!character) {
    return res.status(404).json({ success: false, message: "Character not found" });
  }

  const matchedCharacter = findCharacterAt(x, y, characters);

  if (matchedCharacter) {
    const success = matchedCharacter.id === characterId;

    return res.json({
      success,
      actualCharacter: matchedCharacter.name,
    });
  }

  return res.json({
    success: false,
    actualCharacter: null,
  });
};
