const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000

app.use(cors())

app.use(express.json())

const repo = require('./repository')

app.get('/api', async(req, res) => {
  console.log(`BE REST Endpoint [/] called by client with IP [${req.ip}]\n`)
  const gs = await repo.readGameState()
  res.json(gs)
})

app.post('/api/spin', async(req, res) => {
  console.log(`BE REST Endpoint [/spin] called by client with IP [${req.ip}]\n`)
  //get current gs
  const gs = await repo.readGameState()
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
  repo.saveGameState(gs)
  //return updated gs
  res.json(gs)
})

app.post('/api/reset', async (req, res) => {
  console.log(`BE REST Endpoint [/reset] called by client with IP [${req.ip}]\n`)
  //reset gs
  const newEmptyGs = await repo.resetGameState()
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
    console.error('spinning wheel failed', error)
  }
}

app.listen(port, () => {
  console.log(`WoF backend running on ${port}`)
  repo.readGameState()
})
