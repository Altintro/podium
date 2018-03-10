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
    var loadedSports = 0;

    Sport.remove({}, ()=> {

        console.log('Sports data erased');
        
        const sportsJson = require('./sports.json');
        const loadedSports = sportsJson.length;

        if (loadedSports>0) {
            for (var i = 0; i < loadedSports; i++) {
                const sport = sportsJson[i];
                new Sport(sport).save();
            }   
            console.log('Total sports loaded = ', loadedSports);
            return callback(null);            
        } else {
            err = 'JSON sports file is empty!'
            return callback(err);
        }
    });     
}

function initGame() {
    const Game = mongoose.model('Game');
    var loadedGames = 0;

    Game.remove({}, ()=> {

        console.log('Games data erased');
        
        const gamesJson = require('./games.json');
        const loadedGames = gamesJson.length;
      
        for (var i = 0; i < loadedGames; i++) {
            const game = gamesJson[i];
            new Game(game).save();
        }   
    }); 
    return loadedGames;
}



