const flash = require('express-flash');
const session = require('express-session');
let express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const regnumbers = require('./reg')
const pg = require("pg");
const Pool = pg.Pool;
const _ = require('lodash');

const connectionString = process.env.DATABASE_URL || 'postgresql://codex123:codex123@localhost:5432/numbers';

const pool = new Pool({
    connectionString,
    // ssl: false
});


const Reg = regnumbers(pool)



let app = express();
app.use(flash());

app.use(session({
    secret: "Welcome",
    resave: false,
    saveUninitialized: true
}));

app.get('/addFlash', function (req, res) {
    req.flash('success', 'Flash Message Added');

    res.redirect('/');
});

app.engine('handlebars', exphbs({
    layoutsDir: './views/layouts'
}));

app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', async function (req, res) {


    res.render('index', {
        regNumbers: await Reg.ALLregnumbers()
    });
})

app.post('/regnames', async function (req, res) {

    let error = ""
    let addmessage = _.upperCase(req.body.registration);
    let similar = await Reg.checkIfexist(addmessage);
    let select = await Reg.ALLregnumbers()
    
    if (addmessage === '') {
        error = "Please enter a registration number"
    }

    else if (isNaN(addmessage) === false) {
        error = 'Please enter appropriate reg number '
    }

    else if (addmessage.length != 10) {
        // alert("length must be exactly 6 characters")
        req.flash('info', 'length must be less than 8 characters');
    }

    else if (similar === true) {
        await Reg.addRegN(addmessage)
        req.flash('success', 'Registration successfully registered');
    }

    else if (similar === false) {
        req.flash('exist', 'Reg already exist');
    }

    if (error) {
        req.flash('info', error);
        res.render('index');
    }

    else {
        res.render('index', {
            regNumbers: await Reg.ALLregnumbers(addmessage)
        })
    }
})

app.get('/reset', async function (req, res) {

    await Reg.resetReg()
    req.flash('success', 'Reg numbers successfully reseted from database');
    res.render('index',
    )
});

app.get('/regnames', async function (req, res) {
    let buttons = req.query.places

    if (!buttons) {
        req.flash('info', 'Please select a town name');
    } else {
        var regNumbers = await Reg.filterbytown(buttons)
    }

    res.render('index', {
        regNumbers
    })
})

let PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});


