'use_strict'

const config = require('../config')
const slug = require('slug')
const Sport = require('../models/Sport')
const fs = require('fs')

const baseFilesURL = config.host + '/files/sports/'

function mapBasicSport(sport) {
  return {
    _id: sport.id,
    name: sport.name,
    description: sport.description,
    rules: sport.rules,
    popularity: sport.popularity,
    image: baseFilesURL + sport.slug + '/' + (sport.image || 'default.png')
  }
}

exports.getSports = async (req, res, next) => {
  var sports = await Sport.find()
  sports = sports.map(mapBasicSport)
  return res.status(200).json({ result: sports })
}

exports.postSport = async (req,res,next) => {
  const sport = await Sport.create({
    name: req.body.name,
    description: req.body.description,
    rules: req.body.rules,
    slug: slug(req.body.name).toLowerCase()
  })
  return res.status(200).json({ success: true })
}

exports.uploadSportImage = async (req, res, next) => {
  const sport = await Sport.findById(req.params.id)
  const uploadsPath = __dirname + '/../../files/sports/uploads/'
  const imagePath = __dirname + '/../../files/sports/' + sport.slug
  if(!fs.existsSync(imagePath)) fs.mkdirSync(imagePath)
  fs.rename(uploadsPath + req.file.filename, imagePath + '/' + req.file.filename, (err) => {
    if (err) return next(err)
    console.log(sport.image)
  })
  sport.image = req.file.filename
  await sport.save()
  return res.json({ success: true })
}

