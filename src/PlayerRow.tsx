import cn from "classnames";
import { Id } from "tinybase";
import { MouseEvent, useEffect, useState } from "react";
import { useRow, useSetCellCallback } from "tinybase/ui-react";
import { usePositionTable } from "./utils/PositionTableContext";
import { Player } from "./utils/dataTypes";
import { usePersister } from "./utils/PersisterContext";

type PlayerRowProps = {
    rowId: Id;
}

export default function PlayerRow({ rowId }: PlayerRowProps) {
    const positionTable = usePositionTable();
    const persister = usePersister();
    const playerRow = useRow(positionTable, rowId);
    const [player, setPlayer] = useState<Player>();

    
    useEffect(() => {
        if (playerRow) {
            //@ts-ignore
            setPlayer(playerRow as Player);
        }
    }, [playerRow]);

    
    const updateDraftedValue = useSetCellCallback(
        positionTable, 
        rowId, 
        'drafted', 
        (newValue:boolean) => newValue)
    
    const beenDrafted = async (e:MouseEvent, rowId:string) => {
        console.log('Draft Click', rowId);
        updateDraftedValue(true);
        await persister.save();
    }

    return player ? (
        <tr className={cn('player', {visible: !player.drafted})} >
            <td><button id={`${rowId}`} onClick={(e)=>beenDrafted(e, rowId)}>Drafted</button></td>
            <td>{player.rank}</td>
            <td className={cn('playerNameCol', {drafted: player.drafted})}>{player.playerName}</td>
            <td>{player.team}</td>
            <td>{player.byeWeek}</td>
            <td>{player.adp}</td>
        </tr>
    ) : (
        <tr>
            <td colSpan={6}>Loading...</td>
        </tr>
    )
}

//       "playerId": 
//       "drafted": false,
//       "preferred": 0,
//       "tier": 9,
//       "rank": 107,
//       "playerName": "Ben Skowronek",
//       "team": "LAR",
//       "byeWeek": "7",
//       "adp": "-"