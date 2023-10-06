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
	numberOfAddendaRecord:{
		name: 'Number of Addenda Records',
		width: 4,
		position: 5,
		required: false,
		type: 'numeric',
		value: ''
	},
	reserved: {
		name: 'Reserved',
		width: 13,
		position: 6,
		required: false,
		type: 'alphanumeric',
		value: ''
	},
	amount: {
		name: 'Amount',
		width: 10,
		position: 7,
		required: true,
		type: 'numeric',
		value:'',
		number: true
	},
	DFIAccount: {
		name: 'Foreign Receivers account number / DFI Account Number',
		width: 35,
		position: 8,
		required: true,
		type: 'alphanumeric',
		value: ''
	},
	nineReserved: {
		name: 'Ninth Field Reserved',
		width: 2,
		position: 9,
		required: false,
		type: 'alphanumeric',
		value: ''
	},
	gatewayOperatorOFACScreeningIndicator: {
		name: 'Gateway Operator OFAC Screening Indicator',
		width: 1,
		position: 10,
		required: false,
		type: 'alphanumeric',
		value: '',
	},
	secondaryOFACScreeningIndicator: {
		name: 'Secondary OFAC Screening Indicator',
		width: 1,
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

	traceNumber: {
		name: 'Trace Number',
		width: 15,
		position: 13,
		required: false,
		type: 'numeric',
		blank: true,
		value: ''
	}
};