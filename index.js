const flash = require('express-flash');
const session = require('express-session');
let express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const regnumbers = require('./reg')
const pg = require("pg");
const Pool = pg.Pool;

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
    req.flash('info', 'Flash Message Added');
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
        regNnumbers: await Reg.ALLregnumbers()
    });

})

app.post('/regnames', async function (req, res) {

    const addmessage = req.body.registrations;
     await Reg.addRegN(addmessage)

    // const filtering = await Reg.filterbytown()

    res.render('index', {
        regNumbers: await Reg.ALLregnumbers(addmessage)       
    })
})

app.get('/reset', async function (req, res) {

    await Reg.resetReg()
    res.render('index',

    )
})



let PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});


