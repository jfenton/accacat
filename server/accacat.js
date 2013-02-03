
if(Meteor.is_server) {

	var require = __meteor_bootstrap__.require;
	var path = require("path");
	var fs = require("fs");

	NodeModules = {
		_path: null,

		require: function(moduleName) {
			var module;
			
			// check specified spot
			if (NodeModules._path)
				try {
					module = require(path.join(NodeModules._path, moduleName));
				} catch (e) {}

			// try no path
			if (!module)
				try {
					module = require(moduleName)
				} catch (e) {}

			var basePath = path.resolve('.');
			if (basePath === '/')
				basePath = path.dirname(global.require.main.filename);

			if (!module) {
				var bundlePath = path.join(basePath, 'bundle');

				if (fs.existsSync(bundlePath))
					basePath = path.join(bundlePath);

				var publicPath = path.join(basePath, 'public/node_modules');

				if (fs.existsSync(publicPath))
					basePath = publicPath;
				else
					basePath = path.join(basePath, 'static/node_modules');
			
				var modulePath = path.join(basePath, moduleName);

				if (fs.existsSync(basePath)) {

					// try public
					if (fs.existsSync(modulePath))
						try {
							module = require(modulePath);
						} catch (e) {}
				}
			}
			
			return module;
		},

		setPath: function(basePath) {
			if (basePath.indexOf('~') >= -1)
				basePath.replace('~', process.env.HOME);

			if (basePath[0] === '/')
				NodeModules._path = basePath;
			else
				NodeModules._path = path.join(resolvedPath, basePath);
		}
	};

	var pdfcrowd = NodeModules.require('pdfcrowd');

	Meteor.startup(function() {
		var Assessments = new Meteor.Collection('assessments');

		Meteor.publish('assessment', function(assessment_id) {
			if(assessment_id) {
				return Assessments.find({ _id: assessment_id });
			}
		});

		var simplesmtp = require('simplesmtp');
		var MailComposer = require('mailcomposer').MailComposer;
		var pool = simplesmtp.createClientPool(
			465, // SMTP Port
			'smtp.gmail.com',
			{
				secureConnection: true,
				auth: {
					user: 'jay.fenton@gmail.com',
					pass: '!!3ndg@m3!!J13'
				}
			}
		);

		Meteor.methods({
			email_assessment: function(assessment_id, application_name, to, subject, text) {
				if(this.isSimulation) return true;
				var client = new pdfcrowd.Pdfcrowd("acca", "e2bd9f496733f0b85f9a81178d8e4d2e");
				client.convertURI('http://accacat.herokuapp.com/3d69c3cd-4e97-4721-9530-a5f8ea6e7316/results', {
					pdf: function(rstream) {
						var wstream = fs.createWriteStream('tmp/' + assessment_id + '.pdf');
						rstream.on('end', function() {
							var mc = new MailComposer();
							mc.setMessageOption({
								from: 'jay.fenton@gmail.com',
								to: to,
								subject: subject,
								text: text
							});

							mc.addAttachment({
								fileName: 'accacat-' + application_name + '.pdf',
								filePath: 'tmp/' + assessment_id + '.pdf',
								contentType: 'application/pdf'
							});

							pool.sendMail(mc);
						});
						rstream.pipe(wstream);
					},
					error: function(errMessage, statusCode) { console.log("ERROR: " + errMessage); },
					end: function() {},
				}, {
					width: '210mm',
					height: '298mm',
					hmargin: '0.2in',
					vmargin: '0.2in',
					no_modify: '1',
					no_copy: '1',
					page_layout: '2',
					initial_pdf_zoom_type: '3',
					pdf_scaling_factor: '0.8'
				});
			},
		});

		Assessments.allow({
			insert: function(uid, assessment) {
				return true;
			},
			update: function(uid, assessment) {
				return true;
			},
			remove: function(uid, assessment) {
				return false;
			}
		});
	});
}

