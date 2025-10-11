import { createLocalPersister } from 'tinybase/persisters/persister-browser/with-schemas';
import { DependencyList } from 'react';
import * as UiReact from 'tinybase/ui-react/with-schemas';
import {
  type Id,
  type NoValuesSchema,
  type Indexes,
  type Queries,
  type Cell,
  createIndexes,
  createQueries,
  createStore,
} from 'tinybase/with-schemas';
import { Player, PlayerData } from '../utils/dataTypes';
import { type Position, POSITIONS } from '../types/Common';

type AsId<Key> = Exclude<Key & Id, number>;

const STORE_ID = 'Players';
const PERSISTER_ID = 'Players';
const QUERIES_ID = 'Players';
const INDEXES_ID = 'Players';

const PLAYER_TABLE = {
    drafted: {type: 'boolean'},
    preferred: {type: 'boolean'},
    tier: {type: 'number'},
    rank: {type: 'number'},
    playerName: {type: 'string'},
    team: {type: 'string'},
    byeWeek: {type: 'number'},
    adp: {type: 'string'},
} as const;
const TABLES_SCHEMA = {
    QB: PLAYER_TABLE,
    RB: PLAYER_TABLE,
    WR: PLAYER_TABLE,
    TE: PLAYER_TABLE,
    DEF: PLAYER_TABLE,
    K: PLAYER_TABLE,
} as const;

type Schemas = [typeof TABLES_SCHEMA, NoValuesSchema];
export type PlayersSchema = Schemas;
type CellIds = AsId<
    keyof (typeof PLAYER_TABLE)
>;

const {
    useCreateStore,
    useCreatePersister,
    useCreateIndexes,
    useCreateQueries,
    useProvideStore,
    useProvideIndexes,
    useProvideQueries,
    useProvidePersister,
    usePersister,
    useQueries,
    useIndexes,
    useSliceIds,
    useSliceRowIds,
    useSetCellCallback,
    useResultTable, 
    useRow,
    useSetPartialRowCallback,
    useValue,
    useSetValueCallback,
} = UiReact as UiReact.WithSchemas<Schemas>;

type DataCallback = (pos:Position, data:{ players: Array<PlayerData>}) => void;

async function fetchPositionData(year:number, dataCallbackFn:DataCallback) {
    return Promise.all(POSITIONS.map(
        (pos) => fetch(import.meta.env.BASE_URL + `data/rankings/${year}/${pos}.json`, {
            headers: {
                "Content-Type": "application/json",
            },
        }).then(
            async (response) => { 
                if (!response.ok) {
                    throw new Error(`${response.url}:${response.status}`);
                }
                return await response.json();
            }
        ).then((data) => {
            dataCallbackFn(pos, data);
        }).catch((error) => {
            console.error(`Error fetching ${pos} data:`, error);
        })
    ));
}

function addPlayerProperties(player:PlayerData):Player {
    return Object.assign(player, { drafted: false })
}

export function usePlayersPersister() {
    return usePersister(PERSISTER_ID);
};

export function usePlayersQueries() {
    return useQueries(QUERIES_ID);
}

export function usePlayersIndexes() {
    return useIndexes(INDEXES_ID);
}

export function usePlayersSliceIds(indexName:string) {
    return useSliceIds(indexName, INDEXES_ID);
}

export function usePlayersSliceRowIds(indexName:string, tier:string) {
    return useSliceRowIds(indexName, tier, INDEXES_ID);
}

export function usePlayersResultTable(queryName:string) {
    return useResultTable(queryName, QUERIES_ID);
}

export function usePlayersRow(tableId:Position, rowId:string) {
    return useRow(tableId, rowId, STORE_ID);
}

export function setTierIndex(indexes: Indexes<Schemas>, indexName:string, posTable:Position) {
    indexes.setIndexDefinition(
        indexName,
        posTable,
        'tier'
    ); 
}

export function setDraftedIndex(indexes: Indexes<Schemas>, indexName:string, posTable:Position) {
    indexes.setIndexDefinition(
        indexName,
        posTable,
        'drafted'
    );
}

export function setTierDraftCountQuery(queries: Queries<Schemas>, queryName: string, posTable:Position) {
    return queries.setQueryDefinition(
        queryName,
        posTable,
        ({ select, group, where }) => {
            select('tier');
            select('drafted');
            where('drafted', false)
            group('drafted', 'count').as('undraftedCount');
        }
    ); 
}


export function setTieredPlayersQuery(queries: Queries<Schemas>, queryName: string, posTable:Position, tier: number) {
    return queries.setQueryDefinition(
        queryName, 
        posTable, 
        ({select, where}) => {
            select('drafted');
            select('preferred');
            select('rank');
            select('playerName');
            select('team');
            select('byeWeek');
            select('adp');
            where('tier', tier);
        });
}

export function usePlayersSetCellCallback<Parameter, CellId extends CellIds> (
    tableId:Position, 
    rowId:Id, 
    cellId:CellId, 
    getCell:(param:Parameter ) => Cell<Schemas[0], typeof tableId, CellId>,
    getCellDeps?: DependencyList,
) {
    return useSetCellCallback(tableId, rowId, cellId, getCell, getCellDeps, STORE_ID);
}

interface PlayerStoreProps {
    year: number;
};

export const PlayersStore = ({ year = 2025 }:PlayerStoreProps) => {
    const playersStore = useCreateStore(() =>
        createStore().setTablesSchema(TABLES_SCHEMA),
    );
    useProvideStore(STORE_ID, playersStore);

    const playersQueries = useCreateQueries(playersStore, (store) => createQueries(store));
    const playersIndexes = useCreateIndexes(playersStore, (store) => createIndexes(store));

    useProvideQueries(QUERIES_ID, playersQueries!);
    useProvideIndexes(INDEXES_ID, playersIndexes!);

    const persister = useCreatePersister(
        playersStore,
        (playersStore) => createLocalPersister(playersStore, `${STORE_ID}${year}`),
        [],
        async (persister) => {
            await persister.load();
            
            if (!playersStore.hasTables()) {
                await fetchPositionData(year, (pos, data) => {
                    const players = data.players;
                    for (let player of players) {
                        const playerId = `${pos}${player.rank}`;
                        const sPlayer:any = addPlayerProperties(player);
                        playersStore.setRow(pos, playerId, sPlayer);
                    }
                });
            }
        },
        [year]
    );

    useProvidePersister(PERSISTER_ID, persister);

    
    return null;
};
