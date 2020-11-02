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
        // var getreg = await Reg.ALLregnumbers()
        res.render('index', {
            // getreg
        });

})


app.post('/regnames', async function (req, res) {

    const addmessage = req.body.registrations
    const addData = await Reg.addRegN(addmessage)
    const plates = await Reg.ALLregnumbers()
    res.render('index', {
        addData,
        getreg: plates

    })
})

app.get('/reset', async function (req, res){

    await Reg.resetReg()
    res.render('index', 

    )
})


// app.post('/', async function (res, req) {
//     let Number = req.body;
//     let Cletter = Number.toUpperCase()

//         if (Cletter !== "") {
//             console.log(Cletter)

//             if (/C[AYJ] \d{3,6}$/.test(Cletter) || /C[AYJ] \d{3}-\d{3}$/.test(Cletter)) {

//                 if (await Reg.checkthereg(Cletter) === 0) {
//                     await Reg.addNewregnumbers(Cletter)
//                     req.flash('Welldone!', 'WELLDONE!')
//                 } else {
//                     req.flash('error', 'registration already entered!')
//                 }
//             }
//             else {
//                 req.flash('error', 'enter a valid registration!')
//             }
//         }
//         else {
//             req.flash('error', 'please enter a registration!')
//         }

//         var allreg = await regnumbers.ALLtheregnumbers()
//         res.render('index', {
//             Reg: allreg,
//         })

// })

let PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});


