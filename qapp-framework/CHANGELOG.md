##### 1.0.0

* 优化对`微信`、`Touch`的适配，例如支持微信和Safari手势回退、Header 适配等。
* 框架内部更改代码目录结构，插件使用和核心包统一的版本号，避免不同版本间的问题。
* 支持自定义选择模块打包（已经提供 gulp 工具）。（例如，手势已经成为一个可选模块）
* 更改了一些逻辑：
 * hash 采用单 `#`，修复 ios 客户端识别问题。
 * 支持配置采用 JSON 形式的参数。
 * 优化 生命周期 和 hash 更改的时机。（注：去除 0.4.8 新加的 opened 事件;在 show 时，location.href 已经改变完成。)
 * 增加 willForward 事件，全局通知页面将要离开。
 * Hy 增加 initFilter 事件，全局通知相关 filter 已经 init。
 * 删除 Modules 逻辑和相应的 View 的 loaded 事件。
 * 与服务端路由支持适配。

##### 新的路由跳转说明

此版本，一个大方面是主要修复了 QApp 在Touch 和  微信端 项目适配的问题，最后采取跳转的方式来适配（hash 跳转和采用pushState方式的 URL 变化，都不能让微信的形成『能用手势回退的历史』）。

```
QApp.config({
	hashSupport: {
		usePath: {
			ext: '.jsp',
			basePath: '/qapp-v1.0.0/demo/'
		}
	}
});
```

使用跳转的形式，需要后端的支持。例如上面的配置：

* View a 的地址是 `/qapp-v1.0.0/demo/a.jsp?param=value`
* View b  的地址是 `/qapp-v1.0.0/demo/b.jsp?param=value`

这时，需要服务器支持: a.jsp 和 b.jsp 都指向 index.jsp 的内容（或者做进一步优化，a.jsp 只加载 View a 的 所需要的 js），使用 struts 或者 nginx 都可以很容易做到这点。

当然，你可以配置 usePath: false，这时就不需要后端支持了。

* View a 的地址是 `/qapp-v1.0.0/demo/index.jsp?_qtid=681237861376#a?param=value`

自动加 timestamp 参数的 query，做强制跳转。

前一种方式，url 更可读，分享出去更美观， [Demo 地址](http://ued.qunar.com/qapp-v1.0.0/demo/)；后一种方式不需要服务端支持，但是 url 不美观， [Demo 地址](http://ued.qunar.com/qapp-v1.0.0/demo/origin.html)。

------

##### 0.4.9

* fixed 在 View 中，调用 this.showWidget 时的错误

##### 0.4.8

* fixed 虚拟按键、解锁屏幕时显示高度不准确的问题。（largeChange 配置改为 autoResize，并默认开启。）
* fixed 手势在特殊情况下代码报错的问题（不影响业务）
* View 增加 opened 事件，用于 open 动作彻底完成后的时间点 （actived 之后，location.href 已经改变完成）

##### 0.4.7

* fixed Module 在 RenderAll 时的问题
* 忽略 docs 目录

##### 0.4.6

* 增加 Router 全局事件
* 移除 ABS 机制
* 优化 删除冗余代码

##### 0.4.5

* 优化 手势开关，彻底关闭手势（不监听）
* fixed QApp.util.removeEvent

##### 0.4.4

* 支持 手势开关配置
* 优化 严格 show、actived、receiveData 事件的顺序
* 优化 config type 默认为 touch，默认取消 手势右滑后退的方式，避免与浏览器行为冲突
* fixed CustomRoot 为 false 时的问题
* fixed 修复自定义事件没有绑定事件之前调用off报错的问题

##### 0.4.3

* fixed 不开 Hash 时，路由回退的 Bug
* fixed 渲染 Widget 时，处理参数名的错误

##### 0.4.2

* 视图支持 this.showWidget 方法，Widget 会伴随 View 销毁
* 支持 __ 开头的用于中间跳转的不进入历史的视图
* 优化 工具库内部分方法

##### 0.4.1

* 增加文档！！！！！！！！！！！！！！！！！！！
* fixed global plugins 添加全局插件失败
* fixed router.goto 的逻辑问题
* fixed queryToJson decodeFormat 时将 undefined 转为 字符串的问题
* fixed 在pc上浏览时，click失效的问题
* fixed 在某些逻辑下 destroy 报错的问题

##### 0.4.0 新的稳定版本

* 路由 Router 优化
* 视图 View 生命周期 优化
* 修复一些底层代码的效率问题
