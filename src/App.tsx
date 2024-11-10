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
  const year = new Date().getFullYear();
  const [playersHydrated, setPlayersHydrated] = useState(false);
  const store = useCreateStore(() => createAndSeedStore(() => {
    setPlayersHydrated(true);
  }));
  const queries = useCreateQueries(store, (store) => createQueries(store));
  const indexes = useCreateIndexes(store, (store) => createIndexes(store));
  const persister = useCreatePersister(store, (store) => createLocalPersister(store, 'DraftTool' + year))
  
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
          <img className='header-icon' src={import.meta.env.BASE_URL+'favicon.svg'} alt='American Football'/>
          <h1>
            Fantasy Draft Tool
          </h1>
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
