
Assessments = new Meteor.Collection('assessments');

Meteor.publish('assessment', function(assessment_id) {
	if(assessment_id) {
		return Assessments.find({ _id: assessment_id });
	}
});

Meteor.methods({
	email_assessment: function(assessment_id, application_name, to, subject, text) {
		if(this.isSimulation) return true;
		var client = new Pdfcrowd.Pdfcrowd("acca", "e2bd9f496733f0b85f9a81178d8e4d2e");
		client.convertURI('http://accacat.herokuapp.com/' + assessment_id + '/results', {
			pdf: function(rstream) {
				var wstream = fs.createWriteStream('tmp/' + assessment_id + '.pdf');
				rstream.on('end', function() {
					var mc = new MailComposer.MailComposer();
					mc.setMessageOption({
						from: 'CAT@asiacloud.org',
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
					console.log('sent email to ' + to);
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

