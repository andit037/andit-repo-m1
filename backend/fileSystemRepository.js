const path = require('path')
const fs = require('fs')

const initialGameState = {
  wins: 0,
  losses: 0,
  lastResult: null
}

const GS_FILE = path.join(__dirname, 'lucky_wheel_state.json')

/**
 * @function readGameState 
 * @description read current gs & return it
 * @returns {Promises<GameState>}
 */
const readGameState = async() => {
  console.log(`fileSystem.readGameState called`)
  try {
    if(!fs.existsSync(GS_FILE)){
      saveGameState(initialGameState)
    }
  
    const data = fs.readFileSync(GS_FILE, 'utf-8');
    const gsJson = JSON.parse(data)
    return gsJson;
  } catch (error) {
    console.error(`Reading readGameState failed`, error)
  }
}

/**
 * @function saveGameState 
 * @description save gs to data source
 * @returns {Promises<void>}
 */
const saveGameState = async(gs) =>{
  console.log(`fileSystem.saveGameState called`)
  try {
    fs.writeFileSync(GS_FILE, JSON.stringify(gs, null, 2), 'utf-8')
  } catch (error) {
    console.error('Reading saveGameState failed', error)
  }
}

/**
 * @function resetGameState 
 * @description reset gs in data source to initial value
 * @returns {Promises<GameState>}
 */
const resetGameState = async(gs) =>{
  console.log(`fileSystem.resetGameState called`)
  const newEmptyGs = { ...initialGameState}
  try {
    fs.writeFileSync(GS_FILE, JSON.stringify(newEmptyGs, null, 2), 'utf-8')
    return newEmptyGs
  } catch (error) {
    console.error('Resetting GameState failed', error)
    return initialGameState
  }
}

module.exports = {
  readGameState,
  saveGameState,
  resetGameState
}