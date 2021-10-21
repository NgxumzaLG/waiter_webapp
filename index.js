const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();

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


app.get('/', function(req, res){
	res.render('index');
});

app.post('/waiter', function(req, res) {
	let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	res.render('waiters', { days});
});

let PORT = process.env.PORT || 3010;

app.listen(PORT, function(){
	console.log('App starting on port', PORT);
});