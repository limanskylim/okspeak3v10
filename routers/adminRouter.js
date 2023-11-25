const express = require('express')

const fs = require('fs');
const path = require('path');
const getWelcome = require("../controllers/users/get_welcome");

const jsonParser = express.json();

//CONTROLLER FUNCTIONS

const router = express.Router()
// const jsonParser = express.json();

//ROUTER

router.get('/', (req, res) => {
  // const adminId = +req.params.id

  // if (adminId !== global.adminId) return

  res.render('admin.hbs', {
    welcome: getWelcome(adminId),
    title: `Lim Program - admin`,

  })
})

router.get('/download', (req, res) => {
  const fileName = req.query.fileName;
  const filePath = `./data/${fileName}`
  // console.log(filePath)

  // Проверка существования файла перед скачиванием
  if (fs.existsSync(filePath)) {
    // Устанавливаем заголовок ответа для скачивания файла
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    res.setHeader('Content-type', 'application/octet-stream');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).send('Файл не найден');
  }
});

router.post('/createFile', jsonParser, (req, res) => {
  console.log(req.body)
  const filePath = req.body.url
  const content = req.body.content
  //создание файла
  try {
    // Синхронная запись в файл
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Файл успешно записан: ${filePath}`);
    res.status(200).json({ message: 'admin/createFile OK' })
  } catch (error) {
    console.error(`Ошибка при записи файла: ${error.message}`);
    res.status(200).json({ message: 'admin/createFile ERROR' })
  }

})

router.post('/createLesson', jsonParser, (req, res) => {
  const list = require('../data/list.json')
  // console.log(list)
  // console.log(req.body)
  const dataUrl = req.body.url
  let filePath = 'data/lessons/' + dataUrl
  const content = req.body.content
  const lessonId = +req.body.id
  const title = req.body.title
  const targetId = +req.body.targetId

  const listObj = {
    id: lessonId,
    name: title,
    dataUrl
  }

  //создание файла
  try {
    // Синхронная запись в файл
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Файл успешно записан: ${filePath}`);

  } catch (error) {
    console.error(`Ошибка при записи файла: ${error.message}`);
    res.status(500).json({ message: 'admin/createLesson ERROR' })
    return
  }

  //добавить в список уроков ссылку на новый урок
  filePath = 'data/list.json'
  if (targetId) {
    const index = list.findIndex(el => el.id == targetId)
    if (index !== -1) {
      list.splice(index + 1, 0, listObj);
    } else {
      list.push(listObj)
    }
  } else
    list.push(listObj)

  try {
    fs.writeFileSync(filePath, JSON.stringify(list), 'utf-8');
    console.log(`Ссылка на новый урок добавлена в : ${filePath}`)

  } catch (error) {
    console.error(`Ошибка при добавлении ссылки на урок: ${error.message}`);
    res.status(500).json({ message: 'admin/createLesson ERROR' })
  }
  res.status(200).json({ message: 'admin/createLesson OK' })
})

module.exports = router