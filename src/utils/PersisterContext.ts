import { createContext, useContext } from "react";
import { Persister, Persists } from "tinybase/persisters/with-schemas";
import { PlayersSchema } from "../stores/PlayersStore";

export const PersisterContext = createContext<Persister<PlayersSchema, Persists.StoreOrMergeableStore> | null | undefined>(null);

export const usePersister = () => {
    const currentPersister = useContext(PersisterContext);

    if (currentPersister === null) {
        throw new Error(
        "usePersister has to be used within <PersisterContext.Provider>"
        );
    }

    return currentPersister;
};