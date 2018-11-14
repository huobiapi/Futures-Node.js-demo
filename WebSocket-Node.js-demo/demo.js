const config = require('config');


function ws_subscribe(ws, intf_no) {
    var targetIntf = config.ws_interfaces.ws_sub.filter(x=>x.intf_no == intf_no)[0];
    targetIntf && ws.send(JSON.stringify(targetIntf.sample));
}
function ws_request(ws, intf_no) {
    var targetIntf = config.ws_interfaces.ws_req.filter(x=>x.intf_no == intf_no)[0];
    targetIntf && ws.send(JSON.stringify(targetIntf.sample));
}

exports.run_sub = ws_subscribe;
exports.run_req = ws_request;
