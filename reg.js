module.exports = function regNumbers(pool) {


    async function resetReg() {
        const deleteall = await pool.query('delete from regnumbers');
        return deleteall.rows
    }

    async function checkIfexist(regnumbers) {

        const check = await pool.query('select * from regnumbers where all_registration = $1', [regnumbers])
        return check.rowCount
    }

    async function addRegN(regnumbers) {
        if (!regnumbers == "") {

            //splitting reg into towns and reg numbers 
            const Towns = regnumbers.substring(0, 2)
            const regId = await pool.query('select id from towns where starts_with = $1', [Towns])
            const id = regId.rows[0].id

            let checkTable;
            if (id > 0) {

                checkTable = await pool.query('select * from regnumbers where all_registrations =$1', [regnumbers])
            }


            if (checkTable.rowCount < 1) {

                await pool.query('insert into regnumbers (all_registrations, town_id) values( $1, $2)', [regnumbers, id])
            }
        }
    }

    async function ALLregnumbers() {
        const getPlates = await pool.query('select * from regnumbers ')
        return getPlates.rows;
    }


    async function filterbytown(town_name) {

        if (town_name === 'show') {
            const filter = await pool.query(`select * from regnumbers`)
            return filter.rows
        }
        const Towns = town_name.substring(0, 2)
        const regId = await pool.query('select id from towns where starts_with = $1', [Towns])
        const id = regId.rows[0].id
        const other = await pool.query(`select all_registrations from regnumbers where town_id = $1`, [id])
        return other.rows

    }


    return {
        resetReg,
        checkIfexist,
        addRegN,
        ALLregnumbers,
        filterbytown
    }

}