Npm.depends({
	'pdfcrowd': '1.1.0'
});

Package.on_use(function (api) {
	api.add_files("pdfcrowd.js", "server");
});

