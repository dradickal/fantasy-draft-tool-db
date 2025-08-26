import {useCallback} from 'react';
import {createLocalPersister} from 'tinybase/persisters/persister-browser/with-schemas';
import * as UiReact from 'tinybase/ui-react/with-schemas';
import {
  type Id,
  type NoValuesSchema,
  type Store,
  createIndexes,
  createStore,
} from 'tinybase/with-schemas';
import { Player, PlayerData } from '../utils/dataTypes';
import { useSettingsValue } from './SettingsStore';

type AsId<Key> = Exclude<Key & Id, number>;


const STORE_ID = 'Players';
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


const {
    useCreateStore,
    useProvideStore,
    useCreatePersister,
    useCell,
    useSetPartialRowCallback,
    useValue,
    useSetValueCallback,
} = UiReact as UiReact.WithSchemas<Schemas>;

export const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'DEF', 'K'] as const;
type Position = typeof POSITIONS[number];
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

export const PlayersStore = () => {
    const YEAR = useSettingsValue('selectedYear');
    const playersStore = useCreateStore(() =>
        createStore().setTablesSchema(TABLES_SCHEMA),
    );

    useCreatePersister(
        playersStore,
        (playersStore) => createLocalPersister(playersStore, `${STORE_ID}${YEAR}`),
        [],
        async (persister) => {
            await persister.load();
            
            if (!playersStore.hasTables()) {
                await fetchPositionData(YEAR, (pos, data) => {
                    const players = data.players;
                    for (let player of players) {
                        const playerId = `${pos}${player.rank}`;
                        const sPlayer:any = addPlayerProperties(player);
                        playersStore.setRow(pos, playerId, sPlayer);
                    }
                });
            }
        },
    );

    useProvideStore(STORE_ID, playersStore);
    
    return null;
};
