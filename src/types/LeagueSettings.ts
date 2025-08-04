export type FantasyTeam = {
    id: string;
    name: string;
    abbr: string;
    owner: string;
    order: number;
};
type ArrayString = string;
export type Position = "qb" | "rb" | "wr" | "te" | "k" | "def";
export type RosterLabels = Position | "flex" | "bench" ;
export type RosterLabelSettings = {
    count: number,
    allowed: Array<Position>,
};

export type RosterConfig = Record<RosterLabels, RosterLabelSettings>;

export type LeagueSettings = {
    teamCount: number;
    teams: Array<FantasyTeam>;
};