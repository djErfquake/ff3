import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

console.log("dev", dev);

// load league info
import league from './league.js';


// server and api endpoints
polka() // You can also use Express
	.get('/league', (req, res) => {
		console.log("league data requested");
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify(league.getLeagueData()));
	})
	.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});