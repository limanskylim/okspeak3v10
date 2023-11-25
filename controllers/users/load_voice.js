const fs = require('fs').promises

const loadVoice = (userId) => {
  const voiceSettings = global.userSettings

  const userVoice = voiceSettings.find(el => el.userId == userId)

  if (userVoice) {
    return userVoice
  } else {
    return false
  }
}

module.exports = loadVoice