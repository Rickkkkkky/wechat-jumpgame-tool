(function () {

var socket = io();
var scaleRatio = 1;
var imgInfo = {};
var img = null;
var sscvs = document.getElementById('sscvs');
var ssctx = sscvs.getContext('2d');
var ptcvs = document.getElementById('ptcvs');
var ptctx = ptcvs.getContext('2d');
var bbox = null;
var startPt = {
    x: -1,
    y: -1
};
var endPt = {
    x: -1,
    y: -1
};
var startDrawable = false;
var endDrawable = false;
var glbox = document.getElementById('guidlinebox');
var hgl = document.getElementById('hgl');
var vgl = document.getElementById('vgl');
glbox.addEventListener('mousemove', updateGuidline, false);
glbox.addEventListener('click', canvasClickHandler, false);

socket.on('jump succeed', updateScreenshot);
socket.on('failed loading', failedLoading);

var tipsBox = document.getElementById('tipsbox');
var tips = document.getElementById('tips');
var cancelBtn = document.getElementById('cancelbtn');
cancelBtn.addEventListener('click', cancelBtnClickHandler, false);

var capBtn = document.getElementById('screencapbtn');
capBtn.addEventListener('click', updateScreenshot, false);

var startPtBtn = document.getElementById('startptbtn');
var startPtCoord = document.getElementById('startptcoord');
startPtBtn.addEventListener('click', startPtBtnClickHandler, false);

var endPtBtn = document.getElementById('endptbtn');
var endPtCoord = document.getElementById('endptcoord');
endPtBtn.addEventListener('click', endPtBtnClickHandler, false);


var jumpBtn = document.getElementById('jumpbtn');
jumpBtn.addEventListener('click', jump, false);

var loadingBox = document.getElementById('loadingbox');
loadingBox.classList.add('loading-hide');
var loadingSpan = document.getElementById('loadingspan');

var configWin = createConfigWindow();

var initBtn = configWin.getWrapperElement().getElementsByClassName('initbtn')[0];
initBtn.addEventListener('click', updateSize, false);

var configBtn = document.getElementById('configbtn');
configBtn.addEventListener('click', configBtnClickHandler, false);

updateSize();

function updateSize () {
    showLoadingBox('正在连接手机...');
    socket.emit('update size', adaptSize);
}

function adaptSize (info) {
    if (typeof info === 'object') {
        var innerHeight = window.innerHeight,
            height = info.height,
            innerWidth = window.innerWidth,
            width = info.width;

        imgInfo = info;
        console.log(info);

        scaleRatio = (innerHeight - 60) / height;

        if ((innerWidth - 660) < width * scaleRatio) {
            scaleRatio = (innerWidth - 660) / width;
        }

        imgInfo.dWidth = width * scaleRatio;
        imgInfo.dHeight = height * scaleRatio;
        sscvs.width = imgInfo.dWidth;
        sscvs.height = imgInfo.dHeight;
        ptcvs.width = imgInfo.dWidth;
        ptcvs.height = imgInfo.dHeight;
        glbox.style.width = imgInfo.dWidth + 'px';
        glbox.style.height = imgInfo.dHeight + 'px';

        bbox = ptcvs.getBoundingClientRect();

        console.log(scaleRatio);

        hideLoadingBox();

        setTimeout(updateScreenshot, 1000);
    }
}

function updateGuidline (evt) {
    var pt = windowToCanvas(evt.clientX, evt.clientY);
    hgl.style.top = pt.y + 'px';
    vgl.style.left = pt.x + 'px';
}

function cancelBtnClickHandler () {
    hideTipsBox();
    startDrawable = false;
    endDrawable = false;
}

function updateScreenshot () {
    showLoadingBox('正在窃取手机数据...');
    clearCanvas();
    socket.emit('capture screen', function () {
        img = new Image();  
        img.src = "../jumphack-screencap.png?t=" + new Date().getTime();  
        img.onload = function() {
            ssctx.drawImage(img, 0, 0, imgInfo.dWidth, imgInfo.dHeight);
            hideLoadingBox();

            if (configWin.enableAutoJump()) {
                clickSimulation(startPtBtn);
            }
        };
    });
}

function failedLoading (text) {
    showLoadingBox(text);
    setTimeout(hideLoadingBox, 5000);
}

function startPtBtnClickHandler () {
    startDrawable = true;
    endDrawable = false;
    showTipsBox('请选择起点（小人的屁股）');
}

function endPtBtnClickHandler () {
    endDrawable = true;
    startDrawable = false;
    showTipsBox('请选择落点');
}

function canvasClickHandler (evt) {
    if (startDrawable) {
        drawStartPoint(evt.clientX, evt.clientY);
        startDrawable = false;
    } else if (endDrawable) {
        drawEndPoint(evt.clientX, evt.clientY);
        endDrawable = false;
    }
}

function jump (evt) {
    if (startPt.x > 0 && startPt.y > 0 && endPt.x > 0 && endPt.y > 0) {
        var distance = Math.sqrt(Math.pow(startPt.x - endPt.x, 2) + 
                Math.pow(startPt.y - endPt.y, 2)) / scaleRatio;
        var time = distance * configWin.getTimepxParam();
        console.log(distance);
        console.log(time);
        showLoadingBox('正在起飞中...');
        socket.emit('jump', time);   
    } else if (startPt.x < 0 || startPt.y < 0) {
        showLoadingBox('请选择起点');
        setTimeout(hideLoadingBox, 5000);
    } else {
        showLoadingBox('请选择终点');
        setTimeout(hideLoadingBox, 5000);
    }
}

function configBtnClickHandler (evt) {
    var wrapper = configWin.getWrapperElement();
    if (wrapper.style.display !== 'none') {
        configWin.hide();
    } else {
        configWin.show();
    }
    wrapper = null;
}

function drawStartPoint (winX, winY) {
    var pt = windowToCanvas(winX, winY);
    if (startPt.x > 0 && startPt.y > 0) {
        clearPointsCanvas();
        if (endPt.x > 0 && endPt.y > 0) {
            ptctx.fillStyle = 'rgba(135, 223, 66, 0.9)';
            drawPoint(endPt);
        }
    }
    ptctx.fillStyle = 'rgba(223, 76, 66, 0.9)';
    drawPoint(pt);
    startPt = pt;
    startPtCoord.innerHTML = '起点坐标：(' + pt.x + ', ' + pt.y + ')';

    hideTipsBox();

    if (configWin.enableAutoJump()) {
        clickSimulation(endPtBtn);
    }
}

function drawEndPoint (winX, winY) {
    var pt = windowToCanvas(winX, winY);
    if (endPt.x > 0 && endPt.y > 0) {
        clearPointsCanvas();
        if (startPt.x > 0 && startPt.y > 0) {
            ptctx.fillStyle = 'rgba(223, 76, 66, 0.9)';
            drawPoint(startPt);
        }
    }
    ptctx.fillStyle = 'rgba(135, 223, 66, 0.9)';
    drawPoint(pt);
    endPt = pt;
    endPtCoord.innerHTML = '落点坐标：(' + pt.x + ', ' + pt.y + ')';

    hideTipsBox();

    if (configWin.enableAutoJump()) {
        clickSimulation(jumpBtn);
    }
}

function drawPoint (pt) {
    ptctx.beginPath();
    ptctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2, false);
    ptctx.fill();
}

function clearCanvas () {
    startPt = {
        x: -1,
        y: -1
    };
    endPt = {
        x: -1,
        y: -1
    };
    clearScreenshotCanvas();
    clearPointsCanvas();
}

function clearScreenshotCanvas () {
    ssctx.clearRect(0, 0, imgInfo.dWidth, imgInfo.dHeight);
}

function clearPointsCanvas () {
    startPtCoord.innerHTML = '起点坐标：(xxx, xxx)';
    endPtCoord.innerHTML = '落点坐标：(xxx, xxx)';
    ptctx.clearRect(0, 0, imgInfo.dWidth, imgInfo.dHeight);
}

function showTipsBox (text) {
    tipsBox.classList.remove('tipsbox-hide');
    tips.innerHTML = text;
}

function hideTipsBox () {
    tipsBox.classList.add('tipsbox-hide');
}

function showLoadingBox (text) {
    loadingSpan.innerHTML = text;
    loadingBox.classList.remove('loading-hide');
}

function hideLoadingBox () {
    loadingBox.classList.add('loading-hide');
}

function clickSimulation (btn) {
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, true, document.defaultView, 
            0, 0, 0, 0, 0, false, false, false, false, 0, null);
    btn.dispatchEvent(evt);
}

function windowToCanvas (x, y) {
    return {
        x : (x - bbox.left) * (ptcvs.width / bbox.width),
        y : (y - bbox.top) * (ptcvs.height / bbox.height)
    };
}

})();