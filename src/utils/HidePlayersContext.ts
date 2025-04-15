import { createContext, useContext } from "react";

export const HidePlayersContext = createContext<boolean | null>(null);

export const useHidePlayers = () => {
    const currentHidePlayers = useContext(HidePlayersContext);

    if (currentHidePlayers === null) {
        throw new Error(
        "useHidePlayers has to be used within <hideDraftedPlayers.Provider>"
        );
    }

    return currentHidePlayers;
};
