import { createContext, useContext } from "react";
import { Persister } from "tinybase";

export const PersisterContext = createContext<Persister | null>(null);

export const usePersister = () => {
    const currentPersister = useContext(PersisterContext);

    if (!currentPersister) {
        throw new Error(
        "usePersister has to be used within <PersisterContext.Provider>"
        );
    }

    return currentPersister;
};