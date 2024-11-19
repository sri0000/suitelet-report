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
  
                log.debug('Trimmed Period:', trimmedPeriod);
                log.debug('Month Name:', monthName);
                log.debug('Year:', year);

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
           // for 30 days base saved search
           var categorizedAmounts = {};

           var invoiceSearchObj = search.create({
               type: "invoice",
               filters: [
                   ["type", "anyof", "CustInvc"],
                   "AND",
                   ["status", "anyof", "CustInvc:A"],
                   "AND",
                   ["salesrep.salesrep", "is", "T"],
                   "AND",
                   ["salesrep", "anyof", salesRepId]
               ],
               columns: [
                   search.createColumn({ name: "invoicenum", summary: "GROUP", label: "Invoice Number" }),
                   search.createColumn({ name: "salesrep", summary: "GROUP", label: "Sales Rep" }),
                   search.createColumn({ name: "amount", summary: "SUM", label: "Amount" }),
                   search.createColumn({ name: "trandate", summary: "GROUP", label: "Transaction Date" })
               ]
           });
           // Import the format module
// var format = require('N/format');

// Get the current date
var today = new Date();
log.debug('Today', today);

// Calculate date ranges
var date30DaysAgo = new Date(today);
date30DaysAgo.setDate(today.getDate() - 30);

var date60DaysAgo = new Date(today);
date60DaysAgo.setDate(today.getDate() - 60);

var date90DaysAgo = new Date(today);
date90DaysAgo.setDate(today.getDate() - 90);

var date180DaysAgo = new Date(today);
date180DaysAgo.setDate(today.getDate() - 180);

// Format calculated dates
var formatted30DaysAgo = format.format({
    value: date30DaysAgo,
    type: format.Type.DATE
});
var formatted60DaysAgo = format.format({
    value: date60DaysAgo,
    type: format.Type.DATE
});
var formatted90DaysAgo = format.format({
    value: date90DaysAgo,
    type: format.Type.DATE
});
var formatted180DaysAgo = format.format({
    value: date180DaysAgo,
    type: format.Type.DATE
});

// Log formatted date ranges
log.debug('Formatted Date Ranges', {
    formatted30DaysAgo: formatted30DaysAgo,
    formatted60DaysAgo: formatted60DaysAgo,
    formatted90DaysAgo: formatted90DaysAgo,
    formatted180DaysAgo: formatted180DaysAgo
});

// Initialize categorized data
var categorizedData = {
    lessThan30: [],
    days31to60: [],
    days61to90: [],
    days91to180: [],
    moreThan180: []
};

invoiceSearchObj.run().each(function (result) {
    var amount = parseFloat(result.getValue({ name: "amount", summary: "SUM" }));
    var transactionDateStr = result.getValue({ name: "trandate", summary: "GROUP" });

  
    // Clean the transaction date string (if needed)
    var cleanDateStr = transactionDateStr.split(' ')[0]; // Retain only the date part
    log.debug('Cleaned Transaction Date', cleanDateStr);

    var transactionDate;
    try {
        // Parse the cleaned date string
        transactionDate = format.parse({
            value: cleanDateStr,
            type: format.Type.DATE
        });

        // Validate parsed date
        if (!transactionDate || isNaN(transactionDate.getTime())) {
            throw new Error('Invalid parsed date: ' + cleanDateStr);
        }

        // Format the parsed transaction date
        var formattedTransactionDate = format.format({
            value: transactionDate,
            type: format.Type.DATE
        });
        log.debug('Formatted Transaction Date', formattedTransactionDate);

    } catch (e) {
        log.error('Date Parsing or Formatting Error', {
            errorMessage: e.message,
            transactionDateStr: transactionDateStr
        });
        return true; // Skip this record and continue with the next one
    }

    // Categorize based on the transaction date
    if (transactionDate >= date30DaysAgo) {
        categorizedData.lessThan30.push(amount);
        log.debug('Less Than 30 Days', {
            amount: amount,
            transactionDate: formattedTransactionDate
        });
    } else if (transactionDate < date30DaysAgo && transactionDate >= date60DaysAgo) {
        categorizedData.days31to60.push(amount);
        log.debug('31 to 60 Days', {
            amount: amount,
            transactionDate: formattedTransactionDate
        });
    } else if (transactionDate < date60DaysAgo && transactionDate >= date90DaysAgo) {
        categorizedData.days61to90.push(amount);
        log.debug('61 to 90 Days', {
            amount: amount,
            transactionDate: formattedTransactionDate
        });
    } else if (transactionDate < date90DaysAgo && transactionDate >= date180DaysAgo) {
        categorizedData.days91to180.push(amount);
        log.debug('91 to 180 Days', {
            amount: amount,
            transactionDate: formattedTransactionDate
        });
    } else {
        categorizedData.moreThan180.push(amount);
        log.debug('More Than 180 Days', {
            amount: amount,
            transactionDate: formattedTransactionDate
        });
    }

    return true; // Continue iteration
});

