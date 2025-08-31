import { StrictMode, useRef } from 'react';
import { Provider as TinyBaseProvider, usePersister } from 'tinybase/ui-react';
import { Inspector } from 'tinybase/ui-react-inspector';
import { SettingsStore, useSettingsValue } from './stores/SettingsStore.js';
import { SeasonConfigStore } from './stores/SeasonConfigStore.js';
import { PlayersStore, POSITIONS, usePlayersPersister } from './stores/PlayersStore.js';
import { PositionTableContext } from './utils/PositionTableContext';
import { HidePlayersContext } from './utils/HidePlayersContext';
import PlayerTable from './PlayerTable';
import LeagueSettings from './view-LeagueSettings.js';
import { Header } from './view-Header.js';
import './app.scss';

import { PersisterContext } from './utils/PersisterContext';


export const App = () => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    return (
        <StrictMode>
            <TinyBaseProvider>
                <SettingsStore />
                <SeasonConfigStore />
                <PlayersStore year={useSettingsValue('selectedYear')}/>
                <Inspector />

                <Header dialogRef={dialogRef} />

                <PersisterContext.Provider value={usePlayersPersister()}>
                    <div className='contentContainer'>
                        <div className='rankTables'>
                            {POSITIONS.map((tableId) => (
                                <section className="positionTable" key={tableId}>
                                    <PositionTableContext.Provider value={tableId}>
                                        <HidePlayersContext.Provider value={false}>
                                            <PlayerTable />
                                        </HidePlayersContext.Provider>
                                    </PositionTableContext.Provider>
                                </section>
                            ))}
                        </div>
                        <dialog className='leagueSettings' ref={dialogRef}>
                            <LeagueSettings />
                        </dialog>
                    </div>
                </PersisterContext.Provider>
            </TinyBaseProvider>
        </StrictMode>
    );
};
