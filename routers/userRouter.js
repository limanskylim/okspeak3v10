const express = require('express')

//CONTROLLER FUNCTIONS
const saveUserSettings = require('../controllers/users/save_user_settings');
const loadVoice = require('../controllers/users/load_voice');
// const { loadVoice } = require("../public/js/utils/tts");
//END CONTROLLER FUNCTIONS

const jsonParser = express.json();

//ROUTER
const router = express.Router()

router.get('/settings', (req, res) => {
  const userId = req.query.userId
  const voice = loadVoice(userId)
  // console.log('loaded voice - ', voice)
  if (voice)
    res.status(200).json(voice)
  else res.status(200).json({ data: null })
})

router.post('/settings', jsonParser, (req, res) => {

  saveUserSettings(req.body)
    .then((result) => {
      res.status(200).json({ message: 'voice settings saved' })
    })
    .catch((error) => {
      res.status(200).json({ message: 'не удалось сохранить voice settings' })
    })


})

module.exports = router