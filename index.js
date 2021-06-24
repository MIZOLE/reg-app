const flash = require('express-flash');
const session = require('express-session');
let express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const regnumbers = require('./reg')
const regRoutes = require('./routes')
const pg = require("pg");
const Pool = pg.Pool;

//connecting the app with the database.
const connectionString = process.env.DATABASE_URL || 'postgresql://codex123:codex123@localhost:5432/numbers';

const pool = new Pool({
    connectionString,
    // ssl: false
});

const Reg = regnumbers(pool)
const Routes = regRoutes(Reg)

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

app.get('/', Routes.AllRegNumbers)

app.post('/regnames', Routes.TheWorkFlow )

app.get('/reset', Routes.Reset);

app.get('/regnames', Routes.Filter)

let PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});


