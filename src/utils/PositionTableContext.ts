import { createContext, useContext } from "react";
import { type Position } from "../stores/PlayersStore";

export const PositionTableContext = createContext<Position | null>(null);

export const usePositionTable = () => {
    const currentPositionTable = useContext(PositionTableContext);

    if (!currentPositionTable) {
        throw new Error(
        "usePositionTable has to be used within <PositionTableContext.Provider>"
        );
    }

    return currentPositionTable;
};
