import TypedUI from "./utils/TypedUI.js";
import type { Row } from "tinybase";
import { ReactElement, FormEvent } from "react";
import { nanoid } from "nanoid";
import type { FantasyTeam } from "./types/LeagueSettings.js";
import { usePersister } from "./utils/PersisterContext";
import { FantasyTeamForm } from "./LeagueSettings-TeamForm.js";

const { useStore, useValue } = TypedUI;


export default function FantasyTeams() {
    const store = useStore();
    const persister = usePersister();
    const teamCount = useValue('teamCount');

    function teamCountChange(e:React.ChangeEvent<HTMLSelectElement>) {
        const selectedTeamCount = parseInt(e.target.value);
        store?.setValue('teamCount', selectedTeamCount);
    }

    async function saveSettings() {
        await persister?.save();
    }

    let teamForms:Array<ReactElement> = [];
    const fantasyTeamIds = store?.getSortedRowIds('teams', 'order', false) || [];
    console.log(fantasyTeamIds);
    fantasyTeamIds.forEach((id) => {
        const row = store?.getRow('teams', id) as Row;
        const team = Object.assign(row, { id: id });
        console.log(team);
        teamForms.push((
            <FantasyTeamForm key={id} teamCount={teamCount} currentTeam={team as FantasyTeam} />         
        ));
    });

    for(let i = (fantasyTeamIds.length); i < teamCount; i++) {
        const newTeam = {id: nanoid(10), name: '', abbr: '', owner: '', order: i + 1} as FantasyTeam;
        teamForms.push((
            <FantasyTeamForm key={newTeam.id} teamCount={teamCount} currentTeam={newTeam} />         
        ));
    }
    

    return (
        <div className="leagueSettings-content fantasyTeams">
            <label htmlFor="teamCount">Number of Teams:</label>
            <select id="teamCount" name="teamCount" value={teamCount} onChange={teamCountChange}>
                <option value="6">6</option>
                <option value="8">8</option>
                <option value="10">10</option>
                <option value="12">12</option>
                <option value="14">14</option>
            </select>
            {teamForms}
            <button onClick={saveSettings}>Save Settings</button>
        </div>
    );
}
