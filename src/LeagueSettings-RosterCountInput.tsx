import { PropsWithChildren } from "react";
import { Position } from "./types/Common"

type RosterSlot = 'BENCH' | 'FLEX' | Position;

type Params = {
    rosterSlot: RosterSlot, 
    start: number, 
    limit: number
};

type RosterInputParams = PropsWithChildren<Params>;


export function RosterInput({ rosterSlot, start, limit, children }:RosterInputParams) {
    return (
        <div className="rosterInputGroup">
            <div className="inputGroup">
                <label htmlFor={`${rosterSlot}-start`}>{rosterSlot} Starters:</label>
                <input type="number" id={`${rosterSlot}-start`} name={`${rosterSlot}-start`} defaultValue={start} />
            </div>
            <div className="inputGroup">
                <label htmlFor={`${rosterSlot}-limit`}>{rosterSlot} Limit:</label>
                <input type="number" id={`${rosterSlot}-limit`} name={`${rosterSlot}-limit`} defaultValue={limit} />
            </div>
            {children}
        </div>
    );
}