import fs from 'fs';
import path from 'path';

export type GameData = {
    name: string;
    slug: string;
    author: string;
    imageUrl: string;
    difficulty: string;
    characters: any;
}

export function loadGameData(): GameData[] {
  const dataDir = path.join(__dirname, '../../public/data');
  const files = fs.readdirSync(dataDir);
  const games: GameData[] = [];

  files.forEach(file => {
    if (file.endsWith('.json')) {
      const filePath = path.join(dataDir, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      games.push(parsed);
    }
  });

  return games;
}
