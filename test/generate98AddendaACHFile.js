const Moment = require('moment')
const path = require('path')
const FS = require('fs')
const NachaAimPoint = require('../index')

let dataAddenda = [{
    "id": 20513,
    "standardEntryClassCode": "COR",
    "immediateDestination": "011002725",
    "immediateOrigin": "121042882",
    "immediateDestinationName": "BERKSHIRE BANK",
    "immediateOriginName": "WELLS FARGO BANK NA",
    "referenceCode": " ",
    "batchChildren": [{
        "id": 20513,
        "companyName": "Company Name, In",
        "companyIdentification": "1022337788",
        "serviceClassCode": "200",
        "standardEntryClassCode": "COR",
        "companyDiscretionaryData": "FF4 US",
        "companyEntryDescription": "Accounting",
        "companyDescriptiveDate": "",
        "effectiveEntryDate": Moment("2023-10-25T00:00:00.000Z").toDate(),
        "originatingDFI": "121042882",
        "entryChildren": [{
            "id": 20513,
            "transactionCode": "23",
            "receivingDFI": "011002725",
            "DFIAccount": "12345678",
            "amount": "0",
            "idNumber": "45678654",
            "individualName": "0002Third Receiv",
            "discretionaryData": "21",
            "transactionType": "Credit",
            "addendaRecords": [{
                "id": 203,
                "queued_transaction_id": 20513,
                "addenda_type_code": "98",
                "payment_related_information": "C01this is demo check by pradeep"
            }]
        }]
    }],
    "recordCount": 1,
    "fileCharCount": "PCIN"
}]


async function GenerateNotificationAchFile(queuedTransaction = [], fileFullPath = './') {
    return new Promise((resolve, reject) => {
        let totalRunsFile = [];
        queuedTransaction = queuedTransaction.length > 0 ? queuedTransaction : dataAddenda;
        queuedTransaction.forEach(({batchChildren, id, ...restFieldFile}) => {
            try {
                let Nacha2AimPointFile = new NachaAimPoint.File(restFieldFile);
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
                                    if (addenda.addenda_type_code === '98') {
                                        console.log('addenda.payment_related_information.slice(3)',addenda.payment_related_information.slice(3))
                                        let object = {
                                            addendaTypeCode: addenda.addenda_type_code,
                                            changeCode: addenda.payment_related_information.slice(0, 3),
                                            originalEntryTraceNumber: '210121042880000',
                                            originalReceivingDFI: restFieldFile.immediateDestination,
                                            correctedData: addenda.payment_related_information.slice(3)
                                        }
                                        let addendaEntry = new NachaAimPoint.NotificationEntryAddenda(object);
                                        entryRecord.addReturnAddenda(addendaEntry);
                                    } else {
                                        let object = {
                                            addendaTypeCode: addenda.addenda_type_code,
                                            paymentRelatedInformation: addenda.payment_related_information
                                        }
                                        let addendaEntry = new NachaAimPoint.EntryAddenda(object);
                                        entryRecord.addAddenda(addendaEntry);
                                    }
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
                let fileName = `NOTIFICATION_ACH${restFieldFile.immediateOrigin}PEIN${Moment().format('YYYYMMDDHHmmssSS')}.ach`;
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

module.exports = {GenerateNotificationAchFile}