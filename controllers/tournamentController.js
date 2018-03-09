'use_strict'
const Tournament = require('../models/Tournament')
const User = require('../models/User')
const Sport = require('../models/Sport')
const Team = require('../models/Team')

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
              .populate('players')
              .exec().then((tournaments) => {
                return res.json({results: tournaments})
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
        res.json({ deleted: true })
    }).catch((err) => {
        res.json(err)
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
        res.json({success: 'User signed-up to tournament'})
    })
    .catch((err) => {
        res.json({error:'Error signing up to tournament',err})
    })
}
