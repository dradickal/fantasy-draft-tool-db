import PlayerRow from "./PlayerRow";
import { useEffect, useState } from "react";
import { usePlayersSliceRowIds, usePlayersResultTable } from "./stores/PlayersStore";
import './playerTier.scss';

type PlayerTierProps = {
    tier: string; // comes from index SliceID
    indexNames: { tierIndex: string },
    queryNames: { draftCountQuery: string }
}

export default function PlayerTier({ tier, indexNames, queryNames}: PlayerTierProps) {
    const tierNum = Number(tier);
    const resultTable = usePlayersResultTable(queryNames.draftCountQuery);
    const [undraftedCount, setUndraftedCount] = useState(0);

    const playerRows = usePlayersSliceRowIds(indexNames.tierIndex, tier);
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
