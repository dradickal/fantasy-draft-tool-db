import { useStore } from "tinybase/ui-react"
import { useState, useEffect, ReactElement, FormEvent } from "react";
import { nanoid } from "nanoid";
import type { LeagueSettings, FantasyTeam } from "./types/LeagueSettings.js";
import { FantasyTeamForm } from "./FantasyTeamForm.js";

function transformFormData(formData: FormData): LeagueSettings {
    let teams:Array<FantasyTeam> = [];



    const data = Object.fromEntries(formData.entries());
    console.log('Form data: ', data);

    return {
        teamCount: parseInt(formData.get('teamCount') as string),
        teams: [],
    }
}

export default function LeagueSettings() {
    const [teamCount, setTeamCount] = useState<number>(10);
    const [fantasyTeams, setFantasyTeams] = useState<Array<FantasyTeam>>([]);
    const store = useStore();
    
    function saveLeagueSettings(e:FormEvent) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);

        const leagueSettings = transformFormData(formData);

        const newTeamSettings = []; 
        console.log('Saving team settings: ', formData);
    }

    function teamCountChange(e:React.ChangeEvent<HTMLSelectElement>) {
        const selectedTeamCount = parseInt(e.target.value);
        setTeamCount(selectedTeamCount);
    }

    function setFantasyTeam(fantasyTeam:FantasyTeam) {
        
    }

    let teamForms:Array<ReactElement> = [];
    for(let i = 0; i < teamCount; i++) {
        const currentTeam = fantasyTeams[i] || {id: nanoid(10), name: '', abbr: '', owner: '', order: i + 1};
        teamForms.push((
            <FantasyTeamForm key={currentTeam.id} teamCount={teamCount} currentTeam={currentTeam} setFantasyTeam={setFantasyTeam} />         
        ));
    }
    

    return (
        <div className="leagueSettings">
            <h2>League Settings</h2>
            <div className="fantasyTeams">
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
        </div>
    )
}
