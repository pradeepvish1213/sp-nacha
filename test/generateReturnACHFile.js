const Moment = require('moment')
const path = require('path')
const FS = require('fs')
const NachaAimPoint = require('../index')

let dataAddenda = [{
    "id": 90,
    "standardEntryClassCode": "PPD",
    "immediateDestination": "011002725",
    "immediateOrigin": "121042882",
    "immediateDestinationName": "BERKSHIRE BANK",
    "immediateOriginName": "WELLS FARGO BANK NA",
    "referenceCode": " ",
    "batchChildren": [{
        "id": 90,
        "companyName": "Dataseers",
        "companyIdentification": "1022337788",
        "serviceClassCode": "220",
        "standardEntryClassCode": "PPD",
        "companyDiscretionaryData": "FF4 US",
        "companyEntryDescription": "Accounting",
        "companyDescriptiveDate": "",
        "effectiveEntryDate": Moment("2023-10-25T00:00:00.000Z").toDate(),
        "originatingDFI": "121042882",
        "entryChildren": [{
            "id": 90,
            "transactionCode": "23",
            "receivingDFI": "011002725",
            "DFIAccount": "2234532",
            "amount": "1000",
            "idNumber": "45678654",
            "individualName": "Bank Client",
            "discretionaryData": "55",
            "transactionType": "Credit",
            "addendaRecords": [{
                "id": 105,
                "queued_transaction_id": 90,
                "addenda_type_code": "99",
                "payment_related_information": "011201750000000 011201750000000 011201750011",
                "ach_return_code": "R04",
                "original_entry_trace_number": "011201750000000",
                "date_of_death": "2023-10-24",
                "created_at": "2023-10-26 10:59:05",
                "modified_at": "2023-10-26 10:59:05"
            }]
        }]
    }],
    "recordCount": 1
}]


async function GenerateReturnAchFile(queuedTransaction = [], fileFullPath = './') {
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
                                    if (addenda.addenda_type_code === '99') {
                                      let object = {
                                            addendaTypeCode: addenda.addenda_type_code,
                                            returnReasonCode: addenda.ach_return_code,
                                            originalEntryTraceNumber: addenda.original_entry_trace_number,
                                            dateOfDeath: Moment(addenda.date_of_death).toDate(),
                                            originalReceivingDFI: restFieldFile.immediateDestination,
                                            addendaInformation: addenda.payment_related_information
                                        }
                                        let addendaEntry = new NachaAimPoint.ReturnEntryAddenda(object);
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
                let fileName = `ACH${restFieldFile.immediateOrigin}PEIN${Moment().format('YYYYMMDDHHmmssSS')}.ach`;
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

module.exports = {GenerateReturnAchFile}