const utils = require('../utils');

module.exports = {
    recordTypeCode: {
        name: 'Record Type Code',
        width: 1,
        position: 1,
        required: true,
        type: 'numeric',
        value: '7'
    },

    addendaTypeCode: {
        name: 'Addenda Type Code',
        width: 2,
        position: 2,
        required: true,
        type: 'numeric',
        value: '99'
    },

    returnReasonCode: {
        name: 'Return Reason Code',
        width: 3,
        position: 3,
        required: true,
        type: 'alphanumeric',
        value: 'R17'
    },

    // same as field 11 from forward entry detail records
    originalEntryTraceNumber: {
        name: 'Original Entry Trace Number',
        width: 15,
        position: 4,
        required: false,
        type: 'numeric',
        blank: true,
        value: ''
    },

    dateOfDeath: {
        name: 'Date of Death',
        width: 6,
        position: 5,
        required: false,
        type: 'numeric', // TODO: Format: YYMMDD
        value: '',
        blank: true // TODO: what does this mean
    },

    // same as field 3 from forward entry detail records
    originalReceivingDFI: {
        name: 'Original Receiving DFI Identification',
        width: 8,
        position: 6,
        required: true,
        type: 'numeric',
        value: ''
    },

    addendaInformation: {
        name: 'Addenda Information',
        width: 44,
        position: 7,
        required: false,
        type: 'alphanumeric',
        value: ''
    },

    traceNumber: {
        name: 'Trace Number',
        width: 15,
        position: 8,
        required: false,
        type: 'numeric',
        blank: true,
        value: ''
    }
};