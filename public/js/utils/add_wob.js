
export const addWOB = (userId, item) => {
  const data = {
    userId,
    item
  }

  fetch('/lessons/wob', {
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
      console.log("add WOB ответ сервера", JSON.stringify(data))
    })
    .catch(error => {
      console.error("Произошла ошибка при выполнении запроса:", error);
    });
}