'use strict';

require('../models/User');
require('../models/Tournament');

const readLine = require('readline');
const filesystem = require('fs');
const async = require('async');
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


function initTournament() {
    const Tournament = mongoose.model('Tournament');

    Tournament.remove({}, ()=> {

        console.log('Tournament data erased');
        
        const tournamentsJson = require('./tournaments.json');
        const loadedTournaments = tournamentsJson.length;
      
        for (var i = 0; i < loadedTournaments; i++) {
            const tournament = tournamentsJson[i];
            new Tournament(tournament).save();
        }   
        
        console.log('Total tournaments loaded = ', loadedTournaments);
        return;
    }); 
    return;
}



    






