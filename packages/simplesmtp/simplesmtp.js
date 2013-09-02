
Simplesmtp = Npm.require('simplesmtp');

pool = Simplesmtp.createClientPool(
	587,
	'smtp.sendgrid.net',
	{
		secureConnection: false,
		auth: {
			user: 'app11443580@heroku.com',
			pass: 'b3dyxtya'
		}
	}
);

