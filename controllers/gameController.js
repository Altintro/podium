'use_strict'
const Game = require('../models/Game')
const Team = require('../models/Team')
const User = require('../models/User')
const Sport = require('../models/Sport')

exports.get = (req,res,send) => {

    const limit = parseInt(req.query.limit)
    const skip = parseInt(req.query.skip)
    const fields = req.query.fields
    const sort = req.query.sort

    const filter = {}

    Game.list(filter,limit,skip,fields,sort, (err, games) => {
        if(err) {
            next(err)
            return
        }
        res.json({success: true, results: games})
    })
}

exports.post = (req, res, send) => {
    Team.create({
        players : [{ _id: req.query.userid }]
    }, (err, team) => {
        if(err){
            res.json({error: 'Error creating team for user', err})
            return
        }
        Game.create({
            name : req.body.name, // Sport, description, location...
            participants: [team]
        }, (err,game) => {
            if(err){
                res.json({error: 'Error creating game'})
                return
            }
            var query = { _id: req.query.userid } 
            var operation = { $push: { gamesPlaying: game._id }}
            User.update(query,operation, (err) => {
                if(err){
                    res.json({error: 'Error adding game to user'})
                    return
                }
                res.json({ success: true, message:'Game created successfully' })
            })
        })
    })
}

exports.signup = (req, res, send) => {
    // Create team from the user that wants to sign up to the tournament
    Team.create({
        players : [{ _id: req.query.userid }]
    }, (err, team) => {
        if(err){
            res.json({ error: 'Error creating Team for User when signing up to game', err})
            return
        }
        // If team is created with success, push it to the game's participants array
        var query = { _id: req.params.id} // id from the Game to update with the team
        var operation = { $push: { participants: team._id }} 
        Game.update(query,operation, (err) => {
            if(err){
                res.json({error: 'Error signing up team in game'})
                return
            }
            //If game is updated with the team with success, push the game into gamesPlaying array of the user
            var query = { _id: req.query.userid } // id from the User to update with the game
            var operation = { $push: { gamesPlaying: req.params.id }} 
            User.update(query, operation, (err) => {
                if(err){
                    res.json({error: 'Error sign up in user'})
                    return
                }
                res.json({success:true, message: 'User sign up for game'})
            })
        })
    })
}

exports.delete =  (req,res,next) => {
    Game.deleteOne({_id: req.params.id}, (err, user) => {
      if(err) {
          res.json({ error: 'Error deleting game' + err})
          return
      }
      res.json({deleted: true})
    })
}