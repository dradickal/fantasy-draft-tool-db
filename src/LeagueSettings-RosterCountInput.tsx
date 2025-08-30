
type RosterCountInputParams = {
    label: string,
    count: number,
    pos: string,
}

export function RosterCountInput({ label, count, pos }:RosterCountInputParams) {
    return (
        <div className="inputGroup">
            <label htmlFor={pos}>{label}:</label>
            <input type="number" id={pos} name={`${pos}-count`} defaultValue={count} />
        </div>
    );
}