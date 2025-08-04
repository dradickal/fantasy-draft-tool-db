export function serialzeTable(tableData:Record<string, Record<string, any>>) {
    const data = JSON.parse(JSON.stringify(tableData));
    for(let key in data) {
        const row = data[key];
        for(let cell in row) {
            const cellValue = row[cell];
            if (Array.isArray(cellValue)) {
                row[cell] = JSON.stringify(cellValue);
            }
        }
    }

    return data;
}