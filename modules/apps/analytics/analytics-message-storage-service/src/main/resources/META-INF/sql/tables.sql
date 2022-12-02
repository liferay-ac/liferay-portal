create table AnalyticsAssociation (
	mvccVersion LONG default 0 not null,
	ctCollectionId LONG default 0 not null,
	analyticsAssociationId LONG not null,
	companyId LONG,
	createDate DATE null,
	modifiedDate DATE null,
	userId LONG,
	associationClassName VARCHAR(75) null,
	associationClassPK LONG,
	className VARCHAR(75) null,
	classPK LONG,
	primary key (analyticsAssociationId, ctCollectionId)
);

create table AnalyticsDeleteMessage (
	mvccVersion LONG default 0 not null,
	ctCollectionId LONG default 0 not null,
	analyticsDeleteMessageId LONG not null,
	companyId LONG,
	userId LONG,
	createDate DATE null,
	modifiedDate DATE null,
	className VARCHAR(255) null,
	classPK LONG,
	primary key (analyticsDeleteMessageId, ctCollectionId)
);