
if(Meteor.is_server) {

	Meteor.startup(function() {

		var Assessments = new Meteor.Collection('assessments');

		Meteor.publish('assessment', function(assessment_id) {
			if(assessment_id) {
				console.log('publishing assessment_id ' + assessment_id + ' to client');
				return Assessments.find({ assessment_id: assessment_id });
			}
		});

		// Disable ability for client to 'remove' documents from collections
	/*
		var collections = ['assessments'];
		_.each(collections, function(collection) {
			_.each(['insert', 'update', 'remove'], function(method) {
				Meteor.default_server.method_handlers['/' + collection + '/' + method] = function() {};
			});
		});
	*/

		Meteor.methods({

/*
			email_assessment: function(assessment_id, to, subject, text) {
			},
*/
			create_or_get_assessment: function(assessment_id) {
				var assessment = Assessments.findOne({ assessment_id: assessment_id });
				if(!assessment) {
					mongo_id = Assessments.insert({
						'assessment_id': assessment_id,
						'application_name': ''
					});
					console.log('created new application', assessment_id, assessment_id);
					assessment = Assessments.findOne({ assessment_id: assessment_id });
				} else console.log('found existing application ', assessment_id);
				console.log(assessment);
				return assessment;
			},
			update_assessment: function(assessment_id, update) {
				console.log('updated assessment', assessment_id, update);
				var ret = Assessments.update({ assessment_id: assessment_id }, update);
				console.log(ret);
				var assessment = Assessments.findOne({ assessment_id: assessment_id });
				console.log(assessment);
			}
		});

	/*
		Assessments.allow({
			insert: function(uid, assessment) {
				return true;
			}
			remove: function(uid, assessment) {
				return false;
			}
			remove: function(uid, assessment) {
				return false;
			}
		});
	*/

	});

}

