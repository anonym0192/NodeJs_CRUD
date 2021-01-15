const express = require('express');
const router = require('./routes/index');
const mustache = require('mustache-express');
const helpers =  require('./helpers');
const errorHandler = require('./handlers/errorHandler.js').notFound;
const filterMenuMiddleware = require('./middlewares/filterMenuMiddleware').index;
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy; 

//Configuration
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(__dirname+'/public'));

//Passport config
app.use(passport.initialize());
app.use(passport.session());
const User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next)=>{

    res.locals.h = {...helpers};
    res.locals.flashes = req.flash();
    res.locals.user = req.user;

    //filter menu to logged user
    if(req.user){
        res.locals.h.menu = res.locals.h.menu.filter(i=>i.logged);
    //filter menu to guests
    }else{
        res.locals.h.menu = res.locals.h.menu.filter(i=>i.guest);
    }
    next();
});

app.use( router );
app.use(errorHandler);

//View Engine config
app.engine('mst', mustache(__dirname+'/views/partials', '.mst'));
app.set('view engine', 'mst');
app.set('views', __dirname+'/views');

module.exports = app;