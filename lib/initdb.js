'use strict';

require('../models/User');
require('../models/Game');
require('../models/Sport');

const readLine = require('readline');
const mongoose = require('mongoose');

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

  userInteraction.question('Database initilization sript will delete all records. Continue? (Enter = no) ', function (answer) {
    userInteraction.close();
    if (answer.toLowerCase() === 'yes') {
      dbInit();
    } else {
      console.log('Database initialization aborted!');
    }
    return process.exit(0);  
  });

  return;

});

function dbInit() {

    initUser();
    initSport();
    initGame();
    return;
}

function initUser() {
    const User = mongoose.model('User');

    User.remove({}, ()=> {

        console.log('User data erased');
        
        const usersJson = require('./users.json');
        const loadedUsers = usersJson.length;
      
        for (var i = 0; i < loadedUsers; i++) {
            const user = usersJson[i];
            new User(user).save();
        }   
        
        console.log('Total users loaded = ', loadedUsers);
        return;
    }); 
    return;
}

function initSport() {
    const Sport = mongoose.model('Sport');

    Sport.remove({}, ()=> {

        console.log('Sports data erased');
        
        const sportsJson = require('./sports.json');
        const loadedSports = sportsJson.length;
      
        for (var i = 0; i < loadedSports; i++) {
            const sport = gamesJson[i];
            new Sport(sport).save();
        }   
        
        console.log('Total sports loaded = ', loadedSports);
        return;
    }); 
    return;
}

function initGame() {
    const Game = mongoose.model('Game');

    Game.remove({}, ()=> {

        console.log('Games data erased');
        
        const gamesJson = require('./games.json');
        const loadedGames = gamesJson.length;
      
        for (var i = 0; i < loadedGames; i++) {
            const game = gamesJson[i];
            new Game(game).save();
        }   
        
        console.log('Total games loaded = ', loadedGames);
        return;
    }); 
    return;
}



    






