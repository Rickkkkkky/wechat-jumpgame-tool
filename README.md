# 微信跳一跳小游戏辅助工具

## 运行环境

1. ADB 工具，用于运行手机设备 shell 以及实现计算机与手机设备之间的文件传输。
2. Node.js 运行环境，用于运行程序的服务端。
3. 由于部分模块在安装时需要使用 node-gyp 编译，因此如果 Node 没有自带 node-gyp 模块，需要使用 npm 进行安装。

关于以上运行环境的安装与配置可以在各种搜索引擎上找到帮助，各种环境下可能会有一定的差异，这里就不介绍了。不过一定要确保运行环境正确安装，可以在命令行下通过以下命令测试运行环境是否安装成功。

	// 测试 adb
    adb kill-server
    adb start-server
    adb devices
    
    // 测试 node.js
    node -v
    node-gyp -v

## 安装

下载程序源码并解压。

使用命令行切换到程序根目录。

使用 `npm` 安装程序依赖模块。在命令行输入以下命令进行安装：

	npm install

## 运行程序

在命令行输入以下命令启动服务端：

	node server
	或
	npm run run-server
    
启动以后若看到如下提示则说明服务启动成功：

	Serving HTTP on localhost port 8013 ...

然后通过浏览器（推荐使用 Chrome 浏览器）打开客户端，在地址栏输入：

	localhost:8013

## 操作说明

程序的运行过程：

1. 客户端与服务端建立连接，如果连接失败可以在设置中点击重启服务按钮尝试重新连接。
2. 服务端第一次调用截图功能并将图片信息发送给客户端，客户端根据图片大小自动适应截图显示区域的大小。
3. 客户端触发截图事件，服务端调用截图功能并将截图保存在根目录以后客户端刷新截图显示区域。
4. 客户端选择起点与落点以后根据设置中的比例系数计算按压的时间，并发送给服务端。服务端在手机设备上模拟按压操作。

大致的操作过程参考如下：

1. 在手机设备上开始跳一跳游戏。
2. 打开客户端以后等待连接。如果连接失败可以在设置中尝试重启服务或者刷新页面；如果连接成功客户端会自动请求截图。如果截图失败可以通过侧边栏的获取截图功能手动嗯获取截图。
3. 在自动模式开始的情况下，客户端获取截图以后，可以直接在截图上分别点选起点与终点，当两个点都选择完成以后会自动执行开始起跳功能。如果想要避免误操作可以在设置中关闭自动模式。
4. 可以通过尝试几次跳跃设置一个较为合适的比例系数，不同型号的手机的系数可能不太一样。由于没有条件使用多部手机进行设置，所以无法估算出比例系数与手机分辨率之间的关系。

## 程序运行截图

![等待连接](/pics/1.png)

![截图](/pics/2.png)

![选择起点](/pics/3.png)

![选择落点](/pics/4.png)

![跳跃](/pics/5.png)

![跳跃完成](/pics/6.png)