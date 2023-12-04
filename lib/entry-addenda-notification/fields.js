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
    changeCode: {
        name: 'Change Code',
        width: 3,
        position: 3,
        required: true,
        type: 'alphanumeric',
        value: 'R17'
    },
    originalEntryTraceNumber: {
        name: 'Original Entry Trace Number',
        width: 15,
        position: 4,
        required: false,
        type: 'numeric',
        blank: true,
        value: ''
    },
    reserved: {
        name: 'Reserved',
        width: 6,
        position: 5,
        required: false,
        type: 'alphanumeric',
        value: '',
        blank: true
    },
    originalReceivingDFI: {
        name: 'Original Receiving DFI Identification',
        width: 8,
        position: 6,
        required: true,
        type: 'numeric',
        value: ''
    },
    correctedData: {
        name: 'Corrected Data',
        width: 29,
        position: 7,
        required: true,
        type: 'alphanumeric',
        value: ''
    },
    reserved_: {
        name: 'Reserved',
        width: 15,
        position: 8,
        required: false,
        type: 'alphanumeric',
        value: '',
        blank: true
    },
    traceNumber: {
        name: 'Trace Number',
        width: 15,
        position: 9,
        required: false,
        type: 'numeric',
        blank: true,
        value: ''
    }
};