//////////////////////////////////////////////////
// CONFIGURATION MANAGER
//////////////////////////////////////////////////

/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/js-yaml/js-yaml.d.ts" />

import * as fs from 'fs';
import * as yaml from 'js-yaml';

// Detect home path
const home = process.env[
	process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];

// Name of directory that includes config file
const dirName = '.misskey-web';

// Name of config file
const fileName = 'config.yml';

// Resolve paths
const dirPath = `${home}/${dirName}`;
const path = `${dirPath}/${fileName}`;

//////////////////////////////////////////////////
// DEFINE CONSTANTS
const domains = {
	about: 'about',
	admin: 'admin',
	api: 'api',
	color: 'color',
	forum: 'forum',
	help: 'help',
	i: 'i',
	resources: 'resources',
	signup: 'signup',
	signin: 'signin',
	signout: 'signout',
	share: 'share',
	search: 'search',
	talk: 'talk'
};

//////////////////////////////////////////////////
// CONFIGURATION LOADER

function loadConfig(): IConfig {
	let conf: IConfig;

	try {
		// Load and parse the config
		conf = <IConfig>yaml.safeLoad(fs.readFileSync(path, 'utf8'));
	} catch (e) {
		console.error('Failed to load config: ' + e);
		process.exit(1);
	}

	validateHost(conf.host);

	const host = conf.host;

	const scheme = conf.https.enable ? 'https' : 'http';
	const port = conf.https.enable
		? conf.ports.https === 443 ? '' : ':' + conf.ports.https
		: conf.ports.http === 80 ? '' : ':' + conf.ports.http;

	conf.url = `${scheme}://${host}` + port;

	conf.api.url =
		(conf.api.secure ? 'https' : 'http') + '://'
		+ conf.api.host
		+ (conf.api.secure ? conf.api.port === 443 ? '' : ':' + conf.api.port : conf.api.port === 80 ? '' : ':' + conf.api.port);

	conf.domains = domains;

	// Define hosts
	conf.hosts = {
		admin: `${domains.admin}.${host}`,
		i: `${domains.i}.${host}`,
		about: `${scheme}${domains.about}.${host}`,
		api: `${domains.api}.${host}`,
		resources: `${domains.resources}.${host}`,
		signup: `${domains.signup}.${host}`,
		signin: `${domains.signin}.${host}`,
		signout: `${domains.signout}.${host}`,
		share: `${domains.share}.${host}`,
		forum: `${domains.forum}.${host}`,
		search: `${domains.search}.${host}`,
		talk: `${domains.talk}.${host}`,
		help: `${domains.help}.${host}`,
		color: `${domains.color}.${host}`
	};

	// Define URLs
	conf.urls = {
		admin: `${scheme}://${domains.admin}.${host}`,
		i: `${scheme}://${domains.i}.${host}`,
		about: `${scheme}://${domains.about}.${host}`,
		api: `${scheme}://${domains.api}.${host}`,
		resources: `${scheme}://${domains.resources}.${host}`,
		signup: `${scheme}://${domains.signup}.${host}`,
		signin: `${scheme}://${domains.signin}.${host}`,
		signout: `${scheme}://${domains.signout}.${host}`,
		share: `${scheme}://${domains.share}.${host}`,
		forum: `${scheme}://${domains.forum}.${host}`,
		search: `${scheme}://${domains.search}.${host}`,
		talk: `${scheme}://${domains.talk}.${host}`,
		help: `${scheme}://${domains.help}.${host}`,
		color: `${scheme}://${domains.color}.${host}`
	};

	return conf;
}

export default loadConfig();

export function sanitize(conf: IConfig): any {
	const c = (<any>Object).assign({}, conf);

	delete c.recaptcha.secretKey;
	delete c.api.pass;
	delete c.mongo;
	delete c.redis;
	delete c.cookiePass;
	delete c.sessionSecret;
	delete c.bindPorts;

	return c;
};

//////////////////////////////////////////////////
// CONFIGURATION INTERFACE DEFINITION

type Domains = {
	about: string;
	admin: string;
	api: string;
	color: string;
	forum: string;
	help: string;
	i: string;
	resources: string;
	signup: string;
	signin: string;
	signout: string;
	share: string;
	search: string;
	talk: string;
}

export interface IConfig {
	api: {
		pass: string;
		host: string;
		port: number;
		secure: boolean;
		url: string;
	};
	bindIp: string;
	cookiePass: string;
	host: string;
	hosts: Domains;
	maintainer: string;
	googleSiteVerification: string;
	mongo: {
		uri: string;
		options: {
			user: string;
			pass: string;
		}
	};
	ports: {
		http: number;
		https: number;
	};
	bindPorts: {
		http: number;
		https: number;
	};
	https: {
		enable: boolean;
		keyPath: string;
		certPath: string;
	};
	sessionKey: string;
	sessionSecret: string;
	recaptcha: {
		siteKey: string;
		secretKey: string;
	};
	url: string;
	themeColor: string;
	domains: Domains;
	urls: Domains;
}

function validateHost(host: string): void {
	if (host.indexOf(':') !== -1) {
		console.error('host にはポート情報は含めないでください。必要であれば port にポート情報を記述してください。');
		process.exit();
	}
}
