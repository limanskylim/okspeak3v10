const express = require('express')
const hbs = require('hbs')
const secretRouter = require('./routers/secretRouter')
const lessonRouter = require('./routers/lessonRouter')
const userRouter = require('./routers/userRouter')
const adminRouter = require('./routers/adminRouter')

const app = express()
const port = process.env.PORT || 3000;

//GLOBAL

global.passesUrl = 'data/passes/'
global.savingsUrl = 'data/savings/'
global.wobUrl = 'data/wob/'
global.WOB_COUNT = 20
global.adminId = 100
//END GLOBAL

// console.log('app.js', global.savings[0].items[0].eng)

app.use(express.static(__dirname + "/public"));

//for layout
//npm install express-handlebars
const expHbs = require('express-handlebars')
// устанавливаем настройки для файлов layout
app.engine("hbs", expHbs.engine(
  {
    layoutsDir: "hbs/layouts",
    defaultLayout: "layout",
    extname: "hbs"
  }
))

app.set('view engine', 'hbs')
app.set('views', 'hbs')


app.use('/admin', adminRouter)

app.use('/lessons', lessonRouter)

app.use('/users', userRouter)

app.use('/', secretRouter)

app.listen(port, () => {
  const date = new Date().toLocaleString()
  console.log(date)
  console.log('Server OK ...')
})


// Export the Express API
// module.exports = app