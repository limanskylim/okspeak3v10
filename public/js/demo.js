// import { setLink } from "./utils/set_link.js"

document.addEventListener("DOMContentLoaded", function () {
  // setLink()

  const divData = document.getElementById("demo-data");
  const dataValue = divData.dataset.phrases;
  let items = JSON.parse(dataValue)
  const phrasesBox = document.getElementById('phrases')
  phrasesBox.classList.remove('active')

  let html = ''
  for (let i = 0; i < items.length; i++) {
    const item = `
    <div class="demo-item">
      <div class="number">${i + 1}</div>
      <div class="demo-item-texts">
        <div class="text eng-text">${items[i].eng}</div>
        <div class="text tr-text">${items[i].tr}</div>
      </div>
    </div>
    `
    html += item
  }

  phrasesBox.insertAdjacentHTML('afterbegin', html)

  setTimeout(() => { phrasesBox.classList.add('active') }, 300)

})