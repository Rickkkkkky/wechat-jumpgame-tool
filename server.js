const app = require('http').createServer(createServerHandler);
const io = require('socket.io').listen(app);
const imageinfo = require('imageinfo');
const fs = require('fs');
const { URL } = require('url');
const { exec } = require('child_process');

app.listen(8013, 'localhost', function () {
    console.log('Serving HTTP on localhost port 8013 ...');
});

io.on('connection', function (socket) {
    console.log('Socket sucessfully connected.');

    socket.on('update size', updateSize);
    socket.on('capture screen', updateScreenshot);
    socket.on('jump', pressScreen);

    function updateSize (handler) {
        console.log('Try to initialize device.');
        console.log('Try to kill server.');
        exec('adb kill-server', function (err) {
            if (err) {
                emitFailedLoading('启动服务时出现了错误，请尝试重启服务');
                console.log('Error in killing server.\r\n', err);
            } else {
                console.log('Try to start server.');
                exec('adb start-server', function (err) {
                    if (err) {
                        emitFailedLoading('启动服务时出现了错误，请尝试重启服务');
                        console.log('Error in starting server.\r\n', err);
                    } else {
                        captureScreen(function () {
                            fs.readFile('jumphack-screencap.png', function (err, data) {
                                if (err) {
                                    emitFailedLoading('启动服务时出现了错误，请尝试重启服务');
                                    console.error('Error in reading picture: jumphack-screencap.png\r\n', err);
                                } else {
                                    var info = imageinfo(data);
                                    handler(info);
                                }
                            });
                        });
                    }
                });
            }
        });
    }

    function updateScreenshot (handler) {
        captureScreen(function () {
            handler();
        });
    }

    function captureScreen (callback) {
        console.log('Try to capture screen.')
        exec('adb shell screencap -p /sdcard/jumphack-screencap.png', function (err, stdout, stderr) {
            if (err) {
                emitFailedLoading('尝试截图时出现了错误，请尝试获取截图或重启服务');
                console.error('Error in capturing screen!\r\n', err);
            } else {
                exec('adb pull /sdcard/jumphack-screencap.png ' + __dirname + '/jumphack-screencap.png', function (err) {
                    if (err) {
                        emitFailedLoading('传输文件时出现了错误，请尝试获取截图或重启服务');
                        console.error('Error in pulling screencap picture to client!\r\n', err);
                    } else {
                        if (callback) {callback();}
                    }
                });
            }
        });
    }

    function pressScreen (time) {
        console.log('Try to press screen.');
        exec('adb shell input swipe 400 400 400 400 ' + parseInt(time), function (err) {
            if (err) {
                emitFailedLoading('起跳失败，请尝试重新起跳或重启服务');
                console.error('Error in pressing screen!\r\n', err);
            } else {
                setTimeout(() => socket.emit('jump succeed'), 1000);
            }
        });
    }

    function emitFailedLoading (text) {
        socket.emit('failed loading', text);
    }
});

function createServerHandler (req, res) {
    if (req.url === '/') {
        fs.readFile(__dirname + '/index.html',function (err, data) {  
            if (err) {
              res.writeHead(500);
              res.end('Error loading index.html');
              return;
            }    
            res.writeHead(200, {'Content-Type': 'text/html'});    
            res.end(data);
        });
    } else {
        fs.readFile(__dirname + new URL('http://localhost:8013' + req.url).pathname, function (err, data) {
            if (err) {
                res.writeHead(500);
                res.end('Error loading ' + req.url);
                return;
            }
            res.writeHead(200, {});
            res.end(data);
        })
    }
}