module.exports = {
	recordTypeCode: {
		name: 'Record Type Code',
		width: 1,
		position: 1,
		required: true,
		type: 'numeric',
		value: '6'
	},

	transactionCode: {
		name: 'Transaction Code',
		width: 2,
		position: 2,
		required: true,
		type: 'numeric'
	},
    
	receivingDFI: {
		name: 'Receiving DFI Identification',
		width: 8,
		position: 3,
		required: true,
		type: 'numeric',
		value: ''
	},

	checkDigit: {
		name: 'Check Digit',
		width: 1,
		position: 4,
		required: true,
		type: 'numeric',
		value: ''
	},

	DFIAccount: {
		name: 'DFI Account Number',
		width: 15,
		position: 5,
		required: true,
		type: 'alphanumeric',
		value: ''
	},

	amount: {
		name: 'Amount',
		width: 12,
		position: 6,
		required: true,
		type: 'numeric',
		value:'',
		number: true
	},

	adviceRoutingNumber: {
		name: 'Advice Routing Number',
		width: 9,
		position: 7,
		required: true,
		type: 'numeric',
		value: ''
	},
	fileIdentification: {
		name: 'File Identification',
		width: 5,
		position: 8,
		required: false,
		type: 'alphanumeric',
		value: ''
	},
	achOperatorData: {
		name: 'ACH Operator Data',
		width: 1,
		position: 9,
		required: false,
		type: 'alphanumeric',
		value: ''
	},
	individualName: {
		name: 'Individual Name',
		width: 22,
		position: 10,
		required: true,
		type: 'alphanumeric',
		value: ''
	},

	discretionaryData: {
		name: 'Discretionary Data',
		width: 2,
		position: 11,
		required: false,
		type: 'alphanumeric',
		value: '',
	},

	addendaId: {
		name: 'Addenda Record Indicator',
		width: 1,
		position: 12,
		required: true,
		type: 'numeric',
		value: '0'
	},
	routingNumberOfAchOperator: {
		name: 'Routing Number Of ACH Operator',
		width: 8,
		position: 13,
		required: true,
		type: 'numeric',
		blank: true,
		value: ''
	},
	julianDateOnWhichAdviceIsCreated: {
		name: 'Julian Date On Which Advice Is Created',
		width: 3,
		position: 14,
		required: true,
		type: 'numeric',
		blank: true,
		value: ''
	},
	sequenceNumberWithinBatch: {
		name: 'Sequence Number Within Batch',
		width: 4,
		position: 15,
		required: true,
		type: 'numeric',
		blank: true,
		value: ''
	}
};