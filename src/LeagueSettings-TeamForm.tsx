import { useRef } from "react";
import type { FantasyTeam } from "./types/LeagueSettings";
import { InputDelay } from "./utils/inputDelay";
import TypedUI from "./utils/TypedUI";

const { useSetPartialRowCallback } = TypedUI;

type FantasyTeamFormProps = {
    teamCount: number;
    currentTeam: FantasyTeam;
}

export function FantasyTeamForm({ teamCount, currentTeam }:FantasyTeamFormProps) {
    const form = useRef<HTMLFormElement>(null);
    const i = currentTeam.order;
    const setFantasyTeam = useSetPartialRowCallback(
        'teams', 
        currentTeam.id, 
        (data:any) => data
    );
    let activeDelay = new InputDelay(1800, setFantasyTeam);

    function inputListener(e: any) {
        const form = e.currentTarget as HTMLFormElement;
        const fantasyTeamID = form.dataset.id as string;
        const data = Object.fromEntries(new FormData(form));

        if (activeDelay.label === fantasyTeamID) {
            activeDelay.cancelDelay();
        }

        activeDelay.startDelay(fantasyTeamID, data);
    }

    return (
        <form name={`teamForm-${currentTeam.id}`} onInput={inputListener} data-id={currentTeam.id} ref={form}>
            <div className="inputGroup">
                <label htmlFor={`teamPos${i}`}>Draft Position:</label>
                <select id={`teamPos${i}`} name="order" defaultValue={currentTeam.order}>
                    {[...Array(teamCount)].map((_, index) => (
                        <option key={index} value={index + 1}>{index + 1}</option>
                    ))}
                </select>
            </div>

            <div className="inputGroup">
                <label htmlFor={`teamOwner${i}`}>Team Owner:</label>
                <input type="text" id={`teamOwner${i}`} name="owner" defaultValue={currentTeam.owner}/>
            </div>
            
            <div className="inputGroup">
                <label htmlFor={`teamName${i}`}>Team Name:</label>
                <input type="text" id={`teamName${i}`} name="name" defaultValue={currentTeam.name}/>
            </div>
            
            <div className="inputGroup">
                <label htmlFor={`teamAbbr${i}`}>Team Abbreviation:</label>
                <input type="text" id={`teamAbbr${i}`} name="abbr" defaultValue={currentTeam.abbr}/>
            </div>
        </form>
    )
}