'use_strict'
const Tournament = require('../models/Tournament')
const User = require('../models/User')
const Sport = require('../models/Sport')
const Team = require('../models/Team')

function mapBasicTournament(tournament) {
    return {
        _id: tournament.id,
        name: tournament.name,
        sport: tournament.sport,
        compType: tournament.compType,
        levelAverage: tournament.levelAverage,
        open: tournament.open,
        modality: tournament.modality
    }
}

exports.getTournaments = (req,res,send) => {

    const limit = parseInt(req.query.limit)
    const fields = req.query.fields
    const sort = req.query.sort

    const filter = {}
    const name = req.query.name
    if(name) { filter.name = { $regex: '^'+name, $options: 'i' }}

    Tournament.find(filter)
              .limit(limit)
              .sort(sort)
              .populate('sport')
              .exec().then((tournaments) => {
                tournaments = tournaments.map(mapBasicTournament)
                return res.json({results: tournaments})
              }).catch((err) => {
                return next(err)
              })
}

exports.getTournament = (req, res, next) => {
    let participants = req.query.participants ? 'participants' : ''
    Tournament.findById(req.params.id).select('-pwd').populate(participants).exec().then((tournament) => {
        return res.json({tournament})
    }).catch((err) => {
        return next(err)
    })
}

exports.postTournament = (req, res, send) => {

    Tournament.create({
        name: req.body.name,
        compType: req.body.compType
    }).then((tournament) => {
        return res.json({ tournament: tournament })
    }).catch((err)=> {
        return res.json(err)
    })
}

exports.deleteTournament =  (req,res,next) => {

    var query = { _id: req.params.id }
    Tournament.deleteOne(query).then(() => {
        return res.json({ deleted: true })
    }).catch((err) => {
        return next(err)
    })
}

exports.signUpTournament = (req, res, send) => {

    var query = { _id: req.params.id }
    var operation = { $push: {players: req.userId }}
    Tournament.update(query,operation)
    .then(() => {
        var query = { _id: req.userId }
        var operation = { $push: {tournamentsPlaying: req.params.id }}
        return User.update(query,operation)
    })
    .then(()=> {
        return res.json({success: 'User signed-up to tournament'})
    })
    .catch((err) => {
        return res.json({error:'Error signing up to tournament',err})
    })
}
