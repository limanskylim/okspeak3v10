const fs = require('fs')

const fileExists = (filePath) => {
  if (fs.existsSync(filePath)) {
    // console.log('Файл существует');
    return true
  } else {
    console.log('Файл не существует');
    return false
  }

}

const addWOB = (userId, item) => {
  let message = ''
  let userWob
  // проверяем есть ли файл с ошибками для текущего юзера
  const filePath = `${global.wobUrl}${userId}.json`

  if (fileExists(filePath)) {
    userWob = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    userWob.push(item)
    fs.writeFileSync(filePath, JSON.stringify(userWob), 'utf-8');
    message = `ошибка добавлена: ${JSON.stringify(item)}`
  } else {
    const arr = []
    arr.push(item)
    fs.writeFileSync(filePath, JSON.stringify(arr), 'utf-8');
    message = `Создан файл ${filePath} и ошибка добавлена: ${JSON.stringify(item)}`
  }
  return message
}

module.exports = addWOB