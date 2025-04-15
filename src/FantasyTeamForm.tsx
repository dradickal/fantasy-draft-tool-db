import { useRef } from "react";
import type { FantasyTeam } from "./types/LeagueSettings";

type FantasyTeamFormProps = {
    teamCount: number;
    currentTeam: FantasyTeam;
    setFantasyTeam: (fantasyTeam:FantasyTeam) => void;
}

type DelayLabel = string | null;
type DelayId = number | null;


class InputDelay {
    delay:number
    timeoutId:DelayId = null;
    label:DelayLabel = null;

    constructor(delay:number = 1000) {
        this.delay = delay;
    }

    startDelay(label:DelayLabel, inputValue:string) {
        this.label = label;
        this.timeoutId = setTimeout((v:string, l:string) => {
            console.log(l, v);
        }, this.delay, inputValue, label);
    }

    cancelDelay() {
        if(this.timeoutId === null) return;
        clearTimeout(this.timeoutId as number);
    }
}

export function FantasyTeamForm({ teamCount, currentTeam, setFantasyTeam }:FantasyTeamFormProps) {
    const form = useRef<HTMLFormElement>(null);
    const i = currentTeam.order;
    let activeDelay = new InputDelay(1800);

    function submitTeamForm(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const fantasyTeam = Object.fromEntries(new FormData(form).entries()) as unknown as FantasyTeam;
        
    }

    function inputListener(e:any) {
        const form = e.currentTarget as HTMLFormElement;
        const fantasyTeamID = form.dataset.id;
        const label = `${fantasyTeamID}:${e.target.name}`;
        
        if (activeDelay.label === label) {
            activeDelay.cancelDelay();
        }

        activeDelay.startDelay(label, e.target.value);
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