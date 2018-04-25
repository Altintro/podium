'use_strict'
const Game = require('../models/Game')
const Team = require('../models/Team')
const User = require('../models/User')
const Sport = require('../models/Sport')

const sportsController = require('./sportsController')
const userAccountController = require('./userAccountController')

function mapBasicGame(game) {
  return {
    _id: game.id,
    name: game.name,
    sport: sportsController.mapBasicSport(game.sport),
    participants: game.participants.map(userAccountController.mapBasicUser),
    open: game.open,
    modality: game.modality,
  }
}

exports.getGames = async (req, res, next) => {

  const limit = parseInt(req.query.limit)
  const sort = req.query.sort
  const filter = {}
  let games = await Game.find(filter)
  .limit(limit)
  .sort(sort)
  .populate({ path:'sport', select: 'name image'})
  .populate({ path:'participants', select: 'name alias profilePic', options: { limit: 3 }})
  .exec()
  games = games.map(mapBasicGame)
  return res.status(200).json({ result: games })
}

exports.getGame = async (req, res, next) => {

  let participants = req.query.participants ? 'participants' : ''
  const game = await Game.findById(req.params.id)
  .populate({ path : 'participants', select: 'name alias profilePic'})
  .populate({ path: 'sport', select: 'name image'})
  .exec()
  res.status(200).json({ result: game })
}

exports.createGame = async (req, res, send) => {
  const sport = await Sport.findById(req.body.sport)
  const game = await Game.create({ 
    name: req.body.name,
    participants: [req.userId] ,
    sport: sport._id,
    description: req.body.description
  })
  const query = { _id: req.userId }
  const operation = { $push: { gamesPlaying: game._id }}
  const user = await User.update(query, operation)
  res.status(200).json({success: true })
}

exports.joinGame = async (req, res, send) => {
  let query = { _id: req.params.id }
  let operation = { $push: { participants: req.userId }}
  const game = await Game.update(query,operation)
  query = { _id: req.userId }
  operation = { $push: { gamesPlaying: req.params.id }}
  const user = await User.update(query,operation)
  return res.status(200).json({ success: true })
}

exports.deleteGame = async (req,res,next) => {
    
  const query = { _id: req.params.id }
  const game = await Game.findOneAndRemove(query)
  const teamQuery = {$or:[]}
  game.participants.map((teamId) => {
    teamQuery.$or.push({_id: teamId})
  })
  await Team.deleteMany(teamQuery)
  return res.status(200).json({ deleted: true })
}