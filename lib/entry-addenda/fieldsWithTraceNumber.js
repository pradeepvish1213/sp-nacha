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
        value: '05'
    },

    paymentRelatedInformation: {
        name: 'Payment Related Information',
        width: 76,
        position: 3,
        required: false,
        type: 'alphanumeric',
        value: ''
    },

    traceNumber: {
        name: 'Trace Number',
        width: 15,
        position: 4,
        required: false,
        type: 'numeric',
        blank: true,
        value: ''
    }
};
