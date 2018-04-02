'use_strict'

const Sport = require('../models/Sport')

exports.getSports = async (req, res, next) => {
  const sports = await Sport.find()
  return res.status(200).json({ result: sports })
}

exports.postSport = async (req,res,next) => {
  const sport = await Sport.create({
    name: req.body.name,
    description: req.body.description,
    rules: req.body.rules,
  })
  return res.status(200).json({ success: true })
}
