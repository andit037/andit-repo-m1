const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const path = require('path')
const fs = require('fs')

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const initialGameState = {
  wins: 0,
  losses: 0,
  lastResult: null
}

const GS_FILE = path.join(__dirname, 'lucky_wheel_state.json')

const readGameState = () => {
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

const saveGameState = (gs) =>{
  try {
    fs.writeFileSync(GS_FILE, JSON.stringify(gs, null, 2), 'utf-8')
  } catch (error) {
    console.error('Reading saveGameState failed', error)
  }
}

app.get('/api/wheel', (req, res) => {
  console.log(`BE REST Endpoint [/wheel] called by client with IP [${req.ip}]\n`)
  const gs = readGameState()
  res.json(gs)
})

app.post('/api/wheel/spin', (req, res) => {
  console.log(`BE REST Endpoint [/spin] called by client with IP [${req.ip}]\n`)
  //get current gs
  const gs = readGameState()
  //spin (choose from wheelSegment array with 3 values, based on prob.) and save result
  const spinResult = spin()
  //update gs based on spin result
  if (spinResult==='Blank'){
    gs.losses++
  }else{
    gs.wins++
  }
  gs.lastResult = spinResult
  //save updated gs
  saveGameState(gs)
  //return updated gs
  res.json(gs)
})

app.post('/api/wheel/reset', (req, res) => {
  console.log(`BE REST Endpoint [/reset] called by client with IP [${req.id}]\n`)
  //reset gs
  const newEmptyGs = { ...initialGameState}
  //save gs
  saveGameState(newEmptyGs)
  //return empty gs
  res.json(newEmptyGs)  
})

const wheelSegment =[
  {value: 'Blank', weight: 50},
  {value: '1juta', weight: 20},
  {value: '5juta', weight: 10}
]
const spin = () =>{
  try {
    const totalWeight = wheelSegment.reduce((sum,s) => sum+s.weight, 0);
    let randomNumber = Math.random() * totalWeight;
  
    for (const segment of wheelSegment){
      randomNumber -= segment.weight
      if(randomNumber <= 0){
        return segment.value
      }
    }
  } catch (error) {
    console.error('Reading spin failed', error)
  }
}

app.listen(port, () => {
  console.log(`WoF backend running on ${port}`)
  readGameState()
})
