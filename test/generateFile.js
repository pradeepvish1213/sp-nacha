const Moment = require('moment')
const path = require('path')
const FS = require('fs')
const NachaAimPoint = require('../index')

let data = [{
    "id": 32,
    "immediateDestination": "325272306",
    "immediateOrigin": "041215663",
    "immediateDestinationName": "TONGASS FCU",
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
            "idNumber": "501116885ASSA",
            "individualName": "TEYUNNA L SPEARS",
            "discretionaryData": "00",
            "transactionCode": "22",
            "transactionType": "Credit",
            "paymentRelatedInformation": "N1GDTEYUNNA L SPEARS N1BETEYUNNA L SPEARS 34501116885"
        }]
    }]
}]


async function GenerateAchFile(queuedTransaction = [], fileFullPath = './') {
    return new Promise(resolve => {
        let totalRunsFile = [];
        queuedTransaction = queuedTransaction.length > 0 ? queuedTransaction : data;
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
                    entryChildren.forEach(({transactionType, paymentRelatedInformation, id, ...entry}) => {
                        if (transactionType === 'Credit') {
                            totalCreditAmount = totalCreditAmount + parseInt(entry.amount)
                        } else {
                            totalDebitAmount = totalDebitAmount + parseInt(entry.amount)
                        }

                        try {
                            let entryRecord = new NachaAimPoint.Entry(entry);
                            if (paymentRelatedInformation) {
                                let addenda = new NachaAimPoint.EntryAddenda({
                                    paymentRelatedInformation
                                });
                                entryRecord.addAddenda(addenda);
                            }
                            batch.addEntry(entryRecord);
                            successRecords.push({row_id: id, message: 'Success'})
                        } catch (e) {
                            return resolve({row_id: id, message: e.message})
                        }
                    })
                    try {
                        Nacha2AimPointFile.addBatch(batch);
                    } catch (e) {
                        return resolve({row_id: id, message: e.message})
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
                                return resolve(totalRunsFile)
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
                return resolve({
                    row_id: id,
                    message: error.message ? error.message : error.stack,
                    error: true
                })
            }
        })
    })
}

module.exports = {GenerateAchFile}