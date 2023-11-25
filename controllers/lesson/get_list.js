const fs = require('fs').promises
/**
 * получить список уроков из list.json
 * текущий юзер в global.user 
 * получить savings для текущего юзера 
 * получить passes для текущего юзера
 * 
 */
const getMark = (per, full = false) => {
  let p = parseInt(per)
  let mark = ''
  const marks = {
    fullMark: [
      '"Excellent!!!" - 👍',
      '"Good!" - 🥇',
      '"So-so..." - 🎈',
      '"Try again..." - 😥'
    ],
    shortMark: [
      '👍', '🥇', '🎈', '😥'
    ]
  }

  if (full) {
    if (p > 30) mark = marks.fullMark[3]
    if (p <= 30) mark = marks.fullMark[2]
    if (p <= 15) mark = marks.fullMark[1]
    if (p <= 5) mark = marks.fullMark[0]
  } else {
    if (p > 30) mark = marks.shortMark[3]
    if (p <= 30) mark = marks.shortMark[2]
    if (p <= 15) mark = marks.shortMark[1]
    if (p <= 5) mark = marks.shortMark[0]
  }
  return mark
}

async function loadFile(filePath) {
  try {
    const fileData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    // console.log('get_list.js ' + filePath + ' NO exists')
    return []
  }
}

//wob - если нужно включить урок в работой над ошибками
const getList = async (wob = false, userId) => {

  const allList = require('../../data/list.json')

  //USER PASSES
  let filePath = `${global.passesUrl}${userId}.json`

  const passes = await loadFile(filePath)

  //USER SAVINGS
  filePath = `${global.savingsUrl}${userId}.json`

  const savings = await loadFile(filePath)

  let html = ''

  for (let i = 0; i < allList.length; i++) {
    let currentLessonId = allList[i].id
    let ifpassed = ''
    let ifsavings = ''

    let currentSaving = savings.find(el => +el.lessonId == currentLessonId)
    if (currentSaving) ifsavings = 'in-progress'

    // const passedCurrentLesson = passes.filter(el => +el.lessonId === i + 1)
    const passedCurrentLesson = passes.filter(el => +el.lessonId == currentLessonId)

    let passedHtml = ''
    let percentArr = []

    if (passedCurrentLesson.length === 0) {
      passedHtml = `
            <div class='no-passed'>No lessons passed</div>
        `
    } else {
      ifpassed = 'passed'

    }

    for (let j = 0; j < passedCurrentLesson.length; j++) {
      const percent = Math.round(passedCurrentLesson[j].result.mistakes * 100 / passedCurrentLesson[j].result.count)

      percentArr.push(percent)

      passedHtml += `
        <div class="time">${passedCurrentLesson[j].date}</div>
        <div class="score">
            <span class="total">Score - ${passedCurrentLesson[j].result.count} : </span>
            <span class="mistakes">${passedCurrentLesson[j].result.mistakes}</span>
            <span class="percent">(${percent}%)</span>
        </div>
        
        <div class="mark">${getMark(percent, true)}</div>  
        `
    }

    const style = i === 0 && !wob ? 'style="display: none;"' : ''
    const demoStyle = i === 0 && wob ? 'style="display: none;"' : ''

    //CURRENT USER SETTINGS 
    filePath = 'data/user_settings.json'
    const userSettings = await loadFile(filePath)
    const currentUserSettings = userSettings.find(el => el.userId == userId)
    let lastLessonId = null
    if (currentUserSettings) lastLessonId = currentUserSettings.lastLessonId

    const lastLesson = lastLessonId == allList[i].id ? 'last-lesson' : ''

    html += `
    <div id=${allList[i].id} class="list-item ${ifsavings} ${ifpassed}" ${style} ${lastLesson}>
        <div class="title">
            <div class="list-left">
              <div class="lesson-name">${allList[i].name}</div>
              <div class="demo" ${demoStyle}><a href=${'/lessons/demo/' + allList[i].id + '/' + userId}></a></div>
            </div>
             
            <div class="list-buttons">
              <div class="passed-count">${passedCurrentLesson.length}</div>
              <div class="short-mark">${percentArr.length > 0 ? getMark(Math.min(...percentArr)) : ''}</div>
              <div class="buttons">
              
                <button class="list-btn btn-results">Results</button>
                <a href=${'/lessons/' + allList[i].id + '/' + userId} onclick="localStorage.setItem('lessonId', ${allList[i].id})"><button class="list-btn start">Start</button></a>
              </div>
            </div>
        </div>
  

        <div class="results hidden">
          <div class="result">
              ${passedHtml}
          </div>
        </div>
      
    </div>
    `

  }
  return html
}

module.exports = getList