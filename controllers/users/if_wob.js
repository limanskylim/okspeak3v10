const fs = require('fs').promises
/**
 * savings -> loadFile(filePath)
 * если в savings есть урок с id=0 -> значит не закончена отработка ошибок
 * и возвращаем true
 * 
 * сколько заданий должен содержать урок -> global.WOB_COUNT
 * @returns если достаточно заданий для работы над ошибками -> true
 * если недостаточно -> false
 * 
 */
async function loadFile(filePath) {
  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {

    // console.log('if_wob.js ' + filePath + ' NO exists')
    return []
  }
}

const ifWOB = async (userId) => {
  /**
   * id работы над ошибками = 0
   * сначала проверям незаверщенные уроки (savings)
   * если там есть незаконченная работа над ошибками
   * тогда выходим
   * и не пытаемся загрузить ещё одну работу над ошибками
   */
  let filePath = `${global.savingsUrl}${userId}.json`

  //ищем savings для текущего юзера
  const savings = await loadFile(filePath)
  //ищем lessonId = 0 для текущего юзера userId
  const ifsavings = savings.find(el => el.userId === userId && el.lessonId == 0)

  //если есть сохранения для wob то показываем блок работы над ошибками

  if (ifsavings) return true
  //проверяем есть ли ошибки у текущего юзера 
  //находим содержатся ли записи для него в global.wob (data/wob.json)
  filePath = `${global.wobUrl}${userId}.json`
  const wobItems = await loadFile(filePath)
  //wobItems - массив объектов [{},{}...{}]

  if (wobItems.length >= global.WOB_COUNT) return true

  return false
}

module.exports = ifWOB