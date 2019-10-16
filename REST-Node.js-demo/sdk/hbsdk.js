var config = require('config');
var CryptoJS = require('crypto-js');
var Promise = require('bluebird');
var moment = require('moment');
var HmacSHA256 = require('crypto-js/hmac-sha256')
var http = require('../framework/httpClient');
var url = require('url');
var config = require('config');
var JSONbig = require('json-bigint');

// const URL = 'https://api.huobipro.com';


const DEFAULT_HEADERS = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36"
}


function sign_sha(method, baseurl, path, data) {
    var pars = [];
    for (let item in data) {
        pars.push(item + "=" + encodeURIComponent(data[item]));
    }
    var p = pars.sort().join("&");
    var meta = [method, baseurl, path, p].join('\n');
    // console.log(meta);
    var hash = HmacSHA256(meta, config.huobi.secret_key);
    var Signature = encodeURIComponent(CryptoJS.enc.Base64.stringify(hash));
    // console.log(`Signature: ${Signature}`);
    p += `&Signature=${Signature}`;
    // console.log(p);
    return p;
}

function get_body() {
    return {
        AccessKeyId: config.huobi.api_key,
        SignatureMethod: "HmacSHA256",
        SignatureVersion: 2,
        Timestamp: moment.utc().format('YYYY-MM-DDTHH:mm:ss'),
    };
}


function call_get(tip, path){
    http.get(path, {
        timeout: 1000,
        headers: DEFAULT_HEADERS
    }).then(data => {
        let json = JSONbig.parse(data);
        if (json.status == 'ok') {
            var outputStr = tip + "......" + path + "\r\n";
            Array.isArray(json.data) ? json.data.forEach(e=>{outputStr += JSONbig.stringify(e)+'\r\n'}): outputStr+=JSONbig.stringify(json);
            console.log(outputStr);
        } else {
            console.log('调用错误', tip, "......",  path, "......", json.data);
        }
    }).catch(ex => {
        console.log('GET', path, '异常', ex, tip, '......', path, "  结束\r\n");
    });
}

function call_post(tip, path, payload, body){
    var payloadPath = `${path}?${payload}`;
        http.post(payloadPath, body, {
            timeout: 1000,
            headers: DEFAULT_HEADERS
        }).then(data => {
            let json = JSONbig.parse(data);
            if (json.status == 'ok') {
                var outputStr = tip + "......" + path + "\r\n";
                Array.isArray(json.data) ? json.data.forEach(e=>{outputStr += JSONbig.stringify(e)+'\r\n'}): outputStr+=JSONbig.stringify(json);
                console.log(outputStr);
            } else {
                console.log(tip + '调用status'+ json.status, json, "\r\n", tip, '......', path, "  结束\r\n");
            }
        }).catch(ex => {
            console.log(tip, '.........', path, "POST", '异常', ex);
        });
}

var HUOBI_PRO = {
    
    get_intf: function(tip, path) {
        return call_get(tip, path);
    },
    post_intf: function(postEle) {
        tip = postEle.tip;
        host_prefix = config.huobi.url_prex;
        path = host_prefix + postEle.context_path;
        var host = url.parse(path).host;
        var cpath = url.parse(path).path;
        var body = Object.assign(get_body(), postEle.req_body);
        var payload = sign_sha('POST', host, cpath, body);
        return call_post(tip, path, payload, body);
    },

  
}

module.exports = HUOBI_PRO;
