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

          //dearler addition and deletion start and end date
var dealerSMI = monthMap[monthName];// Assuming fiscal year starts in March (zero-based index: 2) (SMI selected Month index)
var DealerFiscalStartMonth = 2; // March
var dealerFiscalEndMonth = 2;   // Also March (fixed period)

// Determine fiscal year logic based on selected month
var dealerFiscalYearStart;
var dealerFiscalYearEnd;

if (dealerSMI < DealerFiscalStartMonth) {
    dealerFiscalYearStart = year - 3; // Fiscal year starts two years before for months before March
    dealerFiscalYearEnd = year - 1;   // Fiscal year ends one year before
} else {
    dealerFiscalYearStart = year - 2; // Fiscal year starts one year before for months March and after
    dealerFiscalYearEnd = year;       // Fiscal year ends in the current year
}

// Calculate the fiscal start and end dates
var dealerFiscalStartDate = new Date(dealerFiscalYearStart, DealerFiscalStartMonth, 1); // March 1st of fiscal start year
var dealerFiscalEndDate = new Date(dealerFiscalYearEnd, dealerFiscalEndMonth + 1, 0);  // March 31st of fiscal end year

// Format the dates
var formattedFiscalStartDate = format.format({
    value: dealerFiscalStartDate,
    type: format.Type.DATE
});
var formattedFiscalEndDate = format.format({
    value: dealerFiscalEndDate,
    type: format.Type.DATE
});

// Log the results
log.debug('dealer Addition And Deletion Year Start Date:', formattedFiscalStartDate);
log.debug('dealer Addition And Deletion Year End Date:', formattedFiscalEndDate);

//for added new customer in april to current month
var addedCustSMI = monthMap[monthName];// Assuming fiscal year starts in April (SMI selected Month index)
var addedFiscalStartMonth = 3; // April
var addedFiscalEndMonth = monthNumber;  

// Determine fiscal year logic based on selected month
var addedFiscalYearStart;
var addedFiscalYearEnd;

if (addedCustSMI < addedFiscalStartMonth) {
    addedFiscalYearStart = year - 1; 
    addedFiscalYearEnd = year; 
} else {
    addedFiscalYearStart = year;
    addedFiscalYearEnd = year; 
}

// Calculate the fiscal start and end dates
var addedFiscalStartDate = new Date(addedFiscalYearStart, addedFiscalStartMonth, 1); // April 1st of fiscal start year
var addedFiscalEndDate = new Date(addedFiscalYearEnd, addedFiscalEndMonth + 1, 0);  // April 31st of fiscal end year

// Format the dates
var addformattedFiscalStartDate = format.format({
    value: addedFiscalStartDate,
    type: format.Type.DATE
});
var addformattedFiscalEndDate = format.format({
    value: addedFiscalEndDate,
    type: format.Type.DATE
});


