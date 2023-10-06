let chai = require('chai')
    , expect = chai.expect
    , FS = require("fs")
    , NachaAimPoint = require("../index")
    , path = require("path")
    , Moment = require("moment")
    , EntryAddenda = require("../lib/entry-addenda")

let queuedTransaction = [{
    "id": 70,
    "immediateDestination": "231380104",
    "immediateOrigin": "121042882",
    "immediateDestinationName": "CITADEL FED C U",
    "immediateOriginName": "WELLS FARGO BANK NA",
    "referenceCode": " ",
    "batchChildren": [{
        "id": 70,
        "serviceClassCode": "200",
        "iatIndicator": "Iat Indiacator p",
        "foreignExchangeIndicator": "IN",
        "foreignExchangeReferenceIndicator": "3",
        "foreignExchangeReference": "pradeepvish1213",
        "isoDestinationCountryCode": "US",
        "originatorIdentification": "2345432443",
        "standardEntryClassCode": "IAT",
        "companyEntryDescription": "SANdeepviS",
        "isoOriginatingCurrencyCode": "IND",
        "isoDestinationCurrencyCode": "CAD",
        "effectiveEntryDate": Moment().toDate(),
        "originatorStatusCode": "",
        "originatingDFI": "121042882",
        "entryChildren": [{
            "id": 70,
            "receivingDFI": "231380104",
            "DFIAccount": "23456787654323",
            "amount": "92345678",
            "idNumber": null,
            "individualName": "",
            "discretionaryData": "",
            "transactionCode": "21",
            "transactionType": "Credit",
            "traceNumber": '000000001234567',
            "addendaRecords": [{
                "id": 78,
                "queued_transaction_id": 70,
                "addenda_type_code": "10",
                "payment_related_information": "UAS123454323454323.008765432345670000000001The abbreviation INDN on a bank sta",
                "created_at": "2023-10-05 20:35:59",
                "modified_at": "2023-10-05 20:35:59"
            }]
        }, {
            "id": 70,
            "receivingDFI": "231380104",
            "DFIAccount": "23456787654323",
            "amount": "92345678",
            "idNumber": null,
            "individualName": "",
            "discretionaryData": "",
            "transactionCode": "21",
            "transactionType": "Credit",
            "traceNumber": '000000001234567',
            "addendaRecords": [{
                "id": 78,
                "queued_transaction_id": 70,
                "addenda_type_code": "10",
                "payment_related_information": "UAS123454323454323.008765432345670000000001The abbreviation INDN on a bank sta",
                "created_at": "2023-10-05 20:35:59",
                "modified_at": "2023-10-05 20:35:59"
            }, {
                "id": 78,
                "queued_transaction_id": 70,
                "addenda_type_code": "11",
                "payment_related_information": "UAS123454323454323.008765432345670000000001The abbreviation INDN on a bank sta",
                "created_at": "2023-10-05 20:35:59",
                "modified_at": "2023-10-05 20:35:59"
            }, {
                "id": 78,
                "queued_transaction_id": 70,
                "addenda_type_code": "12",
                "payment_related_information": "UAS123454323454323.008765432345670000000001The abbreviation INDN on a bank sta",
                "created_at": "2023-10-05 20:35:59",
                "modified_at": "2023-10-05 20:35:59"
            }]
        }]
    }],
    "recordCount": 1
}]

