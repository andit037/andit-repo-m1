const mariaDB = require('mariadb')

require('dotenv').config({ 
    path: require('path').resolve(__dirname, '..', '.env') 
});

const pool = mariaDB.createPool({
  host:'localhost',
  user:'root',
  password:'',
  database:'lucky_wheel_db',
  connectionLimit:5
})

const initialGameState = {
  wins: 0,
  losses: 0,
  lastResult: null
}

/**
 * @function readGameState 
 * @description read current gs & return it
 * @returns {Promises<GameState>}
 */
const readGameState = async() => {
  console.log(`mariaDB.readGameState called`)
  let conn;
  try {
    conn = await pool.getConnection()
    const rows = await conn.query('select wins, losses, last_result from game_state order by id desc limit 1')

    if (rows.length === 1){
      return {
        wins: rows[0].wins,
        losses: rows[0].losses,
        last_result: rows[0].last_result,
      }
    }else{
      return {wins:0, losses:0, lastResult:null};
    }

  } catch (error) {
    console.error(`Reading readGameState failed`, error)
    return {wins:0, losses:0, lastResult:null};
  } finally{
    if (conn) conn.end();
  }
}

/**
 * @function saveGameState 
 * @description save gs to data source
 * @returns {Promises<void>}
 */
const saveGameState = async(gs) =>{
  console.log(`mariaDB.saveGameState called`)
  let conn;
  try {
    conn = await pool.getConnection()
    await conn.query('insert into game_state (wins, losses, last_result) values (?, ?, ?)',[gs.wins, gs.losses, gs.last_result]);
  } catch (error) {
    console.error(`Reading saveGameState failed`, error)
  } finally{
    if (conn) conn.end();
  }
}

/**
 * @function resetGameState 
 * @description reset gs in data source to initial value
 * @returns {Promises<GameState>}
 */
const resetGameState = async(gs) =>{
  console.log(`mariaDB.resetGameState called`)
 let conn;
  try {
    conn = await pool.getConnection()
    await conn.query('truncate table game_state')
    return {wins:0, losses:0, lastResult:null};
  } catch (error) {
    console.error(`Reading readGameState failed`, error)
    return {wins:0, losses:0, lastResult:null};
  } finally{
    if (conn) conn.end();
  }
}

module.exports = {
  readGameState,
  saveGameState,
  resetGameState
}