export interface IConfig {
	maintainer: string;
	host: string;
	bindIp: string;
	port: number;
	bindPort: number;
	https: {
		enable: boolean;
		key: string;
		cert: string;
	};
	sessionSecret: string;
	recaptcha: {
		siteKey: string;
		secretKey: string;
	};
	api: {
		key: string;
		host: string;
		port: number;
		secure: boolean;
	};
	mongodb: {
		host: string;
		db: string;
		user: string;
		pass: string;
	};
	redis: {
		host: string;
		port: number;
		pass: string;
	};
}