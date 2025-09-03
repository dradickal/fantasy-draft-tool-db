import type { DependencyList } from 'react';
import {createLocalPersister} from 'tinybase/persisters/persister-browser/with-schemas';
import * as UiReact from 'tinybase/ui-react/with-schemas';
import {
    type Id,
    type Value,
    type Row,
    createStore,
} from 'tinybase/with-schemas';
import { useSettingsValue } from './SettingsStore';

type AsId<Key> = Exclude<Key & Id, number>;

const STORE_ID = 'SeasonConfig';
const PERSISTER_ID = 'SeasonConfig';

const VALUES_SCHEMA = {
    teamCount: { type: 'number', default: 12 },
    myTeam: { type: 'string'},
} as const;
type ValueIds = keyof typeof VALUES_SCHEMA;

const TABLES_SCHEMA = {
    rosterConfig: {
        count: {type: 'number'},
        limit: {type: 'number'},
        allowed: {type: 'string'},
    },
    teams: {
        owner: {type: 'string'},
        nickname: {type: 'string'},
        draftPos: {type: 'number'},
    }
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


const ROSTERCONFIG_TABLE_ID = 'rosterConfig';
const TEAM_TABLE_ID = 'teams';

/** TABLE HOOKS */

export const useRosterConfigTable = () => useTable(ROSTERCONFIG_TABLE_ID, STORE_ID);
export const useTeamIds = () => useRowIds(TEAM_TABLE_ID, STORE_ID);
export const useTeamRow = (id:Id) => useRow(TEAM_TABLE_ID, id, STORE_ID);
export const useTeamsSetRowCallback = <
    Parameter,
>(
    teamId: Id,
    getPartialRow: (param: Parameter) => Row<Schemas[0], typeof TEAM_TABLE_ID>,
    getPartialRowDeps?: DependencyList
) => useSetPartialRowCallback(TEAM_TABLE_ID, teamId, getPartialRow, getPartialRowDeps, STORE_ID);



/** CELL HOOKS **/
export const useRosterConfigCell = <CellId extends CellIds<typeof ROSTERCONFIG_TABLE_ID>>(
    rosterConfigId: Id,
    cellId: CellId,
) => useCell(ROSTERCONFIG_TABLE_ID, rosterConfigId, cellId, STORE_ID);

export const useTeamCell = <CellId extends CellIds<typeof TEAM_TABLE_ID>>(
    teamId: Id,
    cellId: CellId,
) => useCell(TEAM_TABLE_ID, teamId, cellId, STORE_ID);


/** COMPONENT **/

const defaultRosterConfig = {
    qb: { count: 1, limit: 3, allowed: 'qb' },
    rb: { count: 2, limit: 5, allowed: 'rb' },
    wr: { count: 3, limit: 5, allowed: 'wr' },
    te: { count: 1, limit: 3, allowed: 'te' },
    k: { count: 1, limit: 3, allowed: 'k' },
    def: { count: 1, limit: 3, allowed: 'def' },
    flex: { count: 1, limit: 1, allowed: 'rb,wr,te' },
    bench: { count: 5, limit: 5, allowed: 'qb,rb,wr,te,def,k' },
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