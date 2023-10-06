// Entry

const _ = require('lodash');
const async = require('async');
const utils = require('./../utils');
const validate = require('./../validate');

const highLevelOverrides = ['transactionCode', 'receivingDFI', 'checkDigit', 'numberOfAddendaRecord', 'amount', 'DFIAccount', 'gatewayOperatorOFACScreeningIndicator', 'secondaryOFACScreeningIndicator', 'addendaId', 'traceNumber'];

function IATEntry(options) {
    this._addendas = [];

    // Allow the file header defaults to be overriden if provided
    this.fields = options.fields ? _.merge(options.fields, require('./fields'), _.defaults) : _.cloneDeep(require('./fields'));

    // Set our high-level values
    utils.overrideLowLevel(highLevelOverrides, options, this);

    // Some values need special coercing, so after they've been set by overrideLowLevel() we override them
    if (options.receivingDFI) {
        this.fields.receivingDFI.value = utils.computeCheckDigit(options.receivingDFI).slice(0, -1);
        this.fields.checkDigit.value = utils.computeCheckDigit(options.receivingDFI).slice(-1);
    }

    if (options.DFIAccount) {
        this.fields.DFIAccount.value = options.DFIAccount.slice(0, this.fields.DFIAccount.width);
    }

    if (options.amount) {
        this.fields.amount.value = Number(options.amount);
    }


    if (options.gatewayOperatorOFACScreeningIndicator) {
        this.fields.gatewayOperatorOFACScreeningIndicator.value = options.gatewayOperatorOFACScreeningIndicator;
    }

    if (options.secondaryOFACScreeningIndicator) {
        this.fields.secondaryOFACScreeningIndicator.value = options.secondaryOFACScreeningIndicator;
    }

    // Validate required fields have been passed
    this._validate();

    return this;
}

IATEntry.prototype.addAddenda = function (entryAddenda) {

    // Add indicator to Entry record
    this.set('addendaId', '1');
    this.set('numberOfAddendaRecord', this._addendas.length + 1)
    // Set corresponding feilds on Addenda
    entryAddenda.set('addendaSequenceNumber', this._addendas.length + 1);
    entryAddenda.set('entryDetailSequenceNumber', this.get('traceNumber'));

    // Add the new entryAddenda to the addendas array
    this._addendas.push(entryAddenda);
};

IATEntry.prototype.getRecordCount = function () {
    return this._addendas.length + 1;
};

IATEntry.prototype.generateString = function (cb) {
    let self = this;
    async.map(self._addendas, function (entryAddenda, done) {
        utils.generateString(entryAddenda.fields, function (string) {
            done(null, string);
        });
    }, function (err, addendaStrings) {
        utils.generateString(self.fields, function (string) {
            cb([string].concat(addendaStrings).join(utils.newLineChar()));
        });
    });
};

IATEntry.prototype._validate = function () {

    // Validate required fields
    validate.validateRequiredFields(this.fields);

    // Validate the ACH code passed is actually valid
    validate.validateACHCode(this.fields.transactionCode.value);

    // Validate the routing number
    validate.validateRoutingNumber(this.fields.receivingDFI.value + this.fields.checkDigit.value);

    // Validate header field lengths
    validate.validateLengths(this.fields);

    // Validate header data types
    validate.validateDataTypes(this.fields);
};

IATEntry.prototype.get = function (category) {

    // If the header has it, return that (header takes priority)
    if (this.fields[category]) {
        return this.fields[category]['value'];
    }
};

IATEntry.prototype.set = function (category, value) {

    // If the header has the field, set the value
    if (this.fields[category]) {
        this.fields[category]['value'] = value;
    }
};

module.exports = IATEntry;
