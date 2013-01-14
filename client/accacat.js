
var cats = [
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
_.each(cats, function(cat) { categories[cat.category] = cat; });

Assessments = new Meteor.Collection('assessments');

Session.set('assessment_id', null);

Meteor.autosubscribe(function () {
	var assessment_id = Session.get('assessment_id');
	if(assessment_id)
		Meteor.subscribe('assessments', assessment_id);
});

Template.matrix.events({
	'click td.choice': function(e) {
		if(this.cell == undefined || this.cell == '') return;
		var onselectclear = categories[ Session.get('category') ].onselectclear;
		if(onselectclear == undefined || onselectclear == 'row') {
			$(e.target).parents('tr').find('td.sel').removeClass('sel');
			$(e.target).addClass('sel');
		} else if(onselectclear == 'table') {
			$(e.target).parents('tbody').find('td.sel').removeClass('sel');
			$(e.target).addClass('sel');
		}
	}
});

Template.matrix.row = function() {
	var cols = cats[0].cols;	
	var rows = {};
	_.each(cols, function(col) {
		_.each(col.rows, function(row) {
			rows[row.title] = (rows[row.title] == undefined) ? [] : rows[row.title];
			rows[row.title].push({ 'col': col.title, 'cell': row.cell });
		});
	});

	var srows = [];
	_.each(cols[0].rows, function(row) {
		rows[row.title].unshift({ 'cell': row.title });
		srows.push(rows[row.title]);
	});
	return srows;
};
Template.matrix.header = function() {
	var cols = cats[0].cols;	
	var headers = [];
	_.each(cols, function(col) {
		headers.push({ 'cell': col.title });
	});
	return headers;
};
Template.matrix.col = function() { return this; };
Template.matrix.cell = function() { return this.cell; };
Template.matrix.rowtitle = function() { return this.col; };

var AccacatRouter = Backbone.Router.extend({
  routes: {
    ':assessment_id': 'evaluation'
  },
  evaluation: function (assessment_id) {
    Session.set('assessment_id', assessment_id);
    Session.set('category', 'Security');
  },
  setList: function (assessment_id) {
    this.navigate(assessment_id, true);
  }
});

Router = new AccacatRouter();

Meteor.startup(function () {
	Backbone.history.start({ pushState: true });
});

