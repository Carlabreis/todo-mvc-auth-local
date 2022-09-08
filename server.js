const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport') //hndles the authentication; has strategies (login access: local, google, twitter...)
const session = require('express-session') // help us have loged in users
const MongoStore = require('connect-mongo')(session) // help us have loged in users; cookies to keep the session
const flash = require('express-flash') // helps shows error messages for validation
const logger = require('morgan') // morgan runs all the logs
const connectDB = require('./config/database') // onnet to our mongodb database
const mainRoutes = require('./routes/main') // link to our routes
const todoRoutes = require('./routes/todos') // link to our routes

require('dotenv').config({path: './config/.env'}) // tell express to use environment variables

// Passport config
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))
// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use('/', mainRoutes)
app.use('/todos', todoRoutes)

app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})
