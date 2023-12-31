// Entry

let _ = require('lodash');
let utils = require('./../utils');
let validate = require('./../validate');

let highLevelOverrides = ['addendaTypeCode', 'paymentRelatedInformation', 'addendaSequenceNumber', 'entryDetailSequenceNumber'];

function EntryAddenda(options, standardEntryClassCode) {

    // Allow the file header defaults to be override if provided
    this.fields = options.fields ? _.merge(options.fields, require('./fields'), _.defaults) : _.cloneDeep(require('./fields'));
    if (['MTE', 'POS', 'SHR', 'IAT'].indexOf(standardEntryClassCode) !== -1 && ['17', '18'].indexOf(options.addendaTypeCode) === -1) {
        this.fields = _.merge(options.fields, require('./fieldsWithTraceNumber'), _.defaults)
        if (standardEntryClassCode === 'IAT') {
            let reservedWith;
            let paymentRelatedInfoWidth
            switch (options.addendaTypeCode) {
                case '10':
                    reservedWith = 6;
                    paymentRelatedInfoWidth = 78
                    break;
                case '13':
                    reservedWith = 10;
                    paymentRelatedInfoWidth = 74
                    break;
                case '14':
                    reservedWith = 10;
                    paymentRelatedInfoWidth = 74
                    break;
                case '15':
                    reservedWith = 34;
                    paymentRelatedInfoWidth = 50
                    break;
                default:
                    reservedWith = 14;
                    paymentRelatedInfoWidth = 70
                    break;
            }
            this.fields.paymentRelatedInformation.width = paymentRelatedInfoWidth;
            this.fields.reserved = {
                name: 'Reserved',
                width: reservedWith,
                position: 4,
                required: false,
                type: 'alphanumeric',
                value: '',
                blank: true
            }
            this.fields.entryDetailSequenceNumber = {
                name: 'Entry Detail Sequence Number',
                width: 7,
                position: 5,
                required: false,
                type: 'numeric',
                value: ''
            }
            delete this.fields.traceNumber
        }
    }
    // Set our high-level values
    utils.overrideLowLevel(highLevelOverrides, options, this);

    // Some values need special coercing, so after they've been set by overrideLowLevel() we override them
    if (options.paymentRelatedInformation) {
        this.fields.paymentRelatedInformation.value = options.paymentRelatedInformation.slice(0, this.fields.paymentRelatedInformation.width);
    }

    if (options.addendaSequenceNumber) {
        this.fields.addendaSequenceNumber.value = Number(options.addendaSequenceNumber);
    }

    if (options.entryDetailSequenceNumber) {
        this.fields.entryDetailSequenceNumber.value = options.entryDetailSequenceNumber.slice(0 - this.fields.entryDetailSequenceNumber.width); // last n digits. pass
    }

    // Validate required fields have been passed
    this._validate();

    return this;
}

EntryAddenda.prototype.generateString = function (cb) {
    utils.generateString(this.fields, function (string) {
        cb(string);
    });
};

EntryAddenda.prototype._validate = function () {

    // Validate required fields
    validate.validateRequiredFields(this.fields);

    // Validate the ACH code passed is actually valid
    validate.validateACHAddendaTypeCode(this.fields.addendaTypeCode.value);

    // Validate header field lengths
    validate.validateLengths(this.fields);

    // Validate header data types
    validate.validateDataTypes(this.fields);
};

EntryAddenda.prototype.get = function (category) {

    // If the header has it, return that (header takes priority)
    if (this.fields[category]) {
        return this.fields[category]['value'];
    }
};

EntryAddenda.prototype.set = function (category, value) {

    // If the header has the field, set the value
    if (this.fields[category]) {
        if (category === 'entryDetailSequenceNumber') {
            this.fields[category]['value'] = value.slice(0 - this.fields[category].width); // pass last n digits
        } else {
            this.fields[category]['value'] = value;
        }
    }
};

module.exports = EntryAddenda;
