const fs = require('fs').promises
const deleteCurrentUserWOB = require('../users/delete_current_user_wob')

async function loadFile(filePath) {
  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {

    // console.log('set_last_lesson.js ' + filePath + ' NO exists')
    return []
  }
}

const getLesson = async (id, userId) => {
  let items = null
  let score = null

  const lessonsList = await loadFile('data/list.json') //+++

  const lesson = lessonsList.find(el => el.id == id) //+++

  /**
   * проверка есть ли сохранения для данного урока
   * сначала получаем все сохранения текущего юзера
   * искать в data/savings/userId.json
   * пытаемся загрузить такой файл
  */
  const currentUserSavings = await loadFile('data/savings/' + `${userId}.json`)
  let currentLessonSaving = null
  if (currentUserSavings.length > 0) {
    //ищем сохранения для данного урока
    currentLessonSaving = currentUserSavings.find(el => el.lessonId == id)
  } //+++

  if (currentLessonSaving) {

    items = currentLessonSaving.items
    score = currentLessonSaving.score
  } else {
    //если id = 0 (запустили работу над ошибками)
    //находим в data/wob.json (или тоже самое в global.wob)
    //запись фраз для текущего юзера (массив items)

    // WOB
    if (id == 0) { //!!! пока не проверяю 
      let filePath = `data/wob/${userId}.json`
      itemsArr = await loadFile(filePath)
      console.log('itemsArr.length ', itemsArr.length)
      //!!!в items могут быть одинаковые элементы
      // нужно создать уникальный массив для передачи в урок

      const uniqueEngSet = new Set();
      const itemsUnique = itemsArr.filter(item => {
        const isUnique = !uniqueEngSet.has(item.eng);
        uniqueEngSet.add(item.eng);
        return isUnique;
      });

      // console.log('itemsay', items)
      // console.log('items', items)
      console.log('itemsUnique.length ', itemsUnique.length)

      // убрать из itemsArr элементы, которые попали в уникальные (по 1-му элементу)

      // Удаление по одному элементу из itemsArr, если они присутствуют в items
      itemsUnique.forEach(item => {
        const indexToRemove = itemsArr.findIndex(el => el.eng === item.eng);
        if (indexToRemove !== -1) {
          itemsArr.splice(indexToRemove, 1);
        }
      })

      console.log('new itemsArr.length', itemsArr.length)

      // остатки элементов в itemsArr записываем в data/wob/{iserId}.json
      fs.writeFile(filePath, JSON.stringify(itemsArr))

      // выбрвнные уникальные элементы записываем в data/wob.json
      fs.writeFile('data/wob.json', JSON.stringify(itemsUnique))

      //данные для урока над ошибками получены
      //теперь их можно удалить
      // deleteCurrentUserWOB() //!!! НЕ ПРОВЕРЕНО !!!
      items = await loadFile(`data/wob.json`)
    } else {
      // items = require(`../../data/lessons/${lesson.dataUrl}`)
      items = await loadFile(`data/lessons/${lesson.dataUrl}`)
    }

    score = {
      count: items.length,
      mistakes: 0
    }
  }

  return {
    lessonId: lesson.id,
    lessonName: lesson.name,
    phrases: items,
    count: score.count,
    mistakes: score.mistakes
  }
}

module.exports = getLesson