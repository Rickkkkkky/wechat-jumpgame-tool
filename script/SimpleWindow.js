'use strict';

var SimpleWindow = (function () {
    var _SimpleWindow = function (srcNodeRef, options) {

        var className = '';

        this.getClassName = function () {};

        var wrapper = null;

        this.getWrapperElement = function () {};

        this.getHeaderElement = function () {};

        this.getBodyElement = function () {};

        this.isEnableCloseButton = false;

        this.enableCloseButton = function () {};

        this.disableCloseButton = function () {};

        var windowSize = {
            width: -1,
            headerHeight: -1,
            bodyHeight: -1
        };

        this.getWindowSize = function () {};

        this.setWindowSize = function (size) {};

        var windowPosition = {
            top: -1,
            right: -1,
            bottom: -1,
            left: -1
        };

        var clientSize = {
            width: -1,
            height: -1
        };

        this.getClientSize = function () {};

        this.getWindowPosition = function () {};

        this.setWindowPosition = function (position) {};

        this.isEnableDraggableHeader = false;

        this.enableDraggableHeader = function () {};

        this.disableDraggableHeader = function () {};

        _init.apply(this, [srcNodeRef, options]);

        function _init (srcNodeRef, options) {

            var that = this;

            var className = options.class;

            this.getClassName = function () {
                return className;
            };

            if (typeof srcNodeRef === 'string') {
                wrapper = document.getElementById(srcNodeRef);
            } else if (typeof srcNodeRef === 'object' && srcNodeRef) {
                wrapper = srcNodeRef;
            }
            wrapper.classList.add('spwin-wrap', className);

            wrapper.innerHTML = '<div class=\"spwin-header\">' + 
                                    '<span class=\"spwin-title\">' + 
                                        (options.title || '') + 
                                    '</span>' + 
                                    '<div class=\"spwin-closebtn\"></div>' + 
                                '</div>' + 
                                '<div class=\"spwin-body\"></div>';

            this.getWrapperElement = function () {
                return wrapper;
            };

            this.getHeaderElement = function () {
                return wrapper.getElementsByClassName('spwin-header')[0];
            };

            this.getBodyElement = function () {
                return wrapper.getElementsByClassName('spwin-body')[0];
            };

            this.isEnableCloseButton = false;

            this.enableCloseButton = function () {
                if (!this.isEnableCloseButton) {
                    var closeButton = wrapper.getElementsByClassName(
                        'spwin-closebtn'
                    )[0];
                    closeButton.addEventListener('click', 
                            closeButtonClickHandler, false);
                    this.isEnableCloseButton = true;
                }
            };

            this.disableCloseButton = function () {
                if (this.isEnableCloseButton) {
                    var closeButton = wrapper.getElementsByClassName(
                        'spwin-closebtn'
                    )[0];
                    closeButton.removeEventListener('click', 
                            closeButtonClickHandler, false);
                    this.isEnableCloseButton = false;
                }
            };

            if (typeof options.isEnableCloseButton === 'boolean') {
                if (options.isEnableCloseButton) {
                    this.enableCloseButton();
                }
            } else {
                this.enableCloseButton();
            }

            windowSize.width = 300;
            windowSize.headerHeight = 25;
            windowSize.bodyHeight = 180;

            this.getWindowSize = function () {
                return {
                    width: windowSize.width,
                    height: windowSize.headerHeight + windowSize.bodyHeight,
                    headerHeight: windowSize.headerHeight,
                    bodyHeight: windowSize.bodyHeight
                };
            };

            this.setWindowSize = function (size) {
                if (typeof size === 'object') {
                    if (typeof size.width === 'number') {
                        windowSize.width = size.width;
                    }
                    if (typeof size.headerHeight === 'number') {
                        windowSize.headerHeight = size.headerHeight;
                    }
                    if (typeof size.bodyHeight === 'number') {
                        windowSize.bodyHeight = size.bodyHeight;
                    }
                }
                updateWindowSize();
            };

            this.setWindowSize(options.windowSize);

            clientSize.width = document.body.clientWidth;
            clientSize.height = document.body.clientHeight;

            this.getClientSize = function () {
                return {
                    width: clientSize.width,
                    height: clientSize.height
                };
            };

            this.getWindowPosition = function () {
                var position = {},
                    size = this.getWindowSize();
                if (windowPosition.bottom < 0) {
                    position.top = windowPosition.top;
                    position.bottom = clientSize.height - 
                            windowPosition.top - size.height;
                } else {
                    position.bottom = windowPosition.bottom;
                    position.top = clientSize.height - 
                            windowPosition.bottom - size.height;
                }
                if (windowPosition.right < 0) {
                    position.left = windowPosition.left;
                    position.right = clientSize.width - 
                            windowPosition.left - size.width;
                } else {
                    position.right = windowPosition.right;
                    position.left = clientSize.width - 
                            windowPosition.right - size.width;
                }
                return position;
            };

            this.setWindowPosition = function (position) {
                var size;
                if (typeof position === 'object') {
                    if (typeof position.bottom === 'number') {
                        windowPosition.bottom = position.bottom;
                        windowPosition.top = -1;
                    }
                    if (typeof position.right === 'number') {
                        windowPosition.right = position.right;
                        windowPosition.left = -1;
                    }
                    if (typeof position.top === 'number') {
                        windowPosition.top = position.top;
                        windowPosition.bottom = -1;
                    }
                    if (typeof position.left === 'number') {
                        windowPosition.left = position.left;
                        windowPosition.right = -1;
                    }
                } else if (typeof position === 'string') {
                    size = this.getWindowSize();
                    switch (position) {
                        case SimpleWindow.POSITION_CENTER:
                            windowPosition.top = 
                                    (clientSize.height - size.height) / 2;
                            windowPosition.bottom = -1;
                            windowPosition.left = 
                                    (clientSize.width - size.width) / 2;
                            windowPosition.right = -1;
                        break;

                        case SimpleWindow.POSITION_VERTICALCENTER:
                            windowPosition.top = 
                                    (clientSize.height - size.height) / 2;
                            windowPosition.bottom = -1;
                        break;

                        case SimpleWindow.POSITION_HORIZONTALCENTER:
                            windowPosition.left = 
                                    (clientSize.width - size.width) / 2;
                            windowPosition.right = -1;
                        break;

                        default:
                        break;
                    }
                }
                updateWindowPosition();
            };

            this.setWindowPosition('center');
            this.setWindowPosition(options.position);

            this.enableDraggableHeader = function () {
                if (!this.isEnableDraggableHeader) {
                    var header = this.getHeaderElement();

                    header.addEventListener('mousedown', 
                            windowMoveMousedownHandler, false);
                    document.addEventListener('mouseup', 
                            windowMoveMouseupHandler, false);

                    this.isEnableDraggableHeader = true;

                    header = null;
                }
            };

            this.disableDraggableHeader = function () {
                if (this.isEnableDraggableHeader) {
                    var header = this.getHeaderElement();

                    header.removeEventListener('mousedown', 
                            windowMoveMousedownHandler, false);
                    document.removeEventListener('mouseup', 
                            windowMoveMouseupHandler, false);

                    this.isEnableDraggableHeader = false;

                    header = null;
                }
            };

            if (typeof options.isEnableDraggableHeader === 'boolean') {
                if (options.isEnableDraggableHeader) {
                    this.enableDraggableHeader();
                }
            } else {
                this.enableDraggableHeader();
            }

            function closeButtonClickHandler (evt) {
                that.hide();
            }

            function updateWindowSize () {
                var wrapper = that.getWrapperElement(),

                    header = that.getHeaderElement(),
                    title = header.getElementsByClassName('spwin-title')[0],
                    closeButton = header.
                            getElementsByClassName('spwin-closebtn')[0],
                    subSize = windowSize.headerHeight / 2,

                    body = that.getBodyElement();

                wrapper.style.width = windowSize.width + 'px';
                wrapper.style.height = (windowSize.headerHeight + 
                        windowSize.bodyHeight) + 'px';

                header.style.height = windowSize.headerHeight + 'px';
                title.style.fontSize = subSize + 'px';
                title.style.lineHeight = windowSize.headerHeight + 'px';
                closeButton.style.width = subSize + 'px';
                closeButton.style.height = subSize + 'px';
                closeButton.style.top = windowSize.headerHeight / 4 + 'px';

                body.style.height = windowSize.bodyHeight + 'px';
                body.style.top = windowSize.headerHeight + 'px';

                wrapper = null;
                header = null;
                body = null;
            }

            function updateWindowPosition () {
                var wrapper = that.getWrapperElement();

                wrapper.style.display = 'none';
                if (windowPosition.bottom < 0) {
                    wrapper.style.top = windowPosition.top + 'px';
                    wrapper.style.bottom = 'auto';
                } else {
                    wrapper.style.bottom = windowPosition.bottom + 'px';
                    wrapper.style.top = 'auto';
                }
                if (windowPosition.right < 0) {
                    wrapper.style.left = windowPosition.left + 'px';
                    wrapper.style.right = 'auto';
                } else {
                    wrapper.style.right = windowPosition.right + 'px';
                    wrapper.style.left = 'auto';
                }
                wrapper.style.display = 'block';

                wrapper = null;
            }

            var isMousemoveListenerBinded = false;
            var startOffset = {
                x: -1,
                y: -1
            };
            function windowMoveMousedownHandler (evt) {
                if (!isMousemoveListenerBinded) {
                    document.addEventListener('mousemove', 
                            windowMoveMousemoveHandler, false);

                    var winPos = that.getWindowPosition();
                    startOffset.x = evt.clientX - winPos.left;
                    startOffset.y = evt.clientY - winPos.top;

                    isMousemoveListenerBinded = true;

                    winPos = null;
                }
            }

            function windowMoveMousemoveHandler (evt) {
                if (isMousemoveListenerBinded) {
                    var size = that.getWindowSize();
                    var clientSize = that.getClientSize();
                    var pos = {
                        top: -1,
                        left: -1
                    };
                    pos.top = evt.clientY - startOffset.y;
                    pos.left = evt.clientX - startOffset.x;
                    if (pos.top < 0) {
                        pos.top = 0;
                    } else if (pos.top > clientSize.height - size.height) {
                        pos.top = clientSize.height - size.height;
                    }
                    if (pos.left < 0) {
                        pos.left = 0;
                    } else if (pos.left > clientSize.width - size.width) {
                        pos.left = clientSize.width - size.width;
                    }
                    that.setWindowPosition(pos);

                    size = null;
                    clientSize = null;
                    pos = null;
                }
            }

            function windowMoveMouseupHandler (evt) {
                if (isMousemoveListenerBinded) {
                    document.removeEventListener('mousemove', 
                            windowMoveMousemoveHandler, false);

                    isMousemoveListenerBinded = false;
                }
            }

        }

    };

    _SimpleWindow.prototype = {

        show: function () {
            this.getWrapperElement().style.display = 'block';
        },

        hide: function () {
            this.getWrapperElement().style.display = 'none';
        }

    };

    return _SimpleWindow;
})();

SimpleWindow.POSITION_CENTER = 'center';
SimpleWindow.POSITION_VERTICALCENTER = 'veritcalcenter';
SimpleWindow.POSITION_HORIZONTALCENTER = 'horizontalcenter';