import { createContext, useContext } from "react";

export const PositionTableContext = createContext<string | null>(null);

export const usePositionTable = () => {
    const currentPositionTable = useContext(PositionTableContext);

    if (!currentPositionTable) {
        throw new Error(
        "usePositionTable has to be used within <PositionTableContext.Provider>"
        );
    }

    return currentPositionTable;
};