
if(Meteor.is_client) {

	var Assessments = new Meteor.Collection('assessments');

	// Data structure used to build the choice matrices
	var assessment_template = [
		{
			'category': 'Security',
			'description': 'Privacy, information security, regulatory',
			'onselectclear': 'row',
			'cols': [
				{ 'title': 'Authentication', 'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Two-factor Authentication' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Standard Authentication' }
					],
				},
				{
					'title': 'User Account Logging', 'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'User account management' },
						{ 'title': 'L1', 'cell': 'Self-serve access logging & access rights' }
					]
				}
			]
		},
		{
			'category': 'Life Cycle',
			'description': 'Long-term support impacting customer business processes',
			'onselectclear': 'row',
			'cols': [
				{ 'title': 'Dev. Roadmap', 'rows': [
						{ 'title': 'L4', 'cell': 'CMM L4' },
						{ 'title': 'L3', 'cell': 'CMM L3' },
						{ 'title': 'L2', 'cell': 'CMM L2' },
						{ 'title': 'L1', 'cell': 'Yes' },
					]
				},
				{ 'title': 'Security Management', 'rows': [
						{ 'title': 'L4', 'cell': '24x7 Security Operations Center' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'Crisis Management Process' },
						{ 'title': 'L1', 'cell': 'Pro-active Security Monitoring' }
					]
				}
			]
		},
	/*
		'Performance': {
		},
		'Access': {
		},
		'Data Center Basics': {
		},
		'Certification': {
		},
		'Support': {
		},
		'Interoperability': {
		}
	*/
	];

	var categories = {};

	Session.set('assessment_id', null);

	Template.category_selection.events({
		'keyup #application_name': function(e) {
			var assessment_id = Session.get('assessment_id');
			var update = {
				$set: {'application_name': e.target.value}
			};
			
			Assessments.update({ assessment_id: assessment_id }, update);

			var assessment = Assessments.findOne({ assessment_id: assessment_id });
			Meteor.flush();
		}
	});
	Template.category_selection.assessment = function() {
		return Assessments.findOne({ assessment_id: Session.get('assessment_id') });
	};

	Template.matrix.events({
		'click td.choice': function(e) {
			if(this.cell == undefined || this.cell == '') return;

			var assessment = Assessments.findOne({ assessment_id: Session.get('assessment_id') });

			// Generate (and cache) a fast category-name-to-category hash from the above data source
			_.each(assessment.data, function(cat) { categories[cat.category] = cat; });

			var selrowtitle = this.row;
			var selcoltitle = this.col;

			var onselectclear = categories[ Session.get('category') ].onselectclear;
			_.each(categories[ Session.get('category') ].cols, function(col) {
				_.each(col.rows, function(row) {
					if(row.title == selrowtitle || onselectclear == 'table') row.cellsel = 0;
				});
			});

			if(this.cellsel != 1) { // If the cell was not previously selected i.e. we are de-selecting
				_.each(categories[ Session.get('category') ].cols, function(col) {
					if(col.title == selcoltitle) {
						_.each(col.rows, function(row) {
							if(row.title == selrowtitle) row.cellsel = 1;
						});
					}
				});
			}

/* 		TODO: Once minimongo supports $ positional access we can use this more efficient form
      Assessments.update({ 'assessment_id': Session.get('assessment_id'), 'data.category':Session.get('category'), 'data.cols.title':selcoltitle, 'data.cols.rows.title':selrowtitle, 'data.cols.rows.cell':selcelltitle }, { $set: { 'data.cols.rows.$.cellsel': 1 } });
*/

			Assessments.update({ 'assessment_id': Session.get('assessment_id') }, { $set: { 'data': assessment.data } });
		}
	});
	Template.matrix.row = function() {
		var assessment = Assessments.findOne({ assessment_id: Session.get('assessment_id') });
		var rows = {};
		if(assessment) {
			var cols = assessment.data[0].cols;	
			_.each(cols, function(col) {
				_.each(col.rows, function(row) {
					rows[row.title] = (rows[row.title] == undefined) ? [] : rows[row.title];
					rows[row.title].push({ 'col': col.title, 'row': row.title, 'cell': row.cell, 'cellsel': row.cellsel });
				});
			});

			var srows = [];
			_.each(cols[0].rows, function(row) {
				rows[row.title].unshift({ 'cell': row.title });
				srows.push(rows[row.title]);
			});
			return srows;
		} else return [];
	};
	Template.matrix.header = function() {
		var assessment = Assessments.findOne({ assessment_id: Session.get('assessment_id') });
		var headers = [];
		if(assessment) {
			var cols = assessment.data[0].cols;
			_.each(cols, function(col) {
				headers.push({ 'cell': col.title });
			});
		}
		return headers;
	};
	Template.matrix.col = function() { return this; };
	Template.matrix.cellsel = function() { return this.cellsel == 1; };
	Template.matrix.cell = function() { return this.cell; };
	Template.matrix.coltitle = function() { return this.row; };
	Template.matrix.rowtitle = function() { return this.col; };
	Template.matrix.selectable = function() { return this.col != undefined; };

	var AccacatRouter = Backbone.Router.extend({
		routes: {
			':assessment_id': 'evaluation'
		},
		evaluation: function(assessment_id) {
			Session.set("assessment_id", assessment_id);
			Session.set('category', 'Security');
		},
		setList: function (assessment_id) {
			this.navigate(assessment_id, true);
		}
	});

	Router = new AccacatRouter();

	Meteor.startup(function () {
		Backbone.history.start({ pushState: true });
		Meteor.subscribe('assessment', Session.get('assessment_id'), function() {
			var assessment_id = Session.get('assessment_id');
			var assessment = Assessments.findOne({ assessment_id: assessment_id });
			if(!assessment) {
				mongo_id = Assessments.insert({
					'assessment_id': assessment_id,
					'application_name': '',
					'data': assessment_template
				});
				console.log('created new application', assessment_id, mongo_id);
				assessment = Assessments.findOne({ assessment_id: assessment_id });
			} else console.log('found existing application ', assessment_id);
		});
	});

}
