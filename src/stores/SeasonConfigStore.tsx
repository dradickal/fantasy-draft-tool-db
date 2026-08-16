import type { DependencyList } from 'react';
import {createLocalPersister} from 'tinybase/persisters/persister-browser/with-schemas';
import * as UiReact from 'tinybase/ui-react/with-schemas';
import {
    type Id,
    type Value,
    type Row,
    createStore,
} from 'tinybase/with-schemas';
import { type RosterId } from '../types/Common';
import { useSettingsValue } from './SettingsStore';


type AsId<Key> = Exclude<Key & Id, number>;

const STORE_ID = 'SeasonConfig';
const PERSISTER_ID = 'SeasonConfig';

const VALUES_SCHEMA = {
    teamCount: { type: 'number', default: 12 },
    myTeam: { type: 'string'},
} as const;
type ValueIds = keyof typeof VALUES_SCHEMA;

const ROSTER_SLOT_TABLE = {
    start: {type: 'number'},
    limit: {type: 'number'},
    allowed: {type: 'string'},
} as const;

const LEAGUE_TEAMS_TABLE = {
    owner: {type: 'string'},
    nickname: {type: 'string'},
    draftPos: {type: 'number'},
} as const;

const TABLES_SCHEMA = {
    rosterConfig: ROSTER_SLOT_TABLE,
    leagueTeams: LEAGUE_TEAMS_TABLE,
} as const;

type Schemas = [typeof TABLES_SCHEMA, typeof VALUES_SCHEMA];
type TableIds = keyof typeof TABLES_SCHEMA;
type CellIds<TableId extends TableIds> = AsId<
    keyof (typeof TABLES_SCHEMA)[TableId]
>;

const {
    useCreateStore,
    useCreatePersister,
    useProvidePersister,
    useProvideStore,
    usePersister,
    useTable,
    useRowIds,
    useRow,
    useCell,
    useSetPartialRowCallback,
    useValue,
    useSetValueCallback,
} = UiReact as UiReact.WithSchemas<Schemas>;

/** PERSISTER HOOKS */
export const useSeasonPersister = () => {
    return usePersister(PERSISTER_ID);
}

/** VALUE HOOKS **/
export const useSeasonValue = <ValueId extends ValueIds>(
    valueId: ValueId
) => useValue<ValueId>(valueId, STORE_ID);

export const useSeasonSetValueCallback = <
    Parameter,
    ValueId extends ValueIds,
>(
    valueId: ValueId,
    getValue: (parameter: Parameter) => Value<Schemas[1], ValueId>,
    getValueDeps?: DependencyList,
) => useSetValueCallback(valueId, getValue, getValueDeps, STORE_ID);


const ROSTER_CONFIG_TABLE_ID = 'rosterConfig';
const LEAGUE_TEAMS_TABLE_ID = 'leagueTeams';

/** TABLE HOOKS */

export const useRosterConfigTable = () => useTable(ROSTER_CONFIG_TABLE_ID, STORE_ID);
export const useRosterConfigRow = (rosterConfigId: RosterId) => useRow(ROSTER_CONFIG_TABLE_ID, rosterConfigId, STORE_ID);
export const useTeamIds = () => useRowIds(LEAGUE_TEAMS_TABLE_ID, STORE_ID);
export const useTeamRow = (id:Id) => useRow(LEAGUE_TEAMS_TABLE_ID, id, STORE_ID);

export const useTeamsSetRowCallback = <
    Parameter,
>(
    teamId: Id,
    getPartialRow: (param: Parameter) => Row<Schemas[0], typeof LEAGUE_TEAMS_TABLE_ID>,
    getPartialRowDeps?: DependencyList
) => useSetPartialRowCallback(LEAGUE_TEAMS_TABLE_ID, teamId, getPartialRow, getPartialRowDeps, STORE_ID);

export const useRosterConsfigSetRowCallback = <
    Parameter,
>(
    rosterConfigId: RosterId,
    getPartialRow: (param: Parameter) => Row<Schemas[0], typeof ROSTER_CONFIG_TABLE_ID>,
    getPartialRowDeps?: DependencyList
) => useSetPartialRowCallback(ROSTER_CONFIG_TABLE_ID, rosterConfigId, getPartialRow, getPartialRowDeps, STORE_ID);


/** CELL HOOKS **/
export const useRosterConfigCell = <CellId extends CellIds<typeof ROSTER_CONFIG_TABLE_ID>>(
    rosterConfigId: RosterId,
    cellId: CellId,
) => useCell(ROSTER_CONFIG_TABLE_ID, rosterConfigId, cellId, STORE_ID);

export const useTeamCell = <CellId extends CellIds<typeof LEAGUE_TEAMS_TABLE_ID>>(
    teamId: Id,
    cellId: CellId,
) => useCell(LEAGUE_TEAMS_TABLE_ID, teamId, cellId, STORE_ID);


/** COMPONENT **/

const defaultRosterConfig = {
    QB: { start: 1, limit: 3, allowed: 'QB' },
    RB: { start: 2, limit: 5, allowed: 'RB' },
    WR: { start: 3, limit: 5, allowed: 'WR' },
    TE: { start: 1, limit: 3, allowed: 'TE' },
    K: { start: 1, limit: 3, allowed: 'K' },
    DEF: { start: 1, limit: 3, allowed: 'DEF' },
    FLEX: { start: 1, limit: 1, allowed: 'RB,WR,TE' },
    BENCH: { start: 5, limit: 5, allowed: 'QB,RB,WR,TE,DEF,K' },
};

export const SeasonConfigStore = () => {
    const year = useSettingsValue('selectedYear');
    const seasonConfigStore = useCreateStore(() =>
        createStore().setSchema(TABLES_SCHEMA, VALUES_SCHEMA),
    );

    const persister = useCreatePersister(
        seasonConfigStore,
        (seasonConfigStore) => {
            const DATED_STORE_ID = `${STORE_ID}${year}`;
            return createLocalPersister(seasonConfigStore, DATED_STORE_ID)
        },
        [year],
        async (persister) => {
            await persister.load([
            {
                rosterConfig: defaultRosterConfig,
            }, 
            {}
            ])
        },
    );

    useProvideStore(STORE_ID, seasonConfigStore);
    useProvidePersister(PERSISTER_ID, persister);
    
    return null;
};