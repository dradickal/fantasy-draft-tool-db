import { Indexes } from "tinybase/indexes/with-schemas"
import { NoTablesSchema } from "tinybase/with-schemas";
import { valuesSchema } from "./schemas";



export function setTierIndex(indexes: Indexes<[NoTablesSchema, typeof valuesSchema]>, indexName:string, posTable: string) {
    indexes.setIndexDefinition(
        indexName,
        posTable,
        'tier'
    ); 
}

export function setDraftedIndex(indexes: Indexes<[NoTablesSchema, typeof valuesSchema]>, indexName:string, posTable: string) {
    indexes.setIndexDefinition(
        indexName,
        posTable,
        'drafted'
    );
}