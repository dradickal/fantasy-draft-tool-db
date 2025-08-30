
export const Header = () => {
    return (
        <header>
          <div className='header-title'>
            <img className='header-icon' src={import.meta.env.BASE_URL+'favicon.svg'} alt='American Football'/>
            <h1>Fantasy Draft Tool</h1>
          </div>
          <div className='header-tools'>
            <select id='draft-year' className='draft-year' name='draft-year' defaultValue={years[0]} onChange={handleYearChange}>
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
              <button className={cn('resetData',{ visible: urlParams.reset == 1})} onClick={resetData}>Reset Data</button>
            </div>
          </div>
        </header>
    )
}