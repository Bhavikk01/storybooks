const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session)
const connectDB = require('../mongodb/db');

dotenv.config({ path: '../config/config.env'});
require('../config/passport')(passport);

const PORT = process.env.PORT || 2000

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(
    methodOverride(function (req, res) {
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method
        delete req.body._method
        return method
      }
    })
  )
  
//Logging
app.use(morgan('dev'));

const {
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select,
  } = require('../helper/hbs')
//Handlebars
app.engine(
    '.hbs',
    exphbs.engine({
      helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
      },
      defaultLayout: 'main',
      extname: '.hbs',
    })
  )

app.set('view engine', '.hbs');

//Sessions

app.use(
    session({
        secret: 'Hello Mam',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection})
    })
);

//Passports middlewares

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})  

//Routes
app.use('/', require('../routes/index'))
app.use('/auth', require('../routes/auth'))
app.use('/stories', require('../routes/stories'))

app.use(express.static(path.join(__dirname, 'public')));

connectDB();

app.listen(PORT, console.log('Server started at port 2000'));