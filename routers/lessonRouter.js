const express = require('express')
// const fs = require('fs').promises


//CONTROLLER FUNCTIONS
const getList = require('../controllers/lesson/get_list')
const getLesson = require('../controllers/lesson/get_lesson')
const getLessonDemo = require('../controllers/lesson/get_lesson_demo')
const saveLesson = require('../controllers/lesson/save_lesson')
const addWOB = require('../controllers/users/add_user_wob')
const ifWOB = require('../controllers/users/if_wob')
const correctLesson = require('../controllers/lesson/correct_lesson')
const setUserLastLessonId = require('../controllers/users/set_last_lesson_id')
const getWelcome = require('../controllers/users/get_welcome')
//END CONTROLLER FUNCTIONS

const jsonParser = express.json();

//ROUTER
const router = express.Router()

router.get('/', async (req, res) => {
  const userId = req.query.userId

  if (!userId) {
    res.redirect('/')
    return
  }

  const wob = await ifWOB(userId)
  const newList = await getList(wob, userId)

  res.render('list', {
    list: newList,
    welcome: getWelcome(userId),
    title: `Lim Program - Lesson list`,
    pageClass: ''
  })
})

router.get('/demo/:id/:userId', (req, res) => {
  const userId = +req.params.userId
  const lesson = getLessonDemo(+req.params.id)
  if (!lesson) {
    console.log('Lesson not found')
    return
  }

  res.render('demo', {
    userId,
    lessonId: lesson.lessonId,
    name: lesson.lessonName,
    phrases: JSON.stringify(lesson.phrases),
    welcome: getWelcome(userId),
    title: `Lim Program - ${lesson.lessonName}`,
    pageClass: 'demo-page'
  })
})

router.get('/:id/:userId', async (req, res) => {
  const id = +req.params.id //lessonID
  const userId = +req.params.userId

  await setUserLastLessonId(id, userId)

  const lesson = await getLesson(id, userId)

  if (!lesson) {
    console.log('Lesson not found')
    return
  }

  res.render('lesson', {
    userId,
    lessonId: lesson.lessonId,
    name: lesson.lessonName,
    phrases: JSON.stringify(lesson.phrases),
    count: lesson.count,
    mistakes: lesson.mistakes,
    welcome: getWelcome(userId),
    title: `Lim Program - ${lesson.lessonName}`,
    pageClass: ''
  })
})

router.post('/save', jsonParser, async (req, res) => {
  const { lesson, score, userId, lessonId } = req.body

  const OK = saveLesson(lesson, score, userId, lessonId)

  if (OK) {
    res.status(200).json({ message: lesson })
  }
  else {
    res.status(200).json({ message: 'Не удалось сохранить файл' })
  }
})

//для работы над ошибками wob - work on bugs
router.post('/wob', jsonParser, (req, res) => {
  const message = addWOB(req.body.userId, req.body.item)
  console.log(message)
  res.status(200).json({ message: 'add WOB OK' })
})

router.put('/correct', jsonParser, (req, res) => {
  correctLesson(req.body)
  res.status(200).json({ message: 'correct OK' })

})

//END ROUTER

module.exports = router