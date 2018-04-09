'use strict';

//Establezco la conexión de la base de datos
require('../db/connectDb');
//Incluyo mis modelos
require('../models/User');
require('../models/Game');
require('../models/Sport');


const readFile = require('./readFile');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Game = mongoose.model('Game');
const Sport = mongoose.model('Sport');

const sha256 = require('sha256');


function deleteCollection (collection) {

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

//Listener pero solo una vez para logear solo la primera vez que se conecte
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDb.');
    mongoose.connection.db.listCollections().toArray(function (err, collections) {
        if (err) {
            //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
            console.log('Error: ', err.message);
            return;
        }
        collections.forEach(function(collection) {
            deleteCollection(collection)
        })
        loadData()
    });
});

function loadData() {

    const sports = loadSports()
    loadGames(sports)
    loadUsers()
}

async function loadSports() {

    const data =  await readFile('./db/sports.json')
                    .catch(err => {
                        console.log("Error reading Sports json: ", err.message)
                    })
    return await Sport.insertMany(data.sports)
                    .then(function() {
                        console.log("Successfully inserted Sports in DB")
                    }).catch(err => {
                        console.log("Error Inserting Sports: ", err.message)
                    })
}

async function loadGames(sports) {
        //Create games
    const data =  await readFile('./db/games.json')
    var count = 0
    data.games.forEach(function(game) {
        game.sport = sports[count]
        count ++
    })
    await Game.insertMany(data.games)
        .then(function() {
            console.log("Successfully inserted Games in DB")
        }).catch(err => {
            console.log("Error Inserting Games: ", err.message)
        })
}

async function loadUsers() {
    //Create Users
    const data =  await readFile('./db/users.json')
    await User.insertMany(data.users)
        .then(function() {
            console.log("Successfully inserted Users in DB")
        }).catch(err => {
            console.log("Error Inserting Users: ", err.message)
        })
}

