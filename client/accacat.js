
if(Meteor.is_client) {

	var Router;

	var Assessments = new Meteor.Collection('assessments');

	// Data structure used to build the choice matrices
	var assessment_template = [
		{
			'category': 'Security',
			'description': 'Privacy, information security, regulatory',
			'onselectclear': 'col',
			'cols': [
				{ 'title': 'Authentication',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Two-factor Authentication', 'description':'L3: For mission and business critical use cases the advanced two-factor authentication is required.' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Standard Authentication', 'description':'Level 1: Standard methods to authenticate the portal as well as the API access by a user.' }
					],
				},
				{
					'title': 'User Account Logging',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'User account management', 'description':'Added capability of logging management activities on requested resources and other actions.' },
						{ 'title': 'L1', 'cell': 'Self-serve access logging & access rights', 'description':'Self serve access and maintenance requires logging of user access and user actions for tracking.' }
					]
				},
				{
					'title': 'Role-based Access Control',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Manage diff access rights', 'description':'In order to mirror business processes even in cloud environments, managing the access for several members of an organization on the same data (user account) with different access rights is required.' }
					]
				},
				{
					'title': 'Protection',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'No access to s/w, data by other users', 'description':'Assurance that software, computing results, data and etc., cannot be accessed or infringed upon by other users. This includes inter-virtual machine attack prevention, storage block level isolation and hypervisor compromise protection.' }
					]
				},
				{
					'title': 'Loss',
					'description': 'In this context loss means that the user can retrieve the deposited assets like software, data and etc., even though the service is out of operation. The redundantly stored information must be monitored for integrity. It is also expected that the software and data will be restored automatically after an entire system failure.',
					'rows': [
						{ 'title': 'L4', 'cell': 'Business continuity process', 'description':'L4: Provider implements well- defined methods for users to establish a business continuity process.' },
						{ 'title': 'L3', 'cell': 'DR + Comprehensive Backup', 'description':'L3: Disaster recovery protection and comprehensive backup and restore services added.' },
						{ 'title': 'L2', 'cell': 'Backup Snapshot', 'description':'L2: User initiated backups and snapshots enable user to restore to most recent version.' },
						{ 'title': 'L1', 'cell': 'Retrieve and restore data and s/w' }
					]
				},
				{
					'title': 'Data Removal',
					'description':'In case a user requests his software or data to be deleted, all data/software stored in the cloud must be entirely and irretrievably removed. This requires that the appropriate techniques be employed to locate the data and all its backups, encrypted or otherwise, and to completely erase all of them into an unrecoverable state.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Entire and irretrievable removal of data at user request' }
					]
				},
				{
					'title': 'Data Encryption',
					'description': 'Even if data is protected against access by other cloud users, encryption of stored data might be necessary to avoid unauthorized read of data through cloud provider employees, tools and etc.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Private key encryption', 'description':'L3: the cloud provider establishes a customer’s individual private key encryption mechanism.' },
						{ 'title': 'L2' },
						{ 'title': 'L1' }
					]
				},
				{
					'title': 'Location Awareness',
					'description': 'The user receives an indication of where his data is being stored and processed. User can specify where software and data have to be stored, run and processed. Provisions are in place to ensure all data and backups are stored only in these locations agreed by contract or the service level agreement.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Known and/or specified user' }
					]
				},
				{
					'title': 'User Def. Sec. Domain',
					'description': 'Different application types require different protection levels. Therefore, deploying SW into a cloud requires grouping of SW parts into domains, e.g. DMZ, application tier, data base tier, for which appropriate filter rules have to be defined and applied (visibility of a domain).',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Known and/or specified user' }
					]
				},
				{
					'title': 'IP Spoofing',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Intrusion detection', 'description':'L3: provider implements proactive measures for intrusion detection.' },
						{ 'title': 'L2', 'cell': 'Yes', 'description':'L2: Any attempt to maliciously access an application from within the cloud should be blocked.' },
						{ 'title': 'L1' }
					]
				},
				{
					'title': 'Firewalls',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'User configurable', 'description':'L3: Firewall allows user specific adjustments for highly critical applications.' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Yes' }
					]
				},
				{
					'title': 'Sec Inc. Rep. & Mgmt.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Yes', 'description':'L3: Besides protecting against attacks like Denial of Service, it is desirable that a provider detects and handles security attacks from outside as well as from inside the cloud. An immediate indication/reporting to users is needed to quickly react on an individual basis.' },
						{ 'title': 'L2' },
						{ 'title': 'L1' }
					]
				}
			]
		},
		{
			'category': 'Life Cycle',
			'description': 'Long-term support impacting customer business processes',
			'onselectclear': 'col',
			'cols': [
				{ 'title': 'Dev. Roadmap',
					'description': 'Ensure that the service provider has a planned way forward (process) to evolve available features and introduce new capabilities.',
					'rows': [
						{ 'title': 'L4', 'cell': 'CMM L4', 'description':'For L2 to L4 a well-defined approach comparable to “Capability Maturity Model” is needed, e.g. L2 is CMM L2, L3 is CMM L3 and L4 is CMM L4.' },
						{ 'title': 'L3', 'cell': 'CMM L3', 'description':'For L2 to L4 a well-defined approach comparable to “Capability Maturity Model” is needed, e.g. L2 is CMM L2, L3 is CMM L3 and L4 is CMM L4.' },
						{ 'title': 'L2', 'cell': 'CMM L2', 'description':'For L2 to L4 a well-defined approach comparable to “Capability Maturity Model” is needed, e.g. L2 is CMM L2, L3 is CMM L3 and L4 is CMM L4.' },
						{ 'title': 'L1', 'cell': 'Yes', 'description':'L1: Process available.' },
					]
				},
				{ 'title': 'Security Management',
					'description': 'In addition to the “technical” aspects of security, which are covered in the “Security” category, this topic here covers the procedural aspect of it.',
					'rows': [
						{ 'title': 'L4', 'cell': '24x7 Security Operations Center', 'description':'L4: Comprehensive supervision by 24x7 security operations center.' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'Crisis Management Process', 'description':'L2: calls for a crisis management process to be established.' },
						{ 'title': 'L1', 'cell': 'Pro-active Security Monitoring', 'description':'L1: Provider performs proactive security monitoring.' }
					]
				},
				{ 'title': 'Config Management',
					'description': 'L1: Basic configuration management refers to the support of the configuration management database (CMDB) capturing basic configuration items (CI) that allow the on-line tracking of the cloud resources subscribed by the end-users. L3: This refers to the support of an enterprise class CMDB capturing comprehensive CI information with correlation capability between CI that allow the on-line track of the cloud resources and CIs relationships subscribed by the end-users.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Comprehensive' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Basic' }
					]
				},
				{ 'title': 'Service Management',
					'description': 'In general terms cloud services are IT services remotely offered to the customer. There are well defined and well structured methods available to determine how services are expected to be managed in an enterprise environment. One should expect the same structured approach to IT service offerings from a service provider as would be expected from an in-house IT organization. Cost, effort and rigidness increase with the ITIL level and present a natural way for mapping it into the CAT framework levels.',
					'rows': [
						{ 'title': 'L4', 'cell': 'ITIL L4/5' },
						{ 'title': 'L3', 'cell': 'ITIL L3' },
						{ 'title': 'L2', 'cell': 'ITIL L2' },
						{ 'title': 'L1', 'cell': 'SLA Commitment' }
					]
				},
				{ 'title': 'Reporting',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Comprehensive Rep.', 'description':'L3: Comprehensive reporting extends L2 capabilities to include pre-defined reports and customer customizable reports that users can receive via various channels including on- line viewing, download (as .pdf, .html, .doc, etc.) from web portal or via e-mail. Comprehensive reports may include report on Cloud resources subscribed for VMs, Storage, Internet IP, bandwidth usage, VM’s performance, network performance, security threats, billing and invoicing, ticketing statistics, etc.' },
						{ 'title': 'L2', 'cell': 'Dashboard', 'description':'L2: In addition to L1 requirements an on- line information dashboard should be made available to the user, showing the list of essential Cloud services currently being deployed and utilized. It may include real-time update of information on status of VMs, Storage usage, Storage Buckets, Data transfer and others.' },
						{ 'title': 'L1', 'cell': 'Basic Rep.', 'description':'L1: Basic reporting refers to the support of simple on-line reports that cover essential cloud services. Basic reports may include report on Cloud resources subscribed for VMs, Storage, Internet IP, Bandwidth usage, etc. ' }
					]
				},
				{ 'title': 'Portal',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'Service Catalog', 'description':'L2: “Service Catalog” is a function in the cloud Web portal that supports listing and grouping of all available products and services to which customers can browse and subscribe.' },
						{ 'title': 'L1', 'cell': 'Self-service', 'description':'“Self Service” is the cloud Web portal feature that enables customers to perform most of the essential services themselves. This includes provisioning resource, managing resources such as controlling VM status (reboot, shutdown, restart, etc.), viewing various subscribed services, downloading essential support documents (e.g. user guides and FAQ list, etc.).' }
					]
				},
				{ 'title': 'Deployment',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Auto VM Upgrade', 'description':'L3: Auto VM- upgrade permits a user to upgrade the virtual core, RAM and Storage of a VM from small configuration to higher configuration without migrating the operating system and data.' },
						{ 'title': 'L2', 'cell': 'Custom Image Support', 'description':'L2: Custom image support permits users to customize a VM server image and quickly redeploy that via a portal on new shared cloud servers.' },
						{ 'title': 'L1', 'cell': 'Auto-prov.', 'description':'L1: Auto-provisioning is the ability of the cloud Web portal to capture customer requested cloud service subscription and automatically provision the cloud services without human intervention.' }
					]
				},
				{ 'title': 'Billing',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'History', 'description':'L3: Service provider keeps a history of the customer’s use of chargeable resources and services.' },
						{ 'title': 'L2' },
						{ 'title': 'L1' }
					]
				},
				{ 'title': 'Ticketing',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'View entire ticket DB and stats', 'description':'L3: ticketing functions allow all customer submitted requests and problems to be logged and retrieved for viewing by customers along with statistics.' },
						{ 'title': 'L2', 'cell': 'Problem logging on request', 'description':'L2: Problem logging supports submission of problems and requests from a customer via a Web form, e-mail link or other methods.' },
						{ 'title': 'L1' },
					]
				}
			]
		},
		{
			'category': 'Performance',
			'description': 'Runtime behavior of deployed application software',
			'onselectclear': 'col',
			'cols': [
				{ 'title': 'Availability %',
					'description': 'Refers to the length of time the service is offering without interruption (outside defined maintenance windows).',
					'rows': [
						{ 'title': 'L4', 'cell': '99.9995', 'description':'L4: 99.9995% is required to support highly critical business applications (e.g. database applications).' },
						{ 'title': 'L3', 'cell': '99.999', 'description':'L3: 99.999% is the widely accepted requirement in the telecommunications industry for high-availability services.' },
						{ 'title': 'L2', 'cell': '99.99' },
						{ 'title': 'L1', 'cell': '99.95', 'description':'L1: 99.95% represents standard IT hardware and software runtime uptime.' }
					]
				},
				{ 'title': 'VM-to-VM Latency',
					'description': 'Refers to the maximum time allowed to send a message from one software instance to another running on different physical machines.',
					'rows': [
						{ 'title': 'L4', 'cell': '100us', 'description':'L4: 100 nanoseconds (for at least 99.5% of messaged, for real time apps highly sophisticated redundancy architectures).' },
						{ 'title': 'L3', 'cell': '1ms', 'description':'L3: 1 microseconds (financial trading).' },
						{ 'title': 'L2', 'cell': '10ms', 'description':'L2: 10 microseconds (for distributed telecommunications DB services).' },
						{ 'title': 'L1', 'cell': '100ms', 'description':'L1: 100ms (e.g. for basic Web apps).' },
					]
				},
				{ 'title': 'Scalability',
					'description': 'Measures the performance level to which a deployed application can be engineered.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': '+ Auto-scaling support for applicaiton', 'description':'L3: Auto scaling support to scale an application without user monitoring or intervention.' },
						{ 'title': 'L2', 'cell': '+ Resource utilization monitoring tool' },
						{ 'title': 'L1', 'cell': '+ Flexible granularity of resource scaling' },
					]
				},
				{ 'title': 'Elasticity',
					'description': 'Addresses the how fast a deployed application can increase its performance response with increasing service requests.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': '+ >1 sec to start/end new VM', 'description':'L3: elapsed detect-trigger time between application/host and infrastructure management.' },
						{ 'title': 'L2', 'cell': '+ Programmatic interface (API)' },
						{ 'title': 'L1', 'cell': '+ Scale up and down' },
					]
				},
				{ 'title': 'Redundancy',
					'description': 'Redundancy architectures frequently rely on a well-defined set of software components to preserve states and transactions.',
					'rows': [
						{ 'title': 'L4', 'cell': 'Cluster deployment API', 'description':'L4: Means for cluster deployment, ensuring that software units are deployed on the physical infra structure according to requirements specified by the application.' },
						{ 'title': 'L3', 'cell': 'HA database as part of offering', 'description':'L3: Service incorporates High Availability- database for high availability software design.' },
						{ 'title': 'L2', 'cell': '+ Auto-restart of dropped app' },
						{ 'title': 'L1', 'cell': 'Availability zone' },
					]
				},
				{ 'title': 'Load Distribution',
					'description': 'Widely used scheme to implement scalable and reliable services.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Selectable distribution criteria' },
						{ 'title': 'L2', 'cell': 'Load distribution redundancy' },
						{ 'title': 'L1', 'cell': 'Intelligent load distribution + programmatic interface to load distribution events' },
					]
				},
				{ 'title': 'Control',
					'description': 'Highly reliable applications implement redundancy schemes, which must be preserved when deploying to IaaS.',
					'rows': [
						{ 'title': 'L4', 'cell': 'SLA for DC LAN', 'description':'L4: SLA for e.g. delay, jitter, throughput, availability' },
						{ 'title': 'L3', 'cell': 'Pinning of vCPU to logical core', 'description':'L3: Application performance engineering requires dedicated CPU resource assignment -> pinning of vCPU to cores.' },
						{ 'title': 'L2', 'cell': 'Multi VM-to-VM L2 networks', 'description':'L2: NaaS (Network as a Service) for multiple networks between virtual machines.' },
						{ 'title': 'L1', 'description':'L1: Resources are fully transparent to user.' } // CROSS CHECK
					]
				},
				{ 'title': 'Storage',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Tiered Storage', 'description':'L3: Deploying critical and highly available applications to an IaaS offering requires special visibility of the storage capabilities so that the application architecture can be adjusted accordingly.' },
						{ 'title': 'L2' },
						{ 'title': 'L1' }
					]
				},
			]
		},
		{
			'category': 'Access',
			'description': 'Connectivity between the end user and cloud service provider',
			'onselectclear': 'col',
			'cols': [
				{ 'title': 'Access', 
					'description': 'This parameter measures the type of access.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Public / Private On-demand', 'description':'L3: enhanced public access or on-demand private access.' },
						{ 'title': 'L2', 'cell': 'Public / Private', 'description':'L2: a) Enhanced availability public Internet access. b) Private, i.e. dedicated link access, e.g. through VPN and other methods.' },
						{ 'title': 'L1', 'cell': 'Public', 'description':'L1: Access through public Internet.' }
					]
				},
				{ 'title': 'Availability',
					'description': 'Indicates the “guaranteed” level of uptime of the network access.',
					'rows': [
						{ 'title': 'L4', 'cell': '100%' },
						{ 'title': 'L3', 'cell': '99.9999%' },
						{ 'title': 'L2', 'cell': '99.996%' },
						{ 'title': 'L1', 'cell': '99.99%' }
					]
				},
				{ 'title': 'Scalability',
					'description': 'Capability to increase and decrease user’s access bandwidth based on actual capacity demand.',
					'rows': [
						{ 'title': 'L4', },
						{ 'title': 'L3', 'cell': 'Selectable bandwidth' },
						{ 'title': 'L2', },
						{ 'title': 'L1', 'cell': 'Min. bandwidth guarantee' }
					]
				},
				{ 'title': 'Reliability',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': '<=50ms' }
					]
				},
				{ 'title': 'Class of Service',
					'description': 'allows priorities to be differentiated and data flows to be shaped for comparable services (non-mission critical, mission critical, real time).',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Non-mission-critical, mission critical, l-time voice/video' }
					]
				},
				{ 'title': 'Packet Loss',
					'description': 'a guarantee to deliver customer packets, expressed as the ratio of undelivered packets to total number of customer packets received by the network.',
					'rows': [
						{ 'title': 'L4', 'cell': '0.001%' },
						{ 'title': 'L3', 'cell': '0.01%' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': '<=0.1%' }
					]
				},
				{ 'title': 'Delay',
					'description': 'is the commitment to end-to-end latency.',
					'rows': [
						{ 'title': 'L4', },
						{ 'title': 'L3', 'cell': '<=180ms' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': '<=230ms' }
					]
				}
			]
		},
		{
			'category': 'Data Center Basics',
			'description': 'Data Center physical infrastructure',
			'onselectclear': 'col',
// TODO
			'notes': 'L4: This is the highest level for clouds and can be considered as the most robust and least prone for failures. This cloud is hosted primarily in a Tier 4 data center and backed up by either a Tier 4 or Tier 3 data center.  L3: This cloud is hosted in two Tier 3 data centers OR a combination of Tier 4 and Tier 2 data centers.  L2: This cloud is hosted in either a Tier 4 / Tier 1 data center OR Tier 3 / Tier 2 data center combinations. Local redundancy may also be considered when hosted in a Tier 4 data center.  L1: This is the lowest level and has higher risks of failure. This cloud is hosted in two Tier 2 data centers OR a combination of Tier 3 and Tier 1 data centers. Local redundancy may also be considered when hosted in a Tier 3 data center.',
			'cols': [
				{ 'title': 'Tier 4',
					'description': '',
					'rows': [
						{ 'title': 'Tier 4', 'cell': 'L4'  },
						{ 'title': 'Tier 3', 'cell': 'L4' },
						{ 'title': 'Tier 2', 'cell': 'L3' },
						{ 'title': 'Tier 1', 'cell': 'L2' },
						{ 'title': 'Local Redundancy', 'cell': 'L2' },
					]
				},
				{ 'title': 'Tier 3',
					'description': '',
					'rows': [
						{ 'title': 'Tier 4', 'cell': 'L4' },
						{ 'title': 'Tier 3', 'cell': 'L3' },
						{ 'title': 'Tier 2', 'cell': 'L2' },
						{ 'title': 'Tier 1', 'cell': 'L1' },
						{ 'title': 'Local Redundancy', 'cell': 'L1' },
					]
				},
				{ 'title': 'Tier 2',
					'description': '',
					'rows': [
						{ 'title': 'Tier 4', 'cell': 'L3' },
						{ 'title': 'Tier 3', 'cell': 'L2' },
						{ 'title': 'Tier 2', 'cell': 'L1' },
						{ 'title': 'Tier 1', 'cell': 'Non-carrier Grade' },
						{ 'title': 'Local Redundancy', 'cell': 'Non-carrier Grade' },
					]
				},
				{ 'title': 'Tier 1',
					'description': '',
					'rows': [
						{ 'title': 'Tier 4', 'cell': 'L2' },
						{ 'title': 'Tier 3', 'cell': 'L1' },
						{ 'title': 'Tier 2', 'cell': 'Non-carrier Grade' },
						{ 'title': 'Tier 1', 'cell': 'Non-carrier Grade' },
						{ 'title': 'Local Redundancy', 'cell': 'Non-carrier Grade' },
					]
				}
			]
		},
		{
			'category': 'Certification',
			'description': 'Degree of quality assurance to the customer',
			'onselectclear': 'col',
			'cols': [
				{ 'title': 'PCI',
					'description': 'Payment card industry (PCI) compliance is adherence to a set of specific security Standards that were developed to protect card information during and after a financial transaction. PCI compliance is required by all card brands.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'Yes' },
						{ 'title': 'L1' },
					]
				},
				{ 'title': 'SAS70',
					'description': 'Defines the standards an auditor must employ in order to assess the contracted internal controls of service organization, e.g. hosted data centers. SSAE16 is a newly introduced optional add on for higher standards.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'SSAE16' },
						{ 'title': 'L1', 'cell': 'Yes' },
					]
				},
				{ 'title': 'ISO 9000',
					'description': 'A series of standards, developed and published by the International Organization for Standardization that define, establish, and maintain an effective quality assurance system for manufacturing and service industries.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'Yes' },
						{ 'title': 'L1' },
					]
				},
				{ 'title': 'ISO 27001/2',
					'description': 'The objective of this pair of standards is to "provide a model for establishing, implementing, operating, monitoring, reviewing, maintaining, and improving an Information Security Management System".',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Yes' },
					]
				},
				{ 'title': 'ISO/IEC 20000',
					'description': 'The provider indicates that they have followed the standardized methods of IT service management, particularly 20000-1 and 20000-2 in revisions from 2011 and 2012 respectively.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'Yes' },
						{ 'title': 'L1' },
					]
				},
				{ 'title': 'EN16001 ISO50xx',
					'description': 'Gives recommendations and guidance on energy management systems. It is designed to help improve energy efficiency by outlining how to implement processes that reduce greenhouse gas emissions. It enables the development of an energy policy and set objectives for the management system in line with legal and regulatory requirements. ISO 50xxx: establishes a framework to manage energy for industrial plants; commercial, institutional, or governmental facilities; or entire organizations. Targeting broad applicability across national economic sectors, it is estimated that the standard could influence up to 60% of the world’s energy use. ISO 50001:2011 specifies requirements for establishing, implementing, maintaining and improving an energy management system, whose purpose is to enable an organization to follow a systematic approach in achieving continual improvement of energy performance, including energy efficiency, energy use and consumption',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'Yes' },
						{ 'title': 'L1' },
					]
				},
				{ 'title': 'Uptime',
					'description': 'The time during which a machine or piece of equipment is operating or can be operated.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Yes' },
						{ 'title': 'L2' },
						{ 'title': 'L1' },
					]
				},
				{ 'title': 'HIPPA',
					'description': 'Health Insurance Portability and Accountability Act of 1996.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'Yes' },
						{ 'title': 'L1' },
					]
				},
				{ 'title': 'Vendor Cert.',
					'description': 'Validates the integrity of commercial software products. It indicates the competence and ability of the provider to operate or offer any third party SW.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Yes' },
					]
				},
				{ 'title': 'Legal',
					'description': 'Providers are obliged to follow legal obligations imposed on them according to the jurisdictions they operate in. Since this may impact the user, who may not even be aware of it, the proposal is to “advertise” these proactively.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Yes' },
						{ 'title': 'L2' },
						{ 'title': 'L1' },
					]
				},
				{ 'title': 'Patch',
					'description': 'The provider is requested to update offer with respect to SW security leaks. This may have impact on the user in requires an appropriate, well defined interaction.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Yes' },
					]
				},
			]
		},
		{
			'category': 'Support',
			'description': 'Deployment and maintenance of applications',
			'onselectclear': 'col',
			'cols': [
				{ 'title': 'Customer Support',
					'description': 'Methods and capabilities available for how a user can interact with the service provider.',
					'rows': [
						{ 'title': 'L4', 'cell': 'Assist Trouble-shooting' },
						{ 'title': 'L3', 'cell': 'Engineering Support' },
						{ 'title': 'L2', 'cell': 'Service Desk' },
						{ 'title': 'L1', 'cell': 'Portal' },
					]
				},
				{ 'title': 'Service Responsiveness',
					'description': 'Time it takes for the service provider to respond to calls or customer inquiries.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': '<=20s' },
						{ 'title': 'L1', 'cell': '24/7' },
					]
				},
				{ 'title': 'Service Escalation',
					'description': 'The levels of escalation provided to customer for proper trouble handling.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': '4 levels' },
					]
				},
				{ 'title': 'Monitoring, Audit, Management',
					'description': 'Cloud implies “self-service” and “ubiquitous”. Therefore, the user needs to be able to monitor and manage the behavior of the deployed user objects at any point in time from any location.',
					'rows': [
						{ 'title': 'L4', 'cell': 'Assisted Monitoring' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'Incident management for all services' },
						{ 'title': 'L1', 'cell': '100% availability for customer\'s access' },
					]
				},
				{ 'title': 'MTTR*',
					'description': 'mean time to repair is the time it takes for service provider to correct reported faults or incidents concerning services acquired by user.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': '2 hours' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': '4 hours' },
					]
				},
				{ 'title': 'Change Management Support',
					'description': 'An acquired service is neither static nor unchanged at all times, it may need internal repairs, upgrades, etc. This impacts the behavior of the user’s service or application. ',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Customer-initiated change requests' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Provider objectives' },
					]
				},
				{ 'title': 'Incident Response Time (Pri1)',
					'description': 'Maximum time it takes for service provider to react and act on Priority 1 incidents (an event where a service/application is not working or accessible).',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': '15 minutes', 'description':'L3: 15 minutes' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': '30 minutes', 'description':'L1: 30 minutes' },
					]
				},
				{ 'title': 'Service Training',
					'description': 'Structured training and transfer of know-how is important for businesses.',
					'rows': [
						{ 'title': 'L4' }, 
						{ 'title': 'L3' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Yes' }
					]
				}
			]
		},
		{
			'category': 'Interoperability',
			'description': 'Cloud hypervisor interfaces to applications',
			'onselectclear': 'col',
			'cols': [
				{ 'title': 'Download Format',
					'description': 'This represents the format of the objects to be transferred into the provider’s infrastructure.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'OVF', 'description':'L2: DMTF [2] has developed a standard format called “open virtualization format” (OVF) which eases the federation across several offerings.' },
						{ 'title': 'L1' }
					]
				},
				{ 'title': 'API',
					'description': '',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Non-provider specific', 'description':'L3: Standardized API will reduce complexity and cost on the user side whenever several cloud services have to be combined or utilized.' },
						{ 'title': 'L2' },
						{ 'title': 'L1', 'cell': 'Provider specific', 'description':'L1: The programmatic interfaces to request and monitor resources, to deploy and manage applications, mirror the feature differentiation as well as the fast innovation cycles of the service offerings.' },
					]
				},
				{ 'title': 'Access Device',
					'description': '',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Any browser', 'description':'L3: For anywhere (e.g. mobile) and any device (e.g. BYOD) access a fully open access (any browser) is needed.' },
						{ 'title': 'L2', 'cell': 'Open client', 'description':'L2: For consuming any application as a service, standard methods for access are needed (“open client”).' },
						{ 'title': 'L1', 'cell': 'Customized', 'description':'L1: Vertically integrated service solutions may benefit from specialized or customized access devices.' },
					]
				},
				{ 'title': 'Life Cycle',
					'description': 'The user needs to integrate the requested services into the IT management processes and applications/services.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'DMTF', 'description':'L3: DMTF developed recommendation [3] allowing consistent life cycle management of different services.' },
						{ 'title': 'L2' },
						{ 'title': 'L1' }
					]
				},
				{ 'title': 'Monitoring Data',
					'description': 'Any applications deployed in IaaS or PaaS environments must be monitored and managed by the user.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3', 'cell': 'Complex monitoring tools', 'description':'L3: For business critical applications a comprehensive set of data (and appropriate monitoring capabilities) should be provided in standardized formats to enable import in user’s monitoring tools.' },
						{ 'title': 'L2' },
						{ 'title': 'L1' }
					]
				},
				{ 'title': 'IDM',
					'description': 'Service providers must have a way of handling the identity of the user and the user must integrate the IDM of the outsourced service into their IT infrastructure.',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'Standard', 'description':'L2: There are many ways to address IDM. For interoperability reason an IDM system based on available standards is recommended.' },
						{ 'title': 'L1' }
					]
				},
				{ 'title': 'Virtual Management',
					'description': 'The user may need to integrate the requested resources into their IT management processes (especially for IaaS).',
					'rows': [
						{ 'title': 'L4' },
						{ 'title': 'L3' },
						{ 'title': 'L2', 'cell': 'DMTF', 'description':'L2: DMTF developed recommendation allowing consistent integration of several services.' },
						{ 'title': 'L1' }
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

	Session.set('assessment_id', null);

	Template.category_selection.events({
		'keyup input#application_name': function(e) {
			var assessment_id = Session.get('assessment_id');
			var update = {
				$set: {'application_name': e.target.value}
			};
			
			Assessments.update({ _id: assessment_id }, update);

			var assessment = Assessments.findOne({ _id: assessment_id });
			Meteor.flush();
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
	};
	Template.category_selection.assessment = function() {
		return Assessments.findOne({ _id: Session.get('assessment_id') });
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
		return Session.get('current');
	};

	Template.category_results.category = function() {
		var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
		var category_name = Session.get('category');
		var category = _.find(assessment.data, function(datum) { return datum.category == category_name; });
		return category;
	};
	Template.category_results.criteria_header = function() {
		var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
		var category_name = Session.get('category');
		var category = _.find(assessment.data, function(datum) { return datum.category == category_name; });
		if(category.description) return category.description;
		return '';
	};
	Template.category_results.assessment = function() {
		return Assessments.findOne({ _id: Session.get('assessment_id') });
	};
	Template.category_results.criteria = function() {
		var current = Session.get('current').replace(/_/g, ' ');
		var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
		var datum = _.find(assessment.data, function(datum) { return datum.category == current; });
		var cols = datum.cols;
		var criterion = [];
		_.each(cols, function(col) {
			_.each(col.rows, function(row) {
				row.coltitle = col.title;
				row.coldescription = col.description;
				if(row.cellsel)
					criterion.push(row);
			});
		});
		return criterion;
	};
	Template.category_results.rendered = function() {
		$('div#header,div#nav').hide();
	};

	Template.results.created = function() {
		var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
		var results = [];
		_.each(assessment.data, function(datum) {
			if(datum.sel == 1) {
console.log(datum.category);
				Session.set('category', datum.category);
				Session.set('current', datum.category);
				$(Meteor.render(function() { return Template.category_results({}); })).appendTo('div#page');
			}
		});
		return results;
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
		} else return true;
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

			var current = Session.get('current').replace(/_/g, ' ');
			var datum = _.find(assessment.data, function(datum) { return datum.category == current; });

			var onselectclear = datum.onselectclear;
			_.each(datum.cols, function(col) {
				_.each(col.rows, function(row) {
					if(col.title == selcoltitle || onselectclear == 'table') row.cellsel = 0;
				});
			});

			if(this.cellsel != 1) { // As long as the cell was not previously selected i.e. we are de-selecting
				_.each(datum.cols, function(col) {
					if(col.title == selcoltitle) {
						_.each(col.rows, function(row) {
							if(row.title == selrowtitle) row.cellsel = 1;
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
			var current = Session.get('current').replace(/_/g, ' ');
			var datum = _.find(assessment.data, function(datum) { return datum.category == current; });
			var cols = datum.cols;
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
		var assessment = Assessments.findOne({ _id: Session.get('assessment_id') });
		var headers = [];
		if(assessment) {
			var current = Session.get('current');
			var datum = _.find(assessment.data, function(datum) { return datum.category == current; });
			var cols = datum.cols;
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
			':assessment_id/:category/results': 'specificResultsPage',
			':assessment_id/:category': 'specificPage',
			'*assessment_id': 'defaultPage'
		},
		specificResultsPage: function(assessment_id, page) {
			Meteor.subscribe('assessment', assessment_id, function() {
				var assessment = Assessments.findOne({ _id: assessment_id });
				if(assessment) {
					console.log('found existing application', assessment._id);
					Session.set('assessment_id', assessment._id);
					Session.set('category', page.replace(/_/g, ' ').capitalise());
					Session.set('current', page.replace(/_/g, ' ').capitalise());
					$('div#page').html('');
					$(Meteor.render(function() { return Template.category_results({}); })).appendTo('div#page');
				}
			});
		},
		specificPage: function(assessment_id, page) {
			Meteor.subscribe('assessment', assessment_id, function() {
				var assessment = Assessments.findOne({ _id: assessment_id });
				if(assessment) {
					if(page == 'results') {
						console.log('found existing application', assessment._id);
						Session.set('assessment_id', assessment._id);
						Session.set('category', page.replace(/_/g, ' ').capitalise());
						Session.set('current', page.replace(/_/g, ' ').capitalise());
						$('div#page').html('');
						$(Meteor.render(function() { return Template.results({}); })).appendTo('div#page');
					} else {
						console.log('found existing application', assessment._id);
						Session.set('assessment_id', assessment._id);
						Session.set('category', page.replace(/_/g, ' ').capitalise());
						Session.set('current', page.replace(/_/g, ' ').capitalise());
						$('div#page').html('');
						if(page == 'categories') {
							$(Meteor.render(function() { return Template.category_selection({}); })).appendTo('div#page');
						} else if(page == 'completed') {
							$(Meteor.render(function() { return Template.assessment_finished({}); })).appendTo('div#page');
						} else if(page == 'results') {
							$(Meteor.render(function() { return Template.assessment_results({}); })).appendTo('div#page');
						} else {
							$(Meteor.render(function() { return Template.category_evaluation({}); })).appendTo('div#page');
						}
					}
				}
			});
		},
		defaultPage: function(assessment_id) {
			if(assessment_id == '') {
				var last_assessment = read_cookie('last_assessment');
				if(last_assessment) {
					this.navigate('/' + last_assessment);
				} else {
					$('div#page').html('');
					$(Meteor.render(function() { return Template.profile_selection({}); })).appendTo('div#page');
				}
			} else if(assessment_id.indexOf('-') > 0 && Assessments.findOne({ _id: assessment_id })) {
				Session.set('category', 'Categories');
				this.navigate('/' + assessment_id + '/' + Session.get('category').replace(/ /g, '_').toLowerCase(), true);
			} else {
				assessment_id = Assessments.insert({
					'application_name': '',
					'stack': ['Categories'],
					'data': assessment_template
				});
				console.log('created new application', assessment_id);
				assessment = Assessments.findOne({ _id: assessment_id });
				this.navigate('/' + assessment_id, true);
			}
		}
	});
	Router = new AccacatRouter();

	Meteor.startup(function() {
		Backbone.history.start({ pushState: true });
	});

}
