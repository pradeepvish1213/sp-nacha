module.exports = {
	recordTypeCode: {
		name: 'Record Type Code',
		width: 1,
		position: 1,
		required: true,
		type: 'numeric',
		value: '5'
	},

	serviceClassCode: {
		name: 'Service Class Code',
		width: 3,
		position: 2,
		required: true,
		type: 'numeric',
		value: ''
	},

	iatIndicator: {
		name: 'IAT Indicator',
		width: 16,
		position: 3,
		required: false,
		type: 'alphanumeric',
		value: ''
	},

	foreignExchangeIndicator: {
		name: 'Foreign Exchange Indicator',
		width: 2,
		position: 4,
		required: true,
		type: 'alphanumeric',
		blank: true,
		value: ''
	},
	foreignExchangeReferenceIndicator: {
		name: 'Foreign Exchange Reference Indicator',
		width: 1,
		position: 5,
		required: true,
		type: 'numeric',
		value: ''
	},
	foreignExchangeReference: {
		name: 'Foreign Exchange Reference',
		width: 15,
		position: 6,
		required: true,
		type: 'alphanumeric',
		value: ''
	},
	isoDestinationCountryCode: {
		name: 'iso_destination_country_code',
		width: 2,
		position: 7,
		required: true,
		type: 'alphanumeric',
		value: ''
	},
	originatorIdentification: {
		name: 'Originator Identification',
		width: 10,
		position: 8,
		required: true,
		type: 'numeric',
		value: ''
	},

	standardEntryClassCode: {
		name: 'Standard Entry Class Code',
		width: 3,
		position: 9,
		required: true,
		type: 'alpha',
		value: ''
	},

	companyEntryDescription: {
		name: 'Company Entry Description',
		width: 10,
		position: 10,
		required: true,
		type: 'alphanumeric',
		value: ''
	},

	isoOriginatingCurrencyCode: {
		name: 'ISO Originating Currency Code',
		width: 3,
		position: 11,
		required: false,
		type: 'alphanumeric',
		value: ''
	},
	isoDestinationCurrencyCode: {
		name: 'ISO Destination Currency Code',
		width: 3,
		position: 12,
		required: false,
		type: 'alphanumeric',
		value: ''
	},

	effectiveEntryDate: {
		name: 'Effective Entry Date',
		width: 6,
		position: 13,
		required: true,
		type: 'numeric',
		value: ''
	},

	settlementDate: {
		name: 'Settlement Date',
		width: 3,
		position: 14,
		required: false,
		type: 'numeric',
		blank: true,
		value: ''
	},

	originatorStatusCode: {
		name: 'Originator Status Code',
		width: 1,
		position: 15,
		required: true,
		type: 'numeric',
		value: '1'
	},

	originatingDFI: {
		name: 'Originating DFI',
		width: 8,
		position: 16,
		required: true,
		type: 'numeric',
		value: ''
	},

	batchNumber: {
		name: 'Batch Number',
		width: 7,
		position: 17,
		required: false,
		type: 'numeric',
		value: 0
	}
};