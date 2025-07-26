import TypedUI from "./utils/TypedUI.js";
import type { Row } from "tinybase";
import { ReactElement } from "react";
import { nanoid } from "nanoid";
import type { FantasyTeam } from "./types/LeagueSettings.js";
import { FantasyTeamForm } from "./LeagueSettings-TeamForm.js";

const { useStore, useValue } = TypedUI;

function createNewTeam() {
    return {id: nanoid(10), name: '', abbr: '', owner: '', order: 0} as FantasyTeam;
}

export default function FantasyTeams() {
    const store = useStore();
    const teamCount = useValue('teamCount');
    const fantasyTeamIds = store?.getSortedRowIds('teams', 'order', false) || [];

    function teamCountChange(e:React.ChangeEvent<HTMLSelectElement>) {
        const selectedTeamCount = parseInt(e.target.value);
        store?.setValue('teamCount', selectedTeamCount);
    }

    let teamForms:Array<ReactElement> = [];
    fantasyTeamIds.forEach((id) => {
        const row = store?.getRow('teams', id) as Row;
        const team = Object.assign(row, { id: id });
        
        teamForms.push((
            <FantasyTeamForm key={id} currentTeam={team as FantasyTeam} />         
        ));
    });

    for(let i = (fantasyTeamIds.length); i < teamCount; i++) {
        const newTeam = createNewTeam();
        teamForms.push((
            <FantasyTeamForm key={newTeam.id} currentTeam={newTeam} />         
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
        </div>
    );
}
