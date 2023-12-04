// Entry

let _ = require('lodash');
let utils = require('./../utils');
let validate = require('./../validate');

let highLevelOverrides = ['addendaTypeCode', 'returnReasonCode', 'changeCode', 'originalEntryTraceNumber', 'originalReceivingDFI', 'correctedData', 'traceNumber'];

function EntryAddendaNotification(options) {
    // Allow the file header defaults to be overridden if provided
    this.fields = options.fields ? _.merge(options.fields, require('./fields'), _.defaults) : _.cloneDeep(require('./fields'));

    // Set our high-level values
    utils.overrideLowLevel(highLevelOverrides, options, this);

    // Some values need special coercing, so after they've been set by overrideLowLevel() we override them

    if (options.originalReceivingDFI) {
        this.fields.originalReceivingDFI.value = utils.computeCheckDigit(options.originalReceivingDFI).slice(0, -1);
    }

    if (options.correctedData) {
        this.fields.correctedData.value = options.correctedData.slice(0, this.fields.correctedData.width);
    }

    // Validate required fields have been passed
    this._validate();

    return this;
}

EntryAddendaNotification.prototype.generateString = function (cb) {
    utils.generateString(this.fields, function (string) {
        cb(string);
    });
};

EntryAddendaNotification.prototype._validate = function () {
    // Validate required fields
    validate.validateRequiredFields(this.fields);

    // Validate the ACH code passed is actually valid
    validate.validateACHAddendaTypeCode(this.fields.addendaTypeCode.value);

    // Validate header field lengths
    validate.validateLengths(this.fields);

    // Validate header data types
    validate.validateDataTypes(this.fields);
};

EntryAddendaNotification.prototype.get = function (category) {
    // If the header has it, return that (header takes priority)
    if (this.fields[category]) {
        return this.fields[category]['value'];
    }
};

EntryAddendaNotification.prototype.set = function (category, value) {
    // If the header has the field, set the value
    if (this.fields[category]) {
        this.fields[category]['value'] = value;
    }
};

module.exports = EntryAddendaNotification;