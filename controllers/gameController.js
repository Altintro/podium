'use_strict'
const Game = require('../models/Game')

exports.get = (req,res,send) => {

    const limit = parseInt(req.query.limit)
    const skip = parseInt(req.query.skip)
    const fields = req.query.fields
    const sort = req.query.sort

    console.log(req.user)

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

    Game.create({

        name: req.body.name,

    }, (err, game) => {
        if(err){
            res.json({error: 'Error posting game'})
            return
        }

        res.json({ success: true, game: game })
    })
}