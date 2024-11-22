/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(["N/record", "N/render", "N/search", "N/runtime", "N/file", "N/format"], function (record, render, search, runtime, file, format) {
   function onRequest(context) {
      
      var todaySalesAmount = {};
      var invoiceSearchObj = search.create({
   type: "invoice",
   settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
   filters:
   [
      ["type","anyof","CustInvc"], 
      "AND", 
      ["status","anyof","CustInvc:A"], 
      "AND", 
      ["salesrep.salesrep","is","T"], 
      "AND", 
      ["salesrep","anyof","653","655"], 
      "AND", 
      ["trandate","within","01/10/2024","31/10/2024"]
   ],
   columns:
   [
      search.createColumn({
         name: "salesrep",
         summary: "GROUP",
         label: "Sales Rep"
      }),
      search.createColumn({
         name: "taxtotal",
         summary: "SUM",
         label: "Amount (Transaction Tax Total)"
      }),
      search.createColumn({
         name: "total",
         summary: "SUM",
         label: "Amount (Transaction Total)"
      }),
      search.createColumn({
         name: "formulacurrency",
         summary: "SUM",
         formula: "CASE      WHEN {taxtotal} IS NULL THEN {totalamount}     ELSE {totalamount} - {taxtotal} END",
         label: "Formula (Currency)"
      })
   ]
});
var searchResultCount = invoiceSearchObj.runPaged().count;
log.debug("invoiceSearchObj result count",searchResultCount);
invoiceSearchObj.run().each(function(result){
   var salesRep = result.getValue({name: "salesrep",summary: "GROUP"});
   var taxTotal = result.getValue({name: "taxtotal",summary: "SUM"});
   var total = result.getValue({name: "total",summary: "SUM"});
   var totalAmountForRep = result.getValue({name: "formulacurrency",summary: "SUM"}) || 0;
   

// Store the amount for the corresponding sales rep ID
todaySalesAmount[salesRep] = totalAmountForRep;

log.debug(' inside sales rep id  values',todaySalesAmount[salesRep] )
    return true;
});
// Loop through the `todaySalesAmount` object to log or process each sales rep's total
Object.keys(todaySalesAmount).forEach(function (salesRep) {
   log.debug("Sales Rep: " + salesRep, "Total Amount: " + todaySalesAmount[salesRep]);
});
   }

return {
   onRequest: onRequest,
 };
});
 
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
        //     var AmountLessthen30 = parseFloat(result.getValue({ name: "debitfxamount", summary: "SUM" })) || 0;
        //     // Store the amount for the corresponding sales rep ID
        //     lessthen30[salesRepId] = AmountLessthen30;

        //     return true; // Continue iteration
        // });

        // // Log the sales rep amounts
        // log.debug("Sales Rep Today's Sales Amounts", lessthen30);

