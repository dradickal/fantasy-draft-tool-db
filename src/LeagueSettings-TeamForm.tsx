import { InputDelay } from "./utils/inputDelay";
import { Id } from "tinybase/with-schemas";
import { useTeamRow, useTeamsSetRowCallback } from "./stores/SeasonConfigStore";

type FantasyTeamFormProps = {
    teamId: Id;
};

export function FantasyTeamForm({ teamId }:FantasyTeamFormProps) {
    const teamRow = useTeamRow(teamId);
    const team = Object.assign({nickname: '', owner: ''}, teamRow);
    const setTeam = useTeamsSetRowCallback(
        teamId, 
        (data:any) => data,
    );
    let activeDelay = new InputDelay(1800, setTeam);

    const inputListener = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        const fantasyTeamID = form.dataset.id as string;
        const data = Object.fromEntries(new FormData(form));

        if (activeDelay.label === fantasyTeamID) {
            activeDelay.cancelDelay();
        }

        activeDelay.startDelay(fantasyTeamID, data);
    }

    return (
        <form name={`teamForm-${teamId}`} onInput={inputListener} data-id={teamId}>
            <div className="inputGroup">
                <label htmlFor={`teamOwner${teamId}`}>Team Owner:</label>
                <input type="text" id={`teamOwner${teamId}`} name="owner" defaultValue={team.owner}/>
            </div>
            
            <div className="inputGroup">
                <label htmlFor={`teamNickname${teamId}`}>Team Name:</label>
                <input type="text" id={`teamNickname${teamId}`} name="nickname" defaultValue={team.nickname}/>
            </div>
        </form>
    )
}
