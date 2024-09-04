import { StrictMode, useState } from 'react';
import { Provider, useCreateIndexes, useCreateQueries, useCreateStore, useCreatePersister } from 'tinybase/ui-react';
import { createIndexes, createQueries } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { createAndSeedStore } from './utils/store';
import PlayerTable from './PlayerTable';
import { PositionTableContext } from './utils/PositionTableContext';
import { PersisterContext } from './utils/PersisterContext';

const positionTables: Array<string> = ["QB", "RB", "WR", "TE", "DEF", "K"];

export const App = () => {
  const [playersHydrated, setPlayersHydrated] = useState(false);
  const store = useCreateStore(() => createAndSeedStore(() => {
    setPlayersHydrated(true);
  }));
  const queries = useCreateQueries(store, (store) => createQueries(store));
  const indexes = useCreateIndexes(store, (store) => createIndexes(store));
  const persister = useCreatePersister(store, (store) => createLocalPersister(store, 'DraftTool'))
  
  // @ts-ignore
  window.DraftTool = {};
  // @ts-ignore
  window.DraftTool.queries = queries;
  // @ts-ignore
  window.DraftTool.indexes = indexes;

  return (
    <StrictMode>
      <Provider store={store} queries={queries} indexes={indexes}>
      <PersisterContext.Provider value={persister}>
        <header>
          {/* Add Favicon SVG next to tile */}
          <span className='asH1'>
            Fantasy Draft Tool ({`${playersHydrated}`})
          </span>
        </header>
        <div className='contentContainer'>
          <div className='rankTables'>
            {positionTables.map((tableId) => (
                <section className="positionTable" key={tableId}>
                  <PositionTableContext.Provider value={tableId} >
                    <PlayerTable />
                  </PositionTableContext.Provider>
                </section>
            ))}
          </div>
        </div>
      </PersisterContext.Provider>
      </Provider>
    </StrictMode>
  );
};
