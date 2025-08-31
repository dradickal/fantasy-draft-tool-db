// import { useIndexes, useQueries, useSliceIds } from "tinybase/ui-react";
import PlayerTier from "./PlayerTier";;
import { useEffect } from "react";
import { usePositionTable } from "./utils/PositionTableContext";
import { 
    usePlayersIndexes, 
    usePlayersQueries, 
    usePlayersSliceIds, 
    setTierIndex,
    setTierDraftCountQuery,
} from "./stores/PlayersStore";

export default function PlayerTable() {
    const positionTable = usePositionTable();
    const headerText = [null, 'Rank', 'Player', 'Team', 'Bye', 'ADP'];
    const tierIndex = `${positionTable}tierIndex`;
    const draftCountQuery = `${positionTable}draftCountQuery`;
    
    const queries = usePlayersQueries();
    const indexes = usePlayersIndexes();

    const indexTierIds = usePlayersSliceIds(tierIndex);

    useEffect(() => {
        if (queries) {
            setTierDraftCountQuery(queries, draftCountQuery, positionTable)
        }
    }, [queries])
    
    useEffect(() => {
        if (indexes) {
            setTierIndex(indexes, tierIndex, positionTable);
        }
    }, [indexes]);

    return (
        <>
            <h2>{positionTable} Rankings</h2>
            <table>
                <thead>
                    <tr>{headerText.map((text, i) => (<th key={text || `empty${i}`}>{text}</th>))}</tr>
                </thead>
                <tbody>{
                    indexTierIds.map((id) => {
                        return (<PlayerTier tier={id} indexNames={{tierIndex}} queryNames={{draftCountQuery}} key={'tier'+ id}/>);
                    })
                }</tbody>
            </table>
        </>
    ) 
}