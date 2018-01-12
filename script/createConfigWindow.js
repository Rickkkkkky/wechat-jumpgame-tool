var createConfigWindow = function () {
    var win = new SimpleWindow('configwin', {
        class: 'configwin',
        title: '设置',
        windowSize: {
            width: 320,
            headerHeight: 25,
            bodyHeight: 180
        },
        position: SimpleWindow.POSITION_VERTICALCENTER
    });
    win.setWindowPosition({
        left: 30
    });

    var body = win.getBodyElement();

    body.innerHTML = '<div class="timepxbox">' + 
                         '<label>比例系数 (时间 / 距离) ：</label>' + 
                         '<input type="number" class="timepxinput" value="1.35"/>' + 
                     '</div>' + 
                     /*'<div class="resolutionbox">' + 
                         '<label>分辨率：</label>' + 
                         '<input type="number" class="resolutionxinput" value="1080"/>' + 
                         '<span>&#215;</span>' + 
                         '<input type="number" class="resolutionyinput" value="1920"/>' + 
                     '</div>' + */
                     '<div class="autobox">' + 
                         '<input type="checkbox" class="autoinput" checked="true"/>' + 
                         '<label>自动模式<span>（自动点击按钮）</span></label>' + 
                     '</div>' + 
                     '<div class="initbox">' + 
                         '<div class="initbtn"><span>重启服务</span></div>' + 
                         '<p>(如果无法加载可以点击按钮尝试重新建立连接)</p>' + 
                     '</div>' + 
                     '<div class="okbtn"><span>确定</span></div>';

    body.getElementsByClassName('okbtn')[0]
            .addEventListener('click', win.hide.bind(win), false);

    win.getTimepxParam = function () {
        return this.getBodyElement()
                .getElementsByClassName('timepxinput')[0].value;
    };

    /*win.getResolution = function () {
        var x = this.getBodyElement()
                .getElementsByClassName('resolutionxinput')[0].value;
        var y = this.getBodyElement()
                .getElementsByClassName('resolutionyinput')[0].value;
        return [x, y];
    };*/

    win.enableAutoJump = function () {
        return body.getElementsByClassName('autoinput')[0].checked;
    };

    return win;
}