// Log the results
log.debug('dealer Addition And Deletion Year Start Date:', addformattedFiscalStartDate);
log.debug('dealer Addition And Deletion Year End Date:', addformattedFiscalEndDate);
// purchase count >= 8 months a year
//here  actually count the 1 year base like jan - dec month. if current month nov mean dec - nov
  // Adjust for previous month
  var prevMonthsOfYear = monthNumber - 3;
  var prevYear = year;
  
  //end date and year
  var less_3_EndMonth =  monthNumber - 3;
  var less_3_EndYear = year;

  // If the month goes below 0, wrap around to December of the previous year
  if (prevMonthsOfYear < 0) {
      prevMonthsOfYear += 12; // Wrap back to the range [0-11]
      prevYear -= 1;   // Adjust the year
      }
       //end date and year
       if (less_3_EndMonth < 0) {
        less_3_EndMonth += 12; // Wrap back to the range [0-11]
        less_3_EndYear -= 1;   // Adjust the year
        }
  // Calculate the start and end dates for the previous month
  var lessThen3startDate = new Date(prevYear, prevMonthsOfYear, 1);
  // log.debug("Start Date less then <3 months", lessThen3startDate);

  var lessThen3endDate = new Date(less_3_EndYear, monthNumber + 1, 0);
  // log.debug("End Date less then <3 months", lessThen3endDate);

  // Format the dates
  var less3formattedStartDate = format.format({
      value: lessThen3startDate,
      type: format.Type.DATE
  });
  var less3formattedEndDate = format.format({
      value: lessThen3endDate,
      type: format.Type.DATE
  });

  log.debug('Start Date less then <3 months:', less3formattedStartDate);
  log.debug('End Date less then <3 months:', less3formattedEndDate);


  //>= 4 to 7 month customer count
  var prev4To7MonthsOfYear = monthNumber - 7;
  var prev4To7Year = year;
   //end date and year
   var grater_4_To_7_EndMonth =  monthNumber - 3;
   var grater_4_To_7_EndYear = year;

  // If the month goes below 0, wrap around to December of the previous year
  if (prev4To7MonthsOfYear < 0) {
      prev4To7MonthsOfYear += 12; // Wrap back to the range [0-11]
      prev4To7Year -= 1;   // Adjust the year
      }

       //end date and year
       if (grater_4_To_7_EndMonth < 0) {
        grater_4_To_7_EndMonth += 12; // Wrap back to the range [0-11]
        grater_4_To_7_EndYear -= 1; 
        }
  // Calculate the start and end dates for the previous month
  var graterThen4To7startDate = new Date(prev4To7Year, prev4To7MonthsOfYear, 1);
  // log.debug("Start Date grater then 8 months", graterThen4To7startDate);
  var graterThen4To7endDate = new Date(grater_4_To_7_EndYear, grater_4_To_7_EndMonth, 0);
  // log.debug("End Date grater then 8 months", graterThen4To7endDate);

  // Format the dates
  var grater4To7formattedStartDate = format.format({
      value: graterThen4To7startDate,
      type: format.Type.DATE
  });
  var grater4To7formattedEndDate = format.format({
      value: graterThen4To7endDate,
      type: format.Type.DATE
  });

  log.debug('Start Date grater then 4 to 7 months:', grater4To7formattedStartDate);
  log.debug('End Date grater then  4 to 7  months:', grater4To7formattedEndDate);


  //>=8 customer count 
  //>= 4 to 7 month customer count
  var grater8MonthsOfYear = monthNumber - 12;
  var grat8Year = year;


  //end date and year
   var grater_8_EndMonth = monthNumber - 7;
   var grater_8_EndYear = year;
  // If the month goes below 0, wrap around to December of the previous year
  if (grater8MonthsOfYear < 0) {
      grater8MonthsOfYear += 12; // Wrap back to the range [0-11]
      grat8Year -= 1;   // Adjust the year
      }
      //end date and year
      if (grater_8_EndMonth < 0) {
        log.debug('good working if condition ')

        grater_8_EndMonth += 12; // Wrap back to the range [0-11]
        grater_8_EndYear-= 1; 
        }
  // Calculate the start and end dates for the previous month
  var graterThen8startDate = new Date(grat8Year, grater8MonthsOfYear, 1);
  // log.debug("Start Date grater then >=8 months", graterThen8startDate);

  var graterThen8endDate = new Date(grater_8_EndYear, grater_8_EndMonth, 0);
  // log.debug("End Date grater then >=8 months", graterThen8endDate);

  // Format the dates
  var grater8formattedStartDate = format.format({
      value: graterThen8startDate,
      type: format.Type.DATE
  });
  var grater8formattedEndDate = format.format({
      value: graterThen8endDate,
      type: format.Type.DATE
  });

  log.debug('Start Date grater then >=8 months:', grater8formattedStartDate);
  log.debug('End Date grater then  >=8  months:', grater8formattedEndDate);


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
                //white board tracker
                var workingDayForMOn =0;
                var completedWorkDay =0;
                var standupWorkingDay = 0;
                var balance_For_day =0;
                for (var m = 0; m < internalIds.length; m++) {
                    var src_rec1 = record.load({
                        type: 'customrecord_impal_wbt_salesman',
                        id: internalIds[m]
                    });
                
                    var monthValue = parseFloat(src_rec1.getValue({ fieldId: monthField })) || 0;
                    monthtotalArray.push(monthValue);
                    salesRepName.push(src_rec1.getText("custrecord_impal_sales_executive_m_s"));
                    salesRepId.push(src_rec1.getValue("custrecord_impal_sales_executive_m_s"));
                    workingDayForMOn = parseFloat(src_rec1.getValue("custrecord_working_days_for_month") )|| 0;  
                    completedWorkDay = parseFloat(src_rec1.getValue("custrecordsales_completed_working_days") )|| 0;  
                    standupWorkingDay = parseFloat(src_rec1.getValue("custrecord_standup_meeting_working_day_") )|| 0;  
                    balance_For_day = parseFloat(src_rec1.getValue("custrecord_balance_days_for_month_") )|| 0;                    
                  
                  
                  
                }
                
                log.debug('Internal IDs length:', internalIds.length);
                log.debug('Month Total Array:', monthtotalArray);
                log.debug('Sales Rep Names Array:', salesRepName); // Logs the full array of sales rep names
                log.debug('Sales Rep workingDayForMOn:', workingDayForMOn);
                log.debug('Sales Rep completedWorkDay:', completedWorkDay);

                log.debug('Sales Rep standupWorkingDay:', standupWorkingDay);
                log.debug('Sales Rep balance_For_day:', balance_For_day);



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

              var today_SalesRep_Amounts = {}; // Object to store sales rep ID and their amount
              var today_SalesRepName = {};   // Object to store sales rep ID and their names

              var invoiceSearchObj = search.create({
              type: "invoice",
              settings: [{ "name": "consolidationtype", "value": "ACCTTYPE" }],
              filters: [
              ["type", "anyof", "CustInvc"],
              "AND",
              ["salesrep", "anyof", salesRepIds],
              "AND",
              ["trandate", "on", today],
              ],
              columns: [
              search.createColumn({ name: "salesrep", summary: "GROUP", label: "Sales Rep ID" }),
              search.createColumn({ name: "entityid", join: "salesrep", summary: "GROUP", label: "Sales Rep Name" }),
              search.createColumn({name: "debitfxamount",summary: "SUM",label: "Amount (Debit) (Foreign Currency)"})
                  ]
              });

              invoiceSearchObj.run().each(function(result) {
              var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
              var salesRepName = result.getValue({ name: "entityid", join: "salesrep", summary: "GROUP" });
              var totalAmountForRep = parseFloat(result.getValue({ name: "debitfxamount", summary: "SUM" })) || 0;

              // Store the sales rep's name and amount in respective objects
              today_SalesRepName[salesRepId] = salesRepName;
              today_SalesRep_Amounts[salesRepId] = totalAmountForRep;

                  return true;
              });

              log.debug("Sales Rep today amount", today_SalesRep_Amounts);


              //cum sales for the sales rep
              var salesRepAmounts = {};// Object to map sales rep ID to amount

              var invoiceSearchObj = search.create({
                  type: "invoice",
                  settings: [{ "name": "consolidationtype", "value": "ACCTTYPE" }],
                  filters: [
                      ["type", "anyof", "CustInvc"],
                      "AND",
                      ["salesrep", "anyof", salesRepIds],
                      "AND",
                      ["trandate", "within", formattedStartDate, formattedEndDate]
                     ],
                      columns: [
                      search.createColumn({ name: "salesrep", summary: "GROUP", label: "Sales Rep" }),
                      search.createColumn({name: "debitfxamount",summary: "SUM",label: "Amount (Debit) (Foreign Currency)"})
                  ]
              });
              
              var searchResultCount = invoiceSearchObj.runPaged().count;
              log.debug("invoiceSearchObj result count", searchResultCount);
              
              // Run the search and populate salesRepAmounts
              invoiceSearchObj.run().each(function(result) {
                  var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                  var totalAmountForRep = parseFloat(result.getValue({ name: "debitfxamount", summary: "SUM" })) || 0;
                
              
                  // Store the amount for the corresponding sales rep ID
                  salesRepAmounts[salesRepId] = totalAmountForRep;
              

                  return true;
              });
              
              log.debug("Sales Rep Amounts", salesRepAmounts); // Logs amounts for each sales rep ID
              
               // sales for the day for new dealers
               var newDelDateCreationsalesAmounts = {};
               var invoiceSearchObj = search.create({
                   type: "invoice",
                   settings: [{ "name": "consolidationtype", "value": "ACCTTYPE" }],
                   filters: [
                       ["type", "anyof", "CustInvc"],
                       "AND",
                       ["salesrep", "anyof", salesRepIds],
                       "AND",
                       ["trandate", "on", today],
                       "AND",
                       ["customer.custentity_customer_date_creations_", "is", "T"]
                   ],
                   columns: [
                       search.createColumn({ name: "salesrep", summary: "GROUP", label: "Sales Rep" }),
                      search.createColumn({name: "debitfxamount",summary: "SUM",label: "Amount (Debit) (Foreign Currency)"})
                   ]
               });

               var searchResultCount = invoiceSearchObj.runPaged().count;
               log.debug("invoiceSearchObj result count", searchResultCount);

               // Run the search and populate newDelDateCreationsalesAmounts
               invoiceSearchObj.run().each(function(result) {
              var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
              var totalAmountForRep = parseFloat(result.getValue({ name: "debitfxamount", summary: "SUM" })) || 0;
 

              // Store the amount for the corresponding sales rep ID
              newDelDateCreationsalesAmounts[salesRepId] = totalAmountForRep;


                   return true;
               });

               log.debug("Sales Rep Amounts", newDelDateCreationsalesAmounts); // Logs amounts for each sales rep ID

               //new dealers date of creation monthly sales rep amount 
                 // sales for the month for new dealers
                 var cumNewDealersAmount = {};
                 var invoiceSearchObj = search.create({
                                     type: "invoice",
                     settings: [{ "name": "consolidationtype", "value": "ACCTTYPE" }],
                     filters: [
                         ["type", "anyof", "CustInvc"],
                         "AND",
                         ["salesrep", "anyof", salesRepIds],
                         "AND",
                         ["trandate", "within", formattedStartDate, formattedEndDate],
                         "AND",
                         ["customer.custentity_customer_date_creations_", "is", "T"]
                         ],
                     columns: [
                         search.createColumn({ name: "salesrep", summary: "GROUP", label: "Sales Rep" }),
                        search.createColumn({name: "debitfxamount",summary: "SUM",label: "Amount (Debit) (Foreign Currency)"})
                     ]
                 });
 
                 var searchResultCount = invoiceSearchObj.runPaged().count;
                 log.debug("invoiceSearchObj result count", searchResultCount);
 
                 // Run the search and populate cumNewDealersAmount
                 invoiceSearchObj.run().each(function(result) {
                var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                var totalAmountForRep = parseFloat(result.getValue({ name: "debitfxamount", summary: "SUM" })) || 0;
   
 
                // Store the amount for the corresponding sales rep ID
                cumNewDealersAmount[salesRepId] = totalAmountForRep;
 

                     return true;
                 });
 
                 log.debug("Sales Rep Amounts", cumNewDealersAmount); // Logs amounts for each sales rep ID

                   // sales for the fical period start and end month for new dealers
                   var cumFiscalNewDealersAmount = {};
                   var invoiceSearchObj = search.create({
                                       type: "invoice",
                       settings: [{ "name": "consolidationtype", "value": "ACCTTYPE" }],
                       filters: [
                           ["type", "anyof", "CustInvc"],
                           "AND",
                           ["salesrep", "anyof", salesRepIds],
                           "AND",
                           ["trandate", "within", formattedFiscalStartDate, formattedFicalEndDate],
                           "AND",
                           ["customer.custentity_customer_date_creations_", "is", "T"]
                           ],
                       columns: [
                           search.createColumn({ name: "salesrep", summary: "GROUP", label: "Sales Rep" }),
                           search.createColumn({name: "debitfxamount",summary: "SUM",label: "Amount (Debit) (Foreign Currency)"})
                       ]
                   });
   
                   var searchResultCount = invoiceSearchObj.runPaged().count;
                   log.debug("invoiceSearchObj result count", searchResultCount);
   
                   // Run the search and populate cumFiscalNewDealersAmount
                   invoiceSearchObj.run().each(function(result) {
                  var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                  var totalAmountForRep = parseFloat(result.getValue({ name: "debitfxamount", summary: "SUM" })) || 0;
     
   
                  // Store the amount for the corresponding sales rep ID
                  cumFiscalNewDealersAmount[salesRepId] = totalAmountForRep;
   
  
                       return true;
                   });
   
                   log.debug("fiscal month Sales Rep Amounts", cumFiscalNewDealersAmount); // Logs amounts for each sales rep ID

                 //search for the new product find the sales for the day
                    // sales for the day for new dealers
               var newProdect = {};
               var invoiceSearchObj = search.create({
                   type: "invoice",
                   settings: [{ "name": "consolidationtype", "value": "ACCTTYPE" }],
                   filters: [
                       ["type", "anyof", "CustInvc"],
                       "AND",
                       ["salesrep", "anyof", salesRepIds],
                       "AND",
                       ["trandate", "on", today],
                       "AND",
                       ["item.custitem_impal_new_product", "is", "T"]
                      ],
                   columns: [
                       search.createColumn({ name: "salesrep", summary: "GROUP", label: "Sales Rep" }),
                      search.createColumn({name: "debitfxamount",summary: "SUM",label: "Amount (Debit) (Foreign Currency)"})
                   ]
               });

               var searchResultCount = invoiceSearchObj.runPaged().count;
               log.debug("invoiceSearchObj result count", searchResultCount);

               // Run the search and populate newProdect
               invoiceSearchObj.run().each(function(result) {
              var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
              var totalAmountForRep = parseFloat(result.getValue({ name: "debitfxamount", summary: "SUM" })) || 0;
 

              // Store the amount for the corresponding sales rep ID
              newProdect[salesRepId] = totalAmountForRep;


                   return true;
               });

               log.debug("Sales Rep Amounts", newProdect); // Logs amounts for each sales rep ID

                  //search for the new product find the sales for the day
                    // sales for the day for new dealers
                    var cum_newProdect = {};
                    var invoiceSearchObj = search.create({
                        type: "invoice",
                        settings: [{ "name": "consolidationtype", "value": "ACCTTYPE" }],
                        filters: [
                            ["type", "anyof", "CustInvc"],
                            "AND",
                            ["salesrep", "anyof", salesRepIds],
                            "AND",
                            ["trandate", "within", formattedStartDate, formattedEndDate],
                            "AND",
                            ["item.custitem_impal_new_product", "is", "T"]
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
                    log.debug("invoiceSearchObj result count", searchResultCount);
    
                    // Run the search and populate cum_newProdect
                    invoiceSearchObj.run().each(function(result) {
                   var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                   var totalAmountForRep = parseFloat(result.getValue({ name: "debitfxamount", summary: "SUM" })) || 0;
    
                   log.debug('result', result)
                   // Store the amount for the corresponding sales rep ID
                   cum_newProdect[salesRepId] = totalAmountForRep;

                        return true;
                    });
    
                    log.debug("Sales Rep Amounts", cum_newProdect); // Logs amounts for each sales rep ID



                    //dealer addition and deletion 
                    var custCount = {};
                    var invoiceSearchObj = search.create({
                      type: "invoice",
                      settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
                      filters:
                      [
                         ["type","anyof","CustInvc"], 
                         "AND", 
                         ["salesrep.salesrep","is","T"], 
                         "AND", 
                         ["salesrep","anyof",salesRepIds], 
                         "AND", 
                         ["customer.datecreated","within",formattedFiscalStartDate,formattedFiscalEndDate], 
                         "AND", 
                         ["mainline","is","T"]
                      ],
                      columns:
                      [
                         search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                         search.createColumn({name: "entity",summary: "COUNT",label: "Name"})
                      ]
                   });
                   var searchResultCount = invoiceSearchObj.runPaged().count;
                   log.debug("invoiceSearchObj result count",searchResultCount);
                   invoiceSearchObj.run().each(function(result){
                    var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                    var customerCount = parseFloat(result.getValue({ name: "entity", summary: "COUNT" })) || 0;

                    log.debug('result', result);
                    custCount[salesRepId] = customerCount;
                    return true;
                   });
                   log.debug('custCount',custCount)

                 

                      //dealer addition and deletion 
                      var addedCount = {};
                      var invoiceSearchObj = search.create({
                        type: "invoice",
                        settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
                        filters:
                        [
                           ["type","anyof","CustInvc"], 
                           "AND", 
                           ["salesrep.salesrep","is","T"], 
                           "AND", 
                           ["salesrep","anyof",salesRepIds], 
                           "AND", 
                           ["customer.datecreated","within",addformattedFiscalStartDate,addformattedFiscalEndDate], 
                           "AND", 
                           ["mainline","is","T"]
                        ],
                        columns:
                        [
                           search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                           search.createColumn({name: "entity",summary: "COUNT",label: "Name"})
                        ]
                     });
                     var searchResultCount = invoiceSearchObj.runPaged().count;
                     log.debug("invoiceSearchObj result count",searchResultCount);
                     invoiceSearchObj.run().each(function(result){
                      var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                      var addedCustomerCount = parseFloat(result.getValue({ name: "entity", summary: "COUNT" })) || 0;
  
                      log.debug('result', result);
                      addedCount[salesRepId] = addedCustomerCount;
                      return true;
                     });
                     log.debug('addedCount',addedCount)
  
                     // date of closer deleted customer
                     var closerCount ={};
                     var invoiceSearchObj = search.create({
                      type: "invoice",
                      settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
                      filters:
                      [
                         ["type","anyof","CustInvc"], 
                         "AND", 
                         ["salesrep.salesrep","is","T"], 
                         "AND", 
                         ["salesrep","anyof",salesRepIds], 
                         "AND", 
                         ["mainline","is","T"], 
                         "AND", 
                         ["customer.custentity_impal_dat_of_clo","within",addformattedFiscalStartDate,addformattedFiscalEndDate]
                      ],
                      columns:
                      [
                         search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                         search.createColumn({name: "entity",summary: "COUNT",label: "Name"})
                      ]
                   });
                   var searchResultCount = invoiceSearchObj.runPaged().count;
                   log.debug("invoiceSearchObj result count",searchResultCount);
                   invoiceSearchObj.run().each(function(result){
                    var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                      var closerCustomer = parseFloat(result.getValue({ name: "entity", summary: "COUNT" })) || 0;
  
                      log.debug('result', result);
                      closerCount[salesRepId] = closerCustomer;
                      return true;
                     });
                     log.debug('date of closer ',closerCount)
  
                     // Number of dealers billed this month 
                     var noOfDelBilledMonth ={};
                     var invoiceSearchObj = search.create({
                      type: "invoice",
                      settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
                      filters:
                      [
                         ["type","anyof","CustInvc"], 
                         "AND", 
                         ["salesrep.salesrep","is","T"], 
                         "AND", 
                         ["salesrep","anyof",salesRepIds], 
                         "AND", 
                         ["mainline","is","T"],
                         "AND", 
                         ["trandate","within",formattedStartDate,formattedEndDate]
                      ],
                      columns:
                      [
                         search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                         search.createColumn({name: "entity",summary: "COUNT",label: "Name"})
                      ]
                   });
                   var searchResultCount = invoiceSearchObj.runPaged().count;
                   log.debug("invoiceSearchObj result count",searchResultCount);
                   invoiceSearchObj.run().each(function(result){
                    var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                      var numOfDealerBilledMonth = parseFloat(result.getValue({ name: "entity", summary: "COUNT" })) || 0;
  
                      log.debug('result', result);
                      noOfDelBilledMonth[salesRepId] = numOfDealerBilledMonth;
                      return true;
                     });
                     log.debug('number of delers billed this month : ',noOfDelBilledMonth)
  

                          //lessthen 3 month  form the selcted month 
                          var less3count={};

                   var invoiceSearchObj = search.create({
                    type: "invoice",
                    settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
                    filters:
                    [
                       ["type","anyof","CustInvc"], 
                       "AND", 
                       ["salesrep.salesrep","is","T"], 
                       "AND", 
                       ["mainline","is","T"], 
                       "AND", 
                       ["trandate","within",less3formattedStartDate,less3formattedEndDate], 
                       "AND", 
                       ["salesrep","anyof",salesRepIds]
                    ],
                    columns:
                    [
                       search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                       search.createColumn({name: "entity",summary: "COUNT",label: "Name"})
                    ]
                 });
                 var searchResultCount = invoiceSearchObj.runPaged().count;
                 log.debug("invoiceSearchObj result count",searchResultCount);
                 invoiceSearchObj.run().each(function(result){
                  var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                  var lessthe3 = parseFloat(result.getValue({ name: "entity", summary: "COUNT" })) || 0;

                  log.debug('result', result);
                  less3count[salesRepId] = lessthe3;
                  return true;
                 });
                 log.debug('less3count',less3count)
   
                     //greater then 4 = 7 month 
                     var graterThen4 ={};
                     var invoiceSearchObj = search.create({
                      type: "invoice",
                      settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
                      filters:
                      [
                         ["type","anyof","CustInvc"], 
                         "AND", 
                         ["salesrep.salesrep","is","T"], 
                         "AND", 
                         ["salesrep","anyof",salesRepIds], 
                         "AND", 
                         ["mainline","is","T"], 
                         "AND", 
                         ["trandate","within",grater4To7formattedStartDate,grater4To7formattedEndDate]
                      ],
                      columns:
                      [
                         search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                         search.createColumn({name: "entity",summary: "COUNT",label: "Name"})
                      ]
                   });
                   var searchResultCount = invoiceSearchObj.runPaged().count;
                   log.debug("invoiceSearchObj result count",searchResultCount);
                   invoiceSearchObj.run().each(function(result){
                    var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                    var grater4To7 = parseFloat(result.getValue({ name: "entity", summary: "COUNT" })) || 0;
  
                    log.debug('result', result);
                    graterThen4[salesRepId] = grater4To7;
                    return true;
                   });
                   log.debug('graterThen4',graterThen4)


                    //greater then  8 month 
                    var graterThen8 ={};
                    var invoiceSearchObj = search.create({
                     type: "invoice",
                     settings:[{"name":"consolidationtype","value":"ACCTTYPE"}],
                     filters:
                     [
                        ["type","anyof","CustInvc"], 
                        "AND", 
                        ["salesrep.salesrep","is","T"], 
                        "AND", 
                        ["salesrep","anyof",salesRepIds], 
                        "AND", 
                        ["mainline","is","T"], 
                        "AND", 
                        ["trandate","within",grater8formattedStartDate,grater8formattedEndDate]
                     ],
                     columns:
                     [
                        search.createColumn({name: "salesrep",summary: "GROUP",label: "Sales Rep"}),
                        search.createColumn({name: "entity",summary: "COUNT",label: "Name"})
                     ]
                  });
                  var searchResultCount = invoiceSearchObj.runPaged().count;
                  log.debug("invoiceSearchObj result count",searchResultCount);
                  invoiceSearchObj.run().each(function(result){
                   var salesRepId = result.getValue({ name: "salesrep", summary: "GROUP" });
                   var grater8 = parseFloat(result.getValue({ name: "entity", summary: "COUNT" })) || 0;
 
                   log.debug('result', result);
                   graterThen8[salesRepId] = grater8;
                   return true;
                  });
                  log.debug('graterThen8',graterThen8)

              

              function roundToTwoDecimals(value) {
                  return Math.round(value * 100) / 100;
                  }

              var avgDay =0;
              var avgDayTotal=0;
              var currentTargetTillDay =0;
              var currTarDayTotal =0;
              var sales_target_for = 0;
              var total_sales_target_for =0;
              var sales_plus_minus =0;
              var total_Sales_Plus_Minus =0;
              var salesVstarget = 0;
              var totalSalesVstarget = 0;

              //second table variables
              var targetFor6Percent =0;
              var newDealersTotalForDay =0;
              var cumNewDealerTotal=0;
              var percentSalesVsTarget =0;
              var perDealerAchievedVsTarget =0;
              var fiscalCumSalesAmount =0;
              var fiscalCumTotal =0;
              var newDealersSalesTarget =0;
              //3rd table variable
              var target_15_0f_sales = 0;
              var target_15_total= 0;
              var newProSalesForDayTotal = 0;
              var cumNewProductTotal = 0;
              var totalPerSales =0;
              var perSalesAchivedvsTarget = 0; // Initialize to avoid undefined values

              var tr ='';
              var td ='';
              var tr2 = '';
              var td2 = '';
              var tr3 = '';
              var td3 = '';

              var serialNumber = 1;


              var forTheMonth=0;
              //total amount for first tablesales rep
              var monthTotal = 0;
              var todayCalAmount = 0;
              var cumMonTotalAmount = 0;
              var cum_amt_total =0;
              var total_cum_amt_percentage =0;
              

              //dealers addition and deletion 
              var custCountTotal =0;
              var targetForTheFy24to25Total =0;
              var addedCustTotal =0;
              var closerTotal =0;
              var totalNumberOfDealersTotal = 0;
              var noOFDealerTotal =0;
              var less_total =0;
              var grater_4_To_7_Total = 0;
              var grater_8_Total =0;

              for (var i = 0; i < internalIds.length; i++) {
                  //first table sales
                  forTheMonth =monthtotalArray[i]
                  monthTotal += forTheMonth
                  var salesRepId = salesRepIds[i];
                  var today_AmountForRep = parseFloat(today_SalesRep_Amounts[salesRepId] )|| 0;
                  todayCalAmount += today_AmountForRep;
                  var salesRepId = salesRepIds[i];
                  var cum_AmountForRep = parseFloat(salesRepAmounts[salesRepId]) || 0;
                  cumMonTotalAmount += cum_AmountForRep;
                  var salesManName = today_SalesRepName[salesRepId];


                  //second table sales

                   fiscalCumSalesAmount= parseFloat(cumFiscalNewDealersAmount[salesRepId]) || 0;
                   fiscalCumTotal +=fiscalCumSalesAmount;
                   newDealersSalesTarget = fiscalCumTotal*6;
                   log.debug('fiscalCumTotal Amount', fiscalCumTotal);
                   log.debug('fiscal * 6%',newDealersSalesTarget);

                   var newDealersFotDay = parseFloat(newDelDateCreationsalesAmounts[salesRepId]) || 0;
                   newDealersTotalForDay += newDealersFotDay; 

                   var cumNewDealers = parseFloat(cumNewDealersAmount[salesRepId]) || 0;
                   cumNewDealerTotal += cumNewDealers; 

                  cum_amt_total = cum_AmountForRep ? roundToTwoDecimals(cum_AmountForRep / cumMonTotalAmount) : 0;
                  total_cum_amt_percentage += roundToTwoDecimals(cum_amt_total);

                
                   //calculation part variables
                    avgDay=roundToTwoDecimals(forTheMonth/workingDayForMOn)||0;
                    avgDayTotal += roundToTwoDecimals(avgDay);

                    currentTargetTillDay =  roundToTwoDecimals(avgDay*completedWorkDay)||0;
                    currTarDayTotal +=roundToTwoDecimals(currentTargetTillDay);
                  
                    sales_target_for = roundToTwoDecimals(Math.abs(forTheMonth-cum_AmountForRep)/balance_For_day)||0;
                    total_sales_target_for +=roundToTwoDecimals(sales_target_for);
                    
                    sales_plus_minus = roundToTwoDecimals(Math.abs(cum_AmountForRep - currentTargetTillDay));
                    total_Sales_Plus_Minus += roundToTwoDecimals(sales_plus_minus);
                  
                    salesVstarget = roundToTwoDecimals(cum_AmountForRep/forTheMonth) ||0;
                    totalSalesVstarget += salesVstarget;

                  

                        //2table e24 calculation
                        percentSalesVsTarget = avgDayTotal*completedWorkDay*6;
                        //2nd table sales vs target
                        // Avoid division by zero
                        if (percentSalesVsTarget !== 0) {
                          perDealerAchievedVsTarget = cumNewDealerTotal / percentSalesVsTarget;
                        } else {
                          perDealerAchievedVsTarget = 0; // Set default if division is not possible
                        }
    

                    td = '<td align ="center" style="border: 1px solid black; padding: 4px; font-weight: normal;  vertical-align: middle;">' + serialNumber + '</td>' +
                    '<td align ="left" style="border: 1px solid black; padding: 4px; font-weight: normal;  vertical-align: middle;">' + salesRepName[i] + '</td>' +
                    '<td align ="center" style="border: 1px solid black; padding: 4px; font-weight: normal;  vertical-align: middle; background-color: rgb(239, 239, 238);">'+forTheMonth+'</td>' +
                    '<td align ="center" style="border: 1px solid black; padding: 4px; font-weight: normal;  vertical-align: middle;">'+avgDay+'</td>' +
                    '<td align ="center" style="border: 1px solid black; padding: 4px; font-weight: normal;  vertical-align: middle;">'+currentTargetTillDay+'</td>' +
                    '<td align ="center" style="border: 1px solid black; padding: 4px; font-weight: normal;  vertical-align: middle;">'+sales_target_for+'</td>' +
                    '<td align ="center" style="border: 1px solid black; padding: 4px; font-weight: normal;  vertical-align: middle;  background-color: rgb(137, 211, 127)">'+today_AmountForRep+'</td>' +
                    '<td align ="center" style="border: 1px solid black; padding: 4px; font-weight: normal;  vertical-align: middle;  background-color: rgb(137, 211, 127)">' + cum_AmountForRep + '</td>' +
                    '<td align ="center" style="border: 1px solid black; padding: 4px; font-weight: normal;  vertical-align: middle;">'+sales_plus_minus+'</td>' +
                    '<td align ="center" style="border: 1px solid black; padding: 4px; font-weight: normal;  vertical-align: middle;">'+salesVstarget+'%'+'</td>' +
                    '<td align ="center" style="border: 1px solid black; padding: 4px; font-weight: normal;  vertical-align: middle;">'+cum_amt_total+'%'+'</td>';
           
         tr += '<tr>' + td + '</tr>';  
         
        
         
         target_15_0f_sales = forTheMonth*0.15;
         target_15_total += target_15_0f_sales;

         var newProductSalesForDay = parseFloat(newProdect[salesRepId]) || 0;
         newProSalesForDayTotal += newProductSalesForDay;

         var cum_newProductMonth = parseFloat(cum_newProdect[salesRepId]) || 0;
         cumNewProductTotal += cum_newProductMonth;


         if (cum_newProductMonth !== 0) { 
          perSalesAchivedvsTarget = cum_newProductMonth/target_15_0f_sales ;
      } else {
          perSalesAchivedvsTarget = 0; // Default to 0 if division is not possible
      }
      
      totalPerSales += perSalesAchivedvsTarget; // Add to total

           // new product sales report
           td2 =  '<td border-right="1"  border-bottom="1" style="width: 15px;height:10px;  padding: 6px; align: center;">'+serialNumber+'</td>' +
           '<td border-right="1"  border-bottom="1" style="width: 15px;height:10px;  padding: 6px; align: center;">'+salesRepName[i]+'</td>'+
           '<td border-right="1"  border-bottom="1" style="width: 15px;height:10px;  padding: 6px; align: center;">'+roundToTwoDecimals(target_15_0f_sales)+'</td>'+
           '<td border-right="1"  border-bottom="1" style="width: 15px;height:10px;  padding: 6px; align: center;">'+roundToTwoDecimals(newProductSalesForDay)+'</td>'+
           '<td border-right="1"  border-bottom="1" style="width: 15px;height:10px;  padding: 6px; align: center;">'+roundToTwoDecimals(cum_newProductMonth)+'</td>'+
           '<td border-bottom="1" style="width: 15px;height:10px;  padding: 6px; align: center;">'+roundToTwoDecimals(perSalesAchivedvsTarget)+'</td>';

           tr2 += '<tr style="width: 10%;height:2%;">'+ td2 + '</tr>';

          var customer_count = parseFloat(custCount[salesRepId]) || 0;
          custCountTotal += customer_count;

          var targetForTheFy24to25 = customer_count*1.2;
          targetForTheFy24to25Total += targetForTheFy24to25;

          var addedCust = parseFloat(addedCount[salesRepId]) || 0;
          addedCustTotal += addedCust;

          // Check if closerCount[salesRepId] is undefined or invalid
          var closer_customer = closerCount[salesRepId];

          if (closer_customer === undefined || isNaN(parseFloat(closer_customer))) {
              closer_customer = '';  // Set to empty string if undefined or invalid
          } else {
              closer_customer = parseFloat(closer_customer);  // Convert to number if it's valid
          }        
              closerTotal += closer_customer;
          

           var totalNoOfDealers = Math.abs(customer_count + addedCust - closer_customer);
           totalNumberOfDealersTotal += totalNoOfDealers;

           var noOfDealerBilled = parseFloat(noOfDelBilledMonth[salesRepId]) || 0;
           noOFDealerTotal += noOfDealerBilled;
           
           var less_then_3 = parseFloat(less3count[salesRepId]) || 0;
           less_total += less_then_3;

           var grater_then_4_to_7 = parseFloat(graterThen4[salesRepId]) || 0;
           grater_4_To_7_Total += grater_then_4_to_7;

           var grater_then_8 = parseFloat(graterThen8[salesRepId]) || 0;
           grater_8_Total += grater_then_8;
          td3 ='<td  style="width: 15px;height:10px;  padding: 6px; border-right: 1px solid black; border-bottom: 1px solid black; align: center; border-left: 1px solid black;">'+serialNumber+'</td>'+
          '<td  style="width: 15px;height:10px;  padding: 6px; border-right: 1px solid black; border-bottom: 1px solid black; align: center; ">'+salesRepName[i]+'</td>'+
          '<td  style="width: 15px;height:10px;  padding: 6px; border-right: 1px solid black; border-bottom: 1px solid black; align: center; ">'+customer_count+'</td>'+
          '<td  style="width: 15px;height:10px;  padding: 6px; border-right: 1px solid black; border-bottom: 1px solid black; align: center; ">'+Math.round(targetForTheFy24to25)+'</td>'+
          '<td  style="width: 15px;height:10px;  padding: 6px; border-right: 1px solid black; border-bottom: 1px solid black; align: center; ">'+addedCust+'</td>'+
          '<td  style="width: 15px;height:10px;  padding: 6px; border-right: 1px solid black; border-bottom: 1px solid black; align: center; ">'+closer_customer+'</td>'+
          '<td  style="width: 15px;height:10px;  padding: 6px; border-right: 1px solid black; border-bottom: 1px solid black; align: center; ">'+totalNoOfDealers+'</td>'+
          '<td  style="width: 15px;height:10px;  padding: 6px; border-right: 1px solid black; border-bottom: 1px solid black; align: center; ">'+noOfDealerBilled+'</td>'+
          '<td  style="width: 15px;height:10px;  padding: 6px; border-right: 1px solid black; border-bottom: 1px solid black; align: center; ">'+less_then_3+'</td>'+
          '<td  style="width: 15px;height:10px;  padding: 6px; border-right: 1px solid black; border-bottom: 1px solid black; align: center; ">'+grater_then_4_to_7+'</td>'+
          '<td  style="width: 15px;height:10px;  padding: 6px; border-right: 1px solid black; border-bottom: 1px solid black; align: center; ">'+grater_then_8+'</td>'+
          '<td  style="width: 15px;height:10px;  padding: 6px; align: center;  border-bottom: 1px solid black; border-right: 1px solid black;"></td>';

    tr3 += '<tr style="width: 10%;height:2%;">'+ td3 +'</tr>' ;
         serialNumber++;
      
          }

          targetFor6Percent = (total_sales_target_for/100)*6;
          log.debug('newDealersTotalForDay',newDealersTotalForDay)

      }
              var xmlTemplateFile= '<?xml version="1.0"?>\
<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">\
<pdf>\
<head>\
</head>\
<body style="font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 20px; width: 250mm; height: 297mm;">\
<!-- First Table -->\
      <table border="1" style="width: 100%; border-collapse: collapse; margin-bottom: 15px; ">\
        <tr border-bottom="1"  style="background-color: white;width: 10%;height:2%;">\
          <td border-right="1" style=" width: 15px;height:10px; padding: 4px;color:black; font-weight: bold;  align: center; vertical-align: middle;">\WBT 4.2</td>\
           <td border-right="1" colspan="8" style=" width:15px;height:10px;background-color: red; color: white; padding: 4px; font-weight: bold;  align: center; vertical-align: middle;">\WHITE BOARD TRACKER</td>\
           <td  style="width: 15px;height:10px;background-color: #4CAF50; color: black;padding: 4px; font-weight: bold; align: center; vertical-align: middle;">'+monthNames+'</td>\
        </tr>\
        <tr border="1" border-top="none" style="border-bottom:none;color:black;width: 10%;height:2%;">\
          <td border-right="1"  border-top="none" style="  width: 15px;height:10px; padding: 4px;  font-weight: normal;  align: center; vertical-align: middle; background-color: #f2f2f2; ">'+monthNames+'</td>\
          <td border-right="1" border-top="none" style="  width: 15px;height:10px; padding: 4px;  background-color:white ; font-weight: bold;  align: center; vertical-align: middle;">BRANCH NAME</td>\
          <td border-right="1" border-top="none" style="  width: 15px;height:10px;  padding: 4px;  background-color:white ; background-color:white ; background-color:white ; font-weight: normal;  align: center; vertical-align: middle;">\Working days for month</td>\
          <td border-right="1" border-top="none" style="  width: 15px;height:10px;  padding: 4px;  align: center; font-weight: normal;  vertical-align: middle; background-color: #f2f2f2;">'+workingDayForMOn+'</td>\
          <td border-right="1" border-top="none"  style="  width: 15px;height:10px;  padding: 4px;  background-color:white ;font-weight: normal;  align: center; vertical-align: middle;">Standup meeting working day</td>\
          <td border-right="1" border-top="none" style="  width: 15px;height:10px; padding: 4px;  background-color: #4CAF50;align: center; font-weight: normal;  vertical-align: middle; ">'+standupWorkingDay+'</td>\
          <td border-right="1" border-top="none" style="  width: 15px;height:10px; padding: 4px;  background-color:white ;font-weight: normal;  align: center; vertical-align: middle;">Completed working days</td>\
          <td border-right="1" border-top="none" style="  width: 15px;height:10px; padding: 4px;   background-color: #4CAF50;align: center; font-weight: normal;  vertical-align: middle;">'+completedWorkDay+'</td>\
          <td border-right="1" border-top="none" style="  width: 15px;height:10px; padding: 4px;  background-color:white ;font-weight: normal;  align: center; vertical-align: middle;">Balance days for month</td>\
          <td border-top="none"  style="width: 15px;height:10px; padding: 4px;  background-color:white ;align: center; font-weight: normal;  vertical-align: middle;">'+balance_For_day+'</td>\
        </tr>\
      </table>\
<!-- Second Table -->\
<table style="width: 100%; border-collapse: collapse;">\
<!-- Header Row -->\
<tr style="background-color: #4CAF50; color: white;">\
  <td colspan="11" style="align:center;border: 1px solid black; padding: 4px; text-align: center; font-weight: bold;  vertical-align: middle; color: white;  background-color: rgb(108, 102, 218)">Sales</td>\
</tr>\
<!-- Sub-header Rows -->\
<tr style="background-color: #f9f9f9;">\
  <td rowspan="2" style="border: 1px solid black;background-color: #f2f2f2; padding: 4px; font-weight: bold;  text-align: center; vertical-align: middle; background-color: rgb(255, 238, 192);">SI.No</td>\
  <td rowspan="2" style="border: 1px solid black; background-color: #f2f2f2;padding: 4px; font-weight: bold;  text-align: center; vertical-align: middle; background-color: rgb(255, 238, 192);">Sales<br/>Executive M/s</td>\
  <td align ="center" colspan="4" style="border: 1px solid black; padding: 4px;color: white; font-weight: bold;  vertical-align: middle;background-color: rgb(255, 9, 17)">Target Lacs</td>\
  <td align ="center"  colspan="3" style="border: 1px solid black; padding: 4px; font-weight: bold;  vertical-align: middle; color: white;  background-color: rgb(108, 102, 218)">Sales Lacs</td>\
  <td align ="center" colspan="3" style="border: 1px solid black; padding: 4px;  font-weight: bold;  vertical-align: middle; color: white;  background-color: rgb(108, 102, 218)">Cum % of Sales</td>\
</tr>\
<tr style="background-color: #f2f2f2;">\
  <td style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold;  vertical-align: middle; background-color: rgb(255, 238, 192);">For the Month</td>\
  <td style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold;  vertical-align: middle; background-color: rgb(255, 238, 192);">Avg/Day</td>\
  <td style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold;  vertical-align: middle; background-color: rgb(255, 238, 192);">Cum Target till Date-(Avg/Day)</td>\
  <td style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold;  vertical-align: middle; background-color: rgb(255, 238, 192);">Sales<br/>Target for</td>\
  <td style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold;  vertical-align: middle; background-color: rgb(255, 238, 192);">Sales for the Day</td>\
  <td style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold;  vertical-align: middle; background-color: rgb(255, 238, 192);">Cumulative<br/>sales as of</td>\
  <td style="border: 1px solid black; padding:4px; text-align: center; font-weight: bold;  vertical-align: middle; background-color: rgb(255, 238, 192);">Sales Cumulative Plus/Minus</td>\
  <td style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold;  vertical-align: middle; background-color: rgb(255, 238, 192);">Sales vs Target</td>\
  <td style="border: 1px solid black; padding: 4px; text-align: center; font-weight: bold;  vertical-align: middle; background-color: rgb(255, 238, 192);">Cus Salesmen Share</td>\
</tr>\
<!-- Rows with Date Values -->\
<!-- items map -->\
 '+tr+'\
  <!-- total map -->\
    <tr>\
  <td  style="border: 1px solid black; padding: 4px; font-weight: normal; text-align: center; vertical-align: middle;">\</td>\
  <td align = "center" style="border: 1px solid black; padding: 4px; font-weight: bold;  align: center; vertical-align: middle;">\Total</td>\
    <td align = "center" style="border: 1px solid black; padding:4px; font-weight: bold; text-align: center; vertical-align: middle;">'+monthTotal+'</td>\
    <td align = "center" style="border: 1px solid black; padding: 4px; font-weight: bold; text-align: center; vertical-align: middle;">'+avgDayTotal+'</td>\
    <td align = "center" style="border: 1px solid black; padding: 4px; font-weight: bold; text-align: center; vertical-align: middle;">'+currTarDayTotal+'</td>\
    <td align = "center" style="border: 1px solid black; padding: 4px; font-weight: bold; text-align: center; vertical-align: middle;">'+total_sales_target_for+'</td>\
    <td align = "center" style="border: 1px solid black; padding: 4px; font-weight: bold; text-align: center; vertical-align: middle;">'+todayCalAmount+'</td>\
    <td align = "center" style="border: 1px solid black; padding: 4px; font-weight: bold; text-align: center; vertical-align: middle;">'+cumMonTotalAmount+'</td>\
    <td align = "center" style="border: 1px solid black; padding: 4px; font-weight: bold; text-align: center; vertical-align: middle;">'+total_Sales_Plus_Minus+'</td>\
    <td align = "center" style="border: 1px solid black; padding: 4px; font-weight: bold; text-align: center; vertical-align: middle;">'+roundToTwoDecimals(totalSalesVstarget)+'%'+'</td>\
    <td align = "center" style="border: 1px solid black; padding: 4px; font-weight: bold; text-align: center; vertical-align: middle;">'+total_cum_amt_percentage+'%'+'</td>\
</tr>\
</table>\
<table  style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px; top:1%;">\
      <tr style="width: 10%;height:2%;">\
        <td  border="1" border-right="1" colspan="3" style="width: 15px;height:10px;font-weight: bold; background-color: red; color: white;  padding: 8px;align: center;  font-weight: bold; vertical-align: middle;">NEW DEALERS` SALES - TARGET 6% OF SALES</td>\
      </tr>\
      <tr >\
        <td  style="width: 50%;">\
          <table border="1" style="width: 100%; border-collapse: collapse; margin-top:-2%; font-family: Arial, sans-serif; font-size: 12px;">\
            <tr style="width: 10%;height:2%;">\
              <td border-bottom="1" colspan="4" style="width: 15px;height:10px;background-color: rgb(108, 102, 218); color: white;  padding: 8px;align: center;font-weight: bold; vertical-align: middle;">NEW DEALERS` SALES REPORT - Lacs for this month</td>\
            </tr >\
            <tr style="background-color: rgb(255, 238, 192);width: 10%;height:2%;">\
              <td border-bottom="1" border-right="1" style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  vertical-align: middle;">Target 6% of sales for the day</td>\
              <td border-bottom="1" border-right="1" style="width: 15px;height:10px;  padding: 6px; font-weight: bold; vertical-align: middle;">New Dealers` Sales for the day</td>\
              <td border-bottom="1" border-right="1" style="width: 15px;height:10px;  padding: 6px; font-weight: bold; vertical-align: middle;">Cumulative New Dealer Sales</td>\
              <td border-bottom="1" style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  vertical-align: middle;">% sales<br/>achieved Vs target</td>\
            </tr>\
            <tr style="width: 10%;height:2%;">\
              <td  border-right="1" style="width: 15px;height:10px;  padding: 6px; font-weight: normal; align: center; vertical-align: middle;">'+roundToTwoDecimals(targetFor6Percent)+'</td>\
              <td  border-right="1" style="width: 15px;height:10px;  padding: 6px; font-weight: normal; align: center; vertical-align: middle;">'+roundToTwoDecimals(newDealersTotalForDay)+'</td>\
              <td  border-right="1" style="width: 15px;height:10px;  padding: 6px;align: center;font-weight: normal; align: center; vertical-align: middle;">'+roundToTwoDecimals(cumNewDealerTotal)+'</td>\
              <td style="width: 15px;height:10px;  padding: 6px;align: center;font-weight: normal; align: center; vertical-align: middle;">'+roundToTwoDecimals(perDealerAchievedVsTarget)+'%'+'</td>\
            </tr>\
          </table>\
        </td>\
        <td style="width: 15px;height:10px;">\</td>\ <!-- Empty column for spacing -->\
        <td style="width: 50%;">\
          <table border="1" style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px;">\
            <tr style="background-color: rgb(108, 102, 218); color: white;width: 10%;height:2%;">\
              <td border-bottom="1" colspan="4" style="width: 15px;height:10px;color: white; font-weight: bold; padding: 8px;align: center;font-weight: bold; align: center; vertical-align: middle;">\CUM. NEW DEALERS` SALES REPORT - Lacs for this month (till this month)</td>\
            </tr>\
            <tr style="background-color: rgb(255, 238, 192);width: 10%;height:2%;">\
              <td border-right="1"  style="width: 15px;height:10px;  padding: 6px;align: center;font-weight: bold; align: center; vertical-align: middle;">Cum.Branch Sales till last month</td>\
              <td  border-right="1"   style="width: 15px;height:10px;  padding: 6px;align: center;font-weight: bold; align: center; vertical-align: middle;">New Dealers` Sales Target</td>\
              <td  border-right="1"   style="width: 15px;height:10px;  padding: 6px;align: center;font-weight: bold; align: center; vertical-align: middle;">New Dealer Sales</td>\
              <td style="width: 15px;height:10px;  padding: 6px;align: center;font-weight: bold; align: center; vertical-align: middle;">% sales<br/>achieved Vs target</td>\
            </tr>\
            <tr style="width: 10%;height:2%;">\
              <td border-right="1"  style="width: 15px;height:10px; border-top: 1px solid black; padding: 6px; align: center;">'+fiscalCumTotal+'</td>\
              <td border-right="1"  style="width: 15px;height:10px; border-top: 1px solid black; padding: 6px; align: center;">'+newDealersSalesTarget+'</td>\
              <td border-right="1"  style="width: 15px;height:10px; border-top: 1px solid black; padding: 6px; align: center;">0.00</td>\
              <td style="width: 15px; height:10px; border-top: 1px solid black; padding: 6px;align: center;">#DIV/0!</td>\
            </tr>\
          </table>\
        </td>\
      </tr>\
    </table>\
       <!-- last table -->\
        <table border="1"  style="width: 60%; margin-top:20px;border-collapse: collapse; font-family: Arial, sans-serif; font-size: 12px; ">\
            <tr style="width: 10%;height:2%;">\
              <td border-bottom="1" colspan="6" style="width: 15px;height:10px;background-color: rgb(108, 102, 218); color: white; font-weight: bold; padding: 8px; font-weight: bold;  align: center; vertical-align: middle;">NEW PRODUCT SALES  REPORT &#x20b9; Lacs</td>\
            </tr>\
           <tr>\
              <td colspan="6" style="width: 15px;height:10px;font-weight: bold; padding: 8px; font-weight: bold;  align: center; vertical-align: middle;">\
              </td>\
            </tr>\
            <tr border-top="1" style="background-color: rgb(255, 238, 192);width: 10%;height:2%;">\
              <td border-right="1"  border-bottom="1"  style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; vertical-align: middle;">\Sl No</td>\
              <td border-right="1"  border-bottom="1"  style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; vertical-align: middle;">\Sales<br/>Executive M/s</td>\
              <td border-right="1"  border-bottom="1" style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; vertical-align: middle;">\Target 15% of sales </td>\
              <td border-right="1"  border-bottom="1" style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; vertical-align: middle;">\Sales for the day</td>\
              <td border-right="1"  border-bottom="1" style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; vertical-align: middle;">\Cumulative sales</td>\
              <td border-bottom="1" style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; vertical-align: middle;">\% sales achived Vs target</td>\
            </tr>\
           '+tr2+'\
            <tr style="width: 10%;height:2%;">\
              <td border-right="1"  style="width: 15px;height:10px;  padding: 6px; align: center;"></td>\
              <td  border-right="1" style="width: 15px;height:10px;  padding: 6px; align: center; font-weight: bold;">Total</td>\
              <td  border-right="1" style="width: 15px;height:10px;  padding: 6px; align: center; font-weight: bold;">'+(target_15_total).toFixed(2)+'</td>\
              <td  border-right="1" style="width: 15px;height:10px;  padding: 6px; align: center; font-weight: bold;">'+newProSalesForDayTotal+'</td>\
              <td  border-right="1" style="width: 15px;height:10px;  padding: 6px; align: center; font-weight: bold;">'+cumNewProductTotal+'</td>\
              <td style="width: 15px;height:10px;  padding: 6px; align: center; font-weight: bold;">'+totalPerSales.toFixed(2)+'</td>\
            </tr>\
          </table>\
          <table  style="width: 100%; margin-top:20px; font-family: Arial, sans-serif; font-size: 11px; ">\
            <tr style="width: 10%;height:2%; border: none;">\
                <td  colspan="8" style="width: 15px;height:10px; font-weight: bold; padding: 8px; font-weight: bold;  align: center; vertical-align: middle; border-right: 1px solid black; border-bottom: 1px solid black;"></td>\
                <td  colspan="4" style="width: 15px;height:10px; font-weight: bold; padding: 8px; font-weight: bold;  align: center; vertical-align: middle; border-bottom: 1px solid black; border-top:1px solid black; border-right: 1px solid black;">Data updated every quarter for previous 12 months</td>\
              </tr>\
            <tr style="height:2%;">\
              <td style="width: 7px;height:10px; background-color: rgb(255, 238, 192); color: white; padding: 8px; font-weight: bold;  align: center; vertical-align: middle; border-right: 1px solid black; border-left: 1px solid black;"></td>\
              <td style="width: 7px;height:10px; background-color: rgb(255, 238, 192); color: white; padding: 8px; font-weight: bold;  align: center; vertical-align: middle; border-right: 1px solid black;"></td>\
              <td style="width: 7px;height:10px; background-color: rgb(255, 238, 192); color: white; padding: 8px; font-weight: bold;  align: center; vertical-align: middle; border-right: 1px solid black;"></td>\
              <td colspan="3"   border-bottom="1" style="width: 7px; height:10px; background-color: rgb(108, 102, 218); color: white; padding: 8px; align: center; font-weight: bold;  align: center; vertical-align: middle; border-right: 1px solid black;">DEALER	&#32;ADDITION/DELETION</td>\
              <td style="width: 7px;height:10px; background-color: rgb(255, 238, 192); color: white; padding: 8px; font-weight: bold;  align: center; vertical-align: middle; border-right: 1px solid black;"></td>\
              <td style="width: 7px;height:10px; background-color: rgb(255, 238, 192); color: white; padding: 8px; font-weight: bold;  align: center; vertical-align: middle; border-right: 1px solid black;"></td>\
              <td style="width: 7px;height:10px; background-color: rgb(255, 238, 192); color: white; padding: 8px; font-weight: bold;  align: center; vertical-align: middle; border-right: 1px solid black;"></td>\
              <td style="width: 7px;height:10px; background-color: rgb(255, 238, 192); color: white; padding: 8px; font-weight: bold;  align: center; vertical-align: middle; border-right: 1px solid black;"></td>\
              <td style="width: 7px;height:10px; background-color: rgb(255, 238, 192); color: white; padding: 8px; font-weight: bold;  align: center; vertical-align: middle; border-right: 1px solid black;"></td>\
              <td rowspan ="2" style="width: 7px;height:10px; background-color: rgb(255, 238, 192);  padding: 8px; font-weight: bold;  align: center; border-bottom: 1px solid black; border-right: 1px solid black; ">% of Frequent dealers billed to total dealers salesman wise -objective 60% or more </td>\
            </tr>\
            <tr style="background-color: rgb(255, 238, 192); width: 10%; height:2%;">\
              <td style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; border-right: 1px solid black; border-bottom: 1px solid black; border-left: 1px solid black;">Sl No</td>\
              <td style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; border-right: 1px solid black; border-bottom: 1px solid black;">Sales Executive M/s</td>\
              <td style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; border-right: 1px solid black; border-bottom: 1px solid black;">Existing no  of<br/>Dealers  end<br/>March &apos; 24 </td>\
              <td style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; border-right: 1px solid black; border-bottom: 1px solid black;">Target for the<br/>FY 24-25 (20% for the entire year)</td>\
              <td style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; border-right: 1px solid black; border-bottom: 1px solid black;">Added till date<br/>this FY 24-25</td>\
              <td style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; border-right: 1px solid black; border-bottom: 1px solid black;">Deleted till date this FY 24-25</td>\
              <td style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; border-right: 1px solid black; border-bottom: 1px solid black;">Total no of<br/>dealers  as<br/>of date </td>\
              <td style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; border-right: 1px solid black; border-bottom: 1px solid black;">Number of Dealers <br/>billed this month<br/>till Date</td>\
              <td style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; border-right: 1px solid black; border-bottom: 1px solid black;">Frequent dealercount purchase &gt;<br/>= 8 months  a year</td>\
              <td style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; border-right: 1px solid black; border-bottom: 1px solid black;">Periodic dealer<br/>count<br/>purchase >= 4 to 7 months a year</td>\
              <td style="width: 15px;height:10px;  padding: 6px; font-weight: bold;  align: center; border-right: 1px solid black; border-bottom: 1px solid black; border-right: 1px solid black;">Occasional dealer count Purchase &lt;=3 months a year</td>\
           </tr>\
           '+tr3+'\
            <tr style="width: 10%;height:2%;">\
              <td  style="width: 15px;height:10px;  padding: 6px; align: center; border-right: 1px solid black; border-bottom: 1px solid black; border-left: 1px solid black;"></td>\
              <td  style="width: 15px;height:10px;  padding: 6px; align: center; border-right: 1px solid black; border-bottom: 1px solid black; font-weight: bold;">Total</td>\
              <td  style="width: 15px;height:10px;  padding: 6px; align: center; border-right: 1px solid black; border-bottom: 1px solid black; font-weight: bold;">'+custCountTotal+'</td>\
              <td  style="width: 15px;height:10px;  padding: 6px; align: center; border-right: 1px solid black; border-bottom: 1px solid black; font-weight: bold;">'+Math.round(targetForTheFy24to25Total)+'</td>\
              <td  style="width: 15px;height:10px;  padding: 6px; align: center; border-right: 1px solid black; border-bottom: 1px solid black; font-weight: bold;">'+addedCustTotal+'</td>\
              <td  style="width: 15px;height:10px;  padding: 6px; align: center; border-right: 1px solid black; border-bottom: 1px solid black; font-weight: bold;">'+closerTotal+'</td>\
              <td  style="width: 15px;height:10px;  padding: 6px; align: center; border-right: 1px solid black; border-bottom: 1px solid black; font-weight: bold;">'+totalNumberOfDealersTotal+'</td>\
              <td  style="width: 15px;height:10px;  padding: 6px; align: center; border-right: 1px solid black; border-bottom: 1px solid black; font-weight: bold;">'+noOFDealerTotal+'</td>\
              <td  style="width: 15px;height:10px;  padding: 6px; align: center; border-right: 1px solid black; border-bottom: 1px solid black; font-weight: bold;">'+less_total+'</td>\
              <td  style="width: 15px;height:10px;  padding: 6px; align: center; border-right: 1px solid black; border-bottom: 1px solid black; font-weight: bold;">'+grater_4_To_7_Total+'</td>\
              <td  style="width: 15px;height:10px;  padding: 6px; align: center; border-right: 1px solid black; border-bottom: 1px solid black; font-weight: bold;">'+grater_8_Total+'</td>\
              <td  style="width: 15px;height:10px;  padding: 6px; align: center; border-bottom: 1px solid black; font-weight: bold; border-right: 1px solid black;"></td>\
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

    
}catch(error) {
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
onRequest: onRequest
};
});
