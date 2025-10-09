import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from '../app';

vi.mock('@prisma/client', () => {
  const findUnique = vi.fn();
  return {
    PrismaClient: vi.fn(() => ({
      game: {
        findUnique,
      },
    })),
  };
});

import { PrismaClient as MockedPrismaClient } from '@prisma/client';
const prisma = new MockedPrismaClient();

// @ts-ignore for test context
const mockedFindUnique = prisma.game.findUnique as ReturnType<typeof vi.fn>;

describe('POST /games/:slug/validate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 if the input is invalid', async () => {
    const res = await request(app)
      .post('/games/test-game/validate')
      .send({ x: 'bad', y: 20, characterName: 'Mario' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 if the game does not exist', async () => {
    mockedFindUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/games/test-game/validate')
      .send({ x: 100, y: 100, characterName: 'Mario' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns 404 if the character does not exist', async () => {
    mockedFindUnique.mockResolvedValue({
      slug: 'test-game',
      characters: [],
    });

    const res = await request(app)
      .post('/games/test-game/validate')
      .send({ x: 100, y: 100, characterName: 'Mario' });

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('returns success if the character is in the area', async () => {
    mockedFindUnique.mockResolvedValue({
      slug: 'test-game',
      characters: [
        {
          name: 'Mario',
          area: [
            { x: 50, y: 50 },
            { x: 150, y: 150 },
          ],
          img: 'mario.png',
        },
      ],
    });

    const res = await request(app)
      .post('/games/test-game/validate')
      .send({ x: 100, y: 100, characterName: 'Mario' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.actualCharacter).toBe('Mario');
  });

  it('returns failure if the character does not match the clicked area', async () => {
    mockedFindUnique.mockResolvedValue({
      slug: 'test-game',
      characters: [
        {
          name: 'Luigi',
          area: [
            { x: 50, y: 50 },
            { x: 150, y: 150 },
          ],
          img: 'luigi.png',
        },
      ],
    });

    const res = await request(app)
      .post('/games/test-game/validate')
      .send({ x: 100, y: 100, characterName: 'Mario' });

    expect(res.body.success).toBe(false);
    expect(res.body.actualCharacter).toBe(undefined);
  });
});
