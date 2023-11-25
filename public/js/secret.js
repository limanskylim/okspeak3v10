
document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("lim-form");
  const info = document.getElementById("info")

  form.addEventListener("submit", function (event) {
    // Предотвращаем стандартное поведение формы 
    event.preventDefault();
    // Получаем данные из формы 
    const secretWord = document.getElementById("secret").value;
    if (!secretWord) {
      info.textContent = "You forgot to enter the secret word! 😠"
      return
    }

    // Создаем объект данных для отправки на сервер 
    const data = { secret: secretWord };
    // Отправляем данные на сервер с использованием fetch 
    fetch('/', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) { // Обработка успешного ответа от сервера 

          return response.json(); // Преобразование ответа в JSON
        } else { //Обработка ошибки 
          console.error("Произошла ошибка при отправке данных на сервер.");

        }
      })
      .then(data => {
        // Обработка JSON-ответа от сервера

        info.style.opacity = 1
        if (data.userName !== 'unknown') {
          info.textContent = `Hi, ${data.userName} 🥰`

          exit(data.userId)
        } else {
          info.textContent = `Wrong secret word! Get out of here! 😠`
          info.style.color = 'red'
        }

      })
      .catch(error => {
        console.error("Произошла ошибка при выполнении запроса:", error);

      });
  });

  const exit = (userId) => {
    const page = document.getElementById('secret-page')
    /**
     * в хранилище создаем объект,
     * связанный с текущим юзером
     * ключ = user_ + userId
     */

    localStorage.setItem('currentUserKey', 'u' + userId)
    localStorage.setItem('userId', userId)

    setTimeout(() => {
      page.style.opacity = 0
    }, 1500)
    setTimeout(() => {
      window.location.href = `/lessons?userId=${userId}`
    }, 2500)
  }

});
