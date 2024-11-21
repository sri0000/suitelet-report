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
  

                //for tofixed
                function formatNumber(value, decimals) {
                    decimals = decimals === undefined ? 2 : decimals;  // Set a default of 2 if decimals is not provided
                    var numberValue = Number(value);
                    return isNaN(numberValue) ? 0 : numberValue.toFixed(decimals);
                }
                     
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
                  
                    //   var monthValue = src_rec1.getValue({ fieldId: monthField })) || 0;
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
                    filters:    [
                        ["type","anyof","CustInvc"], 
                        "AND", 
                        ["status","anyof","CustInvc:A"], 
                        "AND", 
                        ["salesrep.salesrep","is","T"], 
                        "AND", 
                        ["salesrep","anyof",salesRepId], 
                        "AND", 
                        ["trandate","within",formattedStartDate,formattedEndDate]
                     ],

                    columns:
                    [
                       search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                       search.createColumn({name: "taxtotal",summary: "SUM",label: "Amount (Transaction Tax Total)"}),
                       search.createColumn({name: "total",summary: "SUM",label: "Amount (Transaction Total)"}),
                       search.createColumn({name: "formulacurrency",summary: "SUM",formula: "CASE      WHEN {taxtotal} IS NULL THEN {totalamount}     ELSE {totalamount} - {taxtotal} END",
                                            label: "Formula (Currency)"})
                    ]
                 });
                 var searchResultCount = invoiceSearchObj.runPaged().count;
                 log.debug("invoiceSearchObj result count for less then 30 days",searchResultCount);
                 invoiceSearchObj.run().each(function(result){
                    var salesRep = result.getValue({name: "salesrep",summary: "GROUP"});
                    log.debug('x',salesRep)
                    var taxTotal = result.getValue({name: "taxtotal",summary: "SUM"});
                    var total = result.getValue({name: "total",summary: "SUM"});
                    var AmountLessthen30 = parseFloat(result.getValue({name: "formulacurrency",summary: "SUM"}) || 0);
                    log.debug('subtotal',AmountLessthen30)
                    // Store the amount for the corresponding sales rep ID
                    lessthen30[salesRep] = AmountLessthen30;
                    log.debug('30', lessthen30[salesRep])
        
                    return true; // Continue iteration
                });

        
        
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
                       search.createColumn({name: "taxtotal",summary: "SUM",label: "Amount (Transaction Tax Total)"}),
                       search.createColumn({name: "total",summary: "SUM",label: "Amount (Transaction Total)"}),
                       search.createColumn({name: "formulacurrency",summary: "SUM",formula: "CASE      WHEN {taxtotal} IS NULL THEN {totalamount}     ELSE {totalamount} - {taxtotal} END",
                                            label: "Formula (Currency)"})
                    ]
                 });
                 var searchResultCount = invoiceSearchObj.runPaged().count;
                 log.debug("invoiceSearchObj result count for less then 60 days",searchResultCount);
                 invoiceSearchObj.run().each(function(result){
                    var salesRep = result.getValue({name: "salesrep",summary: "GROUP"});
                    var taxTotal = result.getValue({name: "taxtotal",summary: "SUM"});
                    var total = result.getValue({name: "total",summary: "SUM"});
                    var AmountLessthen60 = result.getValue({name: "formulacurrency",summary: "SUM"}) || 0;
                    // Store the amount for the corresponding sales rep ID
                    lessthen60[salesRep] = AmountLessthen60;
        
                    return true; // Continue iteration
                });
        
                // Log the sales rep amounts
                log.debug("Sales Rep lessthen 60 days  Sales Amounts", lessthen60);
        

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
                        search.createColumn({name: "taxtotal",summary: "SUM",label: "Amount (Transaction Tax Total)"}),
                        search.createColumn({name: "total",summary: "SUM",label: "Amount (Transaction Total)"}),
                        search.createColumn({name: "formulacurrency",summary: "SUM",formula: "CASE      WHEN {taxtotal} IS NULL THEN {totalamount}     ELSE {totalamount} - {taxtotal} END",
                                             label: "Formula (Currency)"})
                     ]
                 });
                 var searchResultCount = invoiceSearchObj.runPaged().count;
                 log.debug("invoiceSearchObj result count for less then 90 days",searchResultCount);
                 invoiceSearchObj.run().each(function(result){
                    var salesRep = result.getValue({name: "salesrep",summary: "GROUP"});
                    var taxTotal = result.getValue({name: "taxtotal",summary: "SUM"});
                    var total = result.getValue({name: "total",summary: "SUM"});
                    var AmountLessthen90 = result.getValue({name: "formulacurrency",summary: "SUM"}) || 0;
                    // Store the amount for the corresponding sales rep ID
                    lessthen90[salesRep] = AmountLessthen90;
        
                    return true; // Continue iteration
                });
        
                // Log the sales rep amounts
                log.debug("Sales Rep lessthen 90 days 's Sales Amounts", lessthen90);

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
                        search.createColumn({name: "taxtotal",summary: "SUM",label: "Amount (Transaction Tax Total)"}),
                        search.createColumn({name: "total",summary: "SUM",label: "Amount (Transaction Total)"}),
                        search.createColumn({name: "formulacurrency",summary: "SUM",formula: "CASE      WHEN {taxtotal} IS NULL THEN {totalamount}     ELSE {totalamount} - {taxtotal} END",
                                             label: "Formula (Currency)"})
                     ]
                 });
                 var searchResultCount = invoiceSearchObj.runPaged().count;
                 log.debug("invoiceSearchObj result count for less then 180 days",searchResultCount);
                 invoiceSearchObj.run().each(function(result){
                    var salesRep = result.getValue({name: "salesrep",summary: "GROUP"});
                    var taxTotal = result.getValue({name: "taxtotal",summary: "SUM"});
                    var total = result.getValue({name: "total",summary: "SUM"});
                    var AmountLessthen180 = result.getValue({name: "formulacurrency",summary: "SUM"}) || 0;
                    // Store the amount for the corresponding sales rep ID
                    lessthen180[salesRep] = AmountLessthen180;
        
                    return true; // Continue iteration
                });
        
                // Log the sales rep amounts
                log.debug("Sales Rep lessthen 180 days 's Sales Amounts", lessthen180);
        
        
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
                        search.createColumn({name: "taxtotal",summary: "SUM",label: "Amount (Transaction Tax Total)"}),
                        search.createColumn({name: "total",summary: "SUM",label: "Amount (Transaction Total)"}),
                        search.createColumn({name: "formulacurrency",summary: "SUM",formula: "CASE      WHEN {taxtotal} IS NULL THEN {totalamount}     ELSE {totalamount} - {taxtotal} END",
                                             label: "Formula (Currency)"})
                     ]
                  });
                  var searchResultCount = invoiceSearchObj.runPaged().count;
                  log.debug("invoiceSearchObj result count for more then 180 days",searchResultCount);
                  invoiceSearchObj.run().each(function(result){
                    var salesRep = result.getValue({name: "salesrep",summary: "GROUP"});
                    var taxTotal = result.getValue({name: "taxtotal",summary: "SUM"});
                    var total = result.getValue({name: "total",summary: "SUM"});
                    var Amountmore180 = result.getValue({name: "formulacurrency",summary: "SUM"}) || 0;
                     // Store the amount for the corresponding sales rep ID
                     morethen180[salesRep] = Amountmore180;
         
                     return true; // Continue iteration
                 });
         
                 // Log the sales rep amounts
                 log.debug("Sales Rep more then 180 day's  Sales Amounts", morethen180);
         
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
                search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                search.createColumn({name: "taxtotal",summary: "SUM",label: "Amount (Transaction Tax Total)"}),
                search.createColumn({name: "total",summary: "SUM",label: "Amount (Transaction Total)"}),
                search.createColumn({name: "formulacurrency",summary: "SUM",formula: "CASE      WHEN {taxtotal} IS NULL THEN {totalamount}     ELSE {totalamount} - {taxtotal} END",
                                     label: "Formula (Currency)"})
             ]
         });

         var searchResultCount = invoiceSearchObj.runPaged().count;
         log.debug("invoiceSearchObj result count", searchResultCount);

         // Run the search and populate todaySalesAmount
         invoiceSearchObj.run().each(function(result) {
            var salesRep = result.getValue({name: "salesrep",summary: "GROUP"});
            var taxTotal = result.getValue({name: "taxtotal",summary: "SUM"});
            var total = result.getValue({name: "total",summary: "SUM"});
            var totalAmountForRep = result.getValue({name: "formulacurrency",summary: "SUM"}) || 0;
            

        // Store the amount for the corresponding sales rep ID
        todaySalesAmount[salesRep] = totalAmountForRep;

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
                        search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                        search.createColumn({name: "taxtotal",summary: "SUM",label: "Amount (Transaction Tax Total)"}),
                        search.createColumn({name: "total",summary: "SUM",label: "Amount (Transaction Total)"}),
                        search.createColumn({name: "formulacurrency",summary: "SUM", formula: "CASE      WHEN {taxtotal} IS NULL THEN {totalamount}     ELSE {totalamount} - {taxtotal} END",
                                             label: "Formula (Currency)"})
                     ]
                });

                var searchResultCount = invoiceSearchObj.runPaged().count;
                log.debug("invoiceSearchObj result count", searchResultCount);

                // Run the search and populate cumSalesAmount
                invoiceSearchObj.run().each(function(result) {
                    var salesRep = result.getValue({name: "salesrep",summary: "GROUP"});
                    var taxTotal = result.getValue({name: "taxtotal",summary: "SUM"});
                    var total = result.getValue({name: "total",summary: "SUM"});
                    var totalAmountForRep1 = result.getValue({name: "formulacurrency",summary: "SUM"}) || 0;
                    
  
               // Store the amount for the corresponding sales rep ID
               cumSalesAmount[salesRep] = totalAmountForRep1;

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
                    var salesForTheDay = parseFloat(todaySalesAmount[salesRepId[i]] || 0);
                    salesForDayTotal += salesForTheDay;
                    var cumSales = parseFloat(cumSalesAmount[salesRepId[i]] || 0);
                    cumsalesTotal += cumSales; 

                    //for open invoice amount
                    // var lessthen30 =   openAmount[salesRepId[i]] || 0;
                    var less30days = parseFloat(lessthen30[salesRepId[i]] || 0); 
                    log.debug('lessthen 30 days amount',less30days)
                    less30Total +=less30days;
                    var less60days = parseFloat(lessthen60[salesRepId[i]] || 0); 
                    log.debug('lessthen  60 days amount',less60days)
                    less60Total += less60days;
                    var less90days = parseFloat(lessthen90[salesRepId[i]] || 0); 
                    log.debug('lessthen  90 days amount',less90days)
                    less90Total += less90days;
                    var less180days = parseFloat(lessthen180[salesRepId[i]] || 0); 
                    log.debug('lessthen  180 days amount',less180days)
                    less180Total += less180days;
                    var more180days =  parseFloat(morethen180[salesRepId[i]] || 0);
                    log.debug('more then  180 days amount',less180days)
                    more180Total += more180days;


                    var osAsAFirstMonth = less30days + less60days + less90days + less180days + more180days;
                    osAsAFirstMonthTotal += osAsAFirstMonth;

                    var percent = osAsAFirstMonth !== 0 ? cumSales / osAsAFirstMonth : 0 || 0;
                    percentTotal += percent;
                    
                    var balanceDue = Math.abs(osAsAFirstMonth - cumSales);

                    balanceDueTotal += balanceDue;
                    
                    
                    td = '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+serialNumber+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: left; vertical-align: middle; letter-spacing: normal;">'+name+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+formatNumber(osAsAFirstMonth)+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal; background-color: rgb(178, 212, 218);">'+formatNumber(less30days)+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal; background-color: rgb(178, 212, 218);">'+formatNumber(less60days)+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal; background-color: rgb(178, 212, 218);">'+formatNumber(less90days)+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal; background-color: rgb(178, 212, 218);">'+formatNumber(less180days)+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal; background-color: rgb(178, 212, 218);">'+formatNumber(more180days)+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal; background-color: rgb(187, 221, 167);">'+formatNumber(salesForTheDay)+'</td>' +
                         '<td style="width: 15px;height:10px; border-right: 1px solid black; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;background-color: rgb(187, 221, 167);">'+formatNumber(cumSales)+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px;   padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+formatNumber(percent)+'%'+'</td>'+
                         '<td  style="width: 15px;height:10px;   padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+formatNumber(balanceDue)+'</td>'
                
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
                    <td border-right="1" style="width: 15px;height:10px; padding:4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+formatNumber(osAsAFirstMonthTotal)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+formatNumber(less30Total)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+formatNumber(less60Total)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal; align: center; vertical-align: middle; letter-spacing: normal;">'+formatNumber(less90Total)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+formatNumber(less180Total)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+formatNumber(more180Total)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+formatNumber(salesForDayTotal)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+formatNumber(cumsalesTotal)+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+formatNumber(percentTotal)+'%'+'</td>\
                    <td style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+formatNumber(balanceDueTotal)+'</td>\
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
            
                
