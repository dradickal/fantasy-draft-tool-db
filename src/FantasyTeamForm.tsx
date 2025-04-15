import { useRef } from "react";
import type { FantasyTeam } from "./types/LeagueSettings";

type FantasyTeamFormProps = {
    teamCount: number;
    currentTeam: FantasyTeam;
    setFantasyTeam: (fantasyTeam:FantasyTeam) => void;
}

export function FantasyTeamForm({ teamCount, currentTeam, setFantasyTeam }:FantasyTeamFormProps) {
    const form = useRef<HTMLFormElement>(null);
    const i = currentTeam.order;

    function submitTeamForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const fantasyTeam = Object.fromEntries(new FormData(form).entries()) as unknown as FantasyTeam;
        
    }

    function inputListener(e:any) {
        console.log(e.currentTarget);
        console.log(`${e.currentTarget.getAttribute("name")}:${e.target.name}:`, e.target.value);
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
                <label htmlFor={`teamName${i}`}>Team Name:</label>
                <input type="text" id={`teamName${i}`} name="name" defaultValue={currentTeam.name}/>
            </div>
            
            <div className="inputGroup">
                <label htmlFor={`teamAbbr${i}`}>Team Abbreviation:</label>
                <input type="text" id={`teamAbbr${i}`} name="abbr" defaultValue={currentTeam.abbr}/>
            </div>

            <div className="inputGroup">
                <label htmlFor={`teamOwner${i}`}>Team Owner:</label>
                <input type="text" id={`teamOwner${i}`} name="owner" defaultValue={currentTeam.owner}/>
            </div>
            <input type="submit" value="Save Team" />
        </form>
    )
}