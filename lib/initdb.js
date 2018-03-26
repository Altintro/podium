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

function serie(collections, fn, callbackFinal) {
    
    if (collections.length == 0) {
        callbackFinal();
        return;
    }

    fn(collections.shift())
        .then(() => {
            serie(collections, fn, callbackFinal);
        })
        .catch(err => {
            //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
            console.log('Error : ', err);
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
        //Serie para recorrer las colecciones en forma asincrona y elmminarlas
        serie(collections, deleteCollection, () => {
            //Cargo la data una vez que se que todas las colecciones previas fueron eliminadas
            console.log("Entra serie")
            loadData();
        });
    });
});

function loadData() {

    //Create Users
    readFile('./db/users.json')
        .then((data) => {

            //Hashing passwords with sha256 before saving them on the db
            data.users.forEach(function(user) {
                user.pass = sha256(user.pass);
            });

            //Guardo los anuncios en la db
            User.insertMany(data.users)
                .then(savedUsers => {
                    console.log('Users: ', savedUsers, 'successfully saved in db');
                })
                .catch(err => {
                    //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                    console.log('Error: ', err.message);  //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                });

        }).catch(err => {
            console.log('Error: ', err.message);
        });

        //Create games
        readFile('./db/games.json')
        .then((data) => {

            //Guardo los anuncios en la db
            Game.insertMany(data.games)
                .then(savedGames => {
                    console.log('Games: ', savedGames, 'successfully saved in db');
                })
                .catch(err => {
                    //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                    console.log('Error: ', err.message);  //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                });

        }).catch(err => {
            console.log('Error: ', err.message);
        });

        //Create Sports
        readFile('./db/sports.json')
        .then((data) => {

            //Guardo los anuncios en la db
            Sport.insertMany(data.sports)
                .then(savedSports => {
                    console.log('Sports: ', savedSports, 'successfully saved in db');
                })
                .catch(err => {
                    //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                    console.log('Error: ', err.message);  //Mando el error a la consola porque este script es ejecutado solo por consola para inicializar la db
                });

        }).catch(err => {
            console.log('Error: ', err.message);
        });
}

