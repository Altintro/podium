'use_strict'
const Game = require('../models/Game')
const Team = require('../models/Team')
const User = require('../models/User')
const Sport = require('../models/Sport')

function mapBasicGame(game) {
    return {
        _id: game.id,
        name: game.name,
        sport: game.sport,
        levelAverage: game.levelAverage,
        open: game.open,
        modality: game.modality
    }
}

exports.getGames = async (req, res, next) => {
    const limit = parseInt(req.query.limit)
    const sort = req.query.sort
    const filter = {}
    var games = await Game.find(filter)
    .limit(limit)
    .sort(sort)
    .populate('sport')
    .exec()
    games = games.map(mapBasicGame)
    return res.status(200).json({ result: games })
}

exports.getGame = async (req, res, next) => {
    let participants = req.query.participants ? 'participants' : ''
    const game = await Game.findById(req.params.id)
    .select('-pwd')
    .populate(participants)
    .exec()
    res.status(200).json({ result: game })
}

exports.postGame = async (req, res, send) => {
    const team = await Team.create({  players:[{ _id: req.userId }] })
    const game = await Game.create({ 
        name: req.body.name,
        participants: [team._id] 
    })
    var query = { _id: req.userId }
    var operation = { $push: { gamesPlaying: game._id }}
    const user = await User.update(query, operation)
    res.status(200).json({success: 'Game created successfully'})
}

exports.signUpGame = async (req, res, send) => {
    // TODO: Check for user already in a team
    const team = await Team.create({ players: [{ _id: req.userId}] })
    var query = { _id: req.params.id }
    var operation = { $push: { participants: team._id }}
    const game = await Game.update(query,operation)
    var query = { _id: req.userId }
    var operation = { $push: { gamesPlaying: req.params.id }}
    const user = await User.update(query,operation)
    return res.status(200).json({success: 'User signed-up to game'})

}

exports.deleteGame = async (req,res,next) => {
    var query = { _id: req.params.id }
    const game =  Game.findOneAndRemove(query)
    var teamQuery = {$or:[]}
    game.participants.map((teamId) => {
        teamQuery.$or.push({_id: teamId})
    })
    await Team.deleteMany(teamQuery)
    return res.status(200).json({ deleted: true })
}