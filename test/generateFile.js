const Moment = require('moment')
const path = require('path')
const FS = require('fs')
const NachaAimPoint = require('../index')

let dataAddenda = [{
    "id": 1,
    "immediateDestination": "011002725",
    "immediateOrigin": "011001726",
    "immediateDestinationName": "BERKSHIRE BANK",
    "immediateOriginName": "BROOKLINE BANK",
    "standardEntryClassCode": "IAT",
    "referenceCode": " ",
    "batchChildren": [{
        "id": 1,
        "companyName": "FF4 US",
        "companyIdentification": "0",
        "serviceClassCode": "220",
        "standardEntryClassCode": "IAT",
        "companyDiscretionaryData": "FF4 US",
        "companyEntryDescription": "NA",
        "companyDescriptiveDate": '2023-08-30 05:30:00',
        "effectiveEntryDate": Moment('2023-08-30 05:30:00').toDate(),
        "settlementDate": "2023-09-15 05:30:00",
        "originatingDFI": "011001726",
        "messageAuthenticationCode": "QhBamz2BmF534MlVROX",
        "entryChildren": [{
            "id": 1,
            "receivingDFI": "011002725",
            "DFIAccount": "2234532",
            "amount": "1000",
            "idNumber": "",
            "individualName": "Sandeep",
            "discretionaryData": " ",
            "transactionCode": "22",
            "transactionType": "Credit",
            "addendaRecords": [{
                "payment_related_information": "ANN000000000000100000928383-23939 XYZ Enterprises"
            }, {
                "payment_related_information": "XYZ Solutions 15 East Place Street"
            }, {
                "payment_related_information": "SmithTown*PA\\ US*19306\\"
            }, {
                "payment_related_information": "Citibank 01231380104 US"
            }, {
                "payment_related_information": "Standard Bank 01121042882 CA"
            }, {
                "payment_related_information": "9874654932139872122 Front Street"
            }, {
                "payment_related_information": "BetterTown*AB\\ CA*80015\\"
            }, {
                "payment_related_information": "Another international payment"
            }, {
                "payment_related_information": "Bank of Canada 01456456456987988 CA"
            }]
        }]
    }],
    "recordCount": 1
}]


async function GenerateAchFile(queuedTransaction = [], fileFullPath = './', prefix = '') {
    return new Promise((resolve, reject) => {
        let totalRunsFile = [];
        queuedTransaction = queuedTransaction.length > 0 ? queuedTransaction : dataAddenda;
        queuedTransaction.forEach(({batchChildren, id, ...restField}) => {
            try {
                let standardEntryClassCode = restField.standardEntryClassCode
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
                            let entryRecord = new NachaAimPoint.Entry(entry);
                            if (addendaRecords && addendaRecords.length > 0) {
                                addendaRecords.forEach(addenda => {
                                    let addendaEntry = new NachaAimPoint.EntryAddenda({
                                        paymentRelatedInformation: addenda.payment_related_information
                                    }, standardEntryClassCode);
                                    entryRecord.addAddenda(addendaEntry);
                                })
                            }
                            batch.addEntry(entryRecord);
                            successRecords.push({row_id: id, message: 'Success', error: false})
                        } catch (e) {
                            return reject({row_id: id, message: e.message, error: true})
                        }
                    })
                    try {
                        Nacha2AimPointFile.addBatch(batch);
                    } catch (e) {
                        return reject({row_id: id, message: e.message, error: true})
                    }
                })
                let fileName = `${prefix}ACH${restField.immediateOrigin}PEIN${Moment().format('YYYYMMDDHHmmssSS')}.ach`;
                if (successRecords.length > 0) {
                    Nacha2AimPointFile.generateFile(function (result) {
                        FS.writeFile(path.join(fileFullPath, fileName), result, function (error) {
                            if (error) {
                                totalRunsFile.push({
                                    message: error.message ? error.message : error.stack, error: true
                                })
                                return reject(totalRunsFile)
                            }
                            if (errorBatchEntryRecords.length === 0) {
                                return resolve({
                                    error: false,
                                    message: 'Successfully writing file.',
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
                    return resolve({
                        error: true,
                        fileName,
                        message: 'Queued transaction has some error',
                        totalBatchNumber,
                        totalDebitAmount,
                        totalCreditAmount,
                        endTime: Moment().format('YYYY-MM-DD HH:mm:ss'),
                        successRecords,
                        errorBatchEntryRecords
                    })
                }
            } catch (error) {
                return reject({
                    row_id: id, message: error.message ? error.message : error.stack, error: true
                })
            }
        })
    })
}

module.exports = {GenerateAchFile}