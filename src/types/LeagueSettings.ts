export type FantasyTeam = {
    id: string;
    name: string;
    abbr: string;
    owner: string;
    order: number;
};

export type LeagueSettings = {
    teamCount: number;
    teams: Array<FantasyTeam>;
};