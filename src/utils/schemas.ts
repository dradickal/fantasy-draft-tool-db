

export const valuesSchema = { 
    teamCount: { type: 'number', default: 12 },
    selectedYear: { type: 'number', default: 2024 }, 
    hideDraftedPlayers: { type: 'boolean', default: true },
} as const;

export const tablesSchema = {
    
}