module.exports = function(data) {
	const pool = data;
	let username = '';

	async function setWaiter(user) {
		username = user.charAt(0).toUpperCase() + user.slice(1).toLowerCase();

		const checkWaiter = await pool.query('SELECT name FROM waiter_names WHERE name = $1', [username]);

		if (checkWaiter.rows.length == 0) {
			await pool.query('INSERT INTO waiter_names (name) VALUES ($1)', [username]);
		}
	}

	function getWaiter() {
		return username;

	}

	async function getWaiterId() {
		const waiterId = await pool.query('SELECT id FROM waiter_names WHERE name = $1', [username]);
		
		return waiterId.rows[0].id;
	}

	async function selectShifts(selectedDays) {
		// day = string;
		// const arrayId = [];
		let theDayId;
		const theWaiterId = await getWaiterId();
	
		for (const i of selectedDays) {
			const dayId = await pool.query('SELECT id FROM week_days WHERE days = $1', [i]);
			theDayId = dayId.rows[0].id;
			// arrayId.push(strId);
			await pool.query('INSERT INTO waiter_shifts (waiter_id, day_id) VALUES ($1,$2)', [theWaiterId, theDayId]);
		}
	}

	async function joinTables() {
		const strWaiters = await pool.query(`SELECT waiter_names.name, week_days.days FROM waiter_shifts
			INNER JOIN waiter_names ON waiter_shifts.waiter_id = waiter_names.id
			INNER JOIN week_days ON waiter_shifts.day_id = week_days.id`);

		return strWaiters.rows;
	}

	async function resetData() {
		return pool.query('DELETE FROM waiter_shifts');
	}

	async function waitersTable() {
		const table = await pool.query('SELECT name FROM waiter_names');
		return table.rows;

		// const updateTable = await pool.query('SELECT * FROM waiter_shifts');
		// return updateTable.rows;
	}

	return {
		setWaiter,
		getWaiter,
		getWaiterId,
		selectShifts,
		joinTables,
		resetData,
		waitersTable
	};
};