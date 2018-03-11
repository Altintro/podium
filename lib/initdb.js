'use strict';

require('../models/User');
require('../models/Game');
require('../models/Sport');

const readLine = require('readline');
const fs = require('fs');
const mongoose = require('mongoose');
const async = require('async');

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/podiumdb')
console.log('Conected to Podium Database')
const dbConn = mongoose.connection

dbConn.on('error', err =>{
    console.log('Database connection error', err)
    process.exit(1)
})

dbConn.once('open', function () {

  const userInteraction = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  userInteraction.question('Database initilization sript will empty DB. Continue? yes/(no) ', function (answer) {
    userInteraction.close();
    if (answer.toLowerCase() === 'yes') {
      dbInit();
    } else {
      console.log('Database initialization aborted! Type complete word "yes" to initializate DB');
      return process.exit(0);      
    }
  });
});

function dbInit() {

    async.series([
        initUser,
        initSport
            //initGame()
      ], (err) => {
        if (err) {
          console.error('Error initializating DB: ', err);
          return process.exit(1);
        }
  
        return process.exit(0);
      }
    );    
}

function initUser (callback) {

    const User = mongoose.model('User');
    
    User.remove({}, ()=> {

        console.log('Users data erased');
        
        const jsonUserFile = './users.json'

        loadUsersFromJson(jsonUserFile).then(totalUsers => {
            console.log('Total users loaded = ', totalUsers);
            return callback(null, totalUsers);
        }).catch(err => callback(err) );
    });
}

async function loadUsersFromJson(jsonFile) {
    
    const User = mongoose.model('User');
    const users = require(jsonFile);
    console.log('Loading users from JSON file ', jsonFile, '...');    
    

    if (!users) {
        throw new Error('JSON is empty or JSON not found!');
    }

    const loadedUsers = users.length;

    for (var i = 0; i < loadedUsers; i++) {
        await (new User(users[i])).save();
    }

    return loadedUsers;
}

function initSport(callback) {
    
    const Sport = mongoose.model('Sport');    
    Sport.remove({}, ()=> {

        console.log('Sports data erased');
        
        const jsonSportsFile = './sports.json';

        loadSportsFromJson(jsonSportsFile).then(totalSports => {
            console.log('Total sports loaded = ', totalSports);
            return callback(null, totalSports);
        }).catch(err => callback(err) );
    });     
}

async function loadSportsFromJson(jsonFile) {

    const Sport = mongoose.model('Sport');
    const sports = require(jsonFile);
    console.log('Loading sports from JSON file ', jsonFile, '...');    

    if (!sports) {
        throw new Error('JSON is empty or JSON not found!');
    }
    const loadedSports = sports.length;

    for (var i = 0; i < loadedSports; i++) {
        await (new Sport(sports[i])).save();
    }

    return loadedSports;    
}

function initGame(callback) {
    
    const Game = mongoose.model('Game');    
    Game.remove({}, ()=> {

        console.log('Games data erased');
        
        const jsonGamesFile = './games.json';

        loadGamesFromJson(jsonGamesFile).then(totalGames => {
            console.log('Total sports loaded = ', totalGames);
            return callback(null, totalGames);
        }).catch(err => callback(err) );
    });     
}

async function loadGamesFromJson(jsonFile) {

    const Game = mongoose.model('Game');    
    const games = require(jsonFile);
    console.log('Loading games from JSON file ', jsonFile, '...');    

    if (!games) {
        throw new Error('JSON is empty or JSON not found!');
    }
    const loadedGames = games.length;

    for (var i = 0; i < loadedGames; i++) {
        await (new Game(games[i])).save();
    }

    return loadedGames;    
}




