const Moment = require('moment')
const path = require('path')
const FS = require('fs')
const NachaAimPoint = require('../index')

let data = [{
    "id": 32,
    "immediateDestination": "325272306",
    "immediateOrigin": "041215663",
    "immediateDestinationName": "TONGA'S FCU",
    "immediateOriginName": "SUTTON BANK",
    "referenceCode": " ",
    "batchChildren": [{
        "id": 32,
        "companyName": "SSA TREAS 310",
        "companyIdentification": "9101036669",
        "serviceClassCode": "220",
        "standardEntryClassCode": "PPD",
        "companyEntryDescription": "NA",
        "companyDescriptiveDate": Moment(NachaAimPoint.Utils.computeBusinessDay(8)).format('MMM D'),
        "effectiveEntryDate": Moment('2023-08-30 05:30:00').toDate(),
        "settlementDate": "2023-08-30 05:30:00",
        "originatingDFI": "041215663",
        "entryChildren": [{
            "id": 32,
            "receivingDFI": "325272306",
            "DFIAccount": "1347569324910",
            "amount": "697",
            "idNumber": "",
            "individualName": "Demo",
            "discretionaryData": "00",
            "transactionCode": "22",
            "transactionType": "Credit",
            "paymentRelatedInformation": "N1YUNNAN L SPEARS N1YUNNAN L SPEARS 34501116885"
        }]
    }]
}]

let dataAddenda = [{
    "id": 70,
    "immediateDestination": "011002725",
    "immediateOrigin": "011001726",
    "immediateDestinationName": "BERKSHIRE BANK",
    "immediateOriginName": "BROOKLINE BANK",
    "referenceCode": " ",
    "batchChildren": [{
        "id": 70,
        "companyName": "FF4 US",
        "companyIdentification": "0",
        "serviceClassCode": "220",
        "standardEntryClassCode": "IAT",
        "companyDiscretionaryData": "FF4 US",
        "companyEntryDescription": "NA",
        "companyDescriptiveDate": Moment(NachaAimPoint.Utils.computeBusinessDay(8)).format('MMM D'),
        "effectiveEntryDate": Moment('2023-08-30 05:30:00').toDate(),
        "settlementDate": "2023-09-15 05:30:00",
        "originatingDFI": "011001726",
        "entryChildren": [{
            "id": 70,
            "receivingDFI": "011002725",
            "DFIAccount": "2234532",
            "amount": "1000",
            "idNumber": "",
            "individualName": "Sandeep",
            "discretionaryData": " ",
            "transactionCode": "22",
            "transactionType": "Credit",
            "addendaRecords": [{
                "id": 44,
                "queued_transaction_id": 70,
                "payment_related_information": "ANN000000000000100000928383-23939 XYZ Enterprises",
                "created_at": "2023-09-13 16:50:51",
                "modified_at": "2023-09-14 17:50:22"
            }, {
                "id": 45,
                "queued_transaction_id": 70,
                "payment_related_information": "XYZ Solutions 15 East Place Street",
                "created_at": "2023-09-13 16:50:51",
                "modified_at": "2023-09-14 17:50:22"
            }, {
                "id": 46,
                "queued_transaction_id": 70,
                "payment_related_information": "SmithTown*PA\\ US*19306\\",
                "created_at": "2023-09-13 16:50:51",
                "modified_at": "2023-09-14 17:50:22"
        }, {
                "id": 47,
                "queued_transaction_id": 70,
                "payment_related_information": "Citibank 01231380104 US",
                "created_at": "2023-09-13 16:50:51",
                "modified_at": "2023-09-14 17:50:22"
            }, {
                "id": 48,
                "queued_transaction_id": 70,
                "payment_related_information": "Standard Bank 01121042882 CA",
                "created_at": "2023-09-13 16:50:51",
                "modified_at": "2023-09-14 17:50:22"
            }, {
                "id": 49,
                "queued_transaction_id": 70,
                "payment_related_information": "9874654932139872122 Front Street",
                "created_at": "2023-09-13 16:50:51",
                "modified_at": "2023-09-14 17:50:22"
            }, {
                "id": 50,
                "queued_transaction_id": 70,
                "payment_related_information": "BetterTown*AB\\ CA*80015\\",
                "created_at": "2023-09-13 16:50:51",
                "modified_at": "2023-09-14 17:50:22"
            }, {
                "id": 51,
                "queued_transaction_id": 70,
                "payment_related_information": "Another international payment",
                "created_at": "2023-09-13 16:50:51",
                "modified_at": "2023-09-14 17:50:22"
            }, {
                "id": 52,
                "queued_transaction_id": 70,
                "payment_related_information": "Bank of Canada 01456456456987988 CA",
                "created_at": "2023-09-13 16:50:51",
                "modified_at": "2023-09-14 17:50:22"
            }]
        }]
    }],
    "recordCount": 1
}]


async function GenerateAchFile(queuedTransaction = [], fileFullPath = './') {
    return new Promise((resolve, reject) => {
        let totalRunsFile = [];
        queuedTransaction = queuedTransaction.length > 0 ? queuedTransaction : dataAddenda;
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
                            let entryRecord = new NachaAimPoint.Entry(entry);
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
                            return reject({row_id: id, message: e.message, error: true})
                        }
                    })
                    try {
                        Nacha2AimPointFile.addBatch(batch);
                    } catch (e) {
                        return reject({row_id: id, message: e.message, error: true})
                    }
                })
                let fileName = `ACH${restField.immediateOrigin}PEIN${Moment().format('YYYYMMDDHHmmssSS')}.ach`;
                if (successRecords.length > 0) {
                    Nacha2AimPointFile.generateFile(function (result) {
                        FS.writeFile(path.join(fileFullPath, fileName), result, function (error) {
                            if (error) {
                                totalRunsFile.push({
                                    message: error.message ? error.message : error.stack,
                                    error: true
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
                    row_id: id,
                    message: error.message ? error.message : error.stack,
                    error: true
                })
            }
        })
    })
}

module.exports = {GenerateAchFile}