describe('IAT Records', function () {
    describe('Create IAT Entry', function () {
        it('should create an IAT entry successfully', function () {
            let entry = new NachaAimPoint.EntryIAT(queuedTransaction[0].batchChildren[0].entryChildren[0]);
            entry.generateString(function (string) {
                console.log(string);
            });
        });
    });
    describe('Create IAT Entry with addenda', function () {
        it('should create an entry with an addenda successfully', function () {
            let entry = new NachaAimPoint.EntryIAT(queuedTransaction[0].batchChildren[0].entryChildren[0]);
            let addenda = new EntryAddenda(queuedTransaction[0].batchChildren[0].entryChildren[0].addendaRecords);
            expect(entry.getRecordCount()).to.equal(1);
            entry.addAddenda(addenda);
            expect(entry.get('addendaId')).to.equal('1');
            expect(entry.getRecordCount()).to.equal(2);
            expect(addenda.get('addendaSequenceNumber')).to.equal(1);
            expect(addenda.get('entryDetailSequenceNumber')).to.equal('1234567');
            let addenda2 = new EntryAddenda(queuedTransaction[0].batchChildren[0].entryChildren[1].addendaRecords);
            entry.addAddenda(addenda2);
            expect(entry.get('addendaId')).to.equal('1');
            expect(entry.getRecordCount()).to.equal(3);
            expect(addenda.get('addendaSequenceNumber')).to.equal(1);
            expect(addenda.get('entryDetailSequenceNumber')).to.equal('1234567');
            entry.generateString(function (string) {
                console.log(string);
            });
        });
    });

    describe('Create IAT Entry', function () {
        it('should create an IAT entry successfully', function () {
            queuedTransaction.forEach(({batchChildren, id, ...restField}) => {
                try {
                    let Nacha2AimPointFile = new NachaAimPoint.File(restField);
                    let totalBatchNumber = batchChildren.length;
                    let totalCreditAmount = 0
                    let totalDebitAmount = 0;
                    let successRecords = []
                    let errorBatchEntryRecords = []
                    batchChildren.forEach(({entryChildren, id, ...restField}) => {
                        let batch = new NachaAimPoint.BatchIAT(restField);
                        entryChildren.forEach(({transactionType, addendaRecords, id, ...entry}) => {
                            if (transactionType === 'Credit') {
                                totalCreditAmount = totalCreditAmount + parseInt(entry.amount)
                            } else {
                                totalDebitAmount = totalDebitAmount + parseInt(entry.amount)
                            }

                            try {
                                let entryRecord = new NachaAimPoint.EntryIAT(entry);
                                if (addendaRecords && addendaRecords.length > 0) {
                                    addendaRecords.forEach(addenda => {
                                        let addendaEntry = new NachaAimPoint.EntryAddenda({
                                            paymentRelatedInformation: addenda.payment_related_information
                                        });
                                        entryRecord.addAddenda(addendaEntry);
                                    })
                                }
                                batch.addEntry(entryRecord);
                                successRecords.push({row_id: id, message: 'Success', error: false})
                            } catch (e) {
                                console.log({row_id: id, message: e.message, error: true, errorStack: e})
                            }
                        })
                        try {
                            Nacha2AimPointFile.addBatch(batch);
                        } catch (e) {
                            console.log({row_id: id, message: e.message, error: true, errorStack: e})
                        }
                    })
                    let fileName = `ACH${restField.immediateOrigin}PEIN${Moment().format('YYYYMMDDHHmmssSS')}.ach`;
                    if (successRecords.length > 0) {
                        Nacha2AimPointFile.generateFile(function (result) {
                            FS.writeFile(path.join('./test/ach_file', fileName), result, function (error) {
                                if (error) {
                                    console.log({
                                        message: error.message ? error.message : error.stack,
                                        error: true,
                                        errorStack: error
                                    })
                                }
                                if (errorBatchEntryRecords.length === 0) {
                                    console.log({
                                        error: false,
                                        message: 'IAT Record Successfully writing file.',
                                        fileName,
                                        totalBatchNumber,
                                        totalDebitAmount,
                                        totalCreditAmount,
                                        endTime: Moment().format('YYYY-MM-DD HH:mm:ss'),
                                        successRecords,
                                        errorBatchEntryRecords
                                    })
                                }
                            });
                        });
                    }
                    if (errorBatchEntryRecords.length > 0) {
                        console.log({
                            error: true,
                            fileName,
                            message: 'IAT Record Queued transaction has some error',
                            totalBatchNumber,
                            totalDebitAmount,
                            totalCreditAmount,
                            endTime: Moment().format('YYYY-MM-DD HH:mm:ss'),
                            successRecords,
                            errorBatchEntryRecords
                        })
                    }
                } catch (error) {
                    console.log({
                        row_id: id,
                        message: error.message ? error.message : error.stack,
                        error: true,
                        errorStack: error
                    })
                }
            })
        });
    });
})