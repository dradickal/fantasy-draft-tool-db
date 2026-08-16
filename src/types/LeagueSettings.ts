import { Position, RosterId } from "./Common";

export type FantasyTeam = {
    id: string;
    name: string;
    abbr: string;
    owner: string;
    order: number;
};

export type RosterLabelSettings = {
    start: number;
    limit: number;
    allowed: string;  // of type RosterId
};

export type RosterConfig = Record<RosterId, RosterLabelSettings>;

export type LeagueSettings = {
    teamCount: number;
    teams: Array<FantasyTeam>;
};