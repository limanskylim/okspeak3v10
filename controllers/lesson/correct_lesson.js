// const fs = require('fs').promises
const fs = require('fs')

const correctLesson = (data) => {
  //
  let lessonData, filePath
  // const lessonsList = require('../../data/list.json')
  filePath = 'data/list.json'

  const lessonsList = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  const lesson = lessonsList.find(el => el.id == data.lessonId)

  if (lesson && lesson.id != 0) {
    // const url = '../../data/lessons/' + lesson.dataUrl
    const filePath = 'data/lessons/' + lesson.dataUrl
    lessonData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    // находим индекс элемента массива с data.currentItem
    const { eng, tr, help } = data.currentItem

    const index = lessonData.findIndex(item => item.eng === eng && item.tr === tr && item.help === help)
    if (index !== -1) {
      //заменяем и сохраняем 
      lessonData[index] = data.newItem

      const saveUrl = './data/lessons/' + lesson.dataUrl
      fs.writeFile(saveUrl, JSON.stringify(lessonData), (err) => {
        if (err) {
          console.error('Произошла ошибка при записи lessonData:', err);
        } else {
          //console.log('данные записаны в ', saveUrl);
        }
      });
    }


  }


}

module.exports = correctLesson