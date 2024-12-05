/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record','N/ui/serverWidget'], function(record,serverWidget) {
    function beforeLoad(context) {
        log.debug('user event run seccessfully')
    if (context.type === context.UserEventType.VIEW || context.type === context.UserEventType.EDIT) {
        var form = context.form;
     
        log.debug("context",context)
        form.addButton({
            id: 'custpage_Filter',
            label: 'Collection',
            functionName: 'pageInit'
        });


        var clientt = form.clientScriptFileId = 14708;
      log.debug('redirected to client',clientt)
    }
}
return {
    beforeLoad: beforeLoad
};
});