/**
 * Web server
 */

// Core modules
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';

// express modules
import * as express from 'express';
import * as useragent from 'express-useragent';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as favicon from 'serve-favicon';
const hsts = require('hsts');

// Internal modules
import api from './core/api';
import config from './config';
import router from './router';

/**
 * Init app
 */
const app = express();

app.disable('x-powered-by');

app.set('etag', false);
app.set('views', __dirname);
app.set('view engine', 'pug');

app.locals.config = config;
app.locals.env = process.env.NODE_ENV;
app.locals.compileDebug = false;
app.locals.cache = true;

/**
 * Compressions
 */
app.use(compression());

/**
 * CORS
 */
app.use(cors({
	origin: true,
	credentials: true
}));

/**
 * HSTS
 */
app.use(hsts({
	maxAge: 1000 * 60 * 60 * 24 * 365,
	includeSubDomains: true,
	preload: true
}));

/**
 * Statics
 */
app.use(favicon(`${__dirname}/resources/favicon.ico`));
app.use('/_/resources', express.static(`${__dirname}/resources`));
app.get('/manifest.json', (req, res) => res.sendFile(__dirname + '/resources/manifest.json'));
app.get('/apple-touch-icon.png', (req, res) => res.sendFile(__dirname + '/resources/apple-touch-icon.png'));

/**
 * Basic parsers
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Parse user-agent
 */
app.use(useragent.express());

/**
 * Initialize requests
 */
app.use(async (req, res, next): Promise<any> =>
{
	// Security headers
	res.header('X-Frame-Options', 'DENY');

	// See http://web-tan.forum.impressrd.jp/e/2013/05/17/15269
	res.header('Vary', 'User-Agent');

	const i = req.cookies['i'];

	if (i === undefined) {
		res.locals.signin = false;
		res.locals.user = null;
		return next();
	}

	// Fetch user data
	try {
		res.locals.signin = true;
		res.locals.user = await api('i', { _i: i });
	} catch (e) {
		console.error(e);
		res.status(500).send('Core Error');
		return;
	}

	next();
});

/**
 * Routing
 */
router(app);

/**
 * Create server
 */
const server = config.https.enable ?
	https.createServer({
		key: fs.readFileSync(config.https.key),
		cert: fs.readFileSync(config.https.cert),
		ca: fs.readFileSync(config.https.ca)
	}, app) :
	http.createServer(app);

/**
 * Server listen
 */
server.listen(config.port, () => {
	process.send('listening');
});
