import {useCallback, type DependencyList} from 'react';
import {createLocalPersister} from 'tinybase/persisters/persister-browser/with-schemas';
import * as UiReact from 'tinybase/ui-react/with-schemas';
import {
  type Id,
  type NoTablesSchema,
  type Value,
  type Store,
  createIndexes,
  createStore,
} from 'tinybase/with-schemas';

const STORE_ID = 'settings';
const VALUES_SCHEMA = { 
    selectedYear: { type: 'number', default: 2025 }, 
    hideDraftedPlayers: { type: 'boolean', default: true },
    inDraftMode: { type: 'boolean', default: false },
} as const;

type ValueIds = keyof typeof VALUES_SCHEMA;
type Schemas = [NoTablesSchema, typeof VALUES_SCHEMA];

const {
  useCreateStore,
  useProvideStore,
  useCreatePersister,
  useValue,
  useSetValueCallback,
} = UiReact as UiReact.WithSchemas<Schemas>;

export const useSettingsValue = 
    <ValueId extends ValueIds>(valueId: ValueId) =>
        useValue<ValueId>(valueId, STORE_ID);

export const useSetSettingsValueCallback = <
  Parameter,
  ValueId extends ValueIds,
>(
  valueId: ValueId,
  getValue: (parameter: Parameter) => Value<Schemas[1], ValueId>,
  getValueDeps?: DependencyList,
) => useSetValueCallback(valueId, getValue, getValueDeps, STORE_ID);

export const SettingsStore = () => {
  const settingsStore = useCreateStore(() =>
    createStore().setValuesSchema(VALUES_SCHEMA),
  );

  useCreatePersister(
    settingsStore,
    (settingsStore) => createLocalPersister(settingsStore, STORE_ID),
    [],
    async (persister) => await persister.load(),
  );

  useProvideStore(STORE_ID, settingsStore);
  return null;
};