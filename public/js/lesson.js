import { init, speak, saveVoice, loadVoiceFromLS } from "./utils/tts.js"
import { addWOB } from "./utils/add_wob.js"
import { speakTranslation } from "./utils/tts.js"
// import { setLink } from "./utils/set_link.js"

// setLink()

document.addEventListener("DOMContentLoaded", function () {
  window.useTrVoice = true
  //LOCAL STORAGE
  //currentUserKey, userId, lessonId
  const key = localStorage.getItem('currentUserKey')
  const uId = localStorage.getItem('userId')
  const lId = localStorage.getItem('lessonId')
  const o = {
    userId: +uId, lessonId: +lId
  }
  localStorage.setItem(key, JSON.stringify(o))

  //VARS
  const lessonBodyContainer = document.querySelector('.body-container')
  const lessonBox = document.querySelector('.lesson-body')
  const lessonTitle = document.querySelector('.lesson-title span')
  // const alink = document.querySelector('.lesson-title a')

  const engBox = document.querySelector('.english')
  const trBox = document.querySelector('.translation')
  const helpBox = document.querySelector('.help')
  const itemsLeft = document.getElementById('left')

  const select = document.querySelectorAll('select')

  const voiceSettingBox = document.querySelector('.voice-setting-box')
  const volumeSlider = document.getElementById('volumeSlider')
  const rateSlider = document.getElementById('rateSlider')
  const voiceSelectEN = document.getElementById('selectEN')
  const voiceSelectTR = document.getElementById('selectTR')
  const menuVoicesBtn = document.querySelector('.menu-voices-btn')

  const buttons = document.querySelectorAll('.buttons .btn')

  let timer = null
  let canPressButton = false
  let isCorrection = false //идет исправление
  const userId = localStorage.getItem('userId')
  const lessonId = localStorage.getItem('lessonId')

  //FUNCTIONS

  const showAnswer = (delay = 1200, eng) => {
    timer = setTimeout(() => {
      canPressButton = true
      buttons.forEach(btn => btn.removeAttribute('disabled'))
      engBox.textContent = eng
      if (!isCorrection)
        speak(eng)
    }, delay + eng.length * 125);
  }

  const next = () => {
    buttons.forEach(btn => btn.setAttribute('disabled', true))
    canPressButton = false
    itemsLeft.textContent = items.length
    if (items.length === 0) {
      clearTimeout(timer)
      finish()
      return
    }
    // trBox.style.opacity = 0.1
    clearTimeout(timer)
    const eng = items[0].eng
    const tr = items[0].tr
    trBox.textContent = tr
    engBox.textContent = '???'
    if (items[0].help) {
      helpBox.textContent = items[0].help
      helpBox.classList.remove('hidden')
    } else {
      helpBox.classList.add('hidden')
    }

    if (window.useTrVoice) {
      speakTranslation(items[0].tr)
        .then(() => {
          showAnswer(1000, eng)
        })
    } else showAnswer(3000, eng)

  }

  const insert = (arr, index) => {
    addWOB(userId, arr[0])

    arr.splice(index, 0, arr[0])
    const count = arr.filter(el => el === arr[0]).length;

    if (count < 3 && arr[arr.length - 1] !== arr[0]) {
      arr.splice(20, 0, arr[0])
    }
    arr.shift()

  }

  const finish = () => {
    let percent = Math.round(faults * 100 / itemsCount)
    // if (percent > 100) percent = 100
    // const href = `${lessonId}/${userId}`
    const href = ''
    const finishHTML = `
    <div class="finish-container">
      
      <div class="end-lesson-name">${lessonName}</div>
      <div class="count">Всего фраз - ${itemsCount}</div>
      <div class="mistakes">Ошибок - ${faults} (${percent}%)</div>
      <div class="btn-exit-box">
        <a onclick='goBack()'><button class="btn-exit">OK</button></a>
      </div>
    </div>
    `

    lessonBox.innerHTML = finishHTML

    const finishBox = document.querySelector('.finish-container')
    finishBox.classList.add('not-visible')
    setTimeout(() => {
      finishBox.classList.remove('not-visible')
      document.querySelector('.btn-exit').focus()
    }, 500)

  }

  //END FUNCTIONS

  //HANDLERS
  function handleKeyPress(event) {

    if (!canPressButton) return

    if (isCorrection) return

    if (event.keyCode === 32 && !speakSelection()) {
      //Нажата клавиша "Пробел"
      speak(items[0].eng)
      return
    }

    // Код клавиши "Влево" в JavaScript
    const leftArrowKey = 37;

    // Код клавиши "Вправо" в JavaScript
    const rightArrowKey = 39;

    // Проверяем код клавиши, которая была нажата
    if (event.keyCode === leftArrowKey) {
      // console.log('Нажата клавиша "Влево"');
      // Здесь можно добавить свой код для обработки нажатия "Влево"
      lost()
    } else if (event.keyCode === rightArrowKey) {
      // console.log('Нажата клавиша "Вправо"');
      // Здесь можно добавить свой код для обработки нажатия "Вправо"
      win()
    }

  }
  //END HANDLERS
  const saveLesson = () => {

    const userId = +localStorage.getItem('userId')
    const lessonId = +localStorage.getItem('lessonId')
    // Создаем объект данных для отправки на сервер 
    const data = {
      userId,
      lessonId,
      lesson: items,
      score: { count: itemsCount, mistakes: faults }
    }
    // Отправляем данные на сервер с использованием fetch 
    fetch('/lessons/save', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) { // Обработка успешного ответа от сервера 
          // console.log("Данные успешно отправлены на сервер.");
          return response.json(); // Преобразование ответа в JSON
        } else { //Обработка ошибки 
          console.error("Произошла ошибка при отправке данных на сервер.");

        }
      })
      .then(data => {
        // Обработка JSON-ответа от сервера
        console.log("Сохранение прогресса", data);
      })
      .catch(error => {
        console.error("Произошла ошибка при сохранении прогресса:", error);
      });
  }

  const win = (e) => {
    if (e) e.target.blur()
    items.shift()

    saveLesson()
    next()
  }

  const lost = (e) => {
    //добавляем item в работу над ошибками
    if (e) e.target.blur()
    faults++
    insert(items, 3)

    saveLesson()
    next()
  }

  //LISTENERS
  //VOICE
  volumeSlider.addEventListener('change', () => {
    volumeSlider.blur()
    // VARS.voiceVolume = volumeSlider.value / 100

  })
  rateSlider.addEventListener('change', () => {
    rateSlider.blur()
    // VARS.voiceRate = rateSlider.value / 10
  })

  const speakSelection = () => {
    if (isCorrection) return
    var selectedText = '';

    if (window.getSelection) {
      selectedText = window.getSelection().toString();
    }

    if (selectedText.length > 0) {
      speak(selectedText)
      return true

    }
    return false
  }

  //END VOICE

  document.querySelector('.buttons .ok').addEventListener('click', win)
  document.querySelector('.buttons .wrong').addEventListener('click', lost)
  document.addEventListener('keydown', handleKeyPress);


  engBox.addEventListener('click', () => {
    if (speakSelection()) return

    const text = engBox.textContent
    if (text && !isCorrection)
      speak(text)
  })

  menuVoicesBtn.addEventListener('click', () => {

    voiceSettingBox.classList.toggle('voice-setting-box-hidden')

    if (voiceSettingBox.classList.contains('voice-setting-box-hidden')) {
      saveVoice()
    }
  })

  lessonBodyContainer.addEventListener('click', (e) => {
    if (e.target === engBox || voiceSettingBox.classList.contains('voice-setting-box-hidden')) return

    voiceSettingBox.classList.add('voice-setting-box-hidden')
    saveVoice()

  }
  )

  //END LISTENERS

  //START
  const divData = document.getElementById("data");
  const dataValue = divData.dataset.phrases;
  let items = JSON.parse(dataValue)
  init().then(data => {
    if (data.length > 0) {

      document.querySelector('.voices-box').style.display = 'block'

      const names = data[0].map(el => el.name)
      // VARS.voicesNames = names

      names.forEach(function (name) {
        const option = document.createElement("option");
        option.value = name;
        option.text = name;
        voiceSelectEN.appendChild(option);
      });

      const namesTR = data[1].map(el => el.name)
      namesTR.forEach(function (name) {
        const option = document.createElement("option");
        option.value = name;
        option.text = name;
        voiceSelectTR.appendChild(option);
      });

      // debugger
      loadVoiceFromLS()

      // Обработчик изменения выбора в выпадающем списке

      voiceSelectEN.addEventListener("change", function () {
        const selectedValue = voiceSelectEN.value;

        // VARS.currentVoice = selectedValue;
        //console.log('currentVoice = ', JSON.stringify(VARS.currentVoice))

      });

      voiceSelectTR.addEventListener("change", function () {
        const selectedValue = voiceSelectTR.value;

        // VARS.currentVoiceTR = selectedValue;

      });

      document.querySelector('.close').addEventListener('click', () => {
        // voiceSettingBox.style.display = 'none'
        voiceSettingBox.classList.add('voice-setting-box-hidden')
        saveVoice()

      })

    }
  })

  //VARS !!!здесь нужно загружать из сохранений !!!
  const itemsCount = +divData.dataset.count
  let faults = +divData.dataset.mistakes

  const lessonName = lessonTitle.textContent

  //END VARS

  //сразу сохраняем урок в начатые уроки
  //связано с работой над ошибками -> так как нужно сразу удалить юзера из wob.json на сервере

  setTimeout(() => {
    lessonBox.classList.remove('lesson-body-hidden')
    next()
  }, 1000)

  // OVERLAY FORM

  const ovform = document.querySelector(".overlay-form")
  const ovformform = document.querySelector(".overlay-form form")

  document.querySelector('.form-buttons').addEventListener('click', (e) => {
    ovformform.classList.remove('center')
    setTimeout(() => { ovform.classList.remove('active') }, 700)
  })

  document.querySelector('.translation').addEventListener('dblclick', () => {
    if (!canPressButton) return
    ovform.classList.add('active')
    ovformform.classList.add('center')

    btnSubmit.blur()
    clearTimeout(timer)
    showCorrectForm(items[0])
    isCorrection = true
  })

  document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()

    //заменяем все оставшиеся в уроке члены массива items с items[0] на новое значение из формы
    replaceCurrentItem()
    btnSubmit.blur()
    isCorrection = false
  })

  const eng = document.getElementById('eng')
  const tr = document.getElementById('tr')
  const help = document.getElementById('help')
  const btnSubmit = document.getElementById('btn-submit')

  //overlay form FUNCTIONS
  const showCorrectForm = (obj) => {
    eng.value = obj.eng
    tr.value = obj.tr
    help.value = obj.help
  }

  const replaceCurrentItem = () => {
    const currentItem = {
      eng: items[0].eng,
      tr: items[0].tr,
      help: items[0].help
    }

    // console.log('currenItem', currentItem)
    const newItem = {
      eng: eng.value, tr: tr.value.replace(/\%/g, '\u0301'), help: help.value.replace(/\%/g, '\u0301')
    }

    items.forEach((el, index) => {
      if (el.eng === currentItem.eng) {
        items[index].eng = newItem.eng
        items[index].tr = newItem.tr
        items[index].help = newItem.help
      }
    })

    //обновить надписи в окне
    next()
    //передать изменения на сервер в исходный файл урока
    correctLessonItems(currentItem, newItem)
  }


  const correctLessonItems = (currentItem, newItem) => {
    const data = { currentItem: currentItem, newItem: newItem, lessonId: lessonId }
    // Отправляем данные на сервер с использованием fetch 
    fetch(`/lessons/correct`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) { // Обработка успешного ответа от сервера 
          // console.log("Данные успешно отправлены на сервер.");
          return response.json(); // Преобразование ответа в JSON
        } else { //Обработка ошибки 
          console.error("Произошла ошибка при отправке данных на сервер.");

        }
      })
      .then(data => {
        // Обработка JSON-ответа от сервера
        // console.log("Сервер ответил:", data);
      })
      .catch(error => {
        console.error("Произошла ошибка при выполнении запроса:", error);
      });
  }
  //END overlay form FUNCTIONS

  //use-tr-voice - включить-выключить озвучку перевода
  document.getElementById('use-tr-voice').addEventListener('change', (e) => {
    if (e.target.checked) {
      // console.log('checked')
      window.useTrVoice = true
    } else {
      // console.log('not checked')
      window.useTrVoice = false
    }
  })

})


