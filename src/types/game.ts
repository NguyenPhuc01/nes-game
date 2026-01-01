export interface Game {
  name: string
  description: string
  filePath?: string
}

export const games: Game[] = [
  {
    name: 'Contra',
    description: 'Run and gun classic',
    filePath: '/games/021-Contra.nes',
  },
  {
    name: 'Super Mario Bros',
    description: 'Classic platformer',
    filePath: '/games/Super-Mario.nes',
  },
  {
    name: 'The Legend of Zelda',
    description: 'Epic adventure',
    filePath: '/games/Legend-of-Zelda.nes',
  },
  {
    name: 'Pac-Man',
    description: 'Arcade classic',
    filePath: '/games/Pac-Man.nes',
  },
  {
    name: 'Tetris',
    description: 'Puzzle game',
    filePath: '/games/Tetris.nes',
  },
  {
    name: '1000 in 1 game',
    description: 'Choose your own game',
    filePath: '/games/1200-in-1.nes',
  },
]
