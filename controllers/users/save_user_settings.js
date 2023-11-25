const fs = require('fs').promises

const saveFile = (filePath, fileContent, ok, err) => {

  fs.writeFile(filePath, fileContent)
    .then(() => {
      //console.log(`${filePath} успешно сохранен!`);
      ok('OK')
    })
    .catch(error => {
      console.error('saveUserSettings - ошибка при сохранении файла:', error);
      err('ERROR')
    });

}

const saveUserSettings = (data) => {
  return new Promise((res, rej) => {
    // const filePath = '../../data/user_settings.json';
    const obj = {
      userId: +data.userId,
      lastLessonId: +data.lessonId,
      currentVoice: data.currentVoice ? data.currentVoice : null,
      currentVoiceTR: data.currentVoiceTR ? data.currentVoiceTR : null,
      voiceVolume: data.voiceVolume ? data.voiceVolume : null,
      voiceRate: data.voiceRate ? data.voiceRate : null
    }

    // console.log('obj = ', obj)

    // let settings = require(filePath)
    let settings = global.userSettings

    const index = settings.findIndex(el => el.userId == data.userId)
    if (index !== -1) {
      settings[index] = obj
    } else {
      settings.push(obj)
    }
    const fileContent = JSON.stringify(settings)

    saveFile('./data/user_settings.json', fileContent, res, rej)


  })




}

module.exports = saveUserSettings