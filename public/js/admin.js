document.addEventListener("DOMContentLoaded", function () {
  const makeFileBtn = document.getElementById('show-file-box')
  const makeLessonBtn = document.getElementById('show-lesson-box')

  const makeFileBox = document.querySelector('.make-file-box')
  const mfUrlInput = document.getElementById('mf-url')
  const mfContent = document.getElementById('mf-file-content')
  const mfOK = document.getElementById('mf-make-file-ok')

  const makeLessonBox = document.querySelector('.make-lesson-box')
  const mlUrlInput = document.getElementById('ml-url')
  const mlIdInput = document.getElementById('ml-id')
  const mlNameInput = document.getElementById('ml-name')
  const mlIndexInput = document.getElementById('ml-targetId')
  const mlContent = document.getElementById('ml-lesson-content')
  const mlOK = document.getElementById('ml-make-lesson-ok')

  makeFileBtn.addEventListener('click', () => {
    if (makeFileBox.style.display == 'none')
      makeFileBox.style.display = 'block'
    else makeFileBox.style.display = 'none'
  })

  makeLessonBtn.addEventListener('click', () => {
    if (makeLessonBox.style.display == 'none')
      makeLessonBox.style.display = 'block'
    else makeLessonBox.style.display = 'none'
  })

  mfOK.addEventListener('click', () => {
    if (!mfUrlInput.value) return
    if (!mfContent.value) return
    const url = mfUrlInput.value
    const content = mfContent.value

    sendFileToServer(url, content)
  })

  mlOK.addEventListener('click', () => {
    if (!mlUrlInput.value) return
    if (!mlContent.value) return
    const url = mlUrlInput.value
    const id = mlIdInput.value
    const title = mlNameInput.value
    const content = mlContent.value
    const targetId = mlIndexInput.value

    sendFileToServer(url, content, true, id, title, targetId)
  })

  const sendFileToServer = (url, content, isLesson = false, id = null, title = null, targetId = null) => {
    let data, what

    // Создаем объект данных для отправки на сервер 
    if (!isLesson) {
      what = 'File'
      data = {
        url,
        content
      }
    } else {
      what = 'Lesson'
      data = {
        url,
        id,
        title,
        content,
        targetId
      }
    }

    // Отправляем данные на сервер с использованием fetch 
    fetch('/admin/create' + what, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) { // Обработка успешного ответа от сервера 
          // console.log("Данные успешно отправлены на сервер.");
          return response.json(); // Преобразование ответа в JSON
        } else { //Обработка ошибки 
          console.error("admin.js - ошибка при отправке данных на сервер.");
        }
      })
      .then(data => {
        // Обработка JSON-ответа от сервера
        console.log("Создание файла-урока:", data);
      })
      .catch(error => {
        console.error("Ошибка при создании файла или урока:", error);
      });
  }

})