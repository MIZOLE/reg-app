const assert = require('assert');
const numbers = require('../reg');
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex123:codex123@localhost:5432/numbers';

const pool = new Pool({
    connectionString
});


describe('The Numbers database', function () {

    beforeEach(async function () {
        // clean the tables before each test run
        await pool.query("delete from regnumbers;");
        // await pool.query("delete from how_many_times;");
    });

    it('it should be able to delete all the reg numbers from the data base', async function () {

        let couuntNum = numbers(pool)

        await couuntNum.resetReg('CA 558 998')
        await couuntNum.resetReg('CJ 655 998')
        await couuntNum.resetReg('CJ 666 998')
        await couuntNum.resetReg('CA 699 998')
        await couuntNum.resetReg('CY 666 998')


        var DeletedReg = await couuntNum.ALLregnumbers()
        console.log(DeletedReg)

        assert.equal(0, DeletedReg)
    });


    it('it should be able to add new reg number to the data base', async function () {
        let HowManyAdded = numbers(pool)

        await HowManyAdded.addRegN('CA 558 998')
        await HowManyAdded.addRegN('CA 558 998')
        await HowManyAdded.addRegN('CA 558 998')

        await HowManyAdded.addRegN('CY 666 998')
        await HowManyAdded.addRegN('CJ 699 998')

        var addReg = await HowManyAdded.ALLregnumbers()

        assert.equal(5, addReg.rowCount)
    })



});