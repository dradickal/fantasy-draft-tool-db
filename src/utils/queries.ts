import { Queries } from "tinybase"


// Try setting a named select for a second group of drafted count. 
// Maybe it will hold the row after undrafted becomes zero.
// This feels safer, and could give access to the additional count.

export function setTierDraftCountQuery(queries: Queries, queryName: string, posTable: string) {
    return queries.setQueryDefinition(
        queryName,
        posTable,
        ({ select, group, where }) => {
            select('tier');
            select('drafted');
            //select('drafted').as('undrafted')
            //where('drafted', true);
            where('drafted', false)
            //group('drafted', 'count').as('draftedCount');
            group('drafted', 'count').as('undraftedCount');
        }
    ); 
}


export function setTieredPlayersQuery(queries: Queries, queryName: string, posTable: string, tier: number) {
    return queries.setQueryDefinition(
        queryName, 
        posTable, 
        ({select, where}) => {
            select('playerId');
            select('drafted');
            select('prefferred');
            select('rank');
            select('playerName');
            select('team');
            select('byeWeek');
            select('adp');
            where('tier', tier);
        });
}