import { StrictMode, useState } from 'react';
import cn from "classnames";
import TypedUI from "./utils/TypedUI.js";
import { createIndexes, createQueries } from 'tinybase/with-schemas';
import { createLocalPersister } from 'tinybase/persisters/persister-browser/with-schemas';
import { createAndSeedStore } from './utils/store';
import { PositionTableContext } from './utils/PositionTableContext';
import { HidePlayersContext } from './utils/HidePlayersContext';
import { PersisterContext } from './utils/PersisterContext';
import { urlParams } from './utils/urlParams';
import PlayerTable from './PlayerTable';
import LeagueSettings from './LeagueSettings';
import './app.module.scss';

const positionTables: Array<string> = ["QB", "RB", "WR", "TE", "DEF", "K"];
const years: Array<number> = [2024, 2022];
const { useCreateStore, useCreateIndexes, useCreateQueries, useCreatePersister, Provider } = TypedUI;

const setDebugData = (queries:any, indexes:any) => {
  // @ts-ignore
  window.DraftTool = {};
  // @ts-ignore
  window.DraftTool.queries = queries;
  // @ts-ignore
  window.DraftTool.indexes = indexes;
}

export const App = () => {
  const [year, setYear] = useState<number>(years[0]);
  const [playersHydrated, setPlayersHydrated] = useState<boolean>(false);
  const [hideDraftedPlayers, setHideDraftedPlayers] = useState<boolean>(true);
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

  const handleHidePlayers = (event:React.ChangeEvent<HTMLInputElement>) => {
    setHideDraftedPlayers(event.target.checked)
  }

  const resetData = () => {
    localStorage.removeItem(`DraftTool${year}`);
    location.reload()
  }

  setDebugData(queries, indexes);

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
            <select id='draft-year' className='draft-year' name='draft-year' defaultValue={years[0]} onChange={handleYearChange}>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            <div className='input-group'>
              <label className='hide-players' htmlFor='hide-players'>
                <input type='checkbox' id='hide-players' name='hide-players' onChange={handleHidePlayers} checked={hideDraftedPlayers} />
                Hide Drafted Players
              </label>
            </div>
            <div className='input-group'>
              <button className={cn('resetData',{ visible: urlParams.reset == 1})} onClick={resetData}>Reset Data</button>
            </div>
          </div>
        </header>
        <div className='contentContainer'>
          <div className='rankTables'>
            {positionTables.map((tableId) => (
                <section className="positionTable" key={tableId}>
                  <PositionTableContext.Provider value={tableId} >
                  <HidePlayersContext.Provider value={hideDraftedPlayers}>
                    <PlayerTable />
                  </HidePlayersContext.Provider>
                  </PositionTableContext.Provider>
                </section>
            ))}
          </div>
          <LeagueSettings />
        </div>
      </PersisterContext.Provider>
      </Provider>
    </StrictMode>
  );
};
