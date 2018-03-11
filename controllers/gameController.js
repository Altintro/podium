'use_strict'
const Game = require('../models/Game')
const Team = require('../models/Team')
const User = require('../models/User')
const Sport = require('../models/Sport')

exports.getGames = (req, res, next) => {

    const limit = parseInt(req.query.limit)
    const sort = req.query.sort
    const filter = {}

    Game.find(filter)
        .limit(limit)
        .sort(sort)
        .populate('participants')
        .exec().then((games) => {
            return res.json({ result: games })
        }).catch((err) => {
            return next(err)
        })
}

exports.postGame = (req, res, send) => {

    Team.create({
        players:[{ _id: req.userId }]
    }).then((team) => {
        return Game.create({
            name: req.body.name,
            participants: [team._id]
        })
    }).then((game) => {
        var query = { _id: req.userId }
        var operation = { $push: { gamesPlaying: game._id }}
        return User.update(query,operation)
    }).then((user) => {
        res.json({success: 'Game created successfully'})
    }).catch((err) => {
        res.json({error: 'Error creating game',err})
    })
}

exports.signUpGame = (req, res, send) => {
    Team.create({
        players: [{ _id: req.userId}]
    }).then((team) => {
        var query = { _id: req.params.id }
        var operation = { $push: { participants: team._id }}
        return Game.update(query,operation)
    }).then((game) => {
        var query = { _id: req.userId }
        var operation = { $push: { gamesPlaying: req.params.id }}
        return User.update(query,operation)
    }).then(() => {
        return res.json({success: 'User signed-up to game'})
    }).catch((err) => {
        return res.json({error: 'Error signing-up to game', err})
    })
}

exports.deleteGame =  (req,res,next) => {
 
    var query = { _id: req.params.id }
    Game.deleteOne(query).then(() => {
        return res.json({ deleted: true })
    }).catch((err) => {
        return next(err)
    })
}