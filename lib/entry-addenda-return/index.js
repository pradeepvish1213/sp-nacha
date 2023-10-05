// Entry

var _ = require('lodash');
var utils = require('./../utils');
var validate = require('./../validate');

var highLevelOverrides = ['addendaTypeCode', 'returnReasonCode', 'originalEntryTraceNumber', 'dateOfDeath', 'originalReceivingDFI', 'addendaInformation', 'traceNumber'];

function EntryAddendaReturn(options) {
    // Allow the file header defaults to be overridden if provided
    this.fields = options.fields ? _.merge(options.fields, require('./fields'), _.defaults) : _.cloneDeep(require('./fields'));

    // Set our high-level values
    utils.overrideLowLevel(highLevelOverrides, options, this);

    // Some values need special coercing, so after they've been set by overrideLowLevel() we override them
    if (options.dateOfDeath) {
        this.fields.dateOfDeath.value = utils.formatDate(options.dateOfDeath);
    }

    if (options.originalReceivingDFI) {
        this.fields.originalReceivingDFI.value = utils.computeCheckDigit(options.originalReceivingDFI).slice(0, -1);
    }

    if (options.addendaInformation) {
        this.fields.addendaInformation.value = options.addendaInformation.slice(0, this.fields.addendaInformation.width);
    }

    // Validate required fields have been passed
    this._validate();

    return this;
}

EntryAddendaReturn.prototype.generateString = function (cb) {
    utils.generateString(this.fields, function (string) {
        cb(string);
    });
};

EntryAddendaReturn.prototype._validate = function () {
    // Validate required fields
    validate.validateRequiredFields(this.fields);

    // Validate the ACH code passed is actually valid
    validate.validateACHAddendaTypeCode(this.fields.addendaTypeCode.value);

    // Validate header field lengths
    validate.validateLengths(this.fields);

    // Validate header data types
    validate.validateDataTypes(this.fields);
};

EntryAddendaReturn.prototype.get = function (category) {
    // If the header has it, return that (header takes priority)
    if (this.fields[category]) {
        return this.fields[category]['value'];
    }
};

EntryAddendaReturn.prototype.set = function (category, value) {
    // If the header has the field, set the value
    if (this.fields[category]) {
        this.fields[category]['value'] = value;
    }
};

module.exports = EntryAddendaReturn;