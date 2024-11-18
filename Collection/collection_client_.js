/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/url', 'N/currentRecord'], function (url, currentRecord) {
    function pageInit(context) {
      log.debug('client also run')
        var rec = currentRecord.get();
       log.debug('rec also run',rec)
      if(!rec){
        alert("record not found")
      }
      else{
        var CustomRecId = rec.id;
 log.debug('CustomRecId ',CustomRecId)
        var suiteletUrl = url.resolveScript({
            scriptId: "customscript_collection_salesman_suitele", 
            deploymentId: "customdeploy_collection_salesman_suitele",
            returnExternalUrl: false,
            params: { 'recordid': CustomRecId }
        });
        log.debug('suiteletUrl',suiteletUrl)
        window.open(suiteletUrl, '_blank');
    }
    }
    return {
        pageInit: pageInit
    };
});