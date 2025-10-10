import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { submitScore, getAllLeaderboards } from '../controllers/leaderboardController';
import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

// Mock Prisma
vi.mock('@prisma/client', () => {
  const mPrisma = {
    game: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
    leaderboardEntry: {
      create: vi.fn(),
    },
  };
  return { PrismaClient: vi.fn(() => mPrisma) };
});

const prisma = new PrismaClient();

describe('submitScore', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let json = vi.fn();
  let status = vi.fn(() => ({ json }));

  beforeEach(() => {
    json = vi.fn();
    status = vi.fn(() => ({ json }));
    mockRes = { status } as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if name or time is missing', async () => {
    mockReq = {
      params: { slug: 'test-game' },
      body: { name: '', time: undefined },
    };

    await submitScore(mockReq as Request, mockRes as Response);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'Name and time are required' });
  });

  it('should return 404 if game is not found', async () => {
    mockReq = {
      params: { slug: 'unknown-game' },
      body: { name: 'Player1', time: 123 },
    };

    (prisma.game.findUnique as any).mockResolvedValue(null);

    await submitScore(mockReq as Request, mockRes as Response);

    expect(prisma.game.findUnique).toHaveBeenCalledWith({
      where: { slug: 'unknown-game' },
    });
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: 'Game not found.' });
  });

  it('should create leaderboard entry and return 201', async () => {
    mockReq = {
      params: { slug: 'test-game' },
      body: { name: 'Player1', time: 123 },
    };

    const game = { id: 1 };
    const entry = {
      id: 1,
      playerName: 'Player1',
      time: 123,
      gameId: 1,
      createdAt: new Date(),
    };

    (prisma.game.findUnique as any).mockResolvedValue(game);
    (prisma.leaderboardEntry.create as any).mockResolvedValue(entry);

    await submitScore(mockReq as Request, mockRes as Response);

    expect(prisma.leaderboardEntry.create).toHaveBeenCalledWith({
      data: {
        playerName: 'Player1',
        time: 123,
        gameId: 1,
      },
    });

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({ message: 'Score submitted', entry });
  });

  it('should handle internal server error', async () => {
    mockReq = {
      params: { slug: 'test-game' },
      body: { name: 'Player1', time: 123 },
    };

    (prisma.game.findUnique as any).mockRejectedValue(new Error('DB error'));

    await submitScore(mockReq as Request, mockRes as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'Failed to save score.' });
  });
});

describe('getAllLeaderboards', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let json = vi.fn();
  let status = vi.fn(() => ({ json }));

  beforeEach(() => {
    json = vi.fn();
    status = vi.fn(() => ({ json }));
    mockRes = { status } as any;
    mockReq = {} as any;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return formatted leaderboard data', async () => {
    const mockData = [
      {
        id: 1,
        name: 'Test Game',
        difficulty: 'easy',
        leaderboards: [
          { playerName: 'Alice', time: 100, createdAt: new Date() },
          { playerName: 'Bob', time: 120, createdAt: new Date() },
        ],
      },
    ];

    (prisma.game.findMany as any).mockResolvedValue(mockData);

    await getAllLeaderboards(mockReq as Request, mockRes as Response);

    expect(prisma.game.findMany).toHaveBeenCalledWith({
      include: {
        leaderboards: {
          orderBy: { time: 'asc' },
          take: 10,
        },
      },
    });

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith([
      {
        gameId: 1,
        gameName: 'Test Game',
        difficulty: 'easy',
        leaderboards: expect.arrayContaining([
          expect.objectContaining({
            playerName: 'Alice',
            time: 100,
            createdAt: expect.any(Date),
          }),
        ]),
      },
    ]);
  });

  it('should handle internal server error', async () => {
    (prisma.game.findMany as any).mockRejectedValue(new Error('DB error'));

    await getAllLeaderboards(mockReq as Request, mockRes as Response);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'Failed to fetch all leaderboards.' });
  });
});
