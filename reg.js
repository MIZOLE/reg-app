module.exports = function regNumbers(pool) {


    async function resetReg() {
        const deleteall = await pool.query('delete from regnumbers');
        return deleteall.rows
    }

    async function checkIfexist(regnumbers) {

        const check = await pool.query('select all_registrations from regnumbers where all_registrations = $1', [regnumbers])
        return check.rowCount === 0;
    }

    async function startswith(regnumbers) {

        if (regnumbers !== "1" || "2" || "3") {
            //to check the string
            //to select the appropriate town string
            let AllTowns = await pool.query('select starts_with from towns where starts_with = $1', [regnumbers])
            //add town string that is appropriate
            return AllTowns.rows;
        }
    }



    async function addRegN(regnumbers) {
        if (!regnumbers == "") {

            //splitting reg into towns and reg numbers 
            let Towns = regnumbers.substring(0, 2)
            let func = startswith(Towns)
            // console.log(func);

            let regId = await pool.query('select id from towns where starts_with = $1', [Towns])
            let id = regId.rows[0].id

            let checkTable;
            if (id > 0) {


                checkTable = await pool.query('select * from regnumbers where all_registrations =$1', [regnumbers])
            }

            if (checkTable.rowCount === 0) {

                await pool.query('insert into regnumbers (all_registrations, town_id) values( $1, $2)', [regnumbers, id])
            }
        }
    }

    async function ALLregnumbers() {
        const getPlates = await pool.query('select * from regnumbers ')
        return getPlates.rows;
    }


    async function filterbytown(town_name) {

        if (town_name === 'All') {
            const filter = await pool.query(`select all_registrations from regnumbers`)
            return filter.rows
        } else {
            let other = await pool.query(`select all_registrations from regnumbers where town_id = $1`, [town_name])
            return other.rows
        }

    }

    return {
        resetReg,
        checkIfexist,
        addRegN,
        ALLregnumbers,
        filterbytown,
        startswith
    }

}