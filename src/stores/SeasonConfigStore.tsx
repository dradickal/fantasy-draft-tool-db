import {useCallback, type DependencyList } from 'react';
import {createLocalPersister} from 'tinybase/persisters/persister-browser/with-schemas';
import { GetId } from 'tinybase/ui-react';
import * as UiReact from 'tinybase/ui-react/with-schemas';
import {
    type Id,
    type Store,
    type Value,
    type Row,
    createIndexes,
    createStore,
    ParameterizedCallback,
} from 'tinybase/with-schemas';
import { useSettingsValue } from './SettingsStore';

type AsId<Key> = Exclude<Key & Id, number>;

const STORE_ID = 'SeasonConfig';
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
        abbr: {type: 'string'},
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
    useProvideStore,
    useCreatePersister,
    useCell,
    useSetPartialRowCallback,
    useValue,
    useSetValueCallback,
} = UiReact as UiReact.WithSchemas<Schemas>;


/** VALUE HOOKS **/
export const useSeasonConfigValue = <ValueId extends ValueIds>(
    valueId: ValueId
) => useValue<ValueId>(valueId, STORE_ID);

export const useSetSeasonConfigValueCallback = <
    Parameter,
    ValueId extends ValueIds,
>(
    valueId: ValueId,
    getValue: (parameter: Parameter) => Value<Schemas[1], ValueId>,
    getValueDeps?: DependencyList,
) => useSetValueCallback(valueId, getValue, getValueDeps, STORE_ID);

/** CELL HOOKS **/
const rosterConfigTable = 'rosterConfig';
const teamsTable = 'teams';

export const useRosterConfigCell = <CellId extends CellIds<typeof rosterConfigTable>>(
    rosterConfigId: Id,
    cellId: CellId,
) => useCell(rosterConfigTable, rosterConfigId, cellId, STORE_ID);

export const useTeamCell = <CellId extends CellIds<typeof teamsTable>>(
    teamId: Id,
    cellId: CellId,
) => useCell(teamsTable, teamId, cellId, STORE_ID);

export const useSetTeamsPartialRowCallback = <
    Parameter,
>(
    teamId: Id,
    getPartialRow: (param: Parameter) => Row<Schemas[0], typeof teamsTable>,
    getPartialRowDeps?: DependencyList
) => useSetPartialRowCallback(teamsTable, teamId, getPartialRow, getPartialRowDeps);

/** COMPONENT **/

const defaultRosterConfig = {
    qb: { count: 1, limit: 3, allowed: "['qb']" },
    rb: { count: 2, limit: 5, allowed: "['rb']" },
    wr: { count: 3, limit: 5, allowed: "['wr']" },
    te: { count: 1, limit: 3, allowed: "['te']" },
    k: { count: 1, limit: 3, allowed: "['k']" },
    def: { count: 1, limit: 3, allowed: "['def']" },
    flex: { count: 1, limit: 1, allowed: "['rb', 'wr', 'te']" },
    bench: { count: 5, limit: 5, allowed: "['qb', 'rb', 'wr', 'te', 'def', 'k']" },
};

export const SeasonConfigStore = () => {
    const year = useSettingsValue('selectedYear');
    const DATED_STORE_ID = `${STORE_ID}${year}`;
    const seasonConfigStore = useCreateStore(() =>
        createStore().setSchema(TABLES_SCHEMA, VALUES_SCHEMA),
    );

    useCreatePersister(
        seasonConfigStore,
        (seasonConfigStore) => createLocalPersister(seasonConfigStore, DATED_STORE_ID),
        [],
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
    
    return null;
};