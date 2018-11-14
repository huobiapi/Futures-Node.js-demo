var readline = require('readline');
var demoget = require('./demo');
var config = require('config');

var rl = readline.createInterface(process.stdin, process.stdout);

var recursiveAsyncReadLine = function () {
    rl.question('Command: ', function (answer) {
        switch (answer){
            case 'exit':
              return rl.close();
            case 'g1':
            case 'g2':
            case 'g3':
            case 'g4':
            case 'g5':
            case 'g6':
            case 'g7':
            case 'g8':
            case 'g9':
              demoget.demoget(answer);break;
            case 'p1':
            case 'p2':
            case 'p3':
            case 'p4':
            case 'p5':
            case 'p6':
            case 'p7':
            case 'p8':
            case 'p9':
            case 'p10':
              demoget.demopost(answer);break;  
            case 'h':
              console.log('Get指令列表如下:');
              var getIntfs = config.interfaces.get_methods;
              getIntfs.forEach(e => {
                console.log(e.tip, e.intf_no);
              });
              console.log('Post指令列表如下:');
              var postIntfs = config.interfaces.post_methods;
              postIntfs.forEach(e => {
                console.log(e.tip, e.intf_no);
              });
              break;  

            default:
              console.log('请输入指令, 比如g1, g2, p1, p2..., 指令列表请输入h, 退出输入exit');break;  
                
        }
      recursiveAsyncReadLine(); //Calling this function again to ask new question
    });
  };

recursiveAsyncReadLine(); 