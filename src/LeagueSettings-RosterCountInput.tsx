import { PropsWithChildren, useEffect, useState } from "react";
import { Position } from "./types/Common"

type RosterSlot = 'BENCH' | 'FLEX' | Position;

type Params = {
    rosterSlot: RosterSlot, 
    start: number, 
    limit: number,
    syncLimit?: boolean,
};

type RosterInputParams = PropsWithChildren<Params>;


export function RosterInput({ rosterSlot, start, limit, syncLimit = false, children }:RosterInputParams) {
    const [limitValue, setLimitValue] = useState<number>(limit);
    
    useEffect(() => {
        if (syncLimit) {
            setLimitValue(start);
        }
    }, []);

    function handleSyncedChange (e: React.ChangeEvent<HTMLInputElement>) {
        if (syncLimit) {
            setLimitValue(parseInt(e.target.value));
        }
    }

    return (
        <div className="rosterInputGroup">
            <div className="inputGroup">
                <label htmlFor={`${rosterSlot}-start`}>{rosterSlot} Starters:</label>
                <input type="number" 
                    id={`${rosterSlot}-start`} 
                    name={`${rosterSlot}-start`} 
                    defaultValue={start} 
                    onChange={handleSyncedChange}/>
            </div>
            <div className="inputGroup">
                <label htmlFor={`${rosterSlot}-limit`}>{rosterSlot} Limit:</label>
                <input type="number" 
                    id={`${rosterSlot}-limit`} 
                    name={`${rosterSlot}-limit`} 
                    value={limitValue} 
                    onChange={(e) => setLimitValue(parseInt(e.target.value))} 
                    disabled={syncLimit}/>
            </div>
            {children}
        </div>
    );
}