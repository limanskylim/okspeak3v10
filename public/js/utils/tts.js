
let synth

const selectEN = document.getElementById('selectEN')
const selectTR = document.getElementById('selectTR')
const volume = document.getElementById('volumeSlider')
const rate = document.getElementById('rateSlider')

export const init = () => {

  return new Promise(resolve => {

    // Создаем объект распознавания речи
    synth = window.speechSynthesis;

    // Заполняем список голосов
    synth.onvoiceschanged = () => {
      const voices = synth.getVoices();
      // const enUsVoices = voices.filter(voice => voice.lang === 'en-US' || voice.lang === 'en-GB' || voice.lang === 'en-AU');
      const enUsVoices = voices.filter(voice => voice.lang === 'en-US');
      const ruRuVoices = voices.filter(voice => voice.lang === 'ru-RU');

      // console.log(enUsVoices)
      enUsVoices.localServer = false
      const enTRvoices = [enUsVoices, ruRuVoices]

      resolve(enTRvoices)
    }

  })
}

export const speakTranslation = (txt) => {
  return new Promise(resolve => {
    var cleanedTxt = txt.replace(/[^а-яА-ЯёЁ.,!?-\s\d]/g, '');
    window.speechSynthesis.cancel()
    // Создаем объект сообщения
    const message = new SpeechSynthesisUtterance(cleanedTxt);

    const selectedVoice = synth.getVoices().find(voice => voice.name === selectTR.value)
    // console.log('tts selectedVpice = ', selectedVoice)
    if (selectedVoice)
      message.voice = selectedVoice

    message.lang = 'ru-RU'

    message.volume = 1
    message.rate = 1

    synth.speak(message);

    // Установка обработчика завершения синтеза речи
    message.onend = function (event) {
      // console.log('Перевод прозвучал');
      // Ваш код, который выполняется после завершения синтеза
      resolve('speech OK')
    };

  })

}

// Обработчик события клика по кнопке
export const speak = (txt) => {

  window.speechSynthesis.cancel()
  // Создаем объект сообщения
  const message = new SpeechSynthesisUtterance(txt);

  // Получаем выбранный голос
  const selectedVoice = synth.getVoices().find(voice => voice.name === selectEN.value)

  if (selectedVoice) {
    message.voice = selectedVoice;
  }

  message.volume = volumeSlider.value / 100
  message.rate = rateSlider.value / 10
  message.lang = 'En-US'

  // Воспроизводим сообщение
  synth.speak(message);

}

//SAVE - LOAD

export const saveVoice = () => {
  //голосовые данные будут записаны в localStorage в объект voice

  const userKey = localStorage.getItem('currentUserKey')
  const userId = localStorage.getItem('userId')
  const voiceKey = 'voice_' + userId
  // const voiceSet = JSON.parse(localStorage.getItem('voiceKey'))
  const currentVoice = selectEN.value
  const currentVoiceTR = selectTR.value
  const volume = volumeSlider.value / 100
  const rate = rateSlider.value / 10
  // debugger
  const voiceSet = {
    currentVoice,
    currentVoiceTR,
    volume,
    rate
  }

  // settings.voice = voice

  localStorage.setItem(voiceKey, JSON.stringify(voiceSet))

}


export const loadVoiceFromLS = () => {


  //грузим голос из localStorage
  const userId = localStorage.getItem('userId')
  const key = 'voice_' + userId
  const data = JSON.parse(localStorage.getItem(key))
  if (data) {
    selectEN.value = data.currentVoice
    selectTR.value = data.currentVoiceTR
    volume.value = data.volume * 100
    rate.value = data.rate * 10
  } else {
    selectEN.value = selectEN.options[0].value
    selectTR.value = selectTR.options[0].value
    volume.value = 0.7 * 100
    rate.value = 0.7 * 10
  }

}


