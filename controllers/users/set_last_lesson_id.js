const fs = require('fs').promises

async function loadFile(filePath) {
  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    // console.log('set_last_lesson.js ' + filePath + ' NO exists')
    return []
  }
}

const setUserLastLessonId = async (lessonId, userId) => {
  let filePath = 'data/user_settings.json'
  const userSettings = await loadFile(filePath) //all users settings

  const currentUserSettings = userSettings.find(el => el.userId == userId)

  if (currentUserSettings) {
    currentUserSettings.lastLessonId = +lessonId
  } else {
    const obj = {
      userId: +userId,
      lastLessonId: +lessonId,
      currentVoice: null,
      currentVoiceTR: null,
      voiceVolume: 0.7,
      voiceRate: 0.7
    }
    userSettings.push(obj)
  }

  //теперь нужно переписать весь файл user_settings.json
  const saveUrl = './data/user_settings.json'
  await fs.writeFile(saveUrl, JSON.stringify(userSettings), (err) => {
    if (err) {
      console.error('Произошла ошибка при записи lessonData !');
    } else {
      console.log('данные записаны в ', saveUrl);
    }
  });

}

module.exports = setUserLastLessonId