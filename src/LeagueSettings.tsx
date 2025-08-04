import TypedUI from "./utils/TypedUI.js";
import { usePersister } from "./utils/PersisterContext";
import { useState } from "react";
import FantasyTeams from "./LeagueSettings-FantasyTeams.js";
import RosterConfigForm from "./LeagueSettings-RosterConfigForm.js";
import DraftConfig from "./LeagueSettings-DraftConfig.js";
import './leagueSettings.scss';

const { useStore, useValue } = TypedUI;

const TABS: Record<string, React.JSX.Element> = {
    'teams': <FantasyTeams />,
    'roster': <RosterConfigForm />,
    'draft': <DraftConfig />
}

export default function LeagueSettings() {
    const [selectedTab, setSelectedTab] = useState('teams')
    const store = useStore();
    const persister = usePersister();

    const isActive = (tabName:string) => {
        return selectedTab === tabName ? 'active' : '';
    }

    async function saveSettings() {
        await persister?.save();
    }

    return (
        <section>
            <header>
                <h2>League Settings</h2>
            </header>
            <div className="leagueSettings-tabs">
                <nav>
                    <ul>
                        <li className={isActive('teams')} onClick={() => setSelectedTab('teams')}>Fantasy Teams</li>
                        <li className={isActive('roster')} onClick={() => setSelectedTab('roster')}>Roster Config</li>
                        <li className={isActive('draft')} onClick={() => setSelectedTab('draft')}>Draft Config</li>
                    </ul>
                </nav>
                {TABS[selectedTab]}
            </div>
            <footer>
                <button onClick={saveSettings}>Save Settings</button>
            </footer>
        </section>
    )
}
