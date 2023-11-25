const fs = require('fs').promises

/**
 * global.wob
 * нужно удалить всё связанное с текущим юзером
 * перезаписать файл data/wob.json
 */
const deleteCurrentUserWOB = () => {
  //console.log('deleteCurrentUserWOB')
  //удаляем юзера
  const newWOB = global.wob.filter(el => el.userId != global.user.id)

  global.wob = newWOB

  //сохраняем 
  fs.writeFile('./data/wob.json', JSON.stringify(newWOB), (err) => {
    if (err) {
      console.error('Произошла ошибка при записи newWOB in wob.json:', err);
    } else {
      //console.log('данные newWOB записаны в data/wob.json');
    }
  });

}

module.exports = deleteCurrentUserWOB