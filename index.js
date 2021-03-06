const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const {Pool} = require('pg');

const waiterFactory = require('./functions/waiter-functions');

// should we use a SSL connection
let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local){
	useSSL = true;
}
// which db connection to use
const connectionString = process.env.DATABASE_URL || 'postgresql://lusanda:pg123@localhost:5432/waiters_availability';

const pool = new Pool({
	connectionString,
	ssl : {
		rejectUnauthorized:false
	}
});

const app = express();
const instWaiter = waiterFactory(pool);

app.use(express.static('public'));

const handlebarSetup = exphbs({
	partialsDir: './views/partials',
	viewPath:  './views',
	layoutsDir : './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// initialise session middleware - flash-express depends on it
app.use(session({
	secret : 'error and success messages',
	resave: false,
	saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());


app.get('/', function(req, res){
	res.render('index');
});

app.post('/waiter', async function(req, res) {
	if (req.body.username != '') {
		await instWaiter.setWaiter(req.body.username);
		let waiter = instWaiter.getWaiter();

		res.redirect(`waiters/${waiter}`);
	} else {
		req.flash('error', 'Please enter your username first.');
		res.redirect('/');
	}
	
});

app.get('/waiters/:username', async function(req, res) {
	let waiterName = instWaiter.getWaiter();
	let myDays = await instWaiter.selectedDaysChecked(waiterName);

	res.render('waiters', {waiterName, myDays});
});

app.post('/shifts', async function (req, res) {
	let strWaiter = instWaiter.getWaiter();
	let waiterShifts = req.body.checkDays;

	if ( waiterShifts == undefined ) {
		req.flash('error', 'Please select at least one day.');
	} else 	{
		req.flash('success', 'Shifts successfuly updated.');
		await instWaiter.selectShifts(waiterShifts);
	}

	
	
	res.redirect(`waiters/${strWaiter}`);
});

app.get('/admin/days', async function(req, res) {
	const displayTable = await instWaiter.joinTables();
	const addClasslist = await instWaiter.addClasslistEachDay();

	const Monday = [];
	const Tuesday = [];
	const Wednesday = [];
	const Thursday = [];
	const Friday = [];
	const Saturday = [];
	const Sunday = [];

	for (const i of displayTable) {
		if (i.days === 'Sunday') {
			Sunday.push(i.name);

		} else if (i.days === 'Monday') {
			Monday.push(i.name);

		} else if (i.days === 'Tuesday') {
			Tuesday.push(i.name);

		} else if (i.days === 'Wednesday') {
			Wednesday.push(i.name);

		} else if (i.days === 'Thursday') {
			Thursday.push(i.name);

		} else if (i.days === 'Friday') {
			Friday.push(i.name);

		}
		if (i.days === 'Saturday') {
			Saturday.push(i.name);

		}
	}

	res.render('admin', {
		Sunday,
		Monday,
		Tuesday,
		Wednesday,
		Thursday,
		Friday,
		Saturday,
		addClasslist
	});
});

app.get('/reset', async function(req, res) {
	await instWaiter.resetData();
	req.flash('info', 'Shift schedule has been successfuly reset.');

	res.redirect('/admin/days');
});

let PORT = process.env.PORT || 3010;

app.listen(PORT, function(){
	console.log('App starting on port', PORT);
});