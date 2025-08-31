import cn from "classnames";
import { useRef, type RefObject } from "react";
import { useSetSettingsValueCallback, useSettingsValue } from "./stores/SettingsStore"
import { urlParams } from './utils/urlParams';

interface HeaderProps {
    dialogRef: RefObject<HTMLDialogElement>;
}

export const Header = ({ dialogRef }: HeaderProps) => {
    const years = [2025, 2024, 2022];
    const yearSelectRef = useRef<HTMLSelectElement>(null);
    const selectedYear = useSettingsValue('selectedYear');
    const hideDraftedPlayers = useSettingsValue('hideDraftedPlayers');

    const handleYearChange = useSetSettingsValueCallback('selectedYear', () => {
        return parseInt(yearSelectRef.current?.value as string);
    });
    const handleHidePlayers = useSetSettingsValueCallback('hideDraftedPlayers', () => !hideDraftedPlayers);

    const resetData = () => {
        localStorage.removeItem(`DraftTool${selectedYear}`);
        location.reload();
    };

    const openModal = () => {
        dialogRef.current?.showModal();
    }

    return (
        <header>
            <div className='header-title'>
                <img className='header-icon' src={import.meta.env.BASE_URL + 'favicon.svg'} alt='American Football' />
                <h1>Fantasy Draft Tool</h1>
            </div>
            <div className='header-tools'>
                <select ref={yearSelectRef} id='draft-year' className='draft-year' name='draft-year' defaultValue={selectedYear} onChange={handleYearChange}>
                    {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <div className='input-group'>
                    <label className='hide-players' htmlFor='hide-players'>
                        <input type='checkbox' id='hide-players' name='hide-players' onChange={handleHidePlayers} checked={hideDraftedPlayers} />
                        Hide Drafted Players
                    </label>
                </div>
                <div className='input-group'>
                    <button className='open-settings' onClick={openModal}>Settings</button>
                </div>
                <div className='input-group'>
                    <button className={cn('resetData', { visible: urlParams.reset == 1 })} onClick={resetData}>Reset Data</button>
                </div>
            </div>
        </header>
    )
}