const Entry = require("../lib/entry");
let data = [
    {
        "id": 67,
        "immediateDestination": "031300012",
        "immediateOrigin": "121042882",
        "immediateDestinationName": "PNCBANK, N.A.",
        "immediateOriginName": "WELLS FARGO BANK NA",
        "referenceCode": " ",
        "batchChildren": [
            {
                "id": 67,
                "companyName": "Compan Name",
                "companyIdentification": null,
                "serviceClassCode": "200",
                "standardEntryClassCode": "IAT",
                "companyDiscretionaryData": null,
                "companyEntryDescription": "Accounting",
                "companyDescriptiveDate": "",
                "effectiveEntryDate": "2023-10-04T00:00:00.000Z",
                "settlementDate": null,
                "originatingDFI": "121042882",
                "entryChildren": [
                    {
                        "id": 67,
                        "receivingDFI": "031300012",
                        "DFIAccount": "12345643212354211",
                        "amount": "1000",
                        "idNumber": null,
                        "individualName": "",
                        "discretionaryData": "",
                        "transactionCode": "27",
                        "transactionType": "Debit",
                        "addendaRecords": [
                            {
                                "id": 69,
                                "queued_transaction_id": 67,
                                "addenda_type_code": "10",
                                "payment_related_information": "UAS123454323454320.00werw                  ~~~                                ",
                                "created_at": "2023-10-03 17:37:10",
                                "modified_at": "2023-10-03 17:37:46"
                            },
                            {
                                "id": 70,
                                "queued_transaction_id": 67,
                                "addenda_type_code": "11",
                                "payment_related_information": "Pradeep                            Tahne                              ",
                                "created_at": "2023-10-03 17:37:10",
                                "modified_at": "2023-10-03 17:37:46"
                            },
                            {
                                "id": 71,
                                "queued_transaction_id": 67,
                                "addenda_type_code": "12",
                                "payment_related_information": "Tahen                              INDIA                      ",
                                "created_at": "2023-10-03 17:37:10",
                                "modified_at": "2023-10-03 17:37:46"
                            },
                            {
                                "id": 72,
                                "queued_transaction_id": 67,
                                "addenda_type_code": "13",
                                "payment_related_information": "demo                               12q23453                            USA",
                                "created_at": "2023-10-03 17:37:10",
                                "modified_at": "2023-10-03 17:37:46"
                            },
                            {
                                "id": 73,
                                "queued_transaction_id": 67,
                                "addenda_type_code": "14",
                                "payment_related_information": "sdfsfsdf                           12wesfdsfsdf                        USA",
                                "created_at": "2023-10-03 17:37:10",
                                "modified_at": "2023-10-03 17:37:46"
                            },
                            {
                                "id": 74,
                                "queued_transaction_id": 67,
                                "addenda_type_code": "15",
                                "payment_related_information": "2345trgfvdswegfThane                              ",
                                "created_at": "2023-10-03 17:37:10",
                                "modified_at": "2023-10-03 17:37:46"
                            },
                            {
                                "id": 75,
                                "queued_transaction_id": 67,
                                "addenda_type_code": "16",
                                "payment_related_information": "Thane Pradeep Vishwakarma          4000400000                         ",
                                "created_at": "2023-10-03 17:37:10",
                                "modified_at": "2023-10-03 17:37:46"
                            },
                            {
                                "id": 76,
                                "queued_transaction_id": 67,
                                "addenda_type_code": "17",
                                "payment_related_information": "payment_related_information   ",
                                "created_at": "2023-10-03 17:37:10",
                                "modified_at": "2023-10-03 17:37:46"
                            },
                            {
                                "id": 77,
                                "queued_transaction_id": 67,
                                "addenda_type_code": "18",
                                "payment_related_information": "IDBI BANK                          ISTHANE                             USA",
                                "created_at": "2023-10-03 17:37:10",
                                "modified_at": "2023-10-03 17:37:46"
                            }
                        ],
                        "k": {
                            "id": 67,
                            "client_id": 0,
                            "matrix_id": 6294,
                            "unique_id": "cf3c0f74-1e8a-4e35-9bb6-28e423a2ecff",
                            "api_mode": "A",
                            "rule_id": "",
                            "status": 0,
                            "review": null,
                            "service_class_code": "200",
                            "routing_number": "121042882",
                            "company_name": "Compan Name",
                            "company_identification": null,
                            "company_discretionary": null,
                            "company_entry_description": "Accounting",
                            "foreign_exchange_indicator": "FF",
                            "foreign_exchange_reference_indicator": "5",
                            "foreign_exchange_reference": "USA",
                            "iso_destination_country_code": "CA",
                            "iso_originating_currency_code": "IND",
                            "iso_destination_currency_code": "CAD",
                            "effective_entry_date": "2023-10-04 05:30:00",
                            "settlement_date": null,
                            "transaction_code": "27",
                            "receiving_dfi": "031300012",
                            "dfi_account_number": "12345643212354211",
                            "amount": "1000",
                            "individual_id_number": null,
                            "individual_name": null,
                            "check_serial_number": null,
                            "process_control_field": null,
                            "item_research_number": null,
                            "card_expiration_date": null,
                            "document_reference_number": null,
                            "individual_card_account_number": null,
                            "terminal_city": null,
                            "terminal_state": null,
                            "ach_return_code": null,
                            "ach_file_name": null,
                            "entry_detail_type": "IAT",
                            "discretionary_data": null,
                            "created_at": "2023-10-03 17:37:10",
                            "modified_at": "2023-10-03 17:37:46",
                            "processed_at": null
                        }
                    }
                ]
            }
        ],
        "recordCount": 1
    }
]

describe('IAT Records', function () {
    describe('Create Entry', function () {
        it('should create an entry successfully', function () {
             console.log('===============Started')
        });
    });
})