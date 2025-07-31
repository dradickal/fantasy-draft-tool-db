import { useRef } from "react";
import type { FantasyTeam } from "./types/LeagueSettings";
import { InputDelay } from "./utils/inputDelay";
import TypedUI from "./utils/TypedUI";

const { useSetPartialRowCallback } = TypedUI;

type FantasyTeamFormProps = {
    currentTeam: FantasyTeam;
};

export function FantasyTeamForm({ currentTeam }:FantasyTeamFormProps) {
    const id = currentTeam.id;
    const form = useRef<HTMLFormElement>(null);
    const setFantasyTeam = useSetPartialRowCallback(
        'teams', 
        id, 
        (data:any) => data,
    );
    let activeDelay = new InputDelay(1800, setFantasyTeam);

    const inputListener = (e: any) => {
        const form = e.currentTarget as HTMLFormElement;
        const fantasyTeamID = form.dataset.id as string;
        const data = Object.fromEntries(new FormData(form));

        if (activeDelay.label === fantasyTeamID) {
            activeDelay.cancelDelay();
        }

        activeDelay.startDelay(fantasyTeamID, data);
    }

    return (
        <form name={`teamForm-${id}`} onInput={inputListener} data-id={id} ref={form}>
            <div className="inputGroup">
                <label htmlFor={`teamOwner${id}`}>Team Owner:</label>
                <input type="text" id={`teamOwner${id}`} name="owner" defaultValue={currentTeam.owner}/>
            </div>
            
            <div className="inputGroup">
                <label htmlFor={`teamName${id}`}>Team Name:</label>
                <input type="text" id={`teamName${id}`} name="name" defaultValue={currentTeam.name}/>
            </div>
            
            <div className="inputGroup">
                <label htmlFor={`teamAbbr${id}`}>Team Abbreviation:</label>
                <input type="text" id={`teamAbbr${id}`} name="abbr" defaultValue={currentTeam.abbr}/>
            </div>
        </form>
    )
}
