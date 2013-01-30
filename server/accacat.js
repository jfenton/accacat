
if(Meteor.is_server) {
	Meteor.startup(function() {
		var Assessments = new Meteor.Collection('assessments');

		Meteor.publish('assessment', function(assessment_id) {
			if(assessment_id) {
				return Assessments.find({ _id: assessment_id });
			}
		});

		Meteor.methods({
/*
			email_assessment: function(assessment_id, to, subject, text) {
			},
*/
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

