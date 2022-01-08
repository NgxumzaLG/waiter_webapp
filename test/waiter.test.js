let assert = require('assert');
const waiterFactory = require('../functions/waiter-functions');
const {Pool} = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://lusanda:pg123@localhost:5432/waiters_availability_test';

const pool = new Pool({
	connectionString,
	ssl : {
		rejectUnauthorized:false
	}
});

describe('Waiters availibility webapp' , function(){
	beforeEach(async function(){
		// clean the tables before each test run
		await pool.query('DELETE FROM waiter_shifts;');
	});


	it('Should be able to add the waiters name to the database', async function(){
		let instWaiters = waiterFactory(pool);

		await instWaiters.setWaiter('lusanda');

		assert.deepEqual([{name: 'Lusanda'}], await instWaiters.waitersTable());
	});

	it('Should not add duplicates of waiters name to the database', async function(){
		let instWaiters = waiterFactory(pool);

		await instWaiters.setWaiter('lusanda');
		await instWaiters.setWaiter('lusaNDa');

		assert.deepEqual([{name: 'Lusanda'}], await instWaiters.waitersTable());
	});


	after(function(){
		pool.end();
	});
});