Npm.depends({
	'simplesmtp': '0.3.8'
});

Package.on_use(function (api) {
	api.add_files("simplesmtp.js", "server");
});

