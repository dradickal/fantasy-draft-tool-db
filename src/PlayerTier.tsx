import PlayerRow from "./PlayerRow";
import { useResultTable, useSliceRowIds } from "tinybase/ui-react";
import { useEffect, useState } from "react";

type PlayerTierProps = {
    tier: string; // comes from index SliceID
    indexNames: { tierIndex: string },
    queryNames: { draftCountQuery: string }
}

export default function PlayerTier({ tier, indexNames, queryNames}: PlayerTierProps) {
    const tierNum = Number(tier);
    const resultTable = useResultTable(queryNames.draftCountQuery);
    const [undraftedCount, setUndraftedCount] = useState(0);

    const playerRows = useSliceRowIds(indexNames.tierIndex, tier);
    const [tierCount, setTierCount] = useState(0);

    useEffect(() => {
        let resultCount = 0;
        if (resultTable) {
            for (const [rowId, row] of Object.entries(resultTable)) {
                if(row['tier'] === tierNum) {
                    resultCount = Number(row['undraftedCount']);
                }
            }
            setUndraftedCount(resultCount);
        }
    }, [resultTable])

    useEffect(() => {
        setTierCount(playerRows.length);
    }, [playerRows]);

    return (
        <>
            <tr className="tier"><td colSpan={6}>Tier {tier} ({undraftedCount} of {tierCount})</td></tr>
            {playerRows.map((rowId) => (
                <PlayerRow 
                    rowId={rowId} 
                    key={rowId} />
            ))}
        </>
    );
}
