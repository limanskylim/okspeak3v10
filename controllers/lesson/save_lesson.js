const fs = require('fs')


const fileExists = (filePath) => {
  if (fs.existsSync(filePath)) {
    // console.log('Файл существует');
    return true
  } else {
    // console.log('Файл не существует');
    return false
  }

}

const saveLesson = (data, score, userId, lessonId) => {
  // Путь к файлу, который вы хотите создать или перезаписать
  let filePath = null

  //добавить в passes если урок пройден полностью
  if (data.length <= 0) {
    filePath = `${global.passesUrl}${userId}.json`
    const passedLesson = {
      date: new Date().toLocaleString(),
      lessonId: lessonId,
      userId: userId,
      result: { count: score.count, mistakes: score.mistakes }
    }
    if (fileExists(filePath)) {
      const passes = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      passes.push(passedLesson)
      fs.writeFileSync(filePath, JSON.stringify(passes), 'utf-8')
    } else {
      //нет файла для пройденных уроков
      const arr = []
      arr.push(passedLesson)
      fs.writeFileSync(filePath, JSON.stringify(arr), 'utf-8')
    }

    console.log('добавлен урок в пройденные')

  }

  // Содержимое, которое вы хотите записать в файл
  const arr = []
  const obj = {}
  obj.lessonId = lessonId
  obj.items = data
  obj.score = score

  arr.push(obj)

  let allSavings, currentSaving

  let content
  //ищем файл savings/userId.json
  filePath = `${global.savingsUrl}${userId}.json`

  if (fileExists(filePath)) {
    allSavings = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    // console.log('allSavings', allSavings);
  } else {
    // console.log(`${filePath} не найден - создаём новый`);
    fs.writeFileSync(filePath, JSON.stringify(arr), 'utf-8');
    //создаем новый файл для записи сохранений и выходим
    return true
  }

  //если файл успешно загрузился - ПРОДОЛЖАЕМ...


  //allSavings = ВСЕ сохранения 

  // ищем сохранения для текущего урока
  currentSaving = allSavings.find(el => el.lessonId == lessonId)
  // console.log('currentSaving - ', currentSaving)

  //если нет сохранений для текущего урока - добавим в 
  //allSavings obj с новым уроком
  if (!currentSaving) {
    allSavings.push(obj)
    fs.writeFileSync(filePath, JSON.stringify(allSavings), 'utf-8');
    // console.log('добавлен прогресс для урока ', lessonId)
    return true
  }

  //есть сохранения для текущего урока в currentSaving
  // нужно заменить содержимое на входящий объект
  const index = allSavings.findIndex(el => el.lessonId == lessonId)
  allSavings[index] = obj

  //если пришли пустые данные data = []
  // нужно удалить текущую запись из allSavings 
  if (data.length === 0) {
    allSavings.splice(index, 1)
  }

  // console.log('allSavings после изменения текущего урока', allSavings)
  fs.writeFileSync(filePath, JSON.stringify(allSavings), 'utf-8')

  return true

}

module.exports = saveLesson