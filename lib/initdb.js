'use strict';

//Include required models
require('../models/User');
require('../models/Game');
require('../models/Sport');

const readFile = require('./readFile');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Game = mongoose.model('Game');
const Sport = mongoose.model('Sport');

const conn = mongoose.connection;

//Establish promise library
mongoose.Promise = global.Promise;

//Listen to possible errors on db connnection
conn.on('error', err => {
    console.log('Error connecting to db', err);
    process.exit(1);
});

mongoose.connect('mongodb://localhost/podiumdb');


function deleteCollection(collection) {
    //Listen to possible errors on db connnection
    conn.on('error', err => {
        console.log('Error connecting to db', err);
        process.exit(1);
    });

    return new Promise((resolve, reject) => {
        mongoose.connection.db.dropCollection(collection.name)
            .then(() => {
                console.log('Previouse collection deleted: ', collection.name);
                resolve();
            })
            .catch(err => {
                reject(err);
            });
    });
}


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDb.');
    mongoose.connection.db.listCollections().toArray(function (err, collections) {
        if (err) {
            console.log('Error: ', err.message);
            return;
        }
        //Delete previously created collections
        collections.forEach(function (collection) {
            deleteCollection(collection)
        })
        loadData()
    });
});



async function loadData() {

    var sportsCallBack = function(sports) {
        loadGames(sports)
        loadUsers()
    }

    const sports = await loadSports(sportsCallBack)
}



async function loadSports(sportsCallBack) {

    const data = await readFile('./db/sports.json')
        .catch(err => {
            console.log("Error reading Sports json: ", err.message)
        })
    await Sport.insertMany(data.sports)
        .then(savedSports => {
            console.log("Successfully inserted Sports in DB")
            sportsCallBack(savedSports)
        })
        .catch(err => {
            console.log("Error Inserting Sports json: ", err.message)
        })
}

async function loadGames(sports) {
    //Create games
    const data = await readFile('./db/games.json')
    var count = 0
    data.games.forEach(function (game) {
        game.sport = sports[count]
        count++
    })
    await Game.insertMany(data.games)
        .then(function () {
            console.log("Successfully inserted Games in DB")
        }).catch(err => {
            console.log("Error Inserting Games: ", err.message)
        })
}

async function loadUsers() {
    //Create Users
    const data = await readFile('./db/users.json')
    await User.insertMany(data.users)
        .then(function () {
            console.log("Successfully inserted Users in DB")
        }).catch(err => {
            console.log("Error Inserting Users: ", err.message)
        })
}

