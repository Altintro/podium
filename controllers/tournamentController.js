'use_strict'
const Tournament = require('../models/Tournament')
const User = require('../models/User')

exports.get = (req,res,send) => {
    const sport = req.query.sport
    const name = req.query.name

    const limit = parseInt(req.query.limit)
    const skip = parseInt(req.query.skip)
    const fields = req.query.fields
    const sort = req.query.sort

    console.log(req.user)

    const filter = {}
    if(name) { filter.name = { $regex: '^'+name, $options: 'i' }}
    if(sport){ filter.sport = { $regex: '^'+sport, $options: 'i' }}

    Tournament.list(filter,limit,skip,fields,sort, (err, tournaments) => {
        if(err) {
            next(err)
            return
        }
        res.json({success: true, results: tournaments})
    })
}

exports.post = (req, res, send) => {

    Tournament.create({
        name: req.body.name,
        sport: req.body.sport,
        compType: req.body.type,
    }, (err, tournament) => {
        if(err){
            res.json({error: 'Error posting tournament'})
            return
        }

        res.json({success: true, tournamet: tournament.name})
    })
}

exports.delete =  (req,res,next) => {
    Tournament.deleteOne({_id: req.params.id}, (err, user) => {
      if(err) {
          res.json({ error: 'Error deleting tournament' + err})
          return
      }
      res.json({deleted: true})
    })
}

exports.signup = (req, res, send) => {
    var query = { _id: req.params.id }
    var operation = { $push: { players: req.query.userid }}
    Tournament.update(query, operation, (err) => {
        if(err){
            res.json({error:'Error sign up in tournament'})
            return
        }
        var query = { _id: req.query.userid }
        var operation = { $push: {playing: req.params.id }}
        User.update(query, operation, (err) => {
            if(err) {
                res.json({error: 'Error sign up in user'})
                return
            }
            res.json({success: true, message: 'User signed up for tournament'})
        })
    })
}