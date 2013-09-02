Npm.depends({
	'mailcomposer': '0.2.1'
});

Package.on_use(function (api) {
	api.add_files("mailcomposer.js", "server");
});

