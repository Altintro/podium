'use_strict'

var express = require('express')
var router = express.Router()
const Tournament = require('../../models/Tournament')
var verifyToken = require('./auth/verifyToken')

// Post tournaments
router.post('/',verifyToken, (req,res) => {

    Tournament.create({
        name: req.body.name,
        sport: req.body.sport,
        type: req.body.type
    }, (err, tournament) => {
        if(err){
            res.json({error: 'Error posting tournament'})
            return
        }

        res.json({success: true, tournamet: tournament.name})
    })
})

// Get tournaments
router.get('/', verifyToken, (req,res,send) => {
    const sport = req.query.sport
    const name = req.query.name

    const limit = parseInt(req.query.limit)
    const skip = parseInt(req.query.skip)
    const fields = req.query.fields
    const sort = req.query.sort

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
})

module.exports = router