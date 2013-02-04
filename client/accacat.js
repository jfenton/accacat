
var Assessments = new Meteor.Collection('assessments');

if(Meteor.is_client) {

	Meteor.startup(function() {
		var Router;

		Meteor.autosubscribe(function() {
			var assessment_id = Session.get('assessment_id');
			if(assessment_id) {
				Meteor.subscribe('assessment', assessment_id);
					var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
					if(assessment) {
						var page = Session.get('page');
						$('div#page').html('');
						if(page == 'categories') {
							$(Meteor.render(function() { return Template.category_selection({}); })).appendTo('div#page');
						} else if(page == 'completed') {
							$(Meteor.render(function() { return Template.assessment_finished({}); })).appendTo('div#page');
						} else if(page == 'result') {
							$(Meteor.render(function() { return Template.print_category_results({ 'category':Session.get('category') }); })).appendTo('div#page');
						} else if(page == 'results') {
							$(Meteor.render(function() { return Template.results({}); })).appendTo('div#page');
						} else {
							$(Meteor.render(function() { return Template.category_evaluation({ 'category':Session.get('category') }); })).appendTo('div#page');
						}
					}
			}
		});

		// Data structure used to build the choice matrices
	var assessment_template = [
/*
			{
				'category': 'CAT Category',
				'description': 'CAT Description',
				'onselectclear': 'row', // row = Only one cell per row may be selected, table = Only one cell in the table may be selected.
				'criterialabel': 'row', // row = Row title is used for CAT criteria header, cell = Cell title is used.
				'rows': [
					{ 'title': 'Row Title',
						'cols': [
							{ 'title': 'Column Title', 'cell': 'Text in cell', 'description':'Text shown for criteria below matrix.' },
							{ 'title': 'Column Title', 'cell': 'Text in cell', 'description':'Text shown for criteria below matrix.' }
						]
					},
					{ 'title': 'Row Title',
						'cols': [
							{ 'title': 'Column Title', 'cell': 'Text in cell', 'description':'Text shown for criteria below matrix.' },
							{ 'title': 'Column Title', 'cell': 'Text in cell', 'description':'Text shown for criteria below matrix.' } // See comma statement below
						]
					} // You must ensure that there are no trailing commas on the final entry in each section otherwise IE compatiblity will be compromised.
				]
			},
*/
			{
				'category': 'Security',
				'description': 'Privacy, information security, regulatory',
				'onselectclear': 'row',
				'rows': [
					{ 'title': 'Authentication',
						'cols': [
							{ 'title': 'L1', 'cell': 'Standard Authentication', 'description':'Level 1: Standard methods to authenticate the portal as well as the API access by a user.' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': 'Two-factor Authentication', 'description':'L3: For mission and business critical use cases the advanced two-factor authentication is required.' },
							{ 'title': 'L4' }
						],
					},
					{
						'title': 'User Account Logging',
						'cols': [
							{ 'title': 'L1', 'cell': 'Self-serve access logging & access rights', 'description':'Self serve access and maintenance requires logging of user access and user actions for tracking.' },
							{ 'title': 'L2', 'cell': 'User account management', 'description':'Added capability of logging management activities on requested resources and other actions.' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{
						'title': 'Role-based Access Control',
						'cols': [
							{ 'title': 'L1', 'cell': 'Manage diff access rights', 'description':'In order to mirror business processes even in cloud environments, managing the access for several members of an organization on the same data (user account) with different access rights is required.' },
							{ 'title': 'L2' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{
						'title': 'Protection',
						'cols': [
							{ 'title': 'L1', 'cell': 'No access to s/w, data by other users', 'description':'Assurance that software, computing results, data and etc., cannot be accessed or infringed upon by other users. This includes inter-virtual machine attack prevention, storage block level isolation and hypervisor compromise protection.' },
							{ 'title': 'L2' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{
						'title': 'Loss',
						'description': 'In this context loss means that the user can retrieve the deposited assets like software, data and etc., even though the service is out of operation. The redundantly stored information must be monitored for integrity. It is also expected that the software and data will be restored automatically after an entire system failure.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Retrieve and restore data and s/w' },
							{ 'title': 'L2', 'cell': 'Backup Snapshot', 'description':'L2: User initiated backups and snapshots enable user to restore to most recent version.' },
							{ 'title': 'L3', 'cell': 'DR + Comprehensive Backup', 'description':'L3: Disaster recovery protection and comprehensive backup and restore services added.' },
							{ 'title': 'L4', 'cell': 'Business continuity process', 'description':'L4: Provider implements well- defined methods for users to establish a business continuity process.' }
						]
					},
					{
						'title': 'Data Removal',
						'description':'In case a user requests his software or data to be deleted, all data/software stored in the cloud must be entirely and irretrievably removed. This requires that the appropriate techniques be employed to locate the data and all its backups, encrypted or otherwise, and to completely erase all of them into an unrecoverable state.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Entire and irretrievable removal of data at user request' },
							{ 'title': 'L2' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{
						'title': 'Data Encryption',
						'description': 'Even if data is protected against access by other cloud users, encryption of stored data might be necessary to avoid unauthorized read of data through cloud provider employees, tools and etc.',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': 'Private key encryption', 'description':'L3: the cloud provider establishes a customer’s individual private key encryption mechanism.' },
							{ 'title': 'L4' }
						]
					},
					{
						'title': 'Location Awareness',
						'description': 'The user receives an indication of where his data is being stored and processed. User can specify where software and data have to be stored, run and processed. Provisions are in place to ensure all data and backups are stored only in these locations agreed by contract or the service level agreement.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Known and/or specified user' },
							{ 'title': 'L2' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{
						'title': 'User Def. Sec. Domain',
						'description': 'Different application types require different protection levels. Therefore, deploying SW into a cloud requires grouping of SW parts into domains, e.g. DMZ, application tier, data base tier, for which appropriate filter rules have to be defined and applied (visibility of a domain).',
						'cols': [
							{ 'title': 'L1', 'cell': 'Known and/or specified user' },
							{ 'title': 'L2' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{
						'title': 'IP Spoofing',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2', 'cell': 'Yes', 'description':'L2: Any attempt to maliciously access an application from within the cloud should be blocked.' },
							{ 'title': 'L3', 'cell': 'Intrusion detection', 'description':'L3: provider implements proactive measures for intrusion detection.' },
							{ 'title': 'L4' }
						]
					},
					{
						'title': 'Firewalls',
						'cols': [
							{ 'title': 'L1', 'cell': 'Yes' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': 'User configurable', 'description':'L3: Firewall allows user specific adjustments for highly critical applications.' },
							{ 'title': 'L4' }
						]
					},
					{
						'title': 'Sec Inc. Rep. & Mgmt.',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': 'Yes', 'description':'L3: Besides protecting against attacks like Denial of Service, it is desirable that a provider detects and handles security attacks from outside as well as from inside the cloud. An immediate indication/reporting to users is needed to quickly react on an individual basis.' },
							{ 'title': 'L4' }
						]
					}
				]
			},
			{
				'category': 'Life Cycle',
				'description': 'Long-term support impacting customer business processes',
				'onselectclear': 'row',
				'rows': [
					{ 'title': 'Dev. Roadmap',
						'description': 'Ensure that the service provider has a planned way forward (process) to evolve available features and introduce new capabilities.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Yes', 'description':'L1: Process available.' },
							{ 'title': 'L2', 'cell': 'CMM L2', 'description':'For L2 to L4 a well-defined approach comparable to “Capability Maturity Model” is needed, e.g. L2 is CMM L2, L3 is CMM L3 and L4 is CMM L4.' },
							{ 'title': 'L3', 'cell': 'CMM L3', 'description':'For L2 to L4 a well-defined approach comparable to “Capability Maturity Model” is needed, e.g. L2 is CMM L2, L3 is CMM L3 and L4 is CMM L4.' },
							{ 'title': 'L4', 'cell': 'CMM L4', 'description':'For L2 to L4 a well-defined approach comparable to “Capability Maturity Model” is needed, e.g. L2 is CMM L2, L3 is CMM L3 and L4 is CMM L4.' }
						]
					},
					{ 'title': 'Security Management',
						'description': 'In addition to the “technical” aspects of security, which are covered in the “Security” category, this topic here covers the procedural aspect of it.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Pro-active Security Monitoring', 'description':'L1: Provider performs proactive security monitoring.' },
							{ 'title': 'L2', 'cell': 'Crisis Management Process', 'description':'L2: calls for a crisis management process to be established.' },
							{ 'title': 'L3' },
							{ 'title': 'L4', 'cell': '24x7 Security Operations Center', 'description':'L4: Comprehensive supervision by 24x7 security operations center.' }
						]
					},
					{ 'title': 'Config Management',
						'description': 'L1: Basic configuration management refers to the support of the configuration management database (CMDB) capturing basic configuration items (CI) that allow the on-line tracking of the cloud resources subscribed by the end-users. L3: This refers to the support of an enterprise class CMDB capturing comprehensive CI information with correlation capability between CI that allow the on-line track of the cloud resources and CIs relationships subscribed by the end-users.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Basic' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': 'Comprehensive' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Service Management',
						'description': 'In general terms cloud services are IT services remotely offered to the customer. There are well defined and well structured methods available to determine how services are expected to be managed in an enterprise environment. One should expect the same structured approach to IT service offerings from a service provider as would be expected from an in-house IT organization. Cost, effort and rigidness increase with the ITIL level and present a natural way for mapping it into the CAT framework levels.',
						'cols': [
							{ 'title': 'L1', 'cell': 'SLA Commitment' },
							{ 'title': 'L2', 'cell': 'ITIL L2' },
							{ 'title': 'L3', 'cell': 'ITIL L3' },
							{ 'title': 'L4', 'cell': 'ITIL L4/5' }
						]
					},
					{ 'title': 'Reporting',
						'cols': [
							{ 'title': 'L1', 'cell': 'Basic Rep.', 'description':'L1: Basic reporting refers to the support of simple on-line reports that cover essential cloud services. Basic reports may include report on Cloud resources subscribed for VMs, Storage, Internet IP, Bandwidth usage, etc. ' },
							{ 'title': 'L2', 'cell': 'Dashboard', 'description':'L2: In addition to L1 requirements an on- line information dashboard should be made available to the user, showing the list of essential Cloud services currently being deployed and utilized. It may include real-time update of information on status of VMs, Storage usage, Storage Buckets, Data transfer and others.' },
							{ 'title': 'L3', 'cell': 'Comprehensive Rep.', 'description':'L3: Comprehensive reporting extends L2 capabilities to include pre-defined reports and customer customizable reports that users can receive via various channels including on- line viewing, download (as .pdf, .html, .doc, etc.) from web portal or via e-mail. Comprehensive reports may include report on Cloud resources subscribed for VMs, Storage, Internet IP, bandwidth usage, VM’s performance, network performance, security threats, billing and invoicing, ticketing statistics, etc.' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Portal',
						'cols': [
							{ 'title': 'L1', 'cell': 'Self-service', 'description':'“Self Service” is the cloud Web portal feature that enables customers to perform most of the essential services themselves. This includes provisioning resource, managing resources such as controlling VM status (reboot, shutdown, restart, etc.), viewing various subscribed services, downloading essential support documents (e.g. user guides and FAQ list, etc.).' },
							{ 'title': 'L2', 'cell': 'Service Catalog', 'description':'L2: “Service Catalog” is a function in the cloud Web portal that supports listing and grouping of all available products and services to which customers can bcolse and subscribe.' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Deployment',
						'cols': [
							{ 'title': 'L1', 'cell': 'Auto-prov.', 'description':'L1: Auto-provisioning is the ability of the cloud Web portal to capture customer requested cloud service subscription and automatically provision the cloud services without human intervention.' },
							{ 'title': 'L2', 'cell': 'Custom Image Support', 'description':'L2: Custom image support permits users to customize a VM server image and quickly redeploy that via a portal on new shared cloud servers.' },
							{ 'title': 'L3', 'cell': 'Auto VM Upgrade', 'description':'L3: Auto VM- upgrade permits a user to upgrade the virtual core, RAM and Storage of a VM from small configuration to higher configuration without migrating the operating system and data.' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Billing',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': 'History', 'description':'L3: Service provider keeps a history of the customer’s use of chargeable resources and services.' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Ticketing',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2', 'cell': 'Problem logging on request', 'description':'L2: Problem logging supports submission of problems and requests from a customer via a Web form, e-mail link or other methods.' },
							{ 'title': 'L3', 'cell': 'View entire ticket DB and stats', 'description':'L3: ticketing functions allow all customer submitted requests and problems to be logged and retrieved for viewing by customers along with statistics.' },
							{ 'title': 'L4' }
						]
					}
				]
			},
			{
				'category': 'Performance',
				'description': 'Runtime behavior of deployed application software',
				'onselectclear': 'row',
				'rows': [
					{ 'title': 'Availability %',
						'description': 'Refers to the length of time the service is offering without interruption (outside defined maintenance windows).',
						'cols': [
							{ 'title': 'L1', 'cell': '99.95', 'description':'L1: 99.95% represents standard IT hardware and software runtime uptime.' },
							{ 'title': 'L2', 'cell': '99.99' },
							{ 'title': 'L3', 'cell': '99.999', 'description':'L3: 99.999% is the widely accepted requirement in the telecommunications industry for high-availability services.' },
							{ 'title': 'L4', 'cell': '99.9995', 'description':'L4: 99.9995% is required to support highly critical business applications (e.g. database applications).' }
						]
					},
					{ 'title': 'VM-to-VM Latency',
						'description': 'Refers to the maximum time allowed to send a message from one software instance to another running on different physical machines.',
						'cols': [
							{ 'title': 'L1', 'cell': '100ms', 'description':'L1: 100ms (e.g. for basic Web apps).' },
							{ 'title': 'L2', 'cell': '10ms', 'description':'L2: 10 microseconds (for distributed telecommunications DB services).' },
							{ 'title': 'L3', 'cell': '1ms', 'description':'L3: 1 microseconds (financial trading).' },
							{ 'title': 'L4', 'cell': '100us', 'description':'L4: 100 nanoseconds (for at least 99.5% of messaged, for real time apps highly sophisticated redundancy architectures).' }
						]
					},
					{ 'title': 'Scalability',
						'description': 'Measures the performance level to which a deployed application can be engineered.',
						'cols': [
							{ 'title': 'L1', 'cell': '+ Flexible granularity of resource scaling' },
							{ 'title': 'L2', 'cell': '+ Resource utilization monitoring tool' },
							{ 'title': 'L3', 'cell': '+ Auto-scaling support for applicaiton', 'description':'L3: Auto scaling support to scale an application without user monitoring or intervention.' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Elasticity',
						'description': 'Addresses the how fast a deployed application can increase its performance response with increasing service requests.',
						'cols': [
							{ 'title': 'L1', 'cell': '+ Scale up and down' },
							{ 'title': 'L2', 'cell': '+ Programmatic interface (API)' },
							{ 'title': 'L3', 'cell': '+ >1 sec to start/end new VM', 'description':'L3: elapsed detect-trigger time between application/host and infrastructure management.' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Redundancy',
						'description': 'Redundancy architectures frequently rely on a well-defined set of software components to preserve states and transactions.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Availability zone' },
							{ 'title': 'L2', 'cell': '+ Auto-restart of dropped app' },
							{ 'title': 'L3', 'cell': 'HA database as part of offering', 'description':'L3: Service incorporates High Availability- database for high availability software design.' },
							{ 'title': 'L4', 'cell': 'Cluster deployment API', 'description':'L4: Means for cluster deployment, ensuring that software units are deployed on the physical infra structure according to requirements specified by the application.' }
						]
					},
					{ 'title': 'Load Distribution',
						'description': 'Widely used scheme to implement scalable and reliable services.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Intelligent load distribution + programmatic interface to load distribution events' },
							{ 'title': 'L2', 'cell': 'Load distribution redundancy' },
							{ 'title': 'L3', 'cell': 'Selectable distribution criteria' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Control',
						'description': 'Highly reliable applications implement redundancy schemes, which must be preserved when deploying to IaaS.',
						'cols': [
							{ 'title': 'L1', 'description':'L1: Resources are fully transparent to user.' }, // CROSS CHECK
							{ 'title': 'L2', 'cell': 'Multi VM-to-VM L2 networks', 'description':'L2: NaaS (Network as a Service) for multiple networks between virtual machines.' },
							{ 'title': 'L3', 'cell': 'Pinning of vCPU to logical core', 'description':'L3: Application performance engineering requires dedicated CPU resource assignment -> pinning of vCPU to cores.' },
							{ 'title': 'L4', 'cell': 'SLA for DC LAN', 'description':'L4: SLA for e.g. delay, jitter, throughput, availability' }
						]
					},
					{ 'title': 'Storage',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': 'Tiered Storage', 'description':'L3: Deploying critical and highly available applications to an IaaS offering requires special visibility of the storage capabilities so that the application architecture can be adjusted accordingly.' },
							{ 'title': 'L4' }
						]
					},
				]
			},
			{
				'category': 'Access',
				'description': 'Connectivity between the end user and cloud service provider',
				'onselectclear': 'row',
				'rows': [
					{ 'title': 'Access', 
						'description': 'This parameter measures the type of access.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Public', 'description':'L1: Access through public Internet.' },
							{ 'title': 'L2', 'cell': 'Public / Private', 'description':'L2: a) Enhanced availability public Internet access. b) Private, i.e. dedicated link access, e.g. through VPN and other methods.' },
							{ 'title': 'L3', 'cell': 'Public / Private On-demand', 'description':'L3: enhanced public access or on-demand private access.' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Availability',
						'description': 'Indicates the “guaranteed” level of uptime of the network access.',
						'cols': [
							{ 'title': 'L1', 'cell': '99.99%' },
							{ 'title': 'L2', 'cell': '99.996%' },
							{ 'title': 'L3', 'cell': '99.9999%' },
							{ 'title': 'L4', 'cell': '100%' }
						]
					},
					{ 'title': 'Scalability',
						'description': 'Capability to increase and decrease user’s access bandwidth based on actual capacity demand.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Min. bandwidth guarantee' },
							{ 'title': 'L2', },
							{ 'title': 'L3', 'cell': 'Selectable bandwidth' },
							{ 'title': 'L4', }
						]
					},
					{ 'title': 'Reliability',
						'cols': [
							{ 'title': 'L1', 'cell': '<=50ms' },
							{ 'title': 'L2' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Class of Service',
						'description': 'allows priorities to be differentiated and data flows to be shaped for comparable services (non-mission critical, mission critical, real time).',
						'cols': [
							{ 'title': 'L1', 'cell': 'Non-mission-critical, mission critical, l-time voice/video' },
							{ 'title': 'L2' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Packet Loss',
						'description': 'a guarantee to deliver customer packets, expressed as the ratio of undelivered packets to total number of customer packets received by the network.',
						'cols': [
							{ 'title': 'L1', 'cell': '<=0.1%' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': '0.01%' },
							{ 'title': 'L4', 'cell': '0.001%' }
						]
					},
					{ 'title': 'Delay',
						'description': 'is the commitment to end-to-end latency.',
						'cols': [
							{ 'title': 'L1', 'cell': '<=230ms' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': '<=180ms' },
							{ 'title': 'L4', }
						]
					}
				]
			},
			{
				'category': 'Data Center',
				'description': 'Data Center physical infrastructure',
				'onselectclear': 'table',
				'criterialabel': 'cell',
				'notes': 'L4: This is the highest level for clouds and can be considered as the most robust and least prone for failures. This cloud is hosted primarily in a Tier 4 data center and backed up by either a Tier 4 or Tier 3 data center.  L3: This cloud is hosted in two Tier 3 data centers OR a combination of Tier 4 and Tier 2 data centers.  L2: This cloud is hosted in either a Tier 4 / Tier 1 data center OR Tier 3 / Tier 2 data center combinations. Local redundancy may also be considered when hosted in a Tier 4 data center.  L1: This is the lowest level and has higher risks of failure. This cloud is hosted in two Tier 2 data centers OR a combination of Tier 3 and Tier 1 data centers. Local redundancy may also be considered when hosted in a Tier 3 data center.',
				'rows': [
					{ 'title': 'Tier 4',
						'description': '',
						'cols': [
							{ 'title': 'Tier 4', 'cell': 'L4', 'description':'This is the highest level for clouds and can be considered as the most robust and least prone for failures. This cloud is hosted primarily in a Tier 4 data center and backed up by either a Tier 4 or Tier 3 data center.' },
							{ 'title': 'Tier 3', 'cell': 'L4', 'description':'This is the highest level for clouds and can be considered as the most robust and least prone for failures. This cloud is hosted primarily in a Tier 4 data center and backed up by either a Tier 4 or Tier 3 data center.' },
							{ 'title': 'Tier 2', 'cell': 'L3', 'description':'This cloud is hosted in two Tier 3 data centers OR a combination of Tier 4 and Tier 2 data centers.' },
							{ 'title': 'Tier 1', 'cell': 'L2', 'description':'This cloud is hosted in either a Tier 4 / Tier 1 data center OR Tier 3 / Tier 2 data center combinations. Local redundancy may also be considered when hosted in a Tier 4 data center.' },
							{ 'title': 'Local Redundancy', 'cell': 'L2', 'description':'This cloud is hosted in either a Tier 4 / Tier 1 data center OR Tier 3 / Tier 2 data center combinations. Local redundancy may also be considered when hosted in a Tier 4 data center.' }
						]
					},
					{ 'title': 'Tier 3',
						'description': '',
						'cols': [
							{ 'title': 'Tier 4', 'cell': 'L4', 'description':'This is the highest level for clouds and can be considered as the most robust and least prone for failures. This cloud is hosted primarily in a Tier 4 data center and backed up by either a Tier 4 or Tier 3 data center.' },
							{ 'title': 'Tier 3', 'cell': 'L3', 'description':'This cloud is hosted in two Tier 3 data centers OR a combination of Tier 4 and Tier 2 data centers.' },
							{ 'title': 'Tier 2', 'cell': 'L2', 'description':'This cloud is hosted in either a Tier 4 / Tier 1 data center OR Tier 3 / Tier 2 data center combinations. Local redundancy may also be considered when hosted in a Tier 4 data center.' },
							{ 'title': 'Tier 1', 'cell': 'L1', 'description':'This is the lowest level and has higher risks of failure. This cloud is hosted in two Tier 2 data centers OR a combination of Tier 3 and Tier 1 data centers. Local redundancy may also be considered when hosted in a Tier 3 data center.' },
							{ 'title': 'Local Redundancy', 'cell': 'L1', 'description':'This is the lowest level and has higher risks of failure. This cloud is hosted in two Tier 2 data centers OR a combination of Tier 3 and Tier 1 data centers. Local redundancy may also be considered when hosted in a Tier 3 data center.' }
						]
					},
					{ 'title': 'Tier 2',
						'description': '',
						'cols': [
							{ 'title': 'Tier 4', 'cell': 'L3', 'description':'This cloud is hosted in two Tier 3 data centers OR a combination of Tier 4 and Tier 2 data centers.' },
							{ 'title': 'Tier 3', 'cell': 'L2', 'description':'This cloud is hosted in either a Tier 4 / Tier 1 data center OR Tier 3 / Tier 2 data center combinations. Local redundancy may also be considered when hosted in a Tier 4 data center.' },
							{ 'title': 'Tier 2', 'cell': 'L1', 'description':'This is the lowest level and has higher risks of failure. This cloud is hosted in two Tier 2 data centers OR a combination of Tier 3 and Tier 1 data centers. Local redundancy may also be considered when hosted in a Tier 3 data center.' },
							{ 'title': 'Tier 1', 'cell': 'Non-Carrier Grade', 'description':'This cloud is hosted in a non-Carrier-Grade environment and has the higest risk of failure.' },
							{ 'title': 'Local Redundancy', 'cell': 'Non-Carrier Grade', 'description':'This cloud is hosted in a non-Carrier-Grade environment and has the higest risk of failure.' }
						]
					},
					{ 'title': 'Tier 1',
						'description': '',
						'cols': [
							{ 'title': 'Tier 4', 'cell': 'L2', 'description':'This cloud is hosted in either a Tier 4 / Tier 1 data center OR Tier 3 / Tier 2 data center combinations. Local redundancy may also be considered when hosted in a Tier 4 data center.' },
							{ 'title': 'Tier 3', 'cell': 'L1', 'description':'This is the lowest level and has higher risks of failure. This cloud is hosted in two Tier 2 data centers OR a combination of Tier 3 and Tier 1 data centers. Local redundancy may also be considered when hosted in a Tier 3 data center.' },
							{ 'title': 'Tier 2', 'cell': 'Non-Carrier Grade', 'description':'This cloud is hosted in a non-Carrier-Grade environment and has the higest risk of failure.' },
							{ 'title': 'Tier 1', 'cell': 'Non-Carrier Grade', 'description':'This cloud is hosted in a non-Carrier-Grade environment and has the higest risk of failure.' },
							{ 'title': 'Local Redundancy', 'cell': 'Non-Carrier Grade', 'description':'This cloud is hosted in a non-Carrier-Grade environment and has the higest risk of failure.' }
						]
					}
				]
			},
			{
				'category': 'Certification',
				'description': 'Degree of quality assurance to the customer',
				'onselectclear': 'row',
				'rows': [
					{ 'title': 'PCI',
						'description': 'Payment card industry (PCI) compliance is adherence to a set of specific security Standards that were developed to protect card information during and after a financial transaction. PCI compliance is required by all card brands.',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2', 'cell': 'Yes' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'SAS70',
						'description': 'Defines the standards an auditor must employ in order to assess the contracted internal controls of service organization, e.g. hosted data centers. SSAE16 is a newly introduced optional add on for higher standards.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Yes' },
							{ 'title': 'L2', 'cell': 'SSAE16' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'ISO 9000',
						'description': 'A series of standards, developed and published by the International Organization for Standardization that define, establish, and maintain an effective quality assurance system for manufacturing and service industries.',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2', 'cell': 'Yes' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'ISO 27001/2',
						'description': 'The objective of this pair of standards is to "provide a model for establishing, implementing, operating, monitoring, reviewing, maintaining, and improving an Information Security Management System".',
						'cols': [
							{ 'title': 'L1', 'cell': 'Yes' },
							{ 'title': 'L2' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'ISO/IEC 20000',
						'description': 'The provider indicates that they have followed the standardized methods of IT service management, particularly 20000-1 and 20000-2 in revisions from 2011 and 2012 respectively.',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2', 'cell': 'Yes' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'EN16001 ISO50xx',
						'description': 'Gives recommendations and guidance on energy management systems. It is designed to help improve energy efficiency by outlining how to implement processes that reduce greenhouse gas emissions. It enables the development of an energy policy and set objectives for the management system in line with legal and regulatory requirements. ISO 50xxx: establishes a framework to manage energy for industrial plants; commercial, institutional, or governmental facilities; or entire organizations. Targeting broad applicability across national economic sectors, it is estimated that the standard could influence up to 60% of the world’s energy use. ISO 50001:2011 specifies requirements for establishing, implementing, maintaining and improving an energy management system, whose purpose is to enable an organization to follow a systematic approach in achieving continual improvement of energy performance, including energy efficiency, energy use and consumption',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2', 'cell': 'Yes' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Uptime',
						'description': 'The time during which a machine or piece of equipment is operating or can be operated.',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': 'Yes' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'HIPPA',
						'description': 'Health Insurance Portability and Accountability Act of 1996.',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2', 'cell': 'Yes' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Vendor Cert.',
						'description': 'Validates the integrity of commercial software products. It indicates the competence and ability of the provider to operate or offer any third party SW.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Yes' },
							{ 'title': 'L2' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Legal',
						'description': 'Providers are obliged to follow legal obligations imposed on them according to the jurisdictions they operate in. Since this may impact the user, who may not even be aware of it, the proposal is to “advertise” these proactively.',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': 'Yes' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Patch',
						'description': 'The provider is requested to update offer with respect to SW security leaks. This may have impact on the user in requires an appropriate, well defined interaction.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Yes' },
							{ 'title': 'L2' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
				]
			},
			{
				'category': 'Support',
				'description': 'Deployment and maintenance of applications',
				'onselectclear': 'row',
				'rows': [
					{ 'title': 'Customer Support',
						'description': 'Methods and capabilities available for how a user can interact with the service provider.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Portal' },
							{ 'title': 'L2', 'cell': 'Service Desk' },
							{ 'title': 'L3', 'cell': 'Engineering Support' },
							{ 'title': 'L4', 'cell': 'Assist Trouble-shooting' }
						]
					},
					{ 'title': 'Service Responsiveness',
						'description': 'Time it takes for the service provider to respond to calls or customer inquiries.',
						'cols': [
							{ 'title': 'L1', 'cell': '24/7' },
							{ 'title': 'L2', 'cell': '<=20s' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Service Escalation',
						'description': 'The levels of escalation provided to customer for proper trouble handling.',
						'cols': [
							{ 'title': 'L1', 'cell': '4 levels' },
							{ 'title': 'L2' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Monitoring, Audit, Management',
						'description': 'Cloud implies “self-service” and “ubiquitous”. Therefore, the user needs to be able to monitor and manage the behavior of the deployed user objects at any point in time from any location.',
						'cols': [
							{ 'title': 'L1', 'cell': '100% availability for customer\'s access' },
							{ 'title': 'L2', 'cell': 'Incident management for all services' },
							{ 'title': 'L3' },
							{ 'title': 'L4', 'cell': 'Assisted Monitoring' }
						]
					},
					{ 'title': 'MTTR*',
						'description': 'mean time to repair is the time it takes for service provider to correct reported faults or incidents concerning services acquired by user.',
						'cols': [
							{ 'title': 'L1', 'cell': '4 hours' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': '2 hours' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Change Management Support',
						'description': 'An acquired service is neither static nor unchanged at all times, it may need internal repairs, upgrades, etc. This impacts the behavior of the user’s service or application. ',
						'cols': [
							{ 'title': 'L1', 'cell': 'Provider objectives' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': 'Customer-initiated change requests' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Incident Response Time (Pri1)',
						'description': 'Maximum time it takes for service provider to react and act on Priority 1 incidents (an event where a service/application is not working or accessible).',
						'cols': [
							{ 'title': 'L1', 'cell': '30 minutes', 'description':'L1: 30 minutes' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': '15 minutes', 'description':'L3: 15 minutes' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Service Training',
						'description': 'Structured training and transfer of know-how is important for businesses.',
						'cols': [
							{ 'title': 'L1', 'cell': 'Yes' },
							{ 'title': 'L2' },
							{ 'title': 'L3' },
							{ 'title': 'L4' } 
						]
					}
				]
			},
			{
				'category': 'Interoperability',
				'description': 'Cloud hypervisor interfaces to applications',
				'onselectclear': 'row',
				'rows': [
					{ 'title': 'Download Format',
						'description': 'This represents the format of the objects to be transferred into the provider’s infrastructure.',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2', 'cell': 'OVF', 'description':'L2: DMTF [2] has developed a standard format called “open virtualization format” (OVF) which eases the federation across several offerings.' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'API',
						'description': '',
						'cols': [
							{ 'title': 'L1', 'cell': 'Provider specific', 'description':'L1: The programmatic interfaces to request and monitor resources, to deploy and manage applications, mirror the feature differentiation as well as the fast innovation cycles of the service offerings.' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': 'Non-provider specific', 'description':'L3: Standardized API will reduce complexity and cost on the user side whenever several cloud services have to be combined or utilized.' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Access Device',
						'description': '',
						'cols': [
							{ 'title': 'L1', 'cell': 'Customized', 'description':'L1: Vertically integrated service solutions may benefit from specialized or customized access devices.' },
							{ 'title': 'L2', 'cell': 'Open client', 'description':'L2: For consuming any application as a service, standard methods for access are needed (“open client”).' },
							{ 'title': 'L3', 'cell': 'Any bcolser', 'description':'L3: For anywhere (e.g. mobile) and any device (e.g. BYOD) access a fully open access (any bcolser) is needed.' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Life Cycle',
						'description': 'The user needs to integrate the requested services into the IT management processes and applications/services.',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': 'DMTF', 'description':'L3: DMTF developed recommendation [3] allowing consistent life cycle management of different services.' },
							{ 'title': 'L4' },
						]
					},
					{ 'title': 'Monitoring Data',
						'description': 'Any applications deployed in IaaS or PaaS environments must be monitored and managed by the user.',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2' },
							{ 'title': 'L3', 'cell': 'Complex monitoring tools', 'description':'L3: For business critical applications a comprehensive set of data (and appropriate monitoring capabilities) should be provided in standardized formats to enable import in user’s monitoring tools.' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'IDM',
						'description': 'Service providers must have a way of handling the identity of the user and the user must integrate the IDM of the outsourced service into their IT infrastructure.',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2', 'cell': 'Standard', 'description':'L2: There are many ways to address IDM. For interoperability reason an IDM system based on available standards is recommended.' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
					{ 'title': 'Virtual Management',
						'description': 'The user may need to integrate the requested resources into their IT management processes (especially for IaaS).',
						'cols': [
							{ 'title': 'L1' },
							{ 'title': 'L2', 'cell': 'DMTF', 'description':'L2: DMTF developed recommendation allowing consistent integration of several services.' },
							{ 'title': 'L3' },
							{ 'title': 'L4' }
						]
					},
				]
			}
		];

		var categories = {};

		String.prototype.capitalise = function() {
				return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
		};

		function read_cookie(k,r){return(r=RegExp('(^|; )'+encodeURIComponent(k)+'=([^;]*)').exec(document.cookie))?r[2]:null;}

		Template.assessment_finished.events({
			'click button.viewresults': function(e) {
				_gaq.push(['_trackPageview', '/assessment/results/pdf']);
				var button = $('button.viewresults');
				button.data('oldtxt', button.text()).text('Please wait, preparing your results...').attr('disabled','disabled');
				$('form#pdf input[name="src"]').val(window.location.href.replace('completed','results'));
				$('form#pdf').submit();
				var resetButton = setInterval(function() {
					button.text(button.data('oldtxt')).removeAttr('disabled');
					clearInterval(resetButton);
				}, 10000);
//			Router.navigate('/' + Session.get('assessment_id') + '/results', true);
			},
			'click button.emailresults': function(e) {
				var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
				var to = prompt('Please enter the email address to send to:');
				if(to) {
					Meteor.apply('email_assessment', [Session.get('assessment_id'), assessment.application_name, to, 'ACCA Cloud Assessment Tool results for ' + assessment.application_name, "\nPlease find attached your requested ACCA CAT results.\n"], function() {
						alert('Your email has been sent.');
					});
					_gaq.push(['_trackPageview', '/assessment/results/email']);
				}
			},
			'click button.startagain': function(e) {
				_gaq.push(['_trackPageview', '/assessment/completed/startagain']);
				Router.navigate('/', true);
			},
			'click button.feedback': function(e) {
				_gaq.push(['_trackPageview', '/assessment/completed/feedback']);
				$('div.gsfn-widget-tab').trigger('click');
			},
			'click button.accasite': function(e) {
				_gaq.push(['_trackPageview', '/assessment/completed/acca']);
				window.location.href = 'http://www.asiacloud.org/';
			}
		});
		Template.assessment_finished.pdf_name = function() {
				var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
				return 'acca-cat-' + assessment.application_name;
		};
		Template.assessment_finished.rendered = function() {
			$('div#header').show();
		};

		Template.category_selection.events({
			'change input#application_name': function(e) {
				var assessment_id = Session.get('assessment_id');
				var update = {
					$set: {'application_name': e.target.value}
				};
				Assessments.update({ _id: assessment_id }, update);
			},
			'click li.category': function(e) {
				var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
				var category_name = this.category;
				var category = _.find(assessment.data, function(datum) { return datum.category == category_name; });
				if(category.sel == 1) {
					delete category.sel;
				} else {
					category.sel = 1;
				}
				var assessment_stack = ['Categories'];
				_.each(assessment.data, function(datum) { if(datum.sel == 1) assessment_stack.push(datum.category); });
				assessment_stack.push('Completed');
				Assessments.update({ _id: Session.get('assessment_id') }, { $set: { 'stack': assessment_stack, 'data':assessment.data } });
			}
		});
		Template.category_selection.rendered = function() {
			$('input#application_name').focus();
			$('div#header').show();
		};
		Template.category_selection.assessment = function() {
			return Assessments.findOne({ _id: Session.get('assessment_id') });
		};
		Template.category_selection.application_name = function() {
			var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
			var title = 'ACCA Cloud Assessment Tool';
			if(assessment.application_name)
				title += ' - ' + assessment.application_name;
			document.title = title;
			return assessment.application_name;
		};
		Template.category_selection.category = function() {
			var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
			return assessment.data;
		};
		Template.category_selection.category_title = function() {
			return this.category;
		};
		Template.category_selection.category_description = function() {
			return this.description;
		};
		Template.category_selection.category_selected = function() {
			return this.sel;
		};

		Template.category_evaluation.assessment = function() {
			return Assessments.findOne({ _id: Session.get('assessment_id') });
		};
		Template.category_evaluation.category = function() {
			return this.category;
		};
		Template.category_results.last_page = function() {
			console.log('called');
		};
		Template.category_results.category = function() {
			var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
			var assessment_stack = assessment.stack;
			var category_name = this.category;
			var category = _.find(assessment.data, function(datum) { return datum.category == category_name; });
			var stack_idx = _.indexOf(assessment_stack, category_name, false);
			if(assessment_stack[stack_idx + 1] == 'Completed') category.last_category = true;
			return category;
		};
		Template.category_results.criteria_header = function() {
			var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
			var category_name = this.category;
			var category = _.find(assessment.data, function(datum) { return datum.category == category_name; });
			if(category.description) return category.description;
			return '';
		};
		Template.category_results.assessment = function() {
			return Assessments.findOne({ _id: Session.get('assessment_id') });
		};
		Template.category_results.criteria = function() {
			var current = this.category; // Session.get('current').replace(/_/g, ' ');
			var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
			var datum = _.find(assessment.data, function(datum) { return datum.category == current; });
			var criterion = [];
			_.each(datum.rows, function(row) {
				_.each(row.cols, function(col) {
					if(col.cellsel) {
						col.coltitle = datum.criterialabel && datum.criterialabel == 'cell' ? col.cell : row.title;
						col.coldescription = row.description;
						criterion.push(col);
					}
				});
			});
			return criterion;
		};
		Template.category_results.rendered = function() {
			$('div#header').hide();
		};

		Template.print_category_results.last_category = function() {
			var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
			var assessment_stack = assessment.stack;
			var category_name = this.category;
			var category = _.find(assessment.data, function(datum) { return datum.category == category_name; });
			var stack_idx = _.indexOf(assessment_stack, category_name, false);
			if(assessment_stack[stack_idx + 1] == 'Completed') return true;
			return false;
		};

		Template.results.created = function() {
			var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
			var results = [];
			_.each(assessment.data, function(datum) {
				if(datum.sel == 1) {
					Session.set('category', datum.category);
					Session.set('current', datum.category);
					$(Meteor.render(function() { return Template.print_category_results({'category':datum.category}); })).appendTo('div#page');
				}
			});
			return results;
		};
		Template.results.rendered = function() {
			$('div.gsfn-widget-tab').hide();
		};

		Template.nav.events({
			'click div.prev': function(e) {
				var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
				var assessment_stack = assessment.stack;
				var stack_idx = _.indexOf(assessment_stack, Session.get('current'), false);
				stack_idx--;
				if(stack_idx < 0) stack_idx = 0;
				Session.set('current', assessment_stack[stack_idx]);
				Router.navigate('/' + Session.get('assessment_id') + '/' + Session.get('current').toLowerCase(), true);
			},
			'click div.next': function(e) {
				var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
				var assessment_stack = assessment.stack;
				if(!assessment.application_name) {
					alert('Please fill in an application name before proceeding.');
					return true;
				}
				if(assessment_stack.length == 2) {
					alert('Please select one or more categories before proceeding.');
					return true;
				}
				var stack_idx = _.indexOf(assessment_stack, Session.get('current'), false);
				stack_idx++;
				if(stack_idx > assessment_stack.length - 1) stack_idx = assessment_stack.length - 1;
				Session.set('current', assessment_stack[stack_idx]);
				Router.navigate('/' + Session.get('assessment_id') + '/' + Session.get('current').replace(/ /g, '_').toLowerCase(), true);
			},
			'click div.startagain': function(e) {
				if(confirm("You will lose your current answers. Start a new assessment?")) {
					Router.navigate('/', true);
				}
			}
		});
		Template.nav.profile_selection = function() {
			var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
			if(assessment) {
				var assessment_stack = assessment.stack || ['Categories'];
				var stack_idx = _.indexOf(assessment_stack, Session.get('current'), false);
				return stack_idx == -1;
			} else return false;
		};
		Template.nav.atstart = function() {
			var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
			if(assessment) {
				var assessment_stack = assessment.stack || ['Categories'];
				var stack_idx = _.indexOf(assessment_stack, Session.get('current'), false);
				return stack_idx == 0;
			} else return true;
		};
		Template.nav.assessment_id = function() {
			return Session.get('assessment_id');
		};
		Template.nav.current_category = function() {
			return Session.get('current');
		};

		Template.matrix.events({
			'click td.choice': function(e) {
				if(this.cell == undefined || this.cell == '') return;

				var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });

				// Generate (and cache) a fast category-name-to-category hash from the above data source
				_.each(assessment.data, function(cat) { categories[cat.category] = cat; });

				var selrowtitle = this.row;
				var selcoltitle = this.col;

				var current = Session.get('category').replace(/_/g, ' ');
				var datum = _.find(assessment.data, function(datum) { return datum.category == current; });

				var onselectclear = datum.onselectclear;
				_.each(datum.rows, function(row) {
					_.each(row.cols, function(col) {
						if(row.title == selrowtitle || onselectclear == 'table') col.cellsel = 0;
					});
				});

				if(this.cellsel != 1) { // As long as the cell was not previously selected i.e. we are de-selecting
					_.each(datum.rows, function(row) {
						if(row.title == selrowtitle) {
							_.each(row.cols, function(col) {
								if(col.title == selcoltitle) col.cellsel = 1;
							});
						}
					});
				}

	/* 		TODO: Once minimongo supports $ positional access we can use this more efficient form
				Assessments.update({ _id: Session.get('assessment_id'), 'data.category':Session.get('category'), 'data.cols.title':selcoltitle, 'data.cols.rows.title':selrowtitle, 'data.cols.rows.cell':selcelltitle }, { $set: { 'data.cols.rows.$.cellsel': 1 } });
	*/

				Assessments.update({ _id: Session.get('assessment_id') }, { $set: { 'data': assessment.data } });
			}
		});
		Template.matrix.row = function() {
			var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
			var rows = {};
			if(assessment) {
				var current = this.category;
				var datum = _.find(assessment.data, function(datum) { return datum.category == current; });
				var rows = {};
				_.each(datum.rows, function(row) {
					_.each(row.cols, function(col) {
						if(row.title) {
							rows[row.title] = (rows[row.title] == undefined) ? [] : rows[row.title];
							rows[row.title].push({ 'row': row.title, 'col':col.title, 'cell': col.cell, 'cellsel': col.cellsel });
						}
					});
				});

				var srows = [];
				for(var row in rows) {
					rows[row].unshift({ 'cell': rows[row][0].row, 'first':1 });
					srows.push(rows[row]);
				}
				return srows;
			} else return [];
		};
		Template.matrix.header = function() {
			var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
			var headers = [];
			if(assessment) {
				var current = this.category;
				var datum = _.find(assessment.data, function(datum) { return datum.category == current; });
				if(datum) {
					var cols = datum.rows[0].cols;
					_.each(cols, function(col) {
						headers.push({ 'cell': col.title });
					});
				}
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
				':assessment_id/:category/results': 'specificResultsPage',
				':assessment_id/:category': 'specificPage',
				'*assessment_id': 'defaultPage'
			},
			specificResultsPage: function(assessment_id, page) {
				_gaq.push(['_trackPageview', '/assessment/results']);
				Session.set('assessment_id', assessment_id);
				Session.set('page', 'result');
				Session.set('category', page.replace(/_/g, ' ').capitalise());
				Session.set('current', page.replace(/_/g, ' ').capitalise());
			},
			specificPage: function(assessment_id, page) {
				_gaq.push(['_trackPageview', '/assessment/' + page]);
				_gaq.push(['_trackEvent', 'Assessment', 'Page', assessment_id]);
				Session.set('assessment_id', assessment_id);
				Session.set('page', page);
				Session.set('category', page.replace(/_/g, ' ').capitalise());
				Session.set('current', page.replace(/_/g, ' ').capitalise());
			},
			defaultPage: function(assessment_id) {
				if(assessment_id == '') {
					_gaq.push(['_trackPageview', '/']);
					var last_assessment = read_cookie('last_assessment');
					if(last_assessment) {
						this.navigate('/' + last_assessment);
					} else {
						$('div#page').html('');
						_gaq.push(['_trackPageview', '/profiles']);
						$(Meteor.render(function() { return Template.profile_selection({}); })).appendTo('div#page');
					}
				} else if(assessment_id.indexOf('-') > 0) {
					this.navigate('/' + assessment_id.replace('/','') + '/categories', true);
				} else {
					_gaq.push(['_trackPageview', '/assessment/new/' + assessment_id]);
					_gaq.push(['_trackEvent', 'Assessment', 'New', assessment_id]);
					assessment_id = Assessments.insert({
						'application_name': '',
						'stack': ['Categories'],
						'data': assessment_template
					});
					assessment = Assessments.findOne({ _id: assessment_id });
					this.navigate('/' + assessment_id, true);
				}
			}
		});
		Router = new AccacatRouter();

		Backbone.history.start({ pushState: true });
	});

}
