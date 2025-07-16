import { createContext, useContext } from "react";
import { NoTablesSchema, Persister } from "tinybase/with-schemas";
import { valuesSchema } from "./schemas";

export const PersisterContext = createContext<Persister<[NoTablesSchema, typeof valuesSchema]> | null | undefined>(null);

export const usePersister = () => {
    const currentPersister = useContext(PersisterContext);

    if (currentPersister === null) {
        throw new Error(
        "usePersister has to be used within <PersisterContext.Provider>"
        );
    }

    return currentPersister;
};