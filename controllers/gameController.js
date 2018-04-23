'use_strict'
const Game = require('../models/Game')
const Team = require('../models/Team')
const User = require('../models/User')
const Sport = require('../models/Sport')

const sportsController = require('./sportsController')

function mapBasicGame(game) {
  return {
    _id: game.id,
    name: game.name,
    sport: sportsController.mapBasicSport(game.sport),
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
  .populate('sport')
  .exec()
  games = games.map(mapBasicGame)
  return res.status(200).json({ result: games })
}

exports.getGame = async (req, res, next) => {

  let participants = req.query.participants ? 'participants' : ''
  const game = await Game.findById(req.params.id)
  .populate(participants)
  .exec()
  res.status(200).json({ result: game })
}

exports.createGame = async (req, res, send) => {
  console.log(req.body)
  const team = await Team.create({  players:[{ _id: req.userId }] })
  const sport = await Sport.findOne({ slug: req.body.sport.toLowerCase() })
  const game = await Game.create({ 
    name: req.body.name,
    participants: [team._id] ,
    sport: sport._id,
    description: req.body.description
  })
  const query = { _id: req.userId }
  const operation = { $push: { gamesPlaying: game._id }}
  const user = await User.update(query, operation)
  res.status(200).json({success: true })
}

exports.signUpGame = async (req, res, send) => {

  // TODO: Check for user already in a team
  const team = await Team.create({ players: [{ _id: req.userId}] })
  let query = { _id: req.params.id }
  let operation = { $push: { participants: team._id }}
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