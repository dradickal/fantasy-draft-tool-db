import type { RosterConfig } from "./types/LeagueSettings";
import { RosterInput } from "./LeagueSettings-RosterCountInput";
import { 
    useRosterConfigTable, 
} from "./stores/SeasonConfigStore";

export default function RosterConfigForm() {
    const rosterTable = useRosterConfigTable();
    const roster: RosterConfig = Object.assign({}, rosterTable) as any;
    const flexTypes = roster.FLEX.allowed.split(',');
    const totalCount = Object.values(roster).reduce((total, v) => total + v.start, 0);
    // const setRosterConfigTable = useRosterConfigSetTableCallback(
    //     (data:any) => data,
    // );

    return (
        <div className="leagueSettings-content rosterConfig">
            <fieldset>
                <legend>Total Roster Spots</legend>
                <span>{totalCount}</span>
            </fieldset>
            <form name="leagueRoster">
                <RosterInput rosterSlot="QB" start={roster.QB.start} limit={roster.QB.limit} />
                <RosterInput rosterSlot="RB" start={roster.RB.start} limit={roster.RB.limit} />
                <RosterInput rosterSlot="WR" start={roster.WR.start} limit={roster.WR.limit} />
                <RosterInput rosterSlot="TE" start={roster.TE.start} limit={roster.TE.limit} />
                <RosterInput rosterSlot="K" start={roster.K.start} limit={roster.K.limit} />
                <RosterInput rosterSlot="DEF" start={roster.DEF.start} limit={roster.DEF.limit} />
                <RosterInput rosterSlot="FLEX" start={roster.FLEX.start} limit={roster.FLEX.limit}>
                    <fieldset>
                        <legend>Allowed Flex Positions:</legend>
                        <div className="checkbox">
                            <div className="inputGroup">
                                <input type="checkbox" id="flexRB" name="flex-type" value="rb" defaultChecked={flexTypes.includes('RB')} />
                                <label htmlFor="flexRB">RB</label>
                            </div>
                            <div className="inputGroup">
                                <input type="checkbox" id="flexWR" name="flex-type" value="wr" defaultChecked={flexTypes.includes('WR')} />
                                <label htmlFor="flexWR">WR</label>
                            </div>
                            <div className="inputGroup">
                                <input type="checkbox" id="flexTE" name="flex-type" value="te" defaultChecked={flexTypes.includes('TE')} />
                                <label htmlFor="flexTE">TE</label>
                            </div>
                            <div className="inputGroup">
                                <input type="checkbox" id="flexQB" name="flex-type" value="qb" defaultChecked={flexTypes.includes('QB')} />
                                <label htmlFor="flexQB">QB</label>
                            </div>
                        </div>
                    </fieldset>
                </RosterInput>
                <RosterInput rosterSlot="BENCH" start={roster.BENCH.start} limit={roster.BENCH.limit} />
                
            </form>
        </div>
    );
}
