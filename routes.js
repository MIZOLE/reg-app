module.exports = function routes(Reg) {
    const _ = require('lodash');


    let AllRegNumbers = async function (req, res) {


        res.render('index', {
            regNumbers: await Reg.ALLregnumbers()
        });
    }

    let TheWorkFlow = async function (req, res) {

        let error = ""
        let addmessage = _.upperCase(req.body.registration);
        let similar = await Reg.checkIfexist(addmessage);
        

       
      if (addmessage === '') {
            req.flash('info', 'Please enter a registration number');

        }

        else if (isNaN(addmessage) === false) {
            error = ' '
            req.flash('info', 'Please enter appropriate reg number');

        }

        else if (!/C[AYJ]/.test(addmessage) ) {
            req.flash('info', 'Registration is not recognised');
        }

        else if (addmessage.length != 10) {
            // alert("length must be exactly 6 characters")
            req.flash('info', 'Reg number must be less than 8 characters');
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

    }

    let Reset = async function (req, res) {

        await Reg.resetReg()
        req.flash('success', 'Reg numbers successfully reseted from database');
        res.render('index',
        )
    }

    let Filter = async function (req, res) {
        let buttons = req.query.places

        if (!buttons) {
            req.flash('info', 'Please select a town name');
        } else {
            var regNumbers = await Reg.filterbytown(buttons)
        }

        res.render('index', {
            regNumbers
        })
    }

    return {
        AllRegNumbers,
        TheWorkFlow,
        Reset,
        Filter

    }

}