// Log the final categorized data
log.debug('Final Categorized Data', JSON.stringify(categorizedData));

                       
               

         //sales amount for sales rep
         var todaySalesAmount = {};
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
                            ["status", "anyof", "CustInvc:A"], 
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

                     // Retrieve categorized amounts
    var categorizedData = categorizedAmounts[salesRepId[i]] || {
        lessThan30: [],
        days31to60: [],
        days61to90: [],
        days91to180: [],
        moreThan180: []
    };
   
                    var totalLessThan30 = categorizedData.lessThan30.reduce(function (a, b) {
                        return a + b;
                    }, 0);
                    
                    var totalDays31to60 = categorizedData.days31to60.reduce(function (a, b) {
                        return a + b;
                    }, 0);
                    
                    var totalDays61to90 = categorizedData.days61to90.reduce(function (a, b) {
                        return a + b;
                    }, 0);
                    
                    var totalDays91to180 = categorizedData.days91to180.reduce(function (a, b) {
                        return a + b;
                    }, 0);
                    
                    var totalMoreThan180 = categorizedData.moreThan180.reduce(function (a, b) {
                        return a + b;
                    }, 0);
                    
                
                
                    td = '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;"></td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+name+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding:4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;"></td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+totalLessThan30+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal; align: center; vertical-align: middle; letter-spacing: normal;">'+totalDays31to60+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+totalDays61to90+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+totalDays91to180+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+totalMoreThan180+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+salesForTheDay+'</td>' +
                         '<td style="width: 15px;height:10px; border-right: 1px solid black; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+cumSales+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px;   padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;"></td>'+
                         '<td  style="width: 15px;height:10px;   padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;"></td>'
                
                    tr += ' <tr border-bottom="1"  style="width: 10%;height:2%;">' + td + '</tr>';     
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
                  <td border-right="1" border-bottom="1" rowspan="2" style="width: 15px;height:10px; background-color: rgb(255, 238, 192);padding: 4px; font-weight: bold; font-style: normal; align: center; vertical-align: middle; letter-spacing: normal;">\O/S ason1st of the month</td>\
                  <td border-right="1" colspan="5" style="width: 15px;height:10px; background-color: rgb(255, 238, 192); padding: 4px; align: center; font-weight: bold; font-style: normal; vertical-align: middle; letter-spacing: normal;">\Outstanding Amount in</td>\
               <td  colspan="4" style="width: 15px;height:10px; background-color: rgb(255, 238, 192); padding: 4px; align: center; font-weight: bold; font-style: normal; vertical-align: middle; letter-spacing: normal;">\Collection Lacs</td>\
                </tr>\
                <tr border-bottom="1"  style="background-color: rgb(255, 238, 192);width: 10%;height:2%;">\
                  <td border-right="1" style=" width: 15px;height:10px;  padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">&lt;30 days</td>\
                  <td border-right="1" style=" width: 15px;height:10px;  padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">31 -60 days</td>\
                  <td border-right="1" style=" width: 15px;height:10px;  padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">61-90 days</td>\
                  <td border-right="1" style=" width: 15px;height:10px;  padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">91-180 days</td>\
                  <td border-right="1" style=" width: 15px;height:10px;  padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">&gt;180</td>\
                  <td border-right="1" style=" width: 15px;height:10px;  padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">Day</td>\
                  <td border-right="1" style=" width: 15px;height:10px;  padding:4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">Cumulative as of</td>\
                  <td border-right="1" style=" width: 15px;height:10px;  padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">%</td>\
                  <td  border-right="none" style=" width: 15px;height:10px;  padding: 4px; align: center; font-weight: bold; font-style: normal; letter-spacing: normal; vertical-align: middle;">\Balance Due</td>\
                </tr>\
               '+tr+'\
                    <tr border-bottom="none"  style="width: 10%;height:2%;">\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">\</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: bold; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">\Total</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding:4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">\</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">\</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">\</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal; align: center; vertical-align: middle; letter-spacing: normal;">\</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">\</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">\</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+salesForDayTotal+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+cumsalesTotal+'</td>\
                    <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">\</td>\
                    <td style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">\</td>\
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
            
                
      
