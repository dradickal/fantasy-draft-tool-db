// import { useIndexes, useQueries, useSliceIds } from "tinybase/ui-react";
import PlayerTier from "./PlayerTier";;
import { useEffect } from "react";
import { usePositionTable } from "./utils/PositionTableContext";
import { setTierIndex } from "./utils/indexes";
import { setTierDraftCountQuery } from "./utils/queries";
import TypedUI from "./utils/TypedUI";

const { useIndexes, useQueries, useSliceIds } = TypedUI;

export default function PlayerTable() {
    const positionTable = usePositionTable();
    const headerText = [null, 'Rank', 'Player', 'Team', 'Bye', 'ADP'];
    const tierIndex = `${positionTable}tierIndex`;
    const draftCountQuery = `${positionTable}draftCountQuery`;
    
    const queries = useQueries();
    const indexes = useIndexes();

    const indexTierIds = useSliceIds(tierIndex);

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