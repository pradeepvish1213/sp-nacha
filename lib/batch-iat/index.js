// Batch

let _ = require('lodash');
let async = require('async');
let utils = require('./../utils');
let validate = require('./../validate');

let highLevelHeaderOverrides = ['serviceClassCode', 'companyDiscretionaryData', 'companyIdentification', 'standardEntryClassCode'];
let highLevelControlOverrides = ['addendaCount', 'entryHash', 'totalDebit', 'totalCredit'];

function BatchIAT(options) {
    this._entries = [];

    // Allow the batch header/control defaults to be overriden if provided
    this.header = options.header ? _.merge(options.header, require('./header'), _.defaults) : _.cloneDeep(require('./header'));
    this.control = options.control ? _.merge(options.header, require('./control'), _.defaults) : _.cloneDeep(require('./control'));

    // Configure high-level overrides (these override the low-level settings if provided)
    utils.overrideLowLevel(highLevelHeaderOverrides, options, this);
    utils.overrideLowLevel(highLevelControlOverrides, options, this);

    // Validate the routing number (ABA) before slicing
    validate.validateRoutingNumber(utils.computeCheckDigit(options.originatingDFI));


    if (options.companyEntryDescription) {
        this.header.companyEntryDescription.value = options.companyEntryDescription.slice(0, this.header.companyEntryDescription.width);
    }

    if (options.effectiveEntryDate) {
        this.header.effectiveEntryDate.value = utils.formatDate(options.effectiveEntryDate);
    }

    if (options.originatingDFI) {
        this.header.originatingDFI.value = utils.computeCheckDigit(options.originatingDFI).slice(0, this.header.originatingDFI.width);
    }

    if (options.iatIndicator) {
        this.header.iatIndicator.value = options.iatIndicator.slice(0, this.header.iatIndicator.width);
    }

    if (options.foreignExchangeIndicator) {
        this.header.foreignExchangeIndicator.value = options.foreignExchangeIndicator.slice(0, this.header.foreignExchangeIndicator.width);
    }
    if (options.foreignExchangeReferenceIndicator) {
        this.header.foreignExchangeReferenceIndicator.value = options.foreignExchangeReferenceIndicator.slice(0, this.header.foreignExchangeReferenceIndicator.width);
    }
    if (options.foreignExchangeReference) {
        this.header.foreignExchangeReference.value = options.foreignExchangeReference.slice(0, this.header.foreignExchangeReference.width);
    }
    if (options.isoDestinationCountryCode) {
        this.header.isoDestinationCountryCode.value = options.isoDestinationCountryCode.slice(0, this.header.isoDestinationCountryCode.width);
    }
    if (options.originatorIdentification) {
        this.header.originatorIdentification.value = options.originatorIdentification.slice(0, this.header.originatorIdentification.width);
    }
    if (options.standardEntryClassCode) {
        this.header.standardEntryClassCode.value = options.standardEntryClassCode.slice(0, this.header.standardEntryClassCode.width);
    }

    if (options.isoOriginatingCurrencyCode) {
        this.header.isoOriginatingCurrencyCode.value = options.isoOriginatingCurrencyCode.slice(0, this.header.isoOriginatingCurrencyCode.width);
    }
    if (options.isoDestinationCurrencyCode) {
        this.header.isoDestinationCurrencyCode.value = options.isoDestinationCurrencyCode.slice(0, this.header.isoDestinationCurrencyCode.width);
    }

    if (options.originatorStatusCode) {
        this.header.originatorStatusCode.value = options.originatorStatusCode.slice(0, this.header.originatorStatusCode.width);
    }

    // Set control values which use the same header values
    this.control.serviceClassCode.value = this.header.serviceClassCode.value;
    this.control.originatingDFI.value = this.header.originatingDFI.value;

    // Perform validation on all the passed values
    this._validate();

    return this;
}

BatchIAT.prototype._validate = function () {

    // Validate required fields have been passed
    validate.validateRequiredFields(this.header);

    // Validate the batch's ACH service class code
    validate.validateACHServiceClassCode(this.header.serviceClassCode.value);

    // Validate field lengths
    validate.validateLengths(this.header);

    // Validate datatypes
    validate.validateDataTypes(this.header);

    // Validate required fields have been passed
    validate.validateRequiredFields(this.control);

    // Validate field lengths
    validate.validateLengths(this.control);

    // Validate datatypes
    validate.validateDataTypes(this.control);
};

BatchIAT.prototype.addEntry = function (entry) {
    let self = this;

    // Increment the addendaCount of the batch
    this.control.addendaCount.value += entry.getRecordCount();

    // Add the new entry to the entries array
    this._entries.push(entry);

    // Update the batch values like total debit and credit $ amounts
    let entryHash = 0;
    let totalDebit = 0;
    let totalCredit = 0;

    // (22, 23, 24, 27, 28, 29, 32, 33, 34, 37, 38 & 39)
    let creditCodes = ['21', '22', '23', '24', '31', '32', '33', '34', '41', '42', '43', '44', '51', '52', '53', '54'];
    let debitCodes = ['26', '27', '28', '29', '36', '37', '38', '39', '46', '47', '48', '49', '55', '56'];

    async.each(this._entries, function (entry, done) {
        entryHash += Number(entry.fields.receivingDFI.value);

        if (_.includes(creditCodes, entry.fields.transactionCode.value)) {
            totalCredit += entry.fields.amount.value;
            done();
        } else if (_.includes(debitCodes, entry.fields.transactionCode.value)) {
            totalDebit += entry.fields.amount.value;
            done();
        } else {
            console.log('Transaction codes did not match or are not supported yet (unsupported status codes include: 23, 24, 28, 29, 33, 34, 38, 39)');
        }
    }, function () {
        self.control.totalCredit.value = totalCredit;
        self.control.totalDebit.value = totalDebit;

        // Add up the positions 4-11 and compute the total. Slice the 10 rightmost digits.
        self.control.entryHash.value = entryHash.toString().slice(-10);
    });
};

BatchIAT.prototype.generateHeader = function (cb) {
    utils.generateString(this.header, function (string) {
        cb(string);
    });
};

BatchIAT.prototype.generateControl = function (cb) {
    utils.generateString(this.control, function (string) {
        cb(string);
    });
};

BatchIAT.prototype.generateEntries = function (cb) {
    let result = '';

    async.each(this._entries, function (entry, done) {
        entry.generateString(function (string) {
            result += string + utils.newLineChar();
            done();
        });
    }, function () {
        cb(result);
    });
};

BatchIAT.prototype.generateString = function (cb) {
    let self = this;

    self.generateHeader(function (headerString) {
        self.generateEntries(function (entryString) {
            self.generateControl(function (controlString) {
                cb(headerString + utils.newLineChar() + entryString + controlString);
            });
        });
    });
};

BatchIAT.prototype.get = function (field) {

    // If the header has the field, return the value
    if (this.header[field]) {
        return this.header[field]['value'];
    }

    // If the control has the field, return the value
    if (this.control[field]) {
        return this.control[field]['value'];
    }
};

BatchIAT.prototype.set = function (field, value) {

    // If the header has the field, set the value
    if (this.header[field]) {
        this.header[field]['value'] = value;
    }

    // If the control has the field, set the value
    if (this.control[field]) {
        this.control[field]['value'] = value;
    }
};

module.exports = BatchIAT;
