// import { setLink } from "./utils/set_link.js"

const scroll = () => {
  const lastLesson = document.querySelector(`[last-lesson]`)
  if (lastLesson !== null) {
    lastLesson.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // setLink()
  scroll()
  const resultsClick = (e) => {
    var index = btnResults.indexOf(e.target)
    // console.log('index', index)
    divResults[index].classList.toggle('hidden')

  }
  ///////////////
  const btnResults = Array.from(document.querySelectorAll('.btn-results'))
  const divResults = Array.from(document.querySelectorAll('.results'))

  btnResults.forEach(btn => btn.addEventListener('click', resultsClick))

})

