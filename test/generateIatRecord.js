let chai = require('chai')
    , expect = chai.expect
    , FS = require("fs")
    , NachaAimPoint = require("../index")
    , path = require("path")
    , Moment = require("moment")
    , EntryAddenda = require("../lib/entry-addenda")

let queuedTransaction = [
    {
        "id": 97,
        "standardEntryClassCode": "IAT",
        "immediateDestination": "031300012",
        "immediateOrigin": "121042882",
        "immediateDestinationName": "PNCBANK, N.A.",
        "immediateOriginName": "WELLS FARGO BANK NA",
        "referenceCode": " ",
        "batchChildren": [
            {
                "iatIndicator": "Compan Name",
                "foreignExchangeIndicator": "FF",
                "foreignExchangeReferenceIndicator": "3",
                "foreignExchangeReference": "USA",
                "isoDestinationCountryCode": "CA",
                "originatorIdentification": "1234567890",
                "isoOriginatingCurrencyCode": "IND",
                "isoDestinationCurrencyCode": "CAD",
                "originatorStatusCode": "",
                "id": 97,
                "serviceClassCode": "200",
                "standardEntryClassCode": "IAT",
                "companyDiscretionaryData": null,
                "companyEntryDescription": "Accounting",
                "companyDescriptiveDate": "",
                "effectiveEntryDate": Moment().toDate(),
                "originatingDFI": "121042882",
                "messageAuthenticationCode": "QhBamz2BmF534MlVROX",
                "entryChildren": [
                    {
                        "id": 97,
                        "transactionCode": "27",
                        "receivingDFI": "031300012",
                        "DFIAccount": "12345643212354211",
                        "amount": "1000",
                        "idNumber": null,
                        "individualName": " ",
                        "discretionaryData": "",
                        "transactionType": "Debit",
                        "addendaRecords": [
                            {
                                "id": 141,
                                "queued_transaction_id": 97,
                                "addenda_type_code": "10",
                                "payment_related_information": "UAS1234543234543200  werw                 c~~~                               M",
                                "ach_return_code": null,
                                "original_entry_trace_number": null,
                                "date_of_death": null,
                                "created_at": "2023-11-02 09:09:31",
                                "modified_at": "2023-12-04 16:52:07"
                            },
                            {
                                "id": 142,
                                "queued_transaction_id": 97,
                                "addenda_type_code": "11",
                                "payment_related_information": "Pradeep                           JTahne                             K",
                                "ach_return_code": null,
                                "original_entry_trace_number": null,
                                "date_of_death": null,
                                "created_at": "2023-11-02 09:09:31",
                                "modified_at": "2023-12-04 16:52:07"
                            },
                            {
                                "id": 143,
                                "queued_transaction_id": 97,
                                "addenda_type_code": "12",
                                "payment_related_information": "Tahen                             MINDIA                             N",
                                "ach_return_code": null,
                                "original_entry_trace_number": null,
                                "date_of_death": null,
                                "created_at": "2023-11-02 09:09:31",
                                "modified_at": "2023-12-04 16:52:07"
                            },
                            {
                                "id": 144,
                                "queued_transaction_id": 97,
                                "addenda_type_code": "13",
                                "payment_related_information": "demo                              O12q23453                           PUSA",
                                "ach_return_code": null,
                                "original_entry_trace_number": null,
                                "date_of_death": null,
                                "created_at": "2023-11-02 09:09:31",
                                "modified_at": "2023-12-04 16:52:07"
                            },
                            {
                                "id": 145,
                                "queued_transaction_id": 97,
                                "addenda_type_code": "14",
                                "payment_related_information": "sdfsfsdf             Q12wesfdsfsdf                       RUSA",
                                "ach_return_code": null,
                                "original_entry_trace_number": null,
                                "date_of_death": null,
                                "created_at": "2023-11-02 09:09:31",
                                "modified_at": "2023-12-04 16:52:07"
                            },
                            {
                                "id": 146,
                                "queued_transaction_id": 97,
                                "addenda_type_code": "15",
                                "payment_related_information": "2345trgfvdswegSThane      T",
                                "ach_return_code": null,
                                "original_entry_trace_number": null,
                                "date_of_death": null,
                                "created_at": "2023-11-02 09:09:31",
                                "modified_at": "2023-12-04 16:52:07"
                            },
                            {
                                "id": 147,
                                "queued_transaction_id": 97,
                                "addenda_type_code": "16",
                                "payment_related_information": "Thane Pradeep Vishwakarma         U4000400000                        V",
                                "ach_return_code": null,
                                "original_entry_trace_number": null,
                                "date_of_death": null,
                                "created_at": "2023-11-02 09:09:31",
                                "modified_at": "2023-12-04 16:52:07"
                            },
                            {
                                "id": 148,
                                "queued_transaction_id": 97,
                                "addenda_type_code": "17",
                                "payment_related_information": "payment_related_information                                                    W",
                                "ach_return_code": null,
                                "original_entry_trace_number": null,
                                "date_of_death": null,
                                "created_at": "2023-11-02 09:09:31",
                                "modified_at": "2023-12-04 16:52:07"
                            },
                            {
                                "id": 149,
                                "queued_transaction_id": 97,
                                "addenda_type_code": "18",
                                "payment_related_information": "sdfsdf                            XISsdfsdf                           YUSA",
                                "ach_return_code": null,
                                "original_entry_trace_number": null,
                                "date_of_death": null,
                                "created_at": "2023-11-02 09:09:31",
                                "modified_at": "2023-12-04 16:52:07"
                            }
                        ]
                    }
                ]
            }
        ],
        "recordCount": 1,
        "fileCharCount": "PKIN"
    }
]

describe('IAT Records', function () {
    describe('Create IAT Entry', function () {
        it('should create an IAT entry successfully', function () {
            let entry = new NachaAimPoint.EntryIAT(queuedTransaction[0].batchChildren[0].entryChildren[0]);
            entry.generateString(function (string) {
                console.log(string);
            });
        });
    });
    // describe('Create IAT Entry with addenda', function () {
    //     it('should create an entry with an addenda successfully', function () {
//             let entry = new NachaAimPoint.EntryIAT(queuedTransaction[0].batchChildren[0].entryChildren[0]);
    //         let addenda = new EntryAddenda(queuedTransaction[0].batchChildren[0].entryChildren[0].addendaRecords);
    //         expect(entry.getRecordCount()).to.equal(1);
    //         entry.addAddenda(addenda);
    //         expect(entry.get('addendaId')).to.equal('1');
    //         expect(entry.getRecordCount()).to.equal(2);
    //         expect(addenda.get('addendaSequenceNumber')).to.equal(1);
    //         expect(addenda.get('entryDetailSequenceNumber')).to.equal('1234567');
    //         let addenda2 = new EntryAddenda(queuedTransaction[0].batchChildren[0].entryChildren[1].addendaRecords);
    //         entry.addAddenda(addenda2);
    //         expect(entry.get('addendaId')).to.equal('1');
    //         expect(entry.getRecordCount()).to.equal(3);
    //         expect(addenda.get('addendaSequenceNumber')).to.equal(1);
    //         expect(addenda.get('entryDetailSequenceNumber')).to.equal('1234567');
//             entry.generateString(function (string) {
//                 console.log(string);
//             });
//         });
//     });

    describe('Create IAT Entry', function () {
        it('should create an IAT entry successfully', function () {
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
                                            addendaTypeCode: addenda.addenda_type_code,
                                            paymentRelatedInformation: addenda.payment_related_information
                                        }, standardEntryClassCode);
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