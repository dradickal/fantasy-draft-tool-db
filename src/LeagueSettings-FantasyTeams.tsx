import type { Row } from "tinybase";
import { ReactElement } from "react";
import { nanoid } from "nanoid";
import type { FantasyTeam } from "./types/LeagueSettings.js";
import { FantasyTeamForm } from "./LeagueSettings-TeamForm.js";
import { 
    useSeasonSetValueCallback,
    useSeasonValue,
    useTeamIds,
} from "./stores/SeasonConfigStore.js";
import { Id } from "tinybase/with-schemas";

export default function FantasyTeams() {
    const teamCount = useSeasonValue('teamCount');
    const fantasyTeamIds = useTeamIds() || [];
    

    const teamCountChange = useSeasonSetValueCallback(
        'teamCount',
        (e:React.ChangeEvent<HTMLSelectElement>) => parseInt(e.target.value),
    );

    let teamForms:Array<ReactElement> = [];
    fantasyTeamIds.forEach((id:Id) => {
        teamForms.push((
            <FantasyTeamForm key={id} teamId={id} />         
        ));
    });

    for(let i = (fantasyTeamIds.length); i < teamCount; i++) {
        const newId = nanoid(10);
        teamForms.push((
            <FantasyTeamForm key={newId} teamId={newId} />         
        ));
    }
    
    return (
        <div className="leagueSettings-content fantasyTeams">
            <label htmlFor="teamCount">Number of Teams:</label>
            <select id="teamCount" name="teamCount" value={teamCount} onChange={teamCountChange}>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
            </select>
            {teamForms}
        </div>
    );
}
