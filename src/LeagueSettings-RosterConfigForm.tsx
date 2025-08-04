import { useEffect } from "react";
import type { RosterConfig, RosterLabels, RosterLabelSettings } from "./types/LeagueSettings";
import TypedUI from "./utils/TypedUI";
import { RosterCountInput } from "./LeagueSettings.RosterCountInput";

const {useTable, useSetTableCallback } = TypedUI;

export default function RosterConfigForm() {
    let roster = useTable('rosterConfig')  as any;
    console.log(roster);
    const flexTypes = roster.flex.allowed;
    const totalCount = Object.values(roster as RosterConfig).reduce((total, v) => total + v.count, 0);
    const setRosterConfig = useSetTableCallback(
        'rosterConfig',
        (data:any) => data,
    );

    return (
        <div className="leagueSettings-content rosterConfig">
            <fieldset>
                <legend>Total Roster Spots</legend>
                <span>{totalCount}</span>
            </fieldset>
            <form name="leagueRoster">
                <div className="inputGroup">
                    <label htmlFor="qb">Quarterbacks:</label>
                    <input type="number" id="qb" name="qb-count" defaultValue={roster.qb.count} />
                </div>
                <div className="inputGroup">
                    <label htmlFor="rb">Running Backs:</label>
                    <input type="number" id="rb" name="rb-count" defaultValue={roster.rb.count} />
                </div>
                <div className="inputGroup">
                    <label htmlFor="wr">Wide Recievers:</label>
                    <input type="number" id="wr" name="wr-count" defaultValue={roster.wr.count} />
                </div>
                <div className="inputGroup">
                    <label htmlFor="te">Tight Ends:</label>
                    <input type="number" id="te" name="te-ount" defaultValue={roster.te.count} />
                </div>
                <div className="inputGroup">
                    <label htmlFor="flex">Flex Players:</label>
                    <input type="number" id="flex" name="flex-count" defaultValue={roster.flex.count} />
                </div>
                <div className="inputGroup">
                    <label htmlFor="k">Kickers:</label>
                    <input type="number" id="k" name="k-count" defaultValue={roster.k.count} />
                </div>
                <div className="inputGroup">
                    <label htmlFor="def">Defenses:</label>
                    <input type="number" id="def" name="def-count" defaultValue={roster.def.count} />
                </div>
                <div className="inputGroup">
                    <label htmlFor="bench">Bench Players:</label>
                    <input type="number" id="bench" name="bench-count" defaultValue={roster.bench.count} />
                </div>
            </form>

            <form name="flexPositions">
                <fieldset>
                    <legend>Allowed Flex Positions:</legend>
                    <div className="checkbox">
                        <div className="inputGroup">
                            <input type="checkbox" id="flexRB" name="flex-type" value="rb" defaultChecked={flexTypes.includes('rb')} />
                            <label htmlFor="flexRB">RB</label>
                        </div>
                        <div className="inputGroup">
                            <input type="checkbox" id="flexWR" name="flex-type" value="wr" defaultChecked={flexTypes.includes('wr')} />
                            <label htmlFor="flexWR">WR</label>
                        </div>
                        <div className="inputGroup">
                            <input type="checkbox" id="flexTE" name="flex-type" value="te" defaultChecked={flexTypes.includes('te')} />
                            <label htmlFor="flexTE">TE</label>
                        </div>
                        <div className="inputGroup">
                            <input type="checkbox" id="flexQB" name="flex-type" value="qb" defaultChecked={flexTypes.includes('qb')} />
                            <label htmlFor="flexQB">QB</label>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    );
}
