const express = require('express')

const users = require('../data/users.json')

const router = express.Router()
const jsonParser = express.json();

//handlers
const checkUser = (req, res) => {

  const user = users.find(el => el.secret.toLowerCase() === req.body.secret.toLowerCase())

  if (user) {
    // global.user = user
    global.welcome = `Hi, ${user.name}! 🥰`
    res.status(200).json({ userName: user.name, userId: user.id })

  } else {
    res.status(200).json({ userName: 'unknown' })
  }
}

//routs
router.get('/', (req, res) => {

  res.render('secret.hbs', {
    title: 'secret',
    pageClass: ''

  })
})

router.post('/', jsonParser, checkUser)

module.exports = router