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

                // this is find the fiscal period April to Selected month before month
                var fiscalStartMonth = 3; // April (fiscal year starts in April)
            var reverseMonthMap = {};
            for (var month in monthMap) {
                if (monthMap.hasOwnProperty(month)) {
                    reverseMonthMap[monthMap[month]] = month;
                }
            }
            var selectedMonthIndex = monthMap[monthName];
            // Determine the fiscal year based on the selected month (relative to fiscal start)
            var fiscalYear = (selectedMonthIndex <= fiscalStartMonth) ? year - 1 : year; // Adjust for fiscal year
            // If the user selects February, the fiscal year remains the same
            // Calculate the previous month
            var prevMonthIndex;
            if (selectedMonthIndex === 0) { // If selected month is January
                prevMonthIndex = 11; // Set previous month to December
                fiscalYear = year - 1; // Adjust fiscal year
                // log.debug('the year - 1 is run')
            } else if (selectedMonthIndex === 1) { // If selected month is February
                prevMonthIndex = 0; // Previous month is January
                // log.debug('the  prev month workis run') // No need to adjust fiscal year for February, it stays the same
            } else {
                prevMonthIndex = selectedMonthIndex - 1;
                // log.debug('month - 1 ',prevMonthIndex) // Regular month: just subtract 1 for previous month
            }   
            // Get the previous month name
            var prevMonthName = reverseMonthMap[prevMonthIndex];
            log.debug('Previous month name:', prevMonthName);
            log.debug('Fiscal year:', fiscalYear);
            // Calculate the start and end dates based on fiscal period
            var endyear = (selectedMonthIndex === 0)   ? year - 1 : year;          
            var fiscalStartDate = new Date(fiscalYear, fiscalStartMonth, 1);
            // log.debug( 'correct start date', fiscalStartDate)
            var fiscalEndDate = new Date(endyear, prevMonthIndex + 1, 0); // Last day of selected month - 1
            // log.debug('corrected end date format', fiscalEndDate)
            // Format the start and end dates
            var formattedFiscalStartDate = format.format({
                value: fiscalStartDate,
                type: format.Type.DATE
            });
            var formattedFicalEndDate = format.format({
                value: fiscalEndDate,
                type: format.Type.DATE
            });
            //   Log formatted dates for debugging
            log.debug('Start Date of the Fiscal Month April:', formattedFiscalStartDate);
            log.debug('End Date Month of the Selected Month Before Month:', formattedFicalEndDate);
  
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
                  var monthtotalArray = [];
                  var salesRepId= [];
                  for (var m = 0; m < internalIds.length; m++) {
                      var src_rec1 = record.load({
                          type: 'customrecord_impal_wbt_salesman',
                          id: internalIds[m]
                      });
                  
                      var monthValue = parseFloat(src_rec1.getValue({ fieldId: monthField })) || 0;
                      monthtotalArray.push(monthValue);
                      salesRepName.push(src_rec1.getText("custrecord_impal_sales_executive_m_s"));
                      salesRepId.push(src_rec1.getValue("custrecord_impal_sales_executive_m_s"));
                  }
                  
                  log.debug('Internal IDs length:', internalIds.length);
                  log.debug('Month Total Array:', monthtotalArray);
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
                // Stop further search and processing if no valid sales reps found
                }
               // Use the existing salesRepId array to define salesRepIds dynamically
                var salesRepIds = salesRepId;

                // Initialize salesRepAmounts with 0 for each sales rep ID

                var salesRepAmounts = {}; // Object to map sales rep ID to amount

                salesRepIds.forEach(function(salesRepId) {
                    salesRepAmounts[salesRepId] = 0; // Default to 0 in case there is no data for the sales rep
                });

                var lessThan30 = [];
                var days31to60 = [];
                var days61to90 = [];
                var days91to180 = [];
                var moreThan180 = [];
                
                var invoiceSearchObj = search.create({
                    type: "invoice",
                    settings: [{ "name": "consolidationtype", "value": "ACCTTYPE" }],
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
                        search.createColumn({
                            name: "invoicenum",
                            summary: "GROUP",
                            label: "Invoice Number"
                        }),
                        search.createColumn({
                            name: "salesrep",
                            summary: "GROUP",
                            label: "Sales Rep"
                        }),
                        search.createColumn({
                            name: "amount",
                            summary: "SUM",
                            label: "Amount"
                        }),
                        search.createColumn({
                            name: "trandate",
                            summary: "GROUP",
                            label: "Transaction Date"
                        })
                    ]
                });
                
                var today = new Date();
                log.debug('today', today);
                
                // Initialize arrays to store amounts based on their categorization
                var lessThan30 = [];
                var days31to60 = [];
                var days61to90 = [];
                var days91to180 = [];
                var moreThan180 = [];
                
                invoiceSearchObj.run().each(function (result) {
                    // Get the invoice amount
                    var amount = parseFloat(result.getValue({
                        name: "amount",
                        summary: "SUM"
                    }));
                
                    // Get the transaction date
                    var transactionDateStr = result.getValue({
                        name: "trandate",
                        summary: "GROUP"
                    });
                
                    var transactionDate = new Date(transactionDateStr);
                    log.debug('transactionDate', transactionDate);
                
                    // Calculate the difference in time (milliseconds)
                    var timeDiff = today.getTime() - transactionDate.getTime();
                
                    // Convert the time difference into days
                    var daysDifference = Math.floor(timeDiff / (1000 * 3600 * 24));
                
                    log.debug('daysDifference', daysDifference);
                
                    // Categorize based on the days difference
                    if (daysDifference < 30) { // < 30 days (same month or within the last 30 days)
                        lessThan30.push(amount);
                    } else if (daysDifference >= 31 && daysDifference <= 60) { // 31–60 days (previous month)
                        days31to60.push(amount);
                    } else if (daysDifference >= 61 && daysDifference <= 90) { // 61–90 days (two months back)
                        days61to90.push(amount);
                    } else if (daysDifference >= 91 && daysDifference <= 180) { // 91–180 days
                        days91to180.push(amount);
                    } else { // > 180 days
                        moreThan180.push(amount);
                    }
                
                    return true; // Continue iteration
                });
                
                log.debug("Categorized Invoice Amounts - < 30 days", lessThan30);
                log.debug("Categorized Invoice Amounts - 31 to 60 days", days31to60);
                log.debug("Categorized Invoice Amounts - 61 to 90 days", days61to90);
                log.debug("Categorized Invoice Amounts - 91 to 180 days", days91to180);
                log.debug("Categorized Invoice Amounts - > 180 days", moreThan180);
                
                // Now you can use the arrays to build your table as needed
                
                var tr = '';
                var td = '';
                var serialNumber = 1;
                
                var less30 = 0;
                var more31to60 = 0;
                var more61to90 = 0;
                var more91to180 =0;
                var more180 =0;
                for (var i = 0; i < internalIds.length; i++) {
                    less30 = lessThan30[i] || 0;
                    more31to60 = days31to60[i] || 0;
                    more61to90 = days61to90[i] || 0;
                    more91to180 = days91to180[i] || 0;
                    more180 = moreThan180[i] || 0;
                
                    td = '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">' + serialNumber + '</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">' + salesRepName[i] + '</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding:4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;"></td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">' + less30 + '</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal; align: center; vertical-align: middle; letter-spacing: normal;">' + more31to60 + '</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">' + more61to90 + '</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+more91to180+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">'+more180+'</td>' +
                         '<td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;"></td>' +
                         '<td style="width: 15px;height:10px; border-right: 1px solid black; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;"></td>' +
                         '<td  style="width: 15px;height:10px;   padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;"></td>';
                
                    tr += ' <tr border-bottom="1"  style="width: 10%;height:2%;">' + td + '</tr>';
                    serialNumber++;
                }
                
                // log.debug("Generated Table Rows", tr);
                
        
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
        <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">\</td>\
        <td border-right="1" style="width: 15px;height:10px; padding: 4px; font-weight: normal; font-style: normal;align: center; vertical-align: middle; letter-spacing: normal;">\</td>\
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

    