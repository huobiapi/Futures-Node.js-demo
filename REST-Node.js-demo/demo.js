const hbsdk = require('./sdk/hbsdk');
var config = require('config');
var url = require('url');

function runget(intf_no) {
    var host_prefix = config.huobi.url_prex;
    var getIntfs = config.interfaces.get_methods;
    var getEle = getIntfs.filter(x=>x.intf_no == intf_no)[0];
    hbsdk.get_intf(getEle.tip, host_prefix + getEle.context_path)
}
function runpost(intf_no) {
    var host_prefix = config.huobi.url_prex;
    var postIntfs = config.interfaces.post_methods;
    var postEle = postIntfs.filter(x=>x.intf_no == intf_no)[0];
    hbsdk.post_intf(postEle)
    // postIntfs.forEach(postEle => {
    //         hbsdk.post_intf(postEle.tip, host_prefix + postEle.context_path)
    // });
}
exports.demoget = runget
exports.demopost = runpost
