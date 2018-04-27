'use_strict'

const userAccountController = require('./userAccountController')
const User = require('../models/User')
const Sport = require('../models/Sport')

exports.getUsers = async (req, res, next) => {

  const limit = parseInt(req.query.limit)
  const fields = req.query.fields
  const sort = req.query.sort 

  const filter = {};
  const name = req.query.name;
  const alias = req.query.alias;
  if(name) { filter.name = { $regex: '^'+ name, $options: 'i' }}
  if(alias){ filter.alias = { $regex: '^'+ alias, $options: 'i' }}

  let users = await User.find(filter).select('-pass').limit(limit).sort(sort).exec()
  users = users.map(userAccountController.mapBasicUser)
  return res.status(200).json({result: users})
}

exports.getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id)
  .populate({
    path: 'interests',
    select: 'name image slug',
    options: { limit: 10 },
  }) 
  .populate({
    path: 'gamesPlaying',
    select: 'name sport participants',
    populate: { path:'sport participants', select: 'name slug image profilePic alias', options: { limit: 3 } },
  })
  return res.status(200).json({ result: userAccountController.mapUser(user) })
}

exports.me = async (req,res,next) => {
  req.params.id = req.userId
  next()
}

exports.deleteUser = async (req,res,next) => {
  var query = {_id: req.params.id}
  await User.deleteOne(query).exec()
  return res.status(200).json({ deleted: true})
}