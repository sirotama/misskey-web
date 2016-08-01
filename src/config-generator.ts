import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as inquirer from 'inquirer';
import {IConfig} from './iconfig';
import {configPath, configDirPath} from './meta';

export default async () => {
	const as: any = await inquirer.prompt([
		{
			type: 'input',
			name: 'maintainer',
			message: 'Maintainer name(and email address):'
		},
		{
			type: 'input',
			name: 'host',
			message: 'Host:'
		},
		{
			type: 'input',
			name: 'bind_port',
			message: 'Listen port:'
		},
		{
			type: 'input',
			name: 'port',
			message: 'Access port:'
		},
		{
			type: 'confirm',
			name: 'https',
			message: 'Use TLS?',
			default: false
		},
		{
			type: 'input',
			name: 'https_key',
			message: 'Path of tls key:',
			when: ctx => ctx.https
		},
		{
			type: 'input',
			name: 'https_cert',
			message: 'Path of tls cert:',
			when: ctx => ctx.https
		},
		{
			type: 'input',
			name: 'https_ca',
			message: 'Path of tls ca:',
			when: ctx => ctx.https
		},
		{
			type: 'input',
			name: 'session_secret',
			message: 'Session secret:'
		},
		{
			type: 'input',
			name: 'recaptcha_site',
			message: 'reCAPTCHA\'s site key:'
		},
		{
			type: 'input',
			name: 'recaptcha_secret',
			message: 'reCAPTCHA\'s secret key:'
		},
		{
			type: 'input',
			name: 'api_key',
			message: 'API key:'
		},
		{
			type: 'input',
			name: 'core_host',
			message: 'Core\'s host:'
		},
		{
			type: 'input',
			name: 'core_port',
			message: 'Core\'s port:'
		},
		{
			type: 'confirm',
			name: 'core_secure',
			message: 'Is Core secure?:'
		},
		{
			type: 'input',
			name: 'core_internal_host',
			message: 'Internal core host:',
			default: 'localhost'
		},
		{
			type: 'input',
			name: 'core_internal_port',
			message: 'Internal core port:'
		},
		{
			type: 'input',
			name: 'mongo_host',
			message: 'MongoDB\'s host:',
			default: 'localhost'
		},
		{
			type: 'input',
			name: 'mongo_port',
			message: 'MongoDB\'s port:',
			default: '27017'
		},
		{
			type: 'input',
			name: 'mongo_db',
			message: 'MongoDB\'s db:',
			default: 'misskey-web'
		},
		{
			type: 'input',
			name: 'mongo_user',
			message: 'MongoDB\'s user:'
		},
		{
			type: 'password',
			name: 'mongo_pass',
			message: 'MongoDB\'s password:'
		},
		{
			type: 'input',
			name: 'redis_host',
			message: 'Redis\'s host:',
			default: 'localhost'
		},
		{
			type: 'input',
			name: 'redis_port',
			message: 'Redis\'s port:',
			default: '6379'
		},
		{
			type: 'password',
			name: 'redis_pass',
			message: 'Redis\'s password:'
		}
	]);

	const conf: IConfig = {
		maintainer: as.maintainer,
		host: as.host,
		port: parseInt(as.port, 10),
		bindPort: parseInt(as.bind_port, 10),
		https: {
			enable: as.https,
			key: as.https_key || null,
			cert: as.https_cert || null,
			ca: as.https_ca || null
		},
		sessionSecret: as.session_secret,
		recaptcha: {
			siteKey: as.recaptcha_site,
			secretKey: as.recaptcha_secret
		},
		api: {
			key: as.api_key,
			host: as.core_host,
			port: parseInt(as.core_port, 10),
			secure: as.core_secure,
			internal: {
				host: as.core_internal_host,
				port: parseInt(as.core_internal_port, 10)
			}
		},
		mongodb: {
			host: as.mongo_host,
			port: parseInt(as.mongo_port, 10),
			db: as.mongo_db,
			user: as.mongo_user,
			pass: as.mongo_pass
		},
		redis: {
			host: as.redis_host,
			port: parseInt(as.redis_port, 10),
			pass: as.redis_pass
		}
	};

	console.log('Thanks, writing...');

	try {
		fs.mkdirSync(configDirPath);
		fs.writeFileSync(configPath, yaml.dump(conf));
		console.log('Well done.');
	} catch (e) {
		console.error(e);
	}
};
