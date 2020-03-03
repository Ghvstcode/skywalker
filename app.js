const express = require('express')
const expressLayouts = require('express-ejs-layouts')
require('./db/mongoose')
const passport = require('passport')
require('./config/passport')(passport)
const indexRouter = require('./routes/index')
const userRouter = require('./routes/users')
const flash = require('connect-flash')
const session = require('express-session')
const path = require('path')

const app = express()

//LAYOUTS
app.use(expressLayouts)
app.set('view engine', 'ejs')
//app.set('views', path.join(__dirname, 'views'));

//BODYPARSER
app.use(express.urlencoded( { extended: false } ))

//SESSION
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}))

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());


app.use(flash())

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

//Routes 
app.use('/', indexRouter)
app.use('/users', userRouter)


const PORT = process.env.PORT

app.listen(PORT, ()=> {
    console.log('server is up on port ' + PORT)
})