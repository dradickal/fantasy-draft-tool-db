import { Indexes } from "tinybase/indexes"



export function setTierIndex(indexes: Indexes, indexName:string, posTable: string) {
    indexes.setIndexDefinition(
        indexName,
        posTable,
        'tier'
    ); 
}

export function setDraftedIndex(indexes: Indexes, indexName:string, posTable: string) {
    indexes.setIndexDefinition(
        indexName,
        posTable,
        'drafted'
    );
}