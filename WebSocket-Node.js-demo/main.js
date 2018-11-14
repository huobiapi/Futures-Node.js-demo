const readline = require('readline');
const demo = require('./demo');
const config = require('config');
const pako = require('pako');
const WebSocket = require('ws');

var rl = readline.createInterface(process.stdin, process.stdout);

var recursiveAsyncReadLine = function () {
    var ws = new WebSocket(config.huobi.ws_url_prex);
    ws.on('open', () => {
        console.log('socket open succeed. input your command, or "h" to get help');
    });
    ws.on('close', () => {
        console.log('socket close succeed.');
    });
    ws.on('message', (data) => {
        let text = pako.inflate(data, {
            to: 'string'
        });
        let msg = JSON.parse(text);
        if (msg.ping) {
            ws.send(JSON.stringify({
                pong: msg.ping
            }));
        } else if (msg.tick) {
            console.log(msg);
            // handle(msg);
        } else {
            console.log(text);
        }
    });
    rl.question('Command: ', function (answer) {
        switch (answer){
            case 'exit':
              ws.close();
              return rl.close();
            case 's1':
            case 's2':
            case 's3':
              demo.run_sub(ws, answer);break;  
            case 'r1':
            case 'r2':
              demo.run_req(ws, answer);break;  
            case 'h':
              console.log('Req请求指令列表如下:');
              var getIntfs = config.ws_interfaces.ws_req;
              getIntfs.forEach(e => {
                console.log(e.tip, e.intf_no);
              });
              console.log('Ws注册指令列表如下:');
              var postIntfs = config.ws_interfaces.ws_sub;
              postIntfs.forEach(e => {
                console.log(e.tip, e.intf_no);
              });
              break;  

            default:
              console.log('请输入指令, 比如s1, s2, s1, r1, r2..., 指令列表请输入h, 退出输入exit');break;  
        }
      (ws.readyState === WebSocket.OPEN) && ws.close();
      recursiveAsyncReadLine(); //Calling this function again to ask new question
    });
  };

recursiveAsyncReadLine(); 