/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(["N/record", "N/render", "N/search", "N/runtime", "N/file", "N/format"], function (record, render, search, runtime, file, format) {
    function onRequest(context) {
        try {
            var rec_id = context.request.parameters.recordid;
            log.debug('rec_id', rec_id);
            if (!rec_id) {
                throw new Error("Record ID is missing from request parameters.");
            }
  
            // Load the invoice record using the rec_id
            var loadPO = record.load({
                type: 'customrecord_impal_wbt_sm_brch_rp',
                id: rec_id
            });
  
            var selectedBranch = loadPO.getValue({
                fieldId: 'custrecord_impal_brch'
            });
            log.debug("branch", selectedBranch);
  
            var selectedPeriod = loadPO.getText({
                fieldId: 'custrecord_impal_acc_pr'
            });
            log.debug("accountpr", selectedPeriod);
  
            var selectedPeriod1 = loadPO.getValue({
                fieldId: 'custrecord_impal_acc_pr'
            });
  
            if (selectedPeriod) {
                log.debug('if entered');
                var trimmedPeriod = selectedPeriod.trim();
                log.debug('trimmedPeriod', trimmedPeriod);
                var monthName = trimmedPeriod.split(' ')[6];  //["FY", "2024", ":", "Q1", "2024", ":", "May", "2023"]
                log.debug('monthName', monthName);
                var periodParts = selectedPeriod.trim().split(' ');
                log.debug('periodParts', periodParts);
                var monthNames = periodParts[6];
                log.debug('monthNames', monthNames);
                var year = parseInt(periodParts[7]);
                log.debug('year', year);
  
                
                log.debug('Trimmed Period:', trimmedPeriod);
                log.debug('Month Name:', monthName);
                log.debug('Year:', year);

                var monthMap = {
                    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3,
                    'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7,
                    'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
                };
  
                var monthNumber = monthMap[monthNames];
                var startDate = new Date(year, monthNumber, 1);
                log.debug("before formatting start date", startDate);
                var endDate = new Date(year, monthNumber + 1, 0);
                log.debug("before formatting end date", endDate);
  
                var formattedStartDate = format.format({
                    value: startDate,
                    type: format.Type.DATE
                });
                var formattedEndDate = format.format({
                    value: endDate,
                    type: format.Type.DATE
                });
                log.debug('Start Date:', formattedStartDate);
                log.debug('End Date:', formattedEndDate);
  

                     
                  //perivious 1 month start and end date 
                  if (monthNumber === undefined) {
                    log.error('Invalid Month Name', monthNames);
                    return;
                }
            
                // Adjust for previous month
                var previousMonth = monthNumber - 1;
                var previousYear = year;
            
                // If the month goes below 0, wrap around to December of the previous year
                if (previousMonth < 0) {
                    previousMonth += 12; // Wrap back to the range [0-11]
                    previousYear -= 1;   // Adjust the year
                    }
                // Calculate the start and end dates for the previous month
                var prev1startDate = new Date(previousYear, previousMonth, 1);
                log.debug("Start Date (Previous Month)", prev1startDate);
            
                var prev1endDate = new Date(previousYear, previousMonth + 1, 0);
                log.debug("End Date (Previous Month)", prev1endDate);
            
                // Format the dates
                var prev1formattedStartDate = format.format({
                    value: prev1startDate,
                    type: format.Type.DATE
                });
                var prev1formattedEndDate = format.format({
                    value: prev1endDate,
                    type: format.Type.DATE
                });
            
                log.debug('Previous Month Start Date:', prev1formattedStartDate);
                log.debug('Previous Month End Date:', prev1formattedEndDate);
            
            
                 //perivious 2 month start and end date 
                 if (monthNumber === undefined) {
                    log.error('Invalid Month Name', monthNames);
                    return;
                }
            
                // Adjust for previous month
                var previousMonth = monthNumber - 2;
                var previousYear = year;
            
                // If it's January, move to December of the previous year
                if (previousMonth < 0) {
                    previousMonth += 12; // Wrap back to the range [0-11]
                    previousYear -= 1;   // Adjust the year
                    }
                // Calculate the start and end dates for the previous month
                var prev2startDate = new Date(previousYear, previousMonth, 1);
                log.debug("Start Date (Previous Month)", prev2startDate);
            
                var prev2endDate = new Date(previousYear, previousMonth + 1, 0);
                log.debug("End Date (Previous Month)", prev2endDate);
            
                // Format the dates
                var prev2formattedStartDate = format.format({
                    value: prev2startDate,
                    type: format.Type.DATE
                });
                var prev2formattedEndDate = format.format({
                    value: prev2endDate,
                    type: format.Type.DATE
                });
            
                log.debug('Previous Month Start Date:', prev2formattedStartDate);
                log.debug('Previous Month End Date:', prev2formattedEndDate);




                 //perivious 3 month start and end date 
                 if (monthNumber === undefined) {
                    log.error('Invalid Month Name', monthNames);
                    return;
                }
            
                // Adjust for previous month
                var previousMonth = monthNumber - 3;
                var previousYear = year;
            
                // If it's January, move to December of the previous year
                if (previousMonth < 0) {
                    previousMonth += 12; // Wrap back to the range [0-11]
                    previousYear -= 1;   // Adjust the year
                    }
                // Calculate the start and end dates for the previous month
                var prev3startDate = new Date(previousYear, previousMonth, 1);
                log.debug("Start Date (Previous Month)", prev3startDate);
            
                var prev3endDate = new Date(previousYear, previousMonth + 1, 0);
                log.debug("End Date (Previous Month)", prev3endDate);
            
                // Format the dates
                var prev3formattedStartDate = format.format({
                    value: prev3startDate,
                    type: format.Type.DATE
                });
                var prev3formattedEndDate = format.format({
                    value: prev3endDate,
                    type: format.Type.DATE
                });
            
                log.debug('Previous Month Start Date:', prev3formattedStartDate);
                log.debug('Previous Month End Date:', prev3formattedEndDate);


                
                 //perivious 3 month start and end date 
                 if (monthNumber === undefined) {
                    log.error('Invalid Month Name', monthNames);
                    return;
                }
            
                // Adjust for previous month
                var previousMonth = monthNumber - 4;
                var previousYear = year;
            
                // If it's January, move to December of the previous year
               if (previousMonth < 0) {
                    previousMonth += 12; // Wrap back to the range [0-11]
                    previousYear -= 1;   // Adjust the year
                    }
                // Calculate the start and end dates for the previous month
                var prev4startDate = new Date(previousYear, previousMonth, 1);
                log.debug("Start Date (Previous Month)", prev4startDate);
            
                var prev4endDate = new Date(previousYear, previousMonth + 1, 0);
                log.debug("End Date (Previous Month)", prev4endDate);
            
                // Format the dates
                var prev4formattedStartDate = format.format({
                    value: prev4startDate,
                    type: format.Type.DATE
                });
                var prev4formattedEndDate = format.format({
                    value: prev4endDate,
                    type: format.Type.DATE
                });
            
                log.debug('Previous Month Start Date:', prev4formattedStartDate);
                log.debug('Previous Month End Date:', prev4formattedEndDate);

                // Map month abbreviations to their corresponding fields
                var monthFieldMap = {
                    'Jan': 'custrec ord_wbt_salesman_field_jan',
                    'Feb': 'custrecord_wbt_salesman_field_feb',
                    'Mar': 'custrecord_wbt_salesman_field_march',
                    'Apr': 'custrecord_wbt_salesman_field_april',
                    'May': 'custrecord_wbt_salesman_field_may',
                    'Jun': 'custrecord_wbt_salesman_field_june',
                    'Jul': 'custrecord_wbt_salesman_field_july',
                    'Aug': 'custrecord_wbt_salesman_field_august',
                    'Sep': 'custrecord_wbt_salesman_field_september',
                    'Oct': 'custrecord_wbt_salesman_field_october',
                    'Nov': 'custrecord_wbt_salesman_field_november',
                    'Dec': 'custrecord_wbt_salesman_field_december'
                };
                var monthField = monthFieldMap[monthName];
                log.debug('Month Field:', monthField);
  
                // Get today's date
                var today = format.format({
                    value: new Date(),
                    type: format.Type.DATE
                });
                log.debug('today',today)
                
                var internalIds = [];
                var source = search.create({
                    type: "customrecord_impal_wbt_salesman",
                    filters: [
                        ["custrecord_wbt_salesman_branch", "anyof", selectedBranch],
                        "AND",
                        ["custrecord_wbt_salesman_accounting_perio", "is", selectedPeriod1]
                    ],
                    columns: [ search.createColumn({ name: "internalid" }) ]
                });
 
                source.run().each(function(result) {
                    internalIds.push(result.getValue({ name: "internalid" }));
                    return true;
                });
                  log.debug('internalIds', internalIds);

                  var salesRepName = [];
                //   var monthtotalArray = [];
                  var salesRepId= [];
                  for (var m = 0; m < internalIds.length; m++) {
                      var src_rec1 = record.load({
                          type: 'customrecord_impal_wbt_salesman',
                          id: internalIds[m]
                      });
                  
                    //   var monthValue = parseFloat(src_rec1.getValue({ fieldId: monthField })) || 0;
                    //   monthtotalArray.push(monthValue);
                      salesRepName.push(src_rec1.getText("custrecord_impal_sales_executive_m_s"));
                      salesRepId.push(src_rec1.getValue("custrecord_impal_sales_executive_m_s"));
                  }
                  
                  log.debug('Internal IDs length:', internalIds.length);
                //   log.debug('Month Total Array:', monthtotalArray);
                  log.debug('Sales Rep Names Array:', salesRepName); // Logs the full array of sales rep names
                  if
                 (internalIds.length === 0) {       
                 log.debug("No valid sales reps found. Skipping further search.");            
                 // HTML content to display when no sales rep is found
                 var htmlContent ='<html><head><title>No Sales Rep Found</title></head><body>';          
                 htmlContent +='<h1>No Sales Rep Found for the given period.</h1>';   
                 htmlContent +='<p>Please check the details and try again.</p>';     
                 htmlContent +='</body></html>';            
                // Write the HTML response to the page
                context.response.write(htmlContent);
                return ;
                }


                

                var lessthen30 ={};
                var invoiceSearchObj = search.create({
                    type: "invoice",
                    settings: [{"name": "consolidationtype", "value": "ACCTTYPE"}],
                    filters: [
                        ["type", "anyof", "CustInvc"], 
                        "AND", 
                        ["status", "anyof", "CustInvc:A"], 
                        "AND", 
                        ["salesrep.salesrep", "is", "T"], 
                        "AND", 
                        ["salesrep", "anyof", salesRepId], 
                       "AND", 
                       ["trandate","within",formattedStartDate,formattedEndDate]
                    ],
                    columns:
                    [
                       search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                       search.createColumn({name: "debitfxamount",summary: "SUM",label: "Amount (Debit) (Foreign Currency)"})
                    ]
                 });
                 var searchResultCount = invoiceSearchObj.runPaged().count;
                 log.debug("invoiceSearchObj result count for less then 30 days",searchResultCount);
                 invoiceSearchObj.run().each(function(result){
                    var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                    var AmountLessthen30 = parseFloat(result.getValue({ name: "debitfxamount", summary: "SUM" })) || 2;
                    // Store the amount for the corresponding sales rep ID
                    lessthen30[salesRepId] = AmountLessthen30;
        
                    return true; // Continue iteration
                });
        
                // Log the sales rep amounts
                log.debug("Sales Rep Today's Sales Amounts", lessthen30);
        
                //lessthen31 - 60
                var lessthen60 ={};
                var invoiceSearchObj = search.create({
                    type: "invoice",
                    settings: [{"name": "consolidationtype", "value": "ACCTTYPE"}],
                    filters: [
                        ["type", "anyof", "CustInvc"], 
                        "AND", 
                        ["status", "anyof", "CustInvc:A"], 
                        "AND", 
                        ["salesrep.salesrep", "is", "T"], 
                        "AND", 
                        ["salesrep", "anyof", salesRepId], 
                       "AND", 
                       ["trandate","within",prev1formattedStartDate,prev1formattedEndDate]
                    ],
                    columns:
                    [
                       search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                       search.createColumn({name: "debitfxamount",summary: "SUM",label: "Amount (Debit) (Foreign Currency)"})
                    ]
                 });
                 var searchResultCount = invoiceSearchObj.runPaged().count;
                 log.debug("invoiceSearchObj result count for less then 30 days",searchResultCount);
                 invoiceSearchObj.run().each(function(result){
                    var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                    var AmountLessthen60 = parseFloat(result.getValue({ name: "debitfxamount", summary: "SUM" })) || 2;
                    // Store the amount for the corresponding sales rep ID
                    lessthen60[salesRepId] = AmountLessthen60;
        
                    return true; // Continue iteration
                });
        
                // Log the sales rep amounts
                log.debug("Sales Rep Today's Sales Amounts", lessthen60);
        

                //lessthen90
              
                var lessthen90 ={};
                var invoiceSearchObj = search.create({
                    type: "invoice",
                    settings: [{"name": "consolidationtype", "value": "ACCTTYPE"}],
                    filters: [
                        ["type", "anyof", "CustInvc"], 
                        "AND", 
                        ["status", "anyof", "CustInvc:A"], 
                        "AND", 
                        ["salesrep.salesrep", "is", "T"], 
                        "AND", 
                        ["salesrep", "anyof", salesRepId], 
                       "AND", 
                       ["trandate","within",prev2formattedStartDate,prev2formattedEndDate]
                    ],
                    columns:
                    [
                       search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                       search.createColumn({name: "debitfxamount",summary: "SUM",label: "Amount (Debit) (Foreign Currency)"})
                    ]
                 });
                 var searchResultCount = invoiceSearchObj.runPaged().count;
                 log.debug("invoiceSearchObj result count for less then 30 days",searchResultCount);
                 invoiceSearchObj.run().each(function(result){
                    var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                    var AmountLessthen90 = parseFloat(result.getValue({ name: "debitfxamount", summary: "SUM" })) || 2;
                    // Store the amount for the corresponding sales rep ID
                    lessthen90[salesRepId] = AmountLessthen90;
        
                    return true; // Continue iteration
                });
        
                // Log the sales rep amounts
                log.debug("Sales Rep Today's Sales Amounts", lessthen90);

                //lessthen180
                
                var lessthen180 ={};
                var invoiceSearchObj = search.create({
                    type: "invoice",
                    settings: [{"name": "consolidationtype", "value": "ACCTTYPE"}],
                    filters: [
                        ["type", "anyof", "CustInvc"], 
                        "AND", 
                        ["status", "anyof", "CustInvc:A"], 
                        "AND", 
                        ["salesrep.salesrep", "is", "T"], 
                        "AND", 
                        ["salesrep", "anyof", salesRepId], 
                       "AND", 
                       ["trandate","within",prev3formattedStartDate,prev3formattedEndDate]
                    ],
                    columns:
                    [
                       search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                       search.createColumn({name: "debitfxamount",summary: "SUM",label: "Amount (Debit) (Foreign Currency)"})
                    ]
                 });
                 var searchResultCount = invoiceSearchObj.runPaged().count;
                 log.debug("invoiceSearchObj result count for less then 30 days",searchResultCount);
                 invoiceSearchObj.run().each(function(result){
                    var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                    var AmountLessthen180 = parseFloat(result.getValue({ name: "debitfxamount", summary: "SUM" })) || 2;
                    // Store the amount for the corresponding sales rep ID
                    lessthen180[salesRepId] = AmountLessthen180;
        
                    return true; // Continue iteration
                });
        
                // Log the sales rep amounts
                log.debug("Sales Rep Today's Sales Amounts", lessthen180);
        
        
                //morethen180

                 //lessthen180
                
                 var morethen180 ={};
                 var invoiceSearchObj = search.create({
                     type: "invoice",
                     settings: [{"name": "consolidationtype", "value": "ACCTTYPE"}],
                     filters: [
                         ["type", "anyof", "CustInvc"], 
                         "AND", 
                         ["status", "anyof", "CustInvc:A"], 
                         "AND", 
                         ["salesrep.salesrep", "is", "T"], 
                         "AND", 
                         ["salesrep", "anyof", salesRepId], 
                        "AND", 
                        ["trandate","within",prev4formattedStartDate,prev4formattedEndDate]
                     ],
                     columns:
                     [
                        search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                        search.createColumn({name: "debitfxamount",summary: "SUM",label: "Amount (Debit) (Foreign Currency)"})
                     ]
                  });
                  var searchResultCount = invoiceSearchObj.runPaged().count;
                  log.debug("invoiceSearchObj result count for less then 30 days",searchResultCount);
                  invoiceSearchObj.run().each(function(result){
                     var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                     var Amountmore180 = parseFloat(result.getValue({ name: "debitfxamount", summary: "SUM" })) || 2;
                     // Store the amount for the corresponding sales rep ID
                     morethen180[salesRepId] = Amountmore180;
         
                     return true; // Continue iteration
                 });
         
                 // Log the sales rep amounts
                 log.debug("Sales Rep Today's Sales Amounts", morethen180);
         
// var postingPeriods=[];
//                 // Loop for the last 4 months
// for (var i = 1; i <= 4; i++) {
//     var previousDate =  monthName - i;

//     log.debug( 'perivious month name ',previousDate)
//     // Extract month name and year
//     var monthName = previousDate;
//     // var year = previousDate;

//     // Combine into "Month Year" format
//     var postingPeriod = monthName + ' ' + year.toString(); // e.g., "May 2023"

//     // Store in an array
//     postingPeriods.push(postingPeriod);

//     // Log each posting period
//     log.debug('Posting Period (-' + i + ' Month)', postingPeriod);
// }

// // Example: Access individual posting periods
// var postingPeriodMinus1 = postingPeriods[0]; // -1 month
// var postingPeriodMinus2 = postingPeriods[1]; // -2 months
// var postingPeriodMinus3 = postingPeriods[2]; // -3 months
// var postingPeriodMinus4 = postingPeriods[3]; // -4 months

// // Log the full array of posting periods
// log.debug('All Posting Periods', postingPeriods);
           // for 30 days base saved search

        //    var openAmount = {};
        //    var invoiceSearchObj = search.create({
        //     type: "invoice",
        //     settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
        //     filters:
        //     [
        //        ["type","anyof","CustInvc"], 
        //        "AND", 
        //        ["status","anyof","CustInvc:A"], 
        //        "AND", 
        //        ["salesrep.salesrep","is","T"], 
        //        "AND", 
        //        ["salesrep","anyof",salesRepId], 
        //        "AND", 
        //        ["trandate", "within", "thismonthtodate"]
        //         // "OR",
        //         // ["trandate", "within", "lastmonth"],
        //         // "OR",
        //         // ["trandate", "within", "monthbeforelast"]
            
        //     //    , 
        //     //    "AND", 
        //     //    ["trandate","within","monthbeforelast"]
        //     ],
        //     columns:
        //     [
        //        search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
        //        search.createColumn({name: "amount",summary: "SUM",label: "Amount"})
        //     ]
        //  });
        //  var searchResultCount = invoiceSearchObj.runPaged().count;
        //  log.debug("invoiceSearchObj result count",searchResultCount);
        //  invoiceSearchObj.run().each(function(result){
        //     var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
        //     var amount = parseFloat(result.getValue({ name: "amount", summary: "SUM" })) || 0;

        //     // Store or accumulate the amount for the corresponding sales rep ID
        //     if (!openAmount[salesRepId]) {
        //         openAmount[salesRepId] = 0; // Initialize if not already
        //     }
        
        //     openAmount[salesRepId] += amount; // Add to existing value
        
        //     return true; // Continue iteration
        // });
        // Combine month name and year to create postingPeriod
        // var postingPeriod = monthName + ' ' + year.toString(); // Example: "May 2023"
        // log.debug('Posting Period (Text)', postingPeriod);
        
        // // Search for the posting period internal ID
        // var postingPeriodId;
        // var periodSearch = search.create({
        //     type: "accountingperiod",
        //     filters: [
        //         ["periodname", "is", postingPeriod]
        //     ],
        //     columns: ["internalid"]
        // });
        
        // periodSearch.run().each(function(result) {
        //     postingPeriodId = result.getValue("internalid");
        //     log.debug('Posting Period ID Found', postingPeriodId); // Log the ID if found
        //     return false; // Exit after finding the first match
        // });
        
        // if (!postingPeriodId) {
        //     log.error("Error", "Posting period not found: " + postingPeriod);
        //     return; // Stop further execution if posting period is not found
        // }
        // // Proceed with the invoice search using the internal ID of the posting period
        // log.debug('Proceeding with Invoice Search', 'Posting Period ID: ' + postingPeriodId);
        
        //  var lessthen30 ={};
        // var invoiceSearchObj = search.create({
        //     type: "invoice",
        //     settings: [{"name": "consolidationtype", "value": "ACCTTYPE"}],
        //     filters: [
        //         ["type", "anyof", "CustInvc"], 
        //         "AND", 
        //         ["status", "anyof", "CustInvc:A"], 
        //         "AND", 
        //         ["salesrep.salesrep", "is", "T"], 
        //         "AND", 
        //         ["salesrep", "anyof", salesRepId], 
        //        "AND", 
        //        ["trandate","within","01/07/2024","31/07/2024"]
        //     ],
        //     columns:
        //     [
        //        search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
        //        search.createColumn({name: "debitfxamount",summary: "SUM",label: "Amount (Debit) (Foreign Currency)"})
        //     ]
        //  });
        //  var searchResultCount = invoiceSearchObj.runPaged().count;
        //  log.debug("invoiceSearchObj result count for less then 30 days",searchResultCount);
        //  invoiceSearchObj.run().each(function(result){
        //     var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
        //     var AmountLessthen30 = parseFloat(result.getValue({ name: "debitfxamount", summary: "SUM" })) || 2;
        //     // Store the amount for the corresponding sales rep ID
        //     lessthen30[salesRepId] = AmountLessthen30;

        //     return true; // Continue iteration
        // });

        // // Log the sales rep amounts
        // log.debug("Sales Rep Today's Sales Amounts", lessthen30);

         //sales amount for sales rep
         var todaySalesAmount = {};
         var invoiceSearchObj = search.create({
                 type: "invoice",
                 settings: [{"name": "consolidationtype", "value": "ACCTTYPE"}],
                 filters: [
                     ["type", "anyof", "CustInvc"], 
                     "AND", 
                     ["status","anyof","CustInvc:B"], 
                     "AND", 
                     ["salesrep.salesrep", "is", "T"], 
                     "AND", 
                     ["salesrep", "anyof", salesRepId], 
                     "AND",
                     ["trandate", "on", today]
                 ],
             columns: [
                 search.createColumn({ name: "salesrep", summary: "GROUP", label: "Sales Rep" }),
                 search.createColumn({ name: "amount", summary: "SUM", label: "Amount" })
             ]
         });

         var searchResultCount = invoiceSearchObj.runPaged().count;
         log.debug("invoiceSearchObj result count", searchResultCount);

         // Run the search and populate todaySalesAmount
         invoiceSearchObj.run().each(function(result) {
        var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
        var totalAmountForRep =parseFloat( result.getValue({ name: "amount", summary: "SUM" })) || 0;

        // Store the amount for the corresponding sales rep ID
        todaySalesAmount[salesRepId] = totalAmountForRep;

             return true;
         });
         log.debug("Sales Rep  today sales Amounts", todaySalesAmount); // Logs amounts for each sales rep ID

                //cum sales amount for sales rep
                var cumSalesAmount = {};
                var invoiceSearchObj = search.create({
                        type: "invoice",
                        settings: [{"name": "consolidationtype", "value": "ACCTTYPE"}],
                        filters: [
                            ["type", "anyof", "CustInvc"], 
                            "AND", 
                            ["status","anyof","CustInvc:B"], 
                            "AND", 
                            ["salesrep.salesrep", "is", "T"], 
                            "AND", 
                            ["salesrep", "anyof", salesRepId], 
                            "AND",
                            ["trandate", "within", formattedStartDate, formattedEndDate]
                        ],
                    columns: [
                        search.createColumn({ name: "salesrep", summary: "GROUP", label: "Sales Rep" }),
                        search.createColumn({ name: "amount", summary: "SUM", label: "Amount" })
                    ]
                });

                var searchResultCount = invoiceSearchObj.runPaged().count;
                log.debug("invoiceSearchObj result count", searchResultCount);

                // Run the search and populate cumSalesAmount
                invoiceSearchObj.run().each(function(result) {
               var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
               var totalAmountForRep =parseFloat( result.getValue({ name: "amount", summary: "SUM" })) || 0;
  
               // Store the amount for the corresponding sales rep ID
               cumSalesAmount[salesRepId] = totalAmountForRep;

                    return true;
                });
                log.debug("Sales Rep Amounts", cumSalesAmount); // Logs amounts for each sales rep ID

                var tr = '';
                var td = '';
                var serialNumber = 1;

                //less days variable
                var less30Total = 0;
                var less60Total = 0;
                var less90Total = 0;
                var less180Total = 0;
                var more180Total = 0;


                //O/s as on 1st of the month variable
                var osAsAFirstMonthTotal = 0;
                //% total
                var percentTotal = 0;
                //balanceDue
                var balanceDueTotal =0;

                //sales for the day
                var salesForDayTotal=0;
                //for month sales
                var cumsalesTotal = 0;
                for (var i = 0; i < internalIds.length; i++) {
                    
                    var name = salesRepName[i];
                    var salesForTheDay = todaySalesAmount[salesRepId[i]] || 0;
                    salesForDayTotal += salesForTheDay;
                    var cumSales = cumSalesAmount[salesRepId[i]] || 0;
                    cumsalesTotal += cumSales; 

                    //for open invoice amount
                    // var lessthen30 =   openAmount[salesRepId[i]] || 0;
                    var less30days = lessthen30[salesRepId[i]] || 0; 
                    less30Total +=less30days;
                    var less60days = lessthen60[salesRepId[i]] || 0; 
                    less60Total += less60days;
                    var less90days = lessthen90[salesRepId[i]] || 0; 
                    less90Total += less90days;
                    var less180days = lessthen180[salesRepId[i]] || 0; 
                    less180Total += less180days;
                    var more180days =  morethen180[salesRepId[i]] || 0;
                    more180Total += more180days;


                    var osAsAFirstMonth = less30days + less60days + less90days + less180days + more180days;
                    osAsAFirstMonthTotal += osAsAFirstMonth;

                    var percent = cumSales / osAsAFirstMonth;
                    percentTotal +=percent;

                    var balanceDue = Math.abs(osAsAFirstMonth - cumSales);

                    balanceDueTotal += balanceDue;
                    
                    
                    td = '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+serialNumber+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: left; vertical-align: middle; letter-spacing: normal;">'+name+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+osAsAFirstMonth.toFixed(2)+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal; background-color: rgb(178, 212, 218);">'+less30days.toFixed(2)+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal; background-color: rgb(178, 212, 218);">'+less60days.toFixed(2)+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal; background-color: rgb(178, 212, 218);">'+less90days.toFixed(2)+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal; background-color: rgb(178, 212, 218);">'+less180days.toFixed(2)+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal; background-color: rgb(178, 212, 218);">'+more180days.toFixed(2)+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal; background-color: rgb(187, 221, 167);">'+salesForTheDay.toFixed(2)+'</td>' +
                         '<td style="width: 15px;height:10px; border-right: 1px solid black; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;background-color: rgb(187, 221, 167);">'+cumSales.toFixed(2)+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px;   padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+percent.toFixed(2)+'%'+'</td>'+
                         '<td  style="width: 15px;height:10px;   padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+balanceDue.toFixed(2)+'</td>'
                
                    tr += ' <tr border-bottom="1"  style="width: 10%;height:2%;">' + td + '</tr>';  
                    serialNumber++;   
                }
                          
                var xmlTemplateFile='<?xml version="1.0"?>\
                <pdf>\
                <head>\
                </head>\
                <body style="font-family: Arial, sans-serif; font-size: 11px; margin: 0; padding: 20px; width: 250mm; height: 297mm;">\
               <table border="1" style="width: 100%; border-collapse: collapse;">\
                <tr  style="background-color: #9094c6; color: white;width: 10%;height:2%;">\
                  <td  border-bottom="1" colspan="12" style="align:center;  width: 15px;height:10px; padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">\COLLECTION Lacs</td>\
                </tr>\
                <tr border-bottom="1" style="background-color: #f9f9f9;width: 10%;height:2%;">\
                  <td border-right="1" border-bottom="1" rowspan="2" style="width: 15px;height:10px; background-color: rgb(255, 238, 192); padding: 4px; font-weight: bold; font-style: normal; align: center; vertical-align: middle; letter-spacing: normal;">\SI.No</td>\
                  <td border-right="1" border-bottom="1" rowspan="2" style="width: 15px;height:10px; background-color: rgb(255, 238, 192);padding: 4px; font-weight: bold; font-style: normal; align: center; vertical-align: middle; letter-spacing: normal;">\Sales Executive M/s</td>\
                  <td border-right="1" border-bottom="1" rowspan="2" style="width: 15px;height:10px; background-color: rgb(255, 238, 192);padding: 4px; font-weight: bold; font-style: normal; align: center; vertical-align: middle; letter-spacing: normal;">\O/S as on 1st of<br/>the month</td>\
                  <td border-right="1" colspan="5" style="width: 15px;height:10px; background-color: rgb(255, 238, 192); padding: 4px; align: center; font-weight: bold; font-style: normal; vertical-align: middle; letter-spacing: normal;">\Outstanding Amount in</td>\
               <td  colspan="4" style="width: 15px;height:10px; background-color: rgb(255, 238, 192); padding: 4px; align: center; font-weight: bold; font-style: normal; vertical-align: middle; letter-spacing: normal;">\Collection Lacs</td>\
                </tr>\
                <tr border-bottom="1"  style="background-color: rgb(255, 238, 192);width: 10%;height:2%;">\
                  <td border-right="1" style=" width: 15px;height:10px; padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">&lt;30 days</td>\
                  <td border-right="1" style=" width: 15px;height:10px; padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">31 -60 days</td>\
                  <td border-right="1" style=" width: 15px;height:10px; padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">61-90 days</td>\
                  <td border-right="1" style=" width: 15px;height:10px; padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">91-180 days</td>\
                  <td border-right="1" style=" width: 15px;height:10px; padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">&gt;180</td>\
                  <td border-right="1" style=" width: 15px;height:10px; padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">Day</td>\
                  <td border-right="1" style=" width: 15px;height:10px; padding:4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">Cumulative as of</td>\
                  <td border-right="1" style=" width: 15px;height:10px; padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">%</td>\
                  <td  border-right="none" style=" width: 15px;height:10px;  padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">\Balance Due</td>\
                </tr>\
               '+tr+'\
                    <tr border-bottom="none"  style="width: 10%;height:2%;">\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">\</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: bold; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">\Total</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding:4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+osAsAFirstMonthTotal.toFixed(2)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+less30Total.toFixed(2)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+less60Total.toFixed(2)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal; align: center; vertical-align: middle; letter-spacing: normal;">'+less90Total.toFixed(2)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+less180Total.toFixed(2)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+more180Total.toFixed(2)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+salesForDayTotal.toFixed(2)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+cumsalesTotal.toFixed(2)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+percentTotal.toFixed(2)+'%'+'</td>\
                    <td style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+balanceDueTotal.toFixed(2)+'</td>\
                </tr>\
              </table>\
             </body>\
            </pdf>';
              // Create and configure the renderer
              var renderer = render.create();
              renderer.templateContent = xmlTemplateFile;
              // Log renderer object for debugging
              log.debug({
                title: "Renderer Object",
                details: renderer,
              });
              // Add record to renderer
              renderer.addRecord("record", loadPO);
              // Render PDF
              var invoicePdf = renderer.renderAsPdf();
              // Send the PDF as response
              context.response.writeFile({
                file: invoicePdf,
                isInline: true,
              });
          }
      }       
              catch(error) {
              log.error({
                title: "Error in Suitelet",
                details: error.message,
              });   
              // Send error response to the user
              context.response.write({
                output: "An error occurred: " + error.message,
              });
           }
       }
              return {
              onRequest: onRequest,
            };
      });
            
                
