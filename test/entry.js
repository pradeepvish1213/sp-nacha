let chai = require('chai')
    , expect = chai.expect
    , Entry = require('../lib/entry')
    , EntryAddenda = require('../lib/entry-addenda')
    , EntryAddendaReturn = require('../lib/entry-addenda-return')
    , {GenerateAchFile} = require('./generateFile')
    , Moment = require('moment')
const {GenerateReturnAchFile} = require("./generateReturnACHFile");
const {GenerateNotificationAchFile} = require("./generate98AddendaACHFile");
describe('Entry', function () {
    describe('Create Entry', function () {
        it('should create an entry successfully', function () {
            let entry = new Entry({
                receivingDFI: '081000210',
                DFIAccount: '12345678901234567',
                amount: '3521',
                transactionCode: '22',
                idNumber: 'RAj##23920rjf31',
                individualName: 'Glen Selle',
                discretionaryData: 'A1'
            });
            entry.generateString(function (string) {
                console.log(string);
            });
        });
    });
    describe('Create Entry with addenda', function () {
        it('should create an entry with an addenda successfully', function () {
            let entry = new Entry({
                receivingDFI: '081000210',
                DFIAccount: '12345678901234567',
                amount: '3521',
                transactionCode: '22',
                idNumber: 'RAj##23920rjf31',
                individualName: 'Glen Selle',
                discretionaryData: 'A1',
                traceNumber: '000000001234567'
            });
            let addenda = new EntryAddenda({
                paymentRelatedInformation: "0123456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx"
            });
            expect(entry.getRecordCount()).to.equal(1);
            entry.addAddenda(addenda);
            expect(entry.get('addendaId')).to.equal('1');
            expect(entry.getRecordCount()).to.equal(2);
            expect(addenda.get('addendaSequenceNumber')).to.equal(1);
            expect(addenda.get('entryDetailSequenceNumber')).to.equal('1234567');
            let addenda2 = new EntryAddenda({
                paymentRelatedInformation: "0123456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx"
            });
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

    describe('Create Entry with return addenda', function () {
        it('should create an entry with a return addenda successfully', function () {
            let entry = new Entry({
                receivingDFI: '081000210',
                DFIAccount: '12345678901234567',
                amount: '3521',
                transactionCode: '22',
                idNumber: 'RAj##23920rjf31',
                individualName: 'Glen Selle',
                discretionaryData: 'A1',
                traceNumber: '000000001234567'
            });

            let addenda = new EntryAddendaReturn({
                originalEntryTraceNumber: '000000001234565',
                originalReceivingDFI: '081000210',
                returnReasonCode: 'R17',
                addendaInformation: 'QUESTIONABLE',
                dateOfDeath: Moment('2023-10-05').toDate()
            });

            expect(entry.getRecordCount()).to.equal(1);
            entry.addReturnAddenda(addenda);
            expect(entry.get('addendaId')).to.equal('1');
            expect(entry.getRecordCount()).to.equal(2);
            expect(addenda.get('returnReasonCode')).to.equal('R17');
            expect(addenda.get('addendaInformation')).to.equal('QUESTIONABLE');
            // expect(addenda.get('traceNumber')).to.equal(entry.get('traceNumber'));

            let addenda2 = new EntryAddendaReturn({
                originalEntryTraceNumber: '000000001234566',
                originalReceivingDFI: '081000210',
                returnReasonCode: 'R20',
                dateOfDeath: Moment('2023-10-05').toDate()
            });

            entry.addReturnAddenda(addenda2);
            expect(entry.get('addendaId')).to.equal('1');
            expect(entry.getRecordCount()).to.equal(3);
            expect(addenda2.get('returnReasonCode')).to.equal('R20');
            // expect(addenda2.get('addendaInformation')).to.equal('');
            // expect(addenda.get('traceNumber')).to.equal(entry.get('traceNumber'));

            entry.generateString(function (string) {
                console.log(string);
            });
        }).timeout(10000);
    });

    describe('Generate ACH File', async function () {
        it('should create an ACH file successfully', function (done) {
            GenerateAchFile([], './test/ach_file').then((result) => {
                expect(result.error).to.equal(false);
                expect(result.message).to.equal('Successfully writing file.');
                return done()
            }).catch(error => {
                console.log('===========', error)
                expect(true).to.be.false;
                expect(error.message).to.equal('Successfully writing file.');
                return done();
            })
        }).timeout(10000);
    })

    describe('Generate Return ACH File', async function () {
        it('should create an Return ACH file successfully', function (done) {
            GenerateReturnAchFile([], './test/ach_file').then((result) => {
                expect(result.error).to.equal(false);
                expect(result.message).to.equal('Successfully writing file.');
                return done()
            }).catch(error => {
                console.log('==Return ACH=========', error)
                expect(true).to.be.false;
                expect(error.message).to.equal('Successfully writing file.');
                return done();
            })
        }).timeout(10000);
    })
    describe('Generate Notification addenda ACH File', async function () {
        it('should create an Notification ACH file successfully', function (done) {
            GenerateNotificationAchFile([], './test/ach_file').then((result) => {
                expect(result.error).to.equal(false);
                expect(result.message).to.equal('Successfully writing file.');
                return done()
            }).catch(error => {
                console.log('==Notification Addenda ACH=========', error)
                expect(true).to.be.false;
                expect(error.message).to.equal('Successfully writing file.');
                return done();
            })
        }).timeout(10000);
    })
    let MTERecords = [{
        "id": 20514,
        "standardEntryClassCode": "MTE",
        "immediateDestination": "011002725",
        "immediateOrigin": "121042882",
        "immediateDestinationName": "BERKSHIRE BANK",
        "immediateOriginName": "WELLS FARGO BANK NA",
        "referenceCode": " ",
        "batchChildren": [{
            "id": 20514,
            "companyName": "Compan NamePRDEE",
            "companyIdentification": "1022337788",
            "serviceClassCode": "200",
            "standardEntryClassCode": "MTE",
            "companyDiscretionaryData": "NA",
            "companyEntryDescription": "Accounting",
            "companyDescriptiveDate": "",
            "effectiveEntryDate":  Moment().toDate(),
            "originatingDFI": "121042882",
            "entryChildren": [{
                "id": 20514,
                "transactionCode": "27",
                "receivingDFI": "011002725",
                "DFIAccount": "12345678",
                "amount": "1000",
                "idNumber": "ICICI Bank     ",
                "individualName": "45678654              ",
                "discretionaryData": "21",
                "transactionType": "Debit",
                "addendaRecords": [{
                    "id": 204,
                    "queued_transaction_id": 20514,
                    "addenda_type_code": "02",
                    "payment_related_information": "This is211TERM021000490614101010Target Store 0049          ANYTOWN        VA",
                    "ach_return_code": null,
                    "original_entry_trace_number": null,
                    "date_of_death": null,
                    "created_at": "2023-12-04 13:01:15",
                    "modified_at": "2023-12-04 13:01:15"
                }]
            }]
        }],
        "recordCount": 1,
        "fileCharCount": "PHIN"
    }]
    describe('Generate MTE ACH File', async function () {
        it('should create an MTE ACH file successfully', function (done) {
            GenerateAchFile(MTERecords, './test/ach_file','MTE_').then((result) => {
                expect(result.error).to.equal(false);
                expect(result.message).to.equal('Successfully writing file.');
                return done()
            }).catch(error => {
                console.log('===========', error)
                expect(true).to.be.false;
                expect(error.message).to.equal('Successfully writing file.');
                return done();
            })
        }).timeout(10000);
    })
});
