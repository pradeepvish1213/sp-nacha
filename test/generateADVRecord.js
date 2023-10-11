let FS = require("fs")
    , NachaAimPoint = require("../index")
    , path = require("path")
    , Moment = require("moment")

let queuedTransaction = [{
    "id": 72,
    "immediateDestination": "231380104",
    "immediateOrigin": "121042882",
    "immediateDestinationName": "CITADEL FED C U",
    "immediateOriginName": "WELLS FARGO BANK NA",
    "referenceCode": " ",
    "standardEntryClassCode": "ADV",
    "batchChildren": [{
        "id": 72,
        "companyName": "Company Name, In",
        "companyIdentification": "1210428820",
        "serviceClassCode": "200",
        "standardEntryClassCode": "ADV",
        "companyDiscretionaryData": null,
        "companyEntryDescription": "Accounting",
        "companyDescriptiveDate": "",
        "effectiveEntryDate": Moment('2023-10-06T00:00:00.000Z').toDate(),
        "originatingDFI": "121042882",
        "entryChildren": [{
            "id": 72,
            "transactionCode": "52",
            "receivingDFI": "231380104",
            "DFIAccount": "744-5678-99",
            "amount": "500",
            "adviceRoutingNumber": "121042882",
            "fileIdentification": "122",
            "achOperatorData": "",
            "individualName": "Name",
            "discretionaryData": "",
            "routingNumberOfAchOperator": "123456789",
            "julianDateOnWhichAdviceIsCreated": "000",
            "sequenceNumberWithinBatch": NachaAimPoint.Utils.pad(1, 4, false, '0'),
            "transactionType": "Credit",
            "companyIdentification": "0",
            "addendaRecords": []
        }, {
            "id": 73,
            "transactionCode": "52",
            "receivingDFI": "231380104",
            "DFIAccount": "744-5678-98",
            "amount": "1500",
            "adviceRoutingNumber": "121042882",
            "fileIdentification": "222",
            "achOperatorData": "1",
            "individualName": "Name",
            "discretionaryData": "",
            "routingNumberOfAchOperator": "123456789",
            "julianDateOnWhichAdviceIsCreated": "000",
            "sequenceNumberWithinBatch": NachaAimPoint.Utils.pad(2, 4, false, '0'),
            "transactionType": "Credit",
            "companyIdentification": "0",
            "addendaRecords": []
        }]
    }],
    "recordCount": 2
}]
describe('ADV Records', function () {
    describe('Create ADV Entry', function () {
        it('should create an ADV entry successfully', function () {
            let entry = new NachaAimPoint.EntryADV(queuedTransaction[0].batchChildren[0].entryChildren[0]);
            entry.generateString(function (string) {
                console.log(string);
            });
        });
    });
    describe('Create ADV Entry File', function () {
        it('should create an ADV entry successfully', function () {
            queuedTransaction.forEach(({batchChildren, id, ...restField}) => {
                try {
                    let Nacha2AimPointFile = new NachaAimPoint.File(restField);
                    let totalBatchNumber = batchChildren.length;
                    let totalCreditAmount = 0
                    let totalDebitAmount = 0;
                    let successRecords = []
                    let errorBatchEntryRecords = []
                    batchChildren.forEach(({entryChildren, id, ...restField}) => {
                        let batch = new NachaAimPoint.Batch(restField);
                        entryChildren.forEach(({transactionType, addendaRecords, id, ...entry}) => {
                            if (transactionType === 'Credit') {
                                totalCreditAmount = totalCreditAmount + parseInt(entry.amount)
                            } else {
                                totalDebitAmount = totalDebitAmount + parseInt(entry.amount)
                            }
                            try {
                                let entryRecord = new NachaAimPoint.EntryADV(entry);
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
                                        message: 'ADV Record Successfully writing file.',
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
                            message: 'ADV Record Queued transaction has some error',
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