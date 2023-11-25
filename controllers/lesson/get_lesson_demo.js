const getLessonDemo = (id) => {

  let items = null

  const lessons = require('../../data/list.json')

  const lesson = lessons.find(el => el.id == id)

  items = require(`../../data/lessons/${lesson.dataUrl}`)

  if (!items) return false

  return {
    lessonId: lesson.id,
    lessonName: lesson.name,
    phrases: items
  }
}

module.exports = getLessonDemo