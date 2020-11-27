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

    it('it should be able to check if the reg exist to the data base', async function () {
        let HowManyAdded = numbers(pool)

        await HowManyAdded.addRegN('CJ 558 998')

        assert.deepEqual(true, await HowManyAdded.checkIfexist(2)
        )
    })

    it('it should be able to add new reg number to the data base', async function () {
        let HowManyAdded = numbers(pool)

        await HowManyAdded.addRegN('CJ 558 998')

        var addReg = await HowManyAdded.ALLregnumbers()

        assert.deepEqual('CJ 558 998', addReg[0].all_registrations)
    })

    it("should get all the reg numbers", async function () {
        const reg = numbers(pool)

        var reg1 = "CA 885 434";
        var reg2 = "CJ 552 445";
        var reg3 = "CY 123 456";

        await reg.addRegN(reg1)
        await reg.addRegN(reg2)
        await reg.addRegN(reg3)

        assert.deepEqual([{ regnumbers: "CJ 12345" }], [{ regnumbers: "CJ 12345" }], [{ regnumbers: "CY 123456" }], await reg.ALLregnumbers());
    });

    it("should be able to reset the dataBase", async function () {
        const reg = numbers(pool)

        await reg.addRegN('CA 12345')
        await reg.addRegN('CJ 1234')

        const NUMBERS = await reg.ALLregnumbers()
        assert.deepEqual([], await reg.resetReg());
    });

    it("should be able to filter for Cape Town ", async function () {
        var reg = numbers(pool)

        await reg.addRegN("CA 666 845")
        await reg.addRegN("CY 636 845")
        await reg.addRegN("CJ 656 845")



        assert.deepEqual([{ all_registrations: 'CA 666 845' }], await reg.filterbytown('1'));
});

it("should be able to filter for Paarl ", async function () {
    var reg = numbers(pool)

    await reg.addRegN("CA 666 845")
    await reg.addRegN("CY 636 845")
    await reg.addRegN("CJ 656 845")

    assert.deepEqual([{ all_registrations: 'CJ 656 845' }], await reg.filterbytown('2'));
});

it("should be able to filter for Belville ", async function () {
    var reg = numbers(pool)

    await reg.addRegN("CA 666 845")
    await reg.addRegN("CY 636 845")
    await reg.addRegN("CJ 656 845")

    assert.deepEqual([{ all_registrations: 'CY 636 845' }], await reg.filterbytown('3'));
});

it("should be able to filter for All towns ", async function () {
    var reg = numbers(pool)

    await reg.addRegN("CA 666 845")
    await reg.addRegN("CY 636 845")
    await reg.addRegN("CJ 656 845")

    assert.deepEqual([{ all_registrations: "CA 666 845"}, { all_registrations: "CY 636 845"}, { all_registrations: "CJ 656 845"}], await reg.filterbytown('All'));
});



});