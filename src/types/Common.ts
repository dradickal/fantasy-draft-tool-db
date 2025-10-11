export const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'DEF', 'K'] as const;
export type Position = typeof POSITIONS[number];

export const ROSTER_IDS = ['QB', 'RB', 'WR', 'TE', 'DEF', 'K', 'FLEX', 'BENCH'] as const;
export type RosterId = typeof ROSTER_IDS[number];
