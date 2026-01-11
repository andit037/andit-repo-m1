//load env config
require('dotenv').config({
    path: require('path').resolve(__dirname, '..', '.env')
});

//load db_type to choose which repo to use
const REPO_TYPE = process.env.DB_TYPE || 'filesytem' ;

let repo;

if(REPO_TYPE==='mariaDB'){
  console.log('Loading mariaDB at a runtime')
  repo = require('./mariaDbRepository')
}else{
  console.log('Loading filesystem as data source at runtime')
  repo = require('./fileSystemRepository')
}

module.exports= repo;