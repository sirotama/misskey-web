/**
 * Module dependencies
 */
import * as cluster from 'cluster';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';
import * as expressSession from 'express-session';
import * as useragent from 'express-useragent';
import * as MongoStore from 'connect-mongo';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as csrf from 'csurf';
import * as favicon from 'serve-favicon';
import * as accesses from 'accesses';
import name from 'named';
const hsts = require('hsts');

import db from './db/db';
import UserSetting from './db/models/user-settings';
import api from './core/api';
import config from './config';
import router from './router';

const worker = cluster.worker;
console.log(`Init ${name(worker.id)} server...`);

/**
 * Init app
 */
const app = express();

app.disable('x-powered-by');

app.set('etag', false);
app.set('views', __dirname);
app.set('view engine', 'pug');

app.locals.env = process.env.NODE_ENV;
app.locals.compileDebug = false;
app.locals.cache = true;

/**
 * Logging
 */
app.use(accesses.express());

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
	maxAge: 10886400000,
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
app.use(cookieParser(config.cookiePass));

/**
 * Session
 */
const store = MongoStore(expressSession);
const sessionExpires = 1000 * 60 * 60 * 24 * 365; // One Year
app.use(expressSession({
	name: 's',
	secret: config.sessionSecret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		path: '/',
		domain: `.${config.host}`,
		secure: config.https.enable,
		httpOnly: true,
		expires: new Date(Date.now() + sessionExpires),
		maxAge: sessionExpires
	},
	store: new store({
		mongooseConnection: db
	})
}));

/**
 * CSRF
 */
app.use(csrf({
	cookie: false
}));

/**
 * Parse user-agent
 */
app.use(useragent.express());

/**
 * Initialize requests
 */
app.use(async (req, res, next): Promise<void> => {

	// Security headers
	res.header('X-Frame-Options', 'DENY');

	// See http://web-tan.forum.impressrd.jp/e/2013/05/17/15269
	res.header('Vary', 'User-Agent, Cookie');

	res.locals.signin =
		req.hasOwnProperty('session') &&
		req.session !== null &&
		req.session.hasOwnProperty('userId') &&
		(<any>req.session).userId !== null;

	res.locals.config = config;

	// Get CSRF token
	res.locals.csrftoken = req.csrfToken();

	if (!res.locals.signin) {
		res.locals.user = null;
		return next();
	}

	const userId = (<any>req.session).userId;

	// ユーザー情報フェッチ
	try {
		res.locals.user = await api('i', {}, userId);
	} catch (_) {
		res.status(500).send('Core Error');
		return;
	}

	// ユーザー設定取得
	res.locals.user._settings = await UserSetting
		.findOne({user_id: userId}).lean();

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
		key: fs.readFileSync(config.https.keyPath),
		cert: fs.readFileSync(config.https.certPath)
	}, app) :
	http.createServer(app);

/**
 * Server listen
 */
server.listen(config.bindPort, config.bindIp, () => {
	const h = server.address().address;
	const p = server.address().port;

	console.log(`\u001b[1;32m${name(worker.id)} is now listening at ${h}:${p}\u001b[0m`);
});
