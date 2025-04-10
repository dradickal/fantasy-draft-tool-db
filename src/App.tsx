import { StrictMode, useState } from 'react';
import { Provider, useCreateIndexes, useCreateQueries, useCreateStore, useCreatePersister } from 'tinybase/ui-react';
import { createIndexes, createQueries } from 'tinybase';
import { createLocalPersister } from 'tinybase/persisters/persister-browser';
import { createAndSeedStore } from './utils/store';
import PlayerTable from './PlayerTable';
import { PositionTableContext } from './utils/PositionTableContext';
import { PersisterContext } from './utils/PersisterContext';

const positionTables: Array<string> = ["QB", "RB", "WR", "TE", "DEF", "K"];
const years: Array<number> = [2024, 2022];

export const App = () => {
  const [year, setYear] = useState<number>(years[0]);
  const [playersHydrated, setPlayersHydrated] = useState<boolean>(false);
  const store = useCreateStore(() => createAndSeedStore(() => {
    setPlayersHydrated(true);
  }, year), [year]);
  const queries = useCreateQueries(store, (store) => createQueries(store));
  const indexes = useCreateIndexes(store, (store) => createIndexes(store));
  const persister = useCreatePersister(store, (store) => createLocalPersister(store, 'DraftTool' + year));
  
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => { 
    const selectedYear = parseInt(event.target.value);
    setYear(selectedYear);
    setPlayersHydrated(false);
  };

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
          <div className='header-title'>
            <img className='header-icon' src={import.meta.env.BASE_URL+'favicon.svg'} alt='American Football'/>
            <h1>Fantasy Draft Tool</h1>
          </div>
          <div className='header-tools'>
            <select id='year-select' defaultValue={years[0]} onChange={handleYearChange}>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
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
