
export interface Player extends PlayerData {
    drafted: boolean;
}

export interface PlayerData {
    prefferred: number;
    tier: number;
    rank: number;
    playerName: string;
    team: string;
    byeWeek: number;
    adp: string;
}

export interface PositionImport { 
    players: PlayerData[];
}

export interface PlayersByPosition {
    [key: string]: Array<PlayerData | Player>;
}