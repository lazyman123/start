(function(){

	"use strict";

	//=======================================================================
	//             _________       _          _________    __________
	//           / ________ /    /   \       |  _____  |  |  _____  |
	//          / /      / /    / / \ \      | |     | |  | |     | |
	//         / /  Q   / /    / / A \ \     | |  P  | |  | |  P  | |
	//        / /  __  / /    / /_____\ \    | |_____| |  | |_____| |
	//       / /___\ \/ /    /  _______  \   |  _______|  |  _______|
	//      /________  /    / /         \ \  | |          | |
	//               \_\   /_/           \_\ |_|          |_|
	//
	// QApp Mobile Framework
	// Copyright (c) 2014-2015 Edwon Lim and other contributors in YMFE.
	// WebSite: http://ymfe.tech
	//
	// 去哪儿平台移动组荣誉出品，Created By 林洋
	//
	// qapp.js 1.0.0 build at 2016-07-04 By Edwon.lim (edwon.lim@gmail.com)
	//======================================================================
	
	/**
	 * QApp 版本
	 *
	 * @category Base
	 * @property QApp.version
	 * @type {String}
	 * @value "1.0.0"
	 */
	var QApp = {
	        version: '1.0.0'
	    },
	    _packages = QApp._packages = {}; // 存放 package
	
	// 预赋值，利于压缩
	var win = window,
	    doc = document,
	    TRUE = true,
	    FALSE = false,
	    NULL = null,
	    UNDEFINED = void 0;
	
	// 定义包
	function define(space, factory) {
	    _packages[space] = factory();
	}
	
	// 引用包 require
	// 为了避免和 fekit 冲突，所以不用 require
	function r(space) {
	    return _packages[space];
	}
	
	// 标签列表
	var Tags = {
	    app: 'qapp-app',
	    view: 'qapp-view',
	    widget: 'qapp-widget',
	    role: 'qapp-role'
	};
	
	/* ================================== 全局配置 ================================== */
	var Config = {
	    type: 'touch',        // 类型
	    indexView: 'index',   // 默认的首屏 View
	    animate: TRUE,        // 是否动画
	    defaultAnimate: 'moveEnter',   // 默认的动画
	    autoInit: TRUE,       // 是否自动初始化视图
	    hashRouter: TRUE,     // 是否开启 hash router
	    hashSupport: {
	        all: TRUE,        // 是否默认全部
	        exist: [],        // 白名单
	        except: [],       // 黑名单
	        usePath: FALSE
	    },
	    jsonParam: FALSE,     // 是否采用 json 形式参数
	    customRoot: TRUE,     // 是否使用自定义的 Root
	    preventMove: FALSE,    // 是否阻止 touchMove 事件
	    appRoot: NULL,        // Root 节点
	    screen: {
	        rotate: FALSE,    // 是否支持屏幕旋转
	        autoResize: TRUE  // 自动缩放
	    },
	    root: {               // Root 节点位置和大小配置
	        top: 0,
	        right: 0,
	        bottom: 0,
	        left: 0
	    },
	    logLevel: 1          // 日志等级
	};
	
	/**
	 * 环境嗅探
	 *
	 * @property QApp.sniff
	 * @type {Object}
	 * @category Sniff
	 * @value {os: 'ios', ios: true, android: false, iphone: true, ipad: false, ipod: false, imobile: true, osVersion: '8.1.2', osVersionN: 8, pixelRatio: 2, retina: true, pc: false}
	 */
	var _sniff = (function() {
	
	    var ySniff = {
	        browsers: {},
	        info: {}
	    }; // 结果
	    
	    var ua = navigator.userAgent,
	        platform = navigator.platform,
	        android = ua.match(/(Android);?[\s\/]+([\d.]+)?/), // 匹配 android
	        ipad = ua.match(/(iPad).*OS\s([\d_]+)/), // 匹配 ipad
	        ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/), // 匹配 ipod
	        iphone = ua.match(/(iPhone\sOS)\s([\d_]+)/), // 匹配 iphone
	        webApp = ua.indexOf('Safari') == -1; // 匹配 桌面 webApp
	    
	    var browsers = {
	        wechat: ua.match(/(MicroMessenger)\/([\d\.]+)/), // 匹配 weChat
	        alipay: ua.match(/(AlipayClient)\/([\d\.]+)/), // 匹配 支付宝
	        qq: ua.match(/(MQQBrowser)\/([\d\.]+)/), // 匹配 QQ 浏览器
	        weibo: ua.match(/(weibo__)([\d\.]+)/), // 匹配 微博
	        uc: ua.match(/(UCBrower)\/([\d\.]+)/), // 匹配 uc
	        opera: ua.match(/(Opera)\/([\d\.]+)/) // 匹配 opera
	    };
	    
	    // 系统
	    
	    ySniff.ios = ySniff.android = ySniff.iphone = ySniff.ipad = ySniff.ipod = false;
	    
	    if (android) {
	        ySniff.os = 'android';
	        ySniff.osVersion = android[2];
	        ySniff.android = true;
	    }
	    
	    if (ipad || iphone || ipod) {
	        ySniff.os = 'ios';
	        ySniff.ios = true;
	    }
	    
	    if (iphone) {
	        ySniff.osVersion = iphone[2].replace(/_/g, '.');
	        ySniff.iphone = true;
	        ySniff.imobile = true;
	    }
	    
	    if (ipad) {
	        ySniff.osVersion = ipad[2].replace(/_/g, '.');
	        ySniff.ipad = true;
	    }
	    
	    if (ipod) {
	        ySniff.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
	        ySniff.ipod = true;
	        ySniff.imobile = true;
	    }
	    
	    // iOS 8+ changed UA
	    if (ySniff.ios && ySniff.osVersion && ua.indexOf('Version/') >= 0) {
	        if (ySniff.osVersion.split('.')[0] === '10') {
	            ySniff.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
	        }
	    }
	    
	    if (ySniff.osVersion) {
	        ySniff.osVersionN = parseInt(ySniff.osVersion.match(/\d+\.?\d*/)[0]);
	    }
	    
	    // 配置
	    
	    ySniff.pixelRatio = window.devicePixelRatio || 1;
	    
	    ySniff.retina = ySniff.pixelRatio >= 2;
	    
	    // 浏览器
	    for (var key in browsers) {
	        if (browsers[key]) {
	            webApp = false;
	            ySniff.browsers[key] = browsers[key][2];
	        } else {
	            ySniff.browsers[key] = false;
	        }
	    }
	    
	    ySniff.webApp = ySniff.os == 'ios' && webApp;
	    
	    // 其他信息
	    ua.split(' ').forEach(function(item) {
	        var kv = item.split('/');
	        if (kv.length == 2) {
	            ySniff.info[kv[0]] = kv[1];
	        }
	    });
	    
	    // PC
	    ySniff.pc = platform.indexOf('Mac') === 0 || platform.indexOf('Win') === 0 || (platform.indexOf('linux') === 0 && !ySniff.android);
	    
	
	    return ySniff;
	})();
	
	/* ================================== 工具部分 ================================== */
	var __object__ = Object.prototype,
	    __array__ = Array.prototype,
	    toString = __object__.toString,
	    slice = __array__.slice,
	    readyReg = /complete|loaded|interactive/,  // 页面 ready 时的状态
	    elementReg = /Element$/,                   // 节点类型正则
	    svgReg = /^\[object SVG\w*Element\]$/,     // SVG判定
	    whiteSpace = ' ',                          // className 分隔符
	    curId = 1,                                 // id 初始值
	    curZIndex = 1000;                          // zIndex 初始值
	
	// 元素 Bool 属性
	var bools = "autofocus,autoplay,async,allowTransparency,checked,controls,declare,disabled,defer,defaultChecked,defaultSelected,contentEditable,isMap,loop,multiple,noHref,noResize,noShade,open,readOnly,selected",
	    boolMap = {};
	
	bools.replace(/\w+/g, function (name) {
	    boolMap[name.toLowerCase()] = name;
	});
	
	// 检测 css 支持
	var vendors = ['Webkit', '', 'Moz', 'O'],
	    testEl = doc.createElement('div'),
	    supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
	    transformAttr = '',
	    prefix = '', eventPrefix;
	
	vendors.every(function (vendor) {
	    if (testEl.style[vendor + 'TransitionProperty'] !== UNDEFINED) {
	        if (vendor) {
	            prefix = '-' + vendor.toLowerCase() + '-';
	        }
	        eventPrefix = vendor.toLowerCase();
	        return FALSE;
	    }
	});
	
	testEl = NULL;
	
	transformAttr = prefix + 'transform';
	
	function _noop() {} // 空方法
	
	// 获取 obj 的 key 列表
	function keys(obj) {
	    var ret = [],
	        key;
	    for (key in obj) {
	        ret.push(key);
	    }
	    return ret;
	}
	
	// 类型判断
	var class2type = {
	    '[object HTMLDocument]': 'Document',
	    '[object HTMLCollection]': 'NodeList',
	    '[object StaticNodeList]': 'NodeList',
	    '[object IXMLDOMNodeList]': 'NodeList',
	    '[object DOMWindow]': 'Window',
	    '[object global]': 'Window',
	    'null': 'Null',
	    'NaN': 'NaN',
	    'undefined': 'Undefined'
	};
	
	'Boolean,Number,String,Function,Array,Date,RegExp,Window,Document,Arguments,NodeList,Null,Undefined'
	    .replace(/\w+/ig, function (value) {
	        class2type['[object ' + value + ']'] = value;
	    });
	
	
	/**
	 * 类型判断
	 *
	 * @method QApp.util.is
	 * @category Util-Fn
	 * @param {Any} obj 要判断的对象
	 * @param {String=} match 匹配的类型
	 * @return {String|Boolean} 如果match参数存在，则返回是否匹配，如果不存在，则返回类型
	 */
	function getType(obj, match) {
	    var rs = class2type[(obj === NULL || obj !== obj) ? obj :
	            toString.call(obj)] ||
	        (obj && obj.nodeName) || '#';
	    if (obj === UNDEFINED) {
	        rs = 'Undefined';
	    } else if (rs.charAt(0) === '#') {
	        if (obj == obj.document && obj.document != obj) {
	            rs = 'Window';
	        } else if (obj.nodeType === 9) {
	            rs = 'Document';
	        } else if (obj.callee) {
	            rs = 'Arguments';
	        } else if (isFinite(obj.length) && obj.item) {
	            rs = 'NodeList';
	        } else {
	            rs = toString.call(obj).slice(8, -1);
	        }
	    }
	    if (match) {
	        return match === rs;
	    }
	    return rs;
	}
	
	function _isObject(source) {
	    return getType(source, 'Object');
	}
	
	function _isArray(source) {
	    return getType(source, 'Array');
	}
	
	function _isString(source) {
	    return getType(source, 'String');
	}
	
	function _isFunction(source) {
	    return getType(source, 'Function');
	}
	
	function _isElement(obj) {
	    if (obj && obj.nodeType === 1) {       //先过滤最简单的
	        if (obj instanceof Node){          //如果是IE9,则判定其是否Node的实例
	            return TRUE;                   //由于obj可能是来自另一个文档对象，因此不能轻易返回false
	        }
	        return elementReg.test(toString.call(obj));
	    }
	    return FALSE;
	}
	
	function _isNumber(source) {
	    return getType(source, 'Number');
	}
	
	function _isPlainObject(source) {
	    return getType(source, 'Object') && Object.getPrototypeOf(source) === __object__;
	}
	
	function _isEmptyObject(source) {
	    try {
	        return  JSON.stringify(source) === "{}";
	    } catch (e) {
	        return FLASE;
	    }
	}
	
	/**
	 * 扩展
	 *
	 * @method QApp.util.extend
	 * @category Util-Fn
	 * @param {boolen} deep true表示深拷贝，false表示浅拷贝，默认没有此参数
	 * @param {Any} target 需要扩展的对象
	 * @return {Object} 扩展后的对象
	 * @example
	 *    var obj1, obj2, obj3, //定义变量
	 *        deep; //定义一个布尔值
	 *    QApp.util.extend(true, {}, obj1, obj2, obj3); //深拷贝，obj1, obj2, obj3的属性重新生成后放到{}上
	 *
	 *    var obj1, obj2, obj3,//定义变量
	 *        deep;//定义一个布尔值
	 *    QApp.util.extend(obj1, obj2, obj3); //浅拷贝，obj2，obj3的属性被复制到obj1上
	 */
	// extend
	function extend(target, source, deep) {
	    var key;
	    for (key in source) {
	        if (deep && (_isPlainObject(source[key]) || _isArray(source[key]))) {
	            if (_isPlainObject(source[key]) && !_isPlainObject(target[key])) {
	                target[key] = {};
	            }
	            if (_isArray(source[key]) && !_isArray(target[key])) {
	                target[key] = [];
	            }
	            extend(target[key], source[key], deep);
	        } else if (source[key] !== UNDEFINED) {
	            target[key] = source[key];
	        }
	    }
	}
	
	function _extend(target) {
	    var deep,
	        args = slice.call(arguments, 1);
	    if (typeof target == 'boolean') {
	        deep = target;
	        target = args.shift();
	    }
	    args.forEach(function (arg) {
	        extend(target, arg, deep);
	    });
	    return target;
	}
	
	/**
	 * 遍历对象
	 *
	 * @method QApp.util.each
	 * @category Util-Fn
	 * @param {Object} obj 遍历的对象
	 * @param {Function} fn 回调
	 * @example
	 *    var people = {name: 'xiaoming'};
	 *    function fn(key, item){};
	 *    QApp.util.each(obj, fn); //遍历对象，执行函数fn
	 */
	// each
	function _each(obj, fn) {
	    var key;
	    for (key in obj) {
	        fn.call(obj, key, obj[key]);
	    }
	}
	
	/**
	 * 数组化
	 *
	 * @method QApp.util.makeArray
	 * @category Util-Fn
	 * @param {Any} iteration 需要转换的变量
	 * @return {Array|Boolean} 结果数组，如果转化不成功，则返回 false
	 * @example
	 *    //定义一个类数组对象
	 *    var likeArray = {
	 *        0: param1,
	 *        1: param2,
	 *        2: param3,
	 *        length: 3
	 *    };
	 *
	 *    QApp.util.makeArray(likeArray); //返回一个数组，值为(length-1)下标逆序下标数组
	 */
	// MakeArray
	function _makeArray(iterable) {
	    if (!iterable)
	        return FALSE;
	    var n = iterable.length;
	    if (n === (n >>> 0)) {
	        try {
	            return slice.call(iterable);
	        } catch (e) {
	        }
	    }
	    return FALSE;
	}
	
	/**
	 * 延时封装
	 *
	 * @method QApp.util.delay
	 * @category Util-Fn
	 * @param {Function} func 方法
	 * @param {Number} [delay] 延时时间，默认值为0
	 * @return {Number} Timeout的ID
	 * @example
	 *    var time = 1000;
	 *    function fn(){}
	 *    QApp.util.delay(fn, time); // 延迟1s执行函数
	 */
	// Delay
	function _delay(func, delay) {
	    return win.setTimeout(func, delay || 0);
	}
	
	/**
	 * 数组映射对象
	 *
	 * @method QApp.util.associate
	 * @category Util-Fn
	 * @param {Array} arrVal 数组数
	 * @param {Array} arrKey key数组
	 * @return {Object} 对象数据
	 * @example
	 *    //对象属性值数组
	 *    var arrValues = [val1, val2, val3];
	 *    //对象属性名数组
	 *    var arrKeys = [key1, key2, key3];
	 *
	 *    QApp.util.associate(arrValues, arrKeys); // {key1: val1, key2: val2, key3: val3}
	 */
	// Associate
	function _associate(arrVal, arrKey) {
	    var obj = {}, i = 0;
	    for (; i < arrKey.length; i++) {
	        obj[arrKey[i]] = arrVal[i];
	    }
	    return obj;
	}
	
	/**
	 * 对象映射数组
	 *
	 * @method QApp.util.mapping
	 * @category Util-Fn
	 * @param {Object} obj 对象数据
	 * @param {Array} arrKey key数组
	 * @return {Array}  数组数据
	 * @example
	 *    var obj = {
	 *        key1: value1,
	 *        key2: value2,
	 *        key3: value3
	 *    };
	 *    //想要输出对象值的属性数组
	 *    var arrKeys = [key1, key3];
	 *
	 *    QApp.util.mapping(obj, arrKeys);//返回[value1, value3]
	 */
	// Mapping
	function _mapping(obj, arrKey) {
	    var arrVal = [], i = 0;
	    for (; i < arrKey.length; i++) {
	        arrVal[i] = obj[arrKey[i]];
	    }
	    return arrVal;
	}
	
	/**
	 * 获取唯一id
	 *
	 * @method QApp.util.getUniqueID
	 * @category Util-Fn
	 * @return {Number} 唯一的id
	 * @example
	 *    var variable = QApp.util.getUniqueID; //获取到唯一id
	 */
	// UniqueID
	function _getUniqueID() {
	    return curId ++;
	}
	
	/**
	 * 获取自增 z-index
	 *
	 * @method QApp.util.getZIndex
	 * @category Util-Fn
	 * @return {Number} 获取的 z-index
	 * @example
	 *    QApp.util.getZIndex();//获取自增z-index，最小值是1001
	 */
	// zIndex
	function _getZIndex() {
	    return curZIndex++;
	}
	
	/**
	 * 驼峰化
	 *
	 * @method QApp.util.camelCase
	 * @category Util-Fn
	 * @param {String} str 需要转化的字符串
	 * @return {String} 转化后的字符串
	 * @example
	 *    var str = "div-element"; // 定义一个通过 "-" 或 "/" 分割的变量
	 *    QApp.util.camelCase(str);   // 返回divElement
	 */
	// parseString
	function _camelCase(str) {
	    return str.replace(/[-_][^-_]/g, function (match) {
	        return match.charAt(1).toUpperCase();
	    });
	}
	
	/**
	 * 连接化
	 *
	 * @method QApp.util.dasherize
	 * @category Util-Fn
	 * @param {String} str 需要转化的字符串
	 * @return {String} 转化后的字符串
	 * @example
	 *    // 声明一个值为驼峰形式的字符串
	 *    var str = "divElement";
	 *    QApp.util.dasherize(str);  // 返回以 "-" 连接的字符串，div-element
	 */
	// dasherize
	function _dasherize(str) {
	    return str.replace(/([a-z\d])([A-Z])/g, '$1-$2')
	        .replace(/\_/g, '-').toLowerCase();
	}
	
	/**
	 * 清空对象
	 *
	 * @method QApp.util.empty
	 * @category Util-Fn
	 * @param {Object} obj 要清空的对象
	 * @example
	 *    //定义一个对象
	 *    var programmer = {
	 *        name: "missy",
	 *        age: 22
	 *    };
	 *    QApp.util.empty(programmer);//无返回值，对象属性值将被清空。programmer {name:null, age:null}
	 */
	// empty
	function _empty(obj) {
	    var key;
	    for (key in obj) {
	        obj[key] = NULL;
	    }
	}
	
	/**
	 * 对象判空
	 *
	 * @method QApp.util.isNull
	 * @category Util-Fn
	 * @param {Object} obj 要判空的对象
	 * @return {Boolean} 判空结果
	 */
	// isNull
	function _isNull(obj) {
	    return obj === UNDEFINED || obj === NULL;
	}
	
	/**
	 * json数据转换成查询字符串
	 *
	 * @method QApp.util.jsonToQuery
	 * @category Util-Fn
	 * @param {JSON} json 数据
	 * @param {Any} [isEncode] 是否被编码
	 * @return {String} 结果字符串
	 */
	// jsonToQuery
	function encodeFormat(data, isEncode) {
	    data = (data === NULL ? '' : data).toString().trim();
	    return isEncode ? encodeURIComponent(data) : data;
	}
	
	function _jsonToQuery(json, isEncode){
	    var qs = [], k, i, len;
	    for (k in json) {
	        if (_isNull(json[k])) {
	            qs = qs.concat(k);
	        } else if (_isArray(json[k])) {
	            for (i = 0, len = json[k].length; i < len; i++) {
	                if (!_isFunction(json[k][i])) {
	                    qs.push(k + "=" + encodeFormat(json[k][i], isEncode));
	                }
	            }
	        } else if(!_isFunction(json[k]) && (json[k] !== NULL && json[k] !== UNDEFINED)){
	            qs.push(k + "=" + encodeFormat(json[k], isEncode));
	        }
	    }
	    return qs.join('&');
	}
	
	/**
	 * 查询字符串转换成json数据
	 *
	 * @method QApp.util.queryToJson
	 * @category Util-Fn
	 * @param {String} data 数据
	 * @param {Any} [isDecode] 是否被编码
	 * @return {Object} 结果对象
	 */
	// queryToJson
	
	function decodeFormat(data, isDecode){
	    return _isNull(data) ? data : isDecode ? decodeURIComponent(data) : data;
	}
	
	function _queryToJson(qs, isDecode){
	    var qList = qs.trim().split("&"),
	        json = {},
	        i = 0,
	        len = qList.length;
	
	    for (; i < len; i++) {
	        if (qList[i]) {
	            var hash = qList[i].split("="),
	                key = hash[0],
	                value = hash[1];
	            if (!(key in json)) {
	                // 如果缓存堆栈中没有这个数据，则直接存储
	                json[key] = decodeFormat(value, isDecode);
	            } else {
	                // 如果堆栈中已经存在这个数据，则转换成数组存储
	                json[key] = [].concat(json[key], decodeFormat(value, isDecode));
	            }
	        }
	    }
	    return json;
	}
	
	// custEvent
	function _once(func) {
	    var ran = FALSE,
	        memo;
	    return function () {
	        if (ran) return memo;
	        ran = TRUE;
	        memo = func.apply(this, arguments);
	        func = NULL;
	        return memo;
	    };
	}
	
	var triggerEvents = function (events, args) {
	    var ev,
	        i = -1,
	        l = events.length,
	        ret = 1;
	    while (++i < l && ret) {
	        ev = events[i];
	        ret &= (ev.callback.apply(ev.ctx, args) !== false);
	    }
	    return !!ret;
	};
	
	var CustEvent = {
	    on: function (name, callback, context) {
	        this._events = this._events || {};
	        this._events[name] = this._events[name] || [];
	        var events = this._events[name];
	        events.push({
	            callback: callback,
	            context: context,
	            ctx: context || this
	        });
	        return this;
	    },
	    once: function (name, callback, context) {
	        var self = this;
	        var once = _once(function () {
	            self.off(name, once);
	            callback.apply(this, arguments);
	        });
	        once._callback = callback;
	        return this.on(name, once, context);
	    },
	    off: function (name, callback, context) {
	        if (!this._events) return this;
	        var retain, ev, events, names, i, l, j, k;
	        if (!name && !callback && !context) {
	            this._events = UNDEFINED;
	            return this;
	        }
	        names = name ? [name] : keys(this._events);
	        for (i = 0, l = names.length; i < l; i++) {
	            name = names[i];
	            events = this._events[name];
	            if (events) {
	                this._events[name] = retain = [];
	                if (callback || context) {
	                    for (j = 0, k = events.length; j < k; j++) {
	                        ev = events[j];
	                        if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
	                            (context && context !== ev.context)) {
	                            retain.push(ev);
	                        }
	                    }
	                }
	                if (!retain.length) delete this._events[name];
	            }
	        }
	        return this;
	    },
	    trigger: function (name) {
	        if (!this._events) return this;
	        var args = slice.call(arguments, 1),
	            events = this._events[name],
	            allEvents = this._events.all,
	            ret = 1;
	        if (events) {
	            ret &= triggerEvents(events, args);
	        }
	        if (allEvents && ret) {
	            ret &= triggerEvents(allEvents, args);
	        }
	        return !!ret;
	    }
	};
	
	function _createEventManager() {
	    var EM = function () {
	    };
	    _extend(EM.prototype, CustEvent);
	    return new EM();
	}
	
	// Deferred
	function Deferred() {
	
	    var status = 'pending',
	        ret,
	        isStart = FALSE,
	        startFn,
	        that = {},
	        events = (function () {
	            var binds = {
	                resolve: [],
	                reject: [],
	                notify: []
	            };
	            return {
	                add: function (type, fn) {
	                    binds[type].push(fn);
	                },
	                remove: function (type, fn) {
	                    var index = binds[type].indexOf(fn);
	                    if (index > -1) {
	                        binds[type].splice(index, 1);
	                    }
	                },
	                clear: function(type) {
	                    binds[type].length = 0;
	                },
	                fire: function (type, args) {
	                    binds[type].forEach(function (fn) {
	                        fn.apply(NULL, args);
	                    });
	                },
	                destroy: function () {
	                    binds.resolve.length = 0;
	                    binds.reject.length = 0;
	                    binds.notify.length = 0;
	                }
	            };
	        })();
	
	    function bind(onResolved, onRejected, onProgressed) {
	        if (_isFunction(startFn) && !isStart) {
	            isStart = TRUE;
	            startFn(that);
	        }
	        if (_isFunction(onResolved)) {
	            if (status === 'resolved') {
	                onResolved.apply(NULL, ret);
	            } else if (status === 'pending') {
	                events.add('resolve', onResolved);
	            }
	        }
	        if (_isFunction(onRejected)) {
	            if (status === 'rejected') {
	                onRejected.apply(NULL, ret);
	            } else if (status === 'pending') {
	                events.add('reject', onRejected);
	            }
	        }
	        if (_isFunction(onProgressed)) {
	            events.add('notify', onProgressed);
	        }
	    }
	
	    that.enabled = TRUE;
	
	    that.all = function (onResolvedOrRejected) {
	        bind(onResolvedOrRejected, onResolvedOrRejected);
	        return that;
	    };
	
	    that.done = function (onResolved) {
	        bind(onResolved);
	        return that;
	    };
	
	    that.fail = function (onRejected) {
	        bind(NULL, onRejected);
	        return that;
	    };
	
	    that.progress = function (onProgressed) {
	        bind(NULL, NULL, onProgressed);
	        return that;
	    };
	
	    that.unProgress = function (onProgressed) {
	        events.remove('notify', onProgressed);
	        return that;
	    };
	
	    that.then = function (onResolved, onRejected, onProgressed) {
	        bind(onResolved, onRejected, onProgressed);
	        return that;
	    };
	
	    that.resolve = function () {
	        if (status === 'pending') {
	            status = 'resolved';
	            ret = slice.call(arguments);
	            events.fire('resolve', ret);
	        }
	        return that;
	    };
	
	    that.reject = function () {
	        if (status === 'pending') {
	            status = 'rejected';
	            ret = slice.call(arguments);
	            events.fire('reject', ret);
	        }
	        return that;
	    };
	
	    that.notify = function () {
	        events.fire('notify', slice.call(arguments));
	        return that;
	    };
	
	    that.state = function () {
	        return status;
	    };
	
	    that.startWith = function (fn) {
	        startFn = fn;
	        return that;
	    };
	
	    that.destroy = function () {
	        that.enabled = FALSE;
	        that.notify('destroy');
	        status = NULL;
	        ret = NULL;
	        isStart = NULL;
	        startFn = NULL;
	        that.destroy = function(){};
	        that = NULL;
	        events.destroy();
	        events = NULL;
	    };
	
	    return that;
	}
	
	/**
	 * 异步串行
	 *
	 * @method QApp.util.queue
	 * @category Util-Fn
	 * @param {Array<Deferred>} list Deferred 列表
	 * @param {Array<String>} keys 结果映射
	 * @param {Boolean} dynamic 是否支持动态添加
	 * @return {Deferred} 异步对象
	 */
	// Queue
	function _queue(list, keys, dynamic) {
	    var deferred = new Deferred(),
	        queue = dynamic ? list : list.slice(0),
	        ret = [],
	        index = -1,
	        getKey = function (index) {
	            getKey = (keys && keys.length) ? function (index) {
	                return keys[index];
	            } : function (index) {
	                return index;
	            };
	            return getKey(index);
	        },
	        next = function () {
	            index++;
	            var pro = queue.shift();
	            if (pro && _isFunction(pro.all)) {
	                pro.all(function (data) {
	                    deferred.notify(getKey(index), data, list);
	                    ret[index] = data;
	                    next();
	                });
	            } else if (pro) {
	                if (_isFunction(pro)) {
	                    var p = pro(ret[index - 1], ret);
	                    if (p && _isFunction(p.all)) {
	                        p.all(function (data) {
	                            deferred.notify(getKey(index), data, list);
	                            ret[index] = data;
	                            next();
	                        });
	                    } else {
	                        deferred.notify(getKey(index), p, list);
	                        ret[index] = p;
	                        next();
	                    }
	                } else {
	                    deferred.notify(getKey(index), pro, list);
	                    ret[index] = pro;
	                    next();
	                }
	            } else {
	                if (keys && keys.length) {
	                    ret = _associate(ret, keys);
	                }
	                deferred.resolve.call(NULL, ret);
	            }
	        };
	
	    return deferred.startWith(next);
	}
	
	/**
	 * 异步并行
	 *
	 * @method QApp.util.parallel
	 * @category Util-Fn
	 * @param {Array<Deferred>} list Deferred 列表
	 * @param {Array<String>} [keys] 结果映射
	 * @return {Deferred} 异步对象
	 */
	// Parallel
	function _parallel(list, keys) {
	    var deferred = new Deferred(),
	        queue = list.slice(0),
	        ret = [],
	        num = 0,
	        check = function () {
	            if (num === queue.length) {
	                if (keys && keys.length) {
	                    ret = _associate(ret, keys);
	                }
	                deferred.resolve.call(NULL, ret);
	            }
	        },
	        start = function () {
	            queue.forEach(function (pro, index) {
	                if (pro && _isFunction(pro.all)) {
	                    ret[index] = UNDEFINED;
	                    pro.all(function (data) {
	                        ret[index] = data;
	                        num++;
	                        check();
	                    });
	                } else {
	                    ret[index] = pro;
	                    num++;
	                }
	            });
	            check();
	        };
	
	    return deferred.startWith(start);
	}
	
	// Dom
	
	/**
	 * Ready
	 *
	 * @method QApp.util.ready
	 * @category Util-Dom
	 * @param {Function} callback 回调函数
	 * @example
	 *    QApp.util.ready(function(){});
	 */
	// ready
	function _ready(callback) {
	    if (readyReg.test(doc.readyState) && doc.body) {
	        callback();
	    } else {
	        _addEvent(doc, 'DOMContentLoaded', function () {
	            callback();
	        }, FALSE);
	    }
	}
	
	/**
	 * 节点构造
	 *
	 * @method QApp.util.builder
	 * @category Util-Dom
	 * @param {String} html html片段
	 */
	function _builder(html) {
	
	    var frame, children,
	        toCreate = 'div';
	
	    [['li', 'ul'], ['tr', 'tbody'], ['td', 'tr'], ['th', 'tr'], ['tbody', 'table'], ['option', 'select']].some(function (item) {
	        if (html.indexOf('<' + item[0]) === 0) {
	            toCreate = item[1];
	            return TRUE;
	        }
	    });
	
	    frame = doc.createElement(toCreate);
	    frame.innerHTML = html;
	    children = _makeArray(frame.children);
	    frame = doc.createDocumentFragment();
	
	    children.forEach(function (node) {
	        frame.appendChild(node);
	    });
	
	    return {
	        box: frame,
	        children: children
	    };
	}
	
	/**
	 * 节点添加
	 *
	 * @method QApp.util.appendNodes
	 * @category Util-Dom
	 * @param {Element} node 目标节点
	 * @param {Element|Array<Element>} elements 节点或节点数组
	 * @example
	 *    // 为 el 添加子节点
	 *    var el = document.getElementById('demo'),
	 *        nodes = [document.createTextNode("1"), document.createTextNode("2")];
	 *    QApp.util.appendNodes(el, nodes);
	 *    QApp.util.appendNodes(el, nodes);
	 */
	function _appendNodes(node, elements) {
	    elements = [].concat(elements);
	    elements.forEach(function (element) {
	        node.appendChild(element);
	    });
	}
	
	/**
	 * 节点插入
	 *
	 * @method QApp.util.insertElement
	 * @category Util-Dom
	 * @param {Element} node 节点
	 * @param {Element} element 新节点
	 * @param {String} [where] 插入位置
	 * @return {Element} 新节点
	 * @example
	 *    var node = document.getElementById('demo'),
	 *        el = document.createElement('p');
	 *    el.innerHTML = 'text';
	 *    QApp.util.insertElement(node, el, 'beforebegin'); // 将node开始前插入el
	 *    QApp.util.insertElement(node, el, 'afterbegin'); // 将node开始后插入el
	 *    QApp.util.insertElement(node, el, 'beforeend'); // 将node结束前插入el
	 *    QApp.util.insertElement(node, el, 'afterend'); // 将node结束后插入el
	 *    QApp.util.insertElement(node, el); // 缺省默认为'beforeend'
	 */
	function _insertElement(node, element, where) {
	    where = where ? where.toLowerCase() : "beforeend";
	    switch (where) {
	        case "beforebegin":
	            node.parentNode.insertBefore(element, node);
	            break;
	        case "afterbegin":
	            node.insertBefore(element, node.firstChild);
	            break;
	        case "beforeend":
	            node.appendChild(element);
	            break;
	        case "afterend":
	            if (node.nextSibling) {
	                node.parentNode.insertBefore(element, node.nextSibling);
	            } else {
	                node.parentNode.appendChild(element);
	            }
	            break;
	    }
	    return element;
	}
	
	/**
	 * 删除节点
	 *
	 * @method QApp.util.removeNode
	 * @category Util-Dom
	 * @param {Element} node 被删除的节点
	 * @example
	 *    var el = document.getElementById('demo');
	 *    QApp.util.removeNode(el);
	 */
	function _removeNode(node) {
	    if (node && node.parentNode) {
	        node.parentNode.removeChild(node);
	    }
	}
	
	/**
	 * 获取或设置节点属性值
	 *
	 * @method QApp.util.attr
	 * @category Util-Dom
	 * @param {Element} node 目标节点
	 * @param {{String|Object}} attrName 类型为String时，当两个参数时获取节点属性，当三个参数时修改节点属性；类型为Object时，按照健值对修改节点属性
	 * @return {String} 节点的属性值
	 * @example
	 *    var el = document.getElementById('demo'),
	 *        attrKey = 'id', // 属性名
	 *        attrVal1 = 'new-value', // 属性值
	 *        attrVal2 = 'other-value',
	 *        attr = { // 属性对象
	 *           'id': 'new-value'
	 *        };
	 *    QApp.util.attr(el, attrKey, attrVal1); // 增加属性
	 *    QApp.util.attr(el, attrKey, attrVal2); // 修改属性
	 *    QApp.util.attr(el, attrKey, null);     // 删除属性
	 *    QApp.util.attr(el, attr);              // 利用object方式修改属性
	 */
	function setAttr(node, attrName, value) {
	    var toRemove = (value === FALSE) || (value === null) || (value === void 0);
	    var bool = boolMap[attrName];
	    if (typeof node[bool] === "boolean") {
	        node[bool] = !!value;     //布尔属性必须使用el.xxx = true|false方式设值
	        if (!value) {            //如果为false, IE全系列下相当于setAttribute(xxx,''),会影响到样式,需要进一步处理
	            toRemove = TRUE;
	        }
	    }
	    if (toRemove) {
	        return node.removeAttribute(attrName);
	    }
	    // SVG只能使用setAttribute(xxx, yyy), VML只能使用elem.xxx = yyy ,HTML的固有属性必须elem.xxx = yyy
	    var isInnate = svgReg.test(node) ? FALSE : attrName in node.cloneNode(FALSE);
	    if (isInnate) {
	        node[attrName] = value;
	    } else {
	        node.setAttribute(attrName, value);
	    }
	}
	
	function _attr(node, attrName) {
	    if (_isString(attrName)) {
	        if (arguments.length > 2) {
	            setAttr(node, attrName, arguments[2]);
	        } else {
	            return node.getAttribute(attrName);
	        }
	    } else {
	        _each(attrName, function (key, value) {
	            setAttr(node, key, value);
	        });
	    }
	}
	
	/**
	 * 获取或设置节点样式
	 *
	 * @method QApp.util.css
	 * @category Util-Dom
	 * @param {Element} node 目标节点
	 * @param {{String|Object}} property 类型为String时，当两个参数时获取节点样式，当三个参数时修改节点样式；类型为Object时，按照健值对修改样式
	 * @param {String} [value] 设定的值
	 * @return {String} 节点的样式值
	 * @example
	 *    var el = document.getElementById('demo'),
	 *        attr1 = 'background-color',
	 *        value1 = 'red',
	 *        attr2 = 'borderColor',
	 *        value2 = 'blue',
	 *        attr3 = 'translateY',
	 *        value3 = '20px',
	 *        obj = {
	 *            "translateX": "20px",
	 *            "scaleX": 2
	 *        };
	 *    QApp.util.css(el, attr1, value1); // 增加行内样式属性
	 *    QApp.util.css(el, attr2, value2); // 增加行内样式属性
	 *    QApp.util.css(el, attr2, value2); // 增加行内样式属性
	 *    QApp.util.css(el, attr3, value3); // 增加行内样式属性
	 *    QApp.util.css(el, obj); // 增加行内样式属性
	 *    QApp.util.css(el, attr2, null); // 删除行内样式属性
	 *    QApp.util.css(el, attr1, value2); // 更改行内样式属性
	 *    QApp.util.css(el, attr1); // 查找行内样式属性
	 */
	function _css(node, property) {
	    if (node && node.style) {
	        if (_isString(property)) {
	            if (arguments.length > 2) {
	                var value = arguments[2];
	                if (supportedTransforms.test(property)) {
	                    node.style[transformAttr] = property + '(' + value + ')';
	                } else {
	                    property = _camelCase(property);
	                    if (value || value === 0) {
	                        node.style[property] = value;
	                    } else {
	                        node.style.removeProperty(property);
	                    }
	                }
	            } else {
	                var styles = win.getComputedStyle(node, NULL),
	                    ret;
	                if (styles) {
	                    ret = styles[_camelCase(property)];
	                }
	                return ret;
	            }
	        } else {
	            var styleList = [],
	                transforms = '';
	            _each(property, function (key, value) {
	                if (supportedTransforms.test(key)) {
	                    transforms += key + '(' + value + ') ';
	                } else {
	                    styleList.push(_dasherize(key) + ':' + value);
	                }
	            });
	            if (transforms.length) {
	                styleList.push(_dasherize(transformAttr) + ':' + transforms);
	            }
	            node.style.cssText += ';' + styleList.join(';') + ';';
	        }
	    }
	}
	
	/**
	 * 删除样式
	 *
	 * @method QApp.util.removeStyle
	 * @category Util-Dom
	 * @param {Element} node 节点
	 * @param {String|Array} names 样式名称
	 * @example
	 *     var el = document.getElementById('demo');
	 *     el.style.display = 'none';
	 *     QApp.util.removeStyle(el, 'display');
	 */
	function _removeStyle(node, names) {
	    if (node && node.style) {
	        [].concat(names).forEach(function (name) {
	            node.style.removeProperty(name);
	            node.style.removeProperty(prefix + name);
	        });
	    }
	}
	
	/**
	 * 事件修复
	 *
	 * @method QApp.util.fixEvent
	 * @category Util-Dom
	 * @param {Event} event 事件
	 * @return {Event} 修复后的事件
	 * @example
	 *    var el = document.getElementById('demo'),
	 *        type = 'click',//事件类型
	 *        useCapture = false;//是否冒泡
	 *    QApp.util.addEvent(el, type, function(e){
	 *       var event = QApp.util.fixEvent(e);//事件修复
	 *    }, useCapture);
	 */
	function _fixEvent(event) {
	
	    if(!event.target){
	        event.target = event.srcElement || document;
	    }
	
	    // Safari
	    if (event.target.nodeType == 3) {
	        event.target = event.target.parentNode;
	    }
	
	    //fix pageX & pageY
	    if(event.pageX === NULL && event.clientX !== NULL){
	        var html = doc.documentElement,
	            body = doc.body;
	
	        event.pageX = event.clientX + (html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || body && body.clientLeft || 0);
	        event.pageY = event.clientY + (html.scrollTop  || body && body.scrollTop  || 0) - (html.clientTop  || body && body.clientTop  || 0);
	    }
	
	    return event;
	}
	
	/**
	 * 事件绑定
	 *
	 * @method QApp.util.addEvent
	 * @category Util-Dom
	 * @param {Element} node 节点
	 * @param {String} type 事件名
	 * @param {Function} listener 事件处理函数
	 * @param {Any} [useCapture] 事件处理阶段，默认是 false
	 * @example
	 *    // 监听 el 的 click 事件
	 *    var el = document.getElementById('demo'),
	 *        type = 'click', //事件类型
	 *        fn = function(){}, //回调函数
	 *        useCapture = false; //是否冒泡
	 *    QApp.util.addEvent(el, type, fn, useCapture);
	 */
	function _addEvent(node, type, listener, useCapture) {
	    node.addEventListener(type, listener, !!useCapture);
	}
	
	/**
	 * 解除绑定事件
	 *
	 * @method QApp.util.removeEvent
	 * @category Util-Dom
	 * @param {Element} node 目标节点
	 * @param {String} type 事件名
	 * @param {Function} listener 事件处理函数
	 * @example
	 *    var el = document.getElementById('demo'),
	 *        type = 'click',
	 *        fn = function(){},
	 *        useCapture = false;
	 *    QApp.util.addEvent(el, type, fn, useCapture);
	 *    QApp.util.removeEvent(el, type, fn);
	 */
	function _removeEvent(node, type, listener) {
	    node.removeEventListener(type, listener);
	}
	
	/**
	 * 事件触发
	 *
	 * @method QApp.util.dispatchEvent
	 * @category Util-Dom
	 * @param {Element} node 目标节点
	 * @param {String} type 事件名
	 * @param {Any} args 附加参数
	 */
	// dispatchEvent
	function _dispatchEvent(node, type, args) {
	    var event = doc.createEvent("Events");
	    event.initEvent(type, true, true);
	    _extend(event, args);
	    node.dispatchEvent(event);
	}
	
	/**
	 * 添加类名
	 *
	 * @method QApp.util.addClass
	 * @category Util-Dom
	 * @param {Element} node 节点
	 * @param {String} className 类名
	 * @example
	 *    // 为 el 新增一个 className 为 new-class
	 *    var el = document.getElementById('demo');
	 *    QApp.util.addClass(el, 'new-class');
	 */
	// addClass
	function _addClass(node, className) {
	    node.className = (node.className + whiteSpace + className).split(/\s+/).filter(function (item, index, source) {
	        return source.lastIndexOf(item) === index;
	    }).join(whiteSpace);
	}
	
	/**
	 * 移除元素指定类名
	 *
	 * @method QApp.util.removeClass
	 * @category Util-Dom
	 * @param {Element} node 节点
	 * @param {String} className 类名
	 * @example
	 *    var el = document.getElementById('demo');
	 *    QApp.util.removeClass(el, 'color');
	 */
	// removeClass
	function _removeClass(node, className) {
	    className = whiteSpace + className.replace(/\s+/g, whiteSpace) + whiteSpace;
	
	    node.className = node.className.split(/\s+/).filter(function (originClassName) {
	        return className.indexOf(whiteSpace + originClassName + whiteSpace) === -1;
	    }).join(whiteSpace);
	}
	
	/**
	 * 动态创建样式
	 *
	 * @method QApp.util.createStyle
	 * @category Util-Dom
	 * @param {String} cssText 样式字符串
	 */
	// createStyle
	function _createStyle(cssText) {
	    var style = doc.createElement('style');
	    style.type = 'text/css';
	    style.innerHTML = cssText;
	    doc.querySelector('head').appendChild(style);
	}
	
	/**
	 * 包含判定
	 *
	 * @method QApp.util.contains
	 * @category Util-Dom
	 * @param {Element} a 节点
	 * @param {Element} b 节点
	 * @return {Boolean} true表示a包含b；false表示a不包含b
	 */
	// contains
	var _contains = doc.compareDocumentPosition ? function (a, b) {
	    return !!(a.compareDocumentPosition(b) & 16);
	} : function (a, b) {
	    return a !== b && (a.contains ? a.contains(b) : TRUE);
	};
	
	/**
	 * 节点聚焦
	 *
	 * @method QApp.util.focus
	 * @category Util-Dom
	 * @param {Element} element 节点
	 */
	// focus
	function _focus(element) {
	    var length;
	
	    // 兼容 ios7 问题
	    if (_sniff.ios && element.setSelectionRange && element.type.indexOf('date') !== 0 && element.type !== 'time' && element.type !== 'month') {
	        length = element.value.length;
	        try {
	            element.setSelectionRange(length, length);
	        } catch(e) {
	            element.focus();
	        }
	    } else {
	        element.focus();
	    }
	}
	
	/**
	 * 指定节点内的焦点元素失焦
	 *
	 * @method QApp.util.blur
	 * @category Util-Dom
	 * @param {Element} [container] 容器节点
	 */
	// blur
	function _blur(container) {
	    var el = doc.activeElement;
	    container = container || doc.body;
	    if (el && _contains(container, el) && _isFunction(el.blur)) {
	        el.blur();
	    }
	}
	
	/**
	 * 获取元素的尺寸
	 *
	 * @method QApp.util.size
	 * @category Util-Dom
	 * @param {Any} any 要获取尺寸的对象
	 */
	// size
	function docSize(doc) {
	    function getWidthOrHeight(clientProp) {
	        var docEl = doc.documentElement,
	            body = doc.body;
	        return Math.max(
	            body["scroll" + clientProp],
	            docEl["scroll" + clientProp],
	            body["offset" + clientProp],
	            docEl["offset" + clientProp],
	            docEl["client" + clientProp]
	        );
	    }
	
	    return {
	        width: getWidthOrHeight('Width'),
	        height: getWidthOrHeight('Height')
	    };
	}
	
	function winSize(win) {
	    function getWidthOrHeight(clientProp) {
	        return win.document.documentElement["client" + clientProp];
	    }
	
	    return {
	        width: getWidthOrHeight('Width'),
	        height: getWidthOrHeight('Height')
	    };
	}
	
	function _size(any) {
	    var type = getType(any),
	        ret;
	    switch (type) {
	        case 'Document':
	            ret = docSize(any);
	            break;
	        case 'Window':
	            ret = winSize(any);
	            break;
	        default:
	            ret = {
	                width: parseInt(_css(any, 'width'), 10),
	                height: parseInt(_css(any, 'height'), 10)
	            };
	    }
	
	    return ret;
	}
	
	/**
	 * 获取位置
	 *
	 * @method QApp.util.position
	 * @category Util-Dom
	 * @param {Element} el 获取位置的节点
	 * @return {Object} 包括 top 和 left 两个数值
	 */
	// position
	function generalPosition(el) {
	    var box = el.getBoundingClientRect(),
	        body = el.ownerDocument.body,
	        docEl = el.ownerDocument.documentElement,
	        scrollTop = Math.max(win.pageYOffset || 0, docEl.scrollTop, body.scrollTop),
	        scrollLeft = Math.max(win.pageXOffset || 0, docEl.scrollLeft, body.scrollLeft),
	        clientTop = docEl.clientTop || body.clientTop || 0,
	        clientLeft = docEl.clientLeft || body.clientLeft || 0;
	
	    return {
	        left: box.left + scrollLeft - clientLeft,
	        top: box.top + scrollTop - clientTop
	    };
	}
	
	function diff(pos, bPos) {
	    return {
	        left: pos.left - bPos.left,
	        top: pos.top - bPos.top
	    };
	}
	
	function _position(el) {
	    if (!_contains(el.ownerDocument.body, el)) {
	        return {
	            top: NaN,
	            left: NaN
	        };
	    }
	
	    return arguments.length > 1 ?
	        diff(generalPosition(el), generalPosition(arguments[1])) :
	        generalPosition(el);
	}
	
	/**
	 * 获取节点自定义数据
	 *
	 * @method QApp.util.dataSet
	 * @category Util-Dom
	 * @param {Element} node 目标节点
	 * @return {Object} 包含自定义数据的对象
	 */
	// dataSet
	function _dataSet(node) {
	    var ret = {};
	    if (node) {
	        if (node.dataset) {
	            _extend(ret, node.dataset);
	        } else {
	            var attrs = node.attributes;
	            for (var i = 0, l = attrs.length; i < l; i ++) {
	                var name = attrs[i].name,
	                    value = attrs[i].value;
	                if (name.indexOf('data-') === 0) {
	                    name = _camelCase(name.substring(5));
	                    ret[name] = value;
	                }
	            }
	        }
	    }
	    return ret;
	}
	
	// 其他
	
	/**
	 * 将函数应用于view
	 *
	 * @method QApp.util.apply
	 * @category Util-Fn
	 * @param {Function} callback 方法
	 * @param {Object} view 视图
	 * @param {Any} args 参数
	 * @return {Any} 函数执行结果
	 */
	// apply
	function _apply(callback, view, args) {
	    if (_isFunction(callback)) {
	        return callback.apply(view, _makeArray(args) || []);
	    }
	}
	
	
	/**
	 * 获取回调函数
	 *
	 * @method QApp.util.getCallback
	 * @category Util-Fn
	 * @param {Any} args 回调函数
	 * @return {Function} 回调函数
	 */
	// getCallback
	function _getCallback(args) {
	    var fn = _noop;
	    args = _makeArray(args);
	    if (args) {
	        args.some(function(arg) {
	           if (_isFunction(arg)) {
	               fn = arg;
	               return TRUE;
	           }
	        });
	    }
	    return fn;
	}
	
	/**
	 * 动画
	 *
	 * @method QApp.util.animate
	 * @category Util-Fn
	 * @param {Element} el 执行动画的元素
	 * @param {Object} props 更改的属性
	 * @param {Number} [duration] 持续时间
	 * @param {String} [ease] 动画曲线
	 * @param {Number} [delay] 延迟时间
	 * @return {Deferred} Deferred对象
	 * @example
	 *     // 修改 ele 的 transform 属性，实现动画（推荐）
	 *     var ele_transform = document.createElement("div");
	 *     QApp.util.animate(ele_transform, {transform: "translate(50%, 0)"}, 500);
	 *
	 *     // 修改 ele 的 left，实现动画
	 *     var ele_left = document.createElement("div");
	 *     QApp.util.animate(ele_left, {left: "50%", position: "absolute"}, 500);
	 */
	var _animate = (function () {
	    var DURATION = 200,
	        TIMEOUT_DELAY = 25,
	        EASE = 'linear';
	
	    var transitionProperty, transitionDuration, transitionTiming, transitionDelay;
	
	    transitionProperty = prefix + 'transition-property';
	    transitionDuration = prefix + 'transition-duration';
	    transitionDelay = prefix + 'transition-delay';
	    transitionTiming = prefix + 'transition-timing-function';
	
	    function setParentStyle(el) {
	        var parentNode = el.parentNode;
	        if (parentNode) {
	            _css(parentNode, {
	                'transform-style': 'preserve-3d',
	                'backface-visibility': 'hidden'
	            });
	        }
	    }
	
	    function resetParentStyle(el) {
	        var parentNode = el.parentNode;
	        _removeStyle(parentNode, ['transform-style', 'backface-visibility']);
	    }
	
	    return function (el, props, duration, ease, delay) {
	        var argsLength = arguments.length,
	            endEvent = eventPrefix + 'TransitionEnd',
	            cssValues = {},
	            cssProperties = [],
	            transforms = '';
	
	        if (argsLength < 3) {
	            duration = DURATION;
	        }
	
	        if (argsLength < 4) {
	            ease = EASE;
	        }
	
	        if (argsLength < 5) {
	            delay = 0;
	        }
	
	        _each(props, function (key, value) {
	            if (supportedTransforms.test(key)) {
	                transforms += key + '(' + value + ') ';
	            } else {
	                cssValues[key] = value;
	            }
	            cssProperties.push(_dasherize(key));
	        });
	
	        if (transforms) {
	            cssValues[transformAttr] = transforms;
	            cssProperties.push(transformAttr);
	        }
	
	        if (duration > 0) {
	            cssValues[transitionProperty] = cssProperties.join(', ');
	            cssValues[transitionDuration] = duration / 1000 + 's';
	            cssValues[transitionDelay] = delay / 1000 + 's';
	            cssValues[transitionTiming] = ease;
	        }
	
	        var that = new Deferred();
	        var fired = FALSE;
	
	        function callback(event) {
	            if (event) {
	                if (event.target !== el) {
	                    return;
	                }
	            }
	            _removeEvent(el, endEvent, callback);
	            fired = TRUE;
	            _delay(function () {
	                if (transforms) {
	                    resetParentStyle(el);
	                }
	                _removeStyle(el, 'transition');
	                that.resolve();
	            });
	        }
	
	        if (duration > 0) {
	            _addEvent(el, endEvent, callback, FALSE);
	
	            // 兼容不支持的情况
	            _delay(function () {
	                if (!fired) {
	                    callback();
	                }
	            }, duration + delay + TIMEOUT_DELAY * 2);
	        }
	
	        _delay(function () {
	            if (transforms) {
	                setParentStyle(el);
	            }
	
	            _css(el, cssValues);
	
	            that.notify('start');
	        }, TIMEOUT_DELAY);
	
	        if (duration <= 0) {
	            _delay(callback);
	        }
	
	        return that;
	    };
	})();
	
	var checkContains = function (list, el) {
	    for (var i = 0, len = list.length; i < len; i += 1) {
	        if (_contains(list[i], el)) {
	            return TRUE;
	        }
	    }
	    return FALSE;
	};
	
	function _delegatedEvent(actEl, expEls, tag) {
	    if (!expEls) {
	        expEls = [];
	    }
	    expEls = [].concat(expEls);
	    var evtList = {},
	        bindEvent = function (evt) {
	            var el = evt.target,
	                type = evt.type;
	            doDelegated(el, type, evt);
	        },
	        actionTag = tag || 'action-type';
	
	    function doDelegated(el, type, evt) {
	        var actionType = NULL;
	
	        function checkBuble() {
	            var tg = el,
	                data = _dataSet(tg);
	            if (evtList[type] && evtList[type][actionType]) {
	                return evtList[type][actionType]({
	                    'evt': evt,
	                    'el': tg,
	                    'box': actEl,
	                    'data': data
	                }, data);
	            } else {
	                return TRUE;
	            }
	        }
	
	        if (checkContains(expEls, el)) {
	            return FALSE;
	        } else if (!_contains(actEl, el)) {
	            return FALSE;
	        } else {
	            while (el && el !== actEl) {
	                if (el.nodeType === 1) {
	                    actionType = el.getAttribute(actionTag);
	                    if (actionType && checkBuble() === FALSE) {
	                        break;
	                    }
	                }
	                el = el.parentNode;
	            }
	
	        }
	    }
	
	    var that = {};
	
	    that.add = function (funcName, evtType, process, useCapture) {
	        if (!evtList[evtType]) {
	            evtList[evtType] = {};
	            _addEvent(actEl, evtType, bindEvent, !!useCapture);
	        }
	        var ns = evtList[evtType];
	        ns[funcName] = process;
	    };
	
	    that.remove = function (funcName, evtType) {
	        if (evtList[evtType]) {
	            delete evtList[evtType][funcName];
	            if (_isEmptyObject(evtList[evtType])) {
	                delete evtList[evtType];
	                _removeEvent(actEl, evtType, bindEvent);
	            }
	        }
	    };
	
	    that.pushExcept = function (el) {
	        expEls.push(el);
	    };
	
	    that.removeExcept = function (el) {
	        if (!el) {
	            expEls = [];
	        } else {
	            for (var i = 0, len = expEls.length; i < len; i += 1) {
	                if (expEls[i] === el) {
	                    expEls.splice(i, 1);
	                }
	            }
	        }
	
	    };
	
	    that.clearExcept = function () {
	        expEls = [];
	    };
	
	    that.fireAction = function (actionType, evtType, evt, params) {
	        var data = {};
	        if (params && params.data) {
	            data = params.data;
	        }
	        if (evtList[evtType] && evtList[evtType][actionType]) {
	            evtList[evtType][actionType]({
	                'evt': evt,
	                'el': NULL,
	                'box': actEl,
	                'data': data,
	                'fireFrom': 'fireAction'
	            }, data);
	        }
	    };
	
	    that.fireInject = function (dom, evtType, evt) {
	        var actionType = dom.getAttribute(actionTag),
	            dataSet = _dataSet(dom);
	        if (actionType && evtList[evtType] && evtList[evtType][actionType]) {
	            evtList[evtType][actionType]({
	                'evt': evt,
	                'el': dom,
	                'box': actEl,
	                'data': dataSet,
	                'fireFrom': 'fireInject'
	            }, dataSet);
	        }
	    };
	
	
	    that.fireDom = function (dom, evtType, evt) {
	        doDelegated(dom, evtType, evt || {});
	    };
	
	    that.destroy = function () {
	        for (var k in evtList) {
	            for (var l in evtList[k]) {
	                delete evtList[k][l];
	            }
	            delete evtList[k];
	            _removeEvent(actEl, k, bindEvent);
	        }
	    };
	
	    return that;
	}
	var URL_REG = /(\w+):\/\/\/?([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(\?[^#]*)?(#.*)?/i,
	    URL_MAP = ['url', 'protocol', 'hostname', 'port', 'path', 'name', 'query', 'hash'];
	
	function _parseURL(str, decode) {
	    var scope = _associate(URL_REG.exec(str) || [], URL_MAP);
	
	    scope.query = scope.query ? _queryToJson(scope.query.substring(1), decode) : {};
	
	    scope.hash = scope.hash ? _queryToJson(scope.hash.substring(1), decode) : {};
	
	    scope.getQuery = function(key) {
	        return scope.query[key];
	    };
	
	    scope.getHash = function(key) {
	        return scope.hash[key];
	    };
	
	    scope.setQuery = function(key, value) {
	        if (value === UNDEFINED) {
	            scope.query[key] = NULL;
	        } else {
	            scope.query[key] = value;
	        }
	        return scope;
	    };
	
	    scope.setHash = function(key, value) {
	        if (value === UNDEFINED) {
	            scope.hash[key] = NULL;
	        } else {
	            scope.hash[key] = value;
	        }
	        return scope;
	    };
	
	    scope.toUrl = function(encode) {
	        var url = scope.protocol + '://',
	            query = _jsonToQuery(scope.query, encode),
	            hash = _jsonToQuery(scope.hash, encode);
	        if (scope.protocol && scope.protocol.toLowerCase() === 'file') {
	            url += '/';
	        }
	        return url +
	            scope.hostname +
	            (scope.port || '') +
	            scope.path +
	            (scope.name || '') +
	            (query ? '?' + query : '') +
	            (hash ? '#' + hash : '');
	    };
	
	    return scope;
	}
	
	/// Loader
	var LOADER_OPT = {
	    charset: 'UTF-8',
	    timeout: 30 * 1000,
	    onComplete: NULL,
	    onTimeout: NULL,
	    onFail: NULL
	};
	
	var headEL = doc.getElementsByTagName('head')[0];
	
	function bindEvent(el, deferred, timeout) {
	    var requestTimeout;
	
	    headEL.insertBefore(el, headEL.firstChild);
	
	    if (timeout) {
	        requestTimeout = _delay(function() {
	            el.onload = NULL;
	            _removeNode(el);
	            deferred.reject({type : 'Timeout'});
	        }, timeout);
	    }
	
	    el.onload = function() {
	        if (requestTimeout) {
	            clearTimeout(requestTimeout);
	        }
	        el.onload = NULL;
	        el.onerror = NULL;
	        deferred.resolve();
	    };
	
	    el.onerror = function() {
	        if (requestTimeout) {
	            clearTimeout(requestTimeout);
	        }
	        _removeNode(el);
	        el.onload = NULL;
	        el.onerror = NULL;
	        deferred.reject({type : 'Error'});
	    };
	}
	
	var Manager = {
	    script : function(url, options) {
	        var deferred = new Deferred(),
	            charset = options.charset,
	            timeout = options.timeout,
	            el = doc.createElement('script');
	        el.type = 'text/javascript';
	        el.charset = charset;
	        return deferred.startWith(function() {
	            deferred.notify('element', el);
	            bindEvent(el, deferred, timeout);
	            el.src = url;
	        });
	    },
	    style : function(url, options) {
	        var deferred = new Deferred(),
	            charset = options.charset,
	            timeout = options.timeout,
	            el = doc.createElement('link');
	        el.type = 'text/css';
	        el.charset = charset;
	        el.rel = 'stylesheet';
	        return deferred.startWith(function() {
	            bindEvent(el, deferred, timeout);
	            el.href = url;
	        });
	    },
	    image : function(url, options) {
	        var deferred = new Deferred(),
	            img = new Image(),
	            timeout = options.timeout,
	            timer = NULL;
	        img.onload = function() {
	            img.onload = NULL;
	            img.onerror = NULL;
	            if (timer) {
	                clearTimeout(timer);
	            }
	            deferred.resolve(img);
	        };
	        img.onerror = function() {
	            img.onload = NULL;
	            img.onerror = NULL;
	            if (timer) {
	                clearTimeout(timer);
	            }
	            deferred.reject({type : 'Error'});
	        };
	        if (timeout) {
	            timer = _delay(function() {
	                img.onload = NULL;
	                img.onerror = NULL;
	                if (timer) {
	                    clearTimeout(timer);
	                }
	                deferred.reject({type : 'Timeout'});
	            }, timeout);
	        }
	        return deferred.startWith(function() {
	            img.src = url;
	        });
	    }
	};
	
	function _loader(type, url, options) {
	    var opt = _extend({}, LOADER_OPT, options),
	        deferred = Manager[type] && Manager[type](url, opt);
	
	    if (deferred && (opt.onComplete || opt.onFail || opt.onTimeout)) {
	        deferred.then(opt.onComplete, function(reason) {
	            if (reason.type === 'Timeout' && _isFunction(opt.onTimeout)) {
	                opt.onTimeout(reason);
	            }
	            if (reason.type === 'Error' && _isFunction(opt.onFail)) {
	                opt.onFail(reason);
	            }
	        });
	    }
	
	    return deferred;
	}
	var supportsOrientationChange = "onorientationchange" in win,
	    // orientationEvent = supportsOrientationChange ? "orientationchange" : "resize",
	    orientationEvent = "resize", // 由于 orientationchange 在安卓机器上有兼容性问题，所以统一用 resize
	    _orientation = _createEventManager(),
	    getOrientation = function(size) {
	        return size.width > size.height ? 'landscape' : 'portrait';
	    };
	
	_orientation.get = function() {
	    return getOrientation(_size(win));
	};
	
	_ready(function() {
	    var curSize = _size(win);
	    win.addEventListener(orientationEvent, function() {
	        var size = _size(win);
	        if (curSize.width !== size.width && curSize.height !== size.height) {
	            curSize = size;
	            _orientation.trigger('change', {
	                type: orientationEvent,
	                width: size.width,
	                height: size.height,
	                orientation: getOrientation(size)
	            });
	        }
	    });
	});
	var LOGGER_TYPES = ['info', 'debug', 'warn', 'error'];
	
	function _logger(type, args) {
	    console[type].apply(console, ['[' + type.toUpperCase() + ']'].concat(_makeArray(args)));
	}
	
	LOGGER_TYPES.forEach(function(type, index) {
	   _logger[type] = function() {
	       if (index >= Config.logLevel) {
	           _logger(type, arguments);
	       }
	   };
	});
	
	// query 配置
	
	var logLevel = _parseURL(location.href).query.logLevel;
	
	if (logLevel) {
	    Config.logLevel = parseInt(logLevel);
	}
	
	define('fetchNode', function () {
	
	    function resolveNode(deferred) {
	        deferred.resolve();
	    }
	
	    return function (view) {
	        var options = view.options;
	
	        return new Deferred().startWith(function (that) {
	            if (options.html || _isFunction(options.fetch)) {
	                if (options.html) {
	                    resolveNode(that);
	                } else if (options.fetch.length) { // function(resolve) {}
	                    options.fetch.call(view, function (node) {
	                        options.html = node || '';
	                        resolveNode(that);
	                    });
	                } else {
	                    options.html = options.fetch.call(view) || '';
	                    resolveNode(that);
	                }
	            } else {
	                options.html = '';
	                resolveNode(that);
	            }
	        });
	    };
	});
	
	define('display', function() {
	    return {
	        show: function (container, startCss, endCss, duration) {
	            var me = this;
	            if (me.isShow) {
	                _css(me.root, _extend({
	                    width: '100%',
	                    height: '100%',
	                    zIndex: _getZIndex()
	                }, endCss || startCss));
	                me.trigger('refresh');
	            } else {
	                me.once('completed', function () {
	                    _css(me.root, _extend({
	                        width: '100%',
	                        height: '100%',
	                        zIndex: _getZIndex()
	                    }, startCss));
	                    me.trigger('beforeShow');
	                    if (Config.animate && endCss) {
	                        _animate(me.root, endCss, duration).done(function () {
	                            me.trigger('show');
	                        });
	                    } else {
	                        _css(me.root, endCss || {});
	                        me.trigger('show');
	                    }
	                });
	                me.renderTo(_isElement(container) ? container : Config.appRoot);
	            }
	            return me;
	        },
	        hide: function () {
	            var me = this;
	            if (me.isShow) {
	                me.trigger('beforeHide');
	                me.trigger('hide');
	            }
	            return me;
	        }
	    };
	});
	define('pluginM', function () {
	
	    var plugins = QApp._plugins = {},
	        globalPlugins = [];
	
	    return {
	        /**
	         * 增加插件
	         *
	         * @method QApp.plugin.add
	         * @category Plugin
	         * @alias QApp.addPlugin
	         * @core
	         * @param {String|Array<String>} name 插件名
	         * @param {Object} options 默认配置
	         * @param {Function} [adapter] 适配器
	         * @example
	         * QApp.addPlugin('some', someOpt, function(view, opt) {
	         *      view.someAttr = someValue;
	         *      return SomeObject;
	         * });
	         * @explain
	         * `plugin` 可以通过监听生命周期事件来进行相关行为，也可以复写或增加视图的方法。
	         */
	        add: function (key, options, adapter) {
	            var names = [].concat(key);
	            names.forEach(function (name) {
	                if (!plugins[name]) {
	                    plugins[name] = {
	                        options: options,
	                        adapter: adapter
	                    };
	                } else {
	                    //WARN 'Plugin "' + name + '" already exist.'
	                }
	            });
	        },
	        /**
	         * 检测插件是否存在
	         *
	         * @method QApp.plugin.exists
	         * @category Plugin
	         * @param {String} name 插件名
	         * @return {Boolean} flag 是否存在
	         */
	        exists: function (name) {
	            return !!plugins[name];
	        },
	        /**
	         * 获取插件当前配置
	         *
	         * @method QApp.plugin.get
	         * @category Plugin
	         * @param {String} name 插件名
	         * @return {Object} options 当前配置
	         */
	        get: function (name) {
	            return plugins[name];
	        },
	        /**
	         * 设置插件当前配置
	         *
	         * @method QApp.plugin.setOpt
	         * @category Plugin
	         * @param {String} name 插件名
	         * @param {Object} options 配置
	         * @explain
	         * 以 `extend` 的方式
	         */
	        setOpt: function (name, options) {
	            if (plugins[name]) {
	                _extend(TRUE, plugins[name].options, options);
	            }
	        },
	        /**
	         * 获取全局插件列表
	         *
	         * @method QApp.plugin.getGlobal
	         * @category Plugin
	         * @alias QApp.configPlugin
	         * @return {Array} plugins 全局插件列表
	         */
	        getGlobal: function () {
	            return globalPlugins;
	        },
	        /**
	         * 设置全局插件
	         *
	         * @method QApp.plugin.setGlobal
	         * @category Plugin
	         * @alias QApp.setGlobalPlugins
	         * @param {String|Array<String>} gPlugins 插件或列表
	         * @explain
	         * 内部逻辑是 `concat` 操作
	         */
	        setGlobal: function (gPlugins) {
	            globalPlugins = globalPlugins.concat(gPlugins);
	        }
	    };
	});
	
	define('widgetM', function () {
	
	    var widgets = QApp._widgets = {};
	
	    return {
	        /**
	         * 添加组件
	         *
	         * @method QApp.widget.add
	         * @category Widget
	         * @alias QApp.addWidget
	         * @core
	         * @param {String} name 组件名
	         * @param {Function} adapter 适配器
	         * @param {Boolean|String} [isEvent] 是否由事件触发
	         * @example
	         * QApp.addWidget('some', function(element, opt, view) {
	         *      todoSomething();
	         * })
	         * @explain
	         * `isEvent` 是 `true` 或者是 事件名 (`tap`) 时为触发式组件，反之为渲染式组件
	         */
	        add: function (name, adapter, isEvent) {
	            widgets[name] = {
	                eventName: isEvent && (_isString(isEvent) ? isEvent : 'tap'),
	                adapter: adapter
	            };
	        },
	        /**
	         * 检查组件是否存在
	         *
	         * @method QApp.widget.exists
	         * @category Widget
	         * @param {String} name 组件名
	         * @return {Boolean} flag 是否存在
	         */
	        exists: function (name) {
	            return !!widgets[name];
	        },
	        isEvent: function (name) {
	            return !!widgets[name].eventName;
	        },
	        /**
	         * 获取组件当前配置
	         *
	         * @method QApp.widget.get
	         * @category Widget
	         * @param {String} name 组件名
	         * @return {Object} options 当前组件配置
	         */
	        get: function (name) {
	            return widgets[name];
	        },
	        /**
	         * 显示组件
	         *
	         * @method QApp.widget.show
	         * @category Widget
	         * @alias QApp.showWidget
	         * @core
	         * @param {String} name 组件名
	         * @param {Element} [el] 节点
	         * @param {Object} options 配置
	         * @param {View} [view] 关联的视图
	         * @return {Any} obj 组件返回的对象
	         * @example
	         * var widget = QApp.showWidget('searchlist', {
	         *    onComplete: function() {
	         *          todoSomething();
	         *    }
	         * });
	         * @explain
	         * 所需参数和返回的对象由组件的适配器决定
	         */
	        show: function (name, el, options, view) {
	            if (widgets[name]) {
	                if (_isElement(el)) {
	                    return widgets[name].adapter(el, options, view);
	                } else {
	                    return widgets[name].adapter(NULL, el, options);
	                }
	            }
	        }
	    };
	
	});
	
	/* ================================== View ================================== */
	define('view', function () {
	
	    var $fetchNode = r('fetchNode'),
	        $pluginM = r('pluginM'),
	        $widgetM = r('widgetM'),
	        $display = r('display');
	
	    var RENDER_TIMEOUT = 10;
	
	    var DEFAULT_OPT = {
	        init: {},
	        html: NULL,
	        fetch: NULL,
	        classNames: [],
	        attrs: {},
	        styles: {},
	        destroyDom: TRUE,
	        supportHash: TRUE,
	        ready: NULL,
	        subViews: [],
	        plugins: [],
	        bindEvents: {},
	        extra: {}
	    };
	
	    function createRoot() {
	        return doc.createElement(Tags.view);
	    }
	
	    function initialize(view) {
	        var init = view.options.init;
	        _each(init, function (key, value) {
	            //INFO '[View] 初始化', key, '在视图', view.name, '上, 值为', value
	            view[key] = _isFunction(value) ? value.bind(view) : value;
	        });
	    }
	
	    function bindEvents(view) {
	        _each(view.options.bindEvents, function(eventName, process) {
	            if (_isFunction(process)) {
	                //INFO '[View] 绑定事件', eventName, '在视图', view.name, '上, 回调为', process
	                view.on(eventName, process.bind(view));
	            }
	        });
	    }
	
	    function handlePlugin(view) {
	        var addPlugins = $pluginM.getGlobal();
	
	        addPlugins.concat(view.options.plugins).forEach(function (plugin) {
	            var name = _isString(plugin) ? plugin : plugin.name,
	                options = plugin.options || view.options[_camelCase(name) + 'Options'] || {},
	                pluginOpt = $pluginM.get(name),
	                opt;
	            if (pluginOpt && _isFunction(pluginOpt.adapter)) {
	                //INFO '[View] 添加插件', name, '配置', options, '在视图', view.name
	                opt = _isFunction(options) ? options : _extend(TRUE, {}, pluginOpt.options, options);
	                view.plugins[name] = (pluginOpt.adapter)(view, opt, Config);
	            }
	        });
	    }
	
	    function getParam(el, name) {
	        var options = {
	            param: {}
	        };
	
	        _each(_dataSet(el), function (key, value) {
	            if (!key.indexOf(name)) {
	                var attrName = key.substring(name.length).replace(/\w/i, function (letter) {
	                    return letter.toLowerCase();
	                });
	                if (!attrName.indexOf('param')) {
	                    options.param[
	                        attrName.substring(5).replace(/\w/i, function (letter) {
	                            return letter.toLowerCase();
	                        })
	                        ] = value;
	                } else {
	                    options[attrName] = value;
	                }
	            }
	        });
	        return options;
	    }
	
	    function handleWidget(view, container) {
	        container =  (_isString(container) ? view.root.querySelector(container) : container) || view.root;
	        _makeArray(
	            container.querySelectorAll('[' + Tags.widget + ']')
	        ).forEach(function (el) {
	                var name = _attr(el, Tags.widget),
	                    widget, eventName, bindFunc, adapter, options;
	                if ($widgetM.exists(name)) {
	                    eventName = $widgetM.get(name).eventName;
	                    adapter = $widgetM.get(name).adapter;
	
	                    bindFunc = function () {
	                        options = getParam(el, name);
	                        widget = adapter(el, options, view);
	                        if (options.id) {
	                            view.widgets[options.id] = widget;
	                        }
	                    };
	
	                    if ($widgetM.isEvent(name)) {
	                        options = getParam(el, name);
	                        eventName = options.eventType || eventName;
	
	                        _addEvent(el, eventName, bindFunc, FALSE);
	                        view.on('destroy', function () {
	                            _removeEvent(el, eventName, bindFunc);
	                        });
	                    } else {
	                        if (view.isReady) {
	                            bindFunc();
	                        } else {
	                            view.on('ready', function () {
	                                bindFunc();
	                            });
	                        }
	                    }
	
	                    view.on('destroy', function () {
	                        if (widget && _isFunction(widget.destroy)) {
	                            widget.destroy();
	                        }
	                        widget = NULL;
	                        adapter = NULL;
	                        options = NULL;
	                        bindFunc = NULL;
	                    });
	                }
	            });
	    }
	
	    function doReady(view) {
	        view.isReady = TRUE;
	        view.trigger('ready');
	        _apply(view.options.ready, view);
	        view.trigger('completed');
	    }
	
	    function getViewIndex(name) {
	        return name.split('-')[0].split(':')[1];
	    }
	
	    function View(options) {
	        var me = this;
	
	        me.options = _extend(TRUE, {}, DEFAULT_OPT, options);
	        me.name = me.options.name || ('view-' + _getUniqueID());
	        //INFO '[View] 创建视图', me.name
	        /**
	         * 容器
	         *
	         * @property View.container
	         * @category Class:View
	         * @type {Element}
	         */
	        me.container = NULL;
	        /**
	         * 是否已经ready
	         *
	         * @property View.isReady
	         * @category Class:View
	         * @type {Boolean}
	         */
	        me.isReady = FALSE;
	        /**
	         * 是否显示
	         *
	         * @property View.isShow
	         * @category Class:View
	         * @type {Boolean}
	         */
	        me.isShow = FALSE;
	        /**
	         * 根节点
	         *
	         * @property View.root
	         * @category Class:View
	         * @type {Element}
	         */
	        me.root = NULL;
	        me.nodes = NULL;
	        /**
	         * 参数
	         *
	         * @property View.param
	         * @category Class:View
	         * @type {Element}
	         */
	        me.param = {};
	        /**
	         * 插件映射
	         *
	         * @property View.plugins
	         * @category Class:View
	         * @type {Object<String, Plugin>}
	         */
	        me.plugins = {};
	        /**
	         * 组件映射
	         *
	         * @property View.widgets
	         * @category Class:View
	         * @type {Object<String, Widget>}
	         */
	        me.widgets = {};
	        /**
	         * 扩展配置
	         *
	         * @property View.extra
	         * @category Class:View
	         * @type {Object}
	         */
	        me.extra = _extend({}, me.options.extra);
	
	        me._locked = FALSE;
	        me._renderEventTimer = NULL;
	        me._renderDeferred = new Deferred();
	
	        //INFO '[View] 开始初始化视图', me.name
	        initialize(me);
	        //INFO '[View] 开始绑定事件', me.name
	        bindEvents(me);
	        //INFO '[View] 开始处理插件', me.name
	        handlePlugin(me);
	
	        me.on('show', function() {
	           me.isShow = TRUE;
	        });
	
	        me.on('hide', function() {
	            me.isShow = FALSE;
	        });
	    }
	
	    _extend(View.prototype, CustEvent, {
	        /**
	         * 渲染到容器中
	         *
	         * @prototype View.prototype.renderTo
	         * @category Class:View
	         * @private
	         * @type {Function}
	         * @param {Element} container 渲染到的容器
	         * @return {View} view 视图实例
	         */
	        renderTo: function (container) {
	            var me = this;
	            //INFO '[View] 渲染视图', me.name, '容器', container
	            if (!me._locked) {
	                me._locked = TRUE;
	                me.container = container;
	                if (!me.isReady) {
	                    me.root = createRoot();
	                    _attr(me.root, 'qapp-name', me.name);
	                    _addClass(me.root, me.options.classNames.join(' '));
	                    _attr(me.root, me.options.attrs);
	                    _css(me.root, me.options.styles);
	                    me.trigger('loadStart');
	                    $fetchNode(me).done(function () {
	                        me.html = me.options.html;
	                        me.trigger('loadEnd');
	                        me.container.appendChild(me.root);
	                        me.renderHTML().done(function () {
	                            me.trigger('rendered');
	                            me.trigger('loaded');
	                            me._locked = FALSE;
	                            doReady(me);
	                        });
	                    });
	                } else {
	                    me.trigger('rendered');
	                    me.container.appendChild(me.root);
	                    me.trigger('loaded');
	                    me._locked = FALSE;
	                    me.trigger('completed');
	                }
	            }
	            return me;
	        },
	        /**
	         * 渲染HTML
	         *
	         * @prototype View.prototype.renderHTML
	         * @category Class:View
	         * @private
	         * @type {Function}
	         * @param {String} html html模板
	         * @return {Deferred} deferred 异步对象
	         */
	        renderHTML: function (html) {
	            var me = this,
	                deferred = me._renderDeferred,
	                cb = function (e) {
	                    if (me._renderEventTimer) {
	                        clearTimeout(me._renderEventTimer);
	                        me._renderEventTimer = NULL;
	                    }
	                    me._renderEventTimer = _delay(function () {
	                        if (me.root) {
	                            me._renderEventTimer = NULL;
	                            deferred.resolve();
	                        }
	                    }, RENDER_TIMEOUT);
	                };
	
	            me.html = html || me.html;
	            me.nodes = _builder(me.html).children;
	
	            if (me.nodes.length) {
	                _addEvent(me.root, 'DOMNodeInserted', cb, FALSE);
	                _appendNodes(me.root, me.nodes);
	                deferred.done(function () {
	                    _removeEvent(me.root, 'DOMNodeInserted', cb);
	                    handleWidget(me);
	                });
	                me._renderEventTimer = _delay(function () {
	                    if (me.root) {
	                        me._renderEventTimer = NULL;
	                        deferred.resolve();
	                    }
	                }, RENDER_TIMEOUT);
	            } else {
	                if (me.root) {
	                    handleWidget(me);
	                    deferred.resolve();
	                }
	            }
	            return deferred;
	        },
	        staticBuild: function(root) {
	            var me = this;
	            //INFO '[View] 静态构建', me.name
	            if (root && _isElement(root)) {
	                me.trigger('loadStart');
	                me.html = root.innerHTML || '';
	                me.trigger('loadEnd');
	                me.container = root.parentNode || root;
	                me.root = root;
	                _attr(me.root, 'qapp-name', me.name);
	                _addClass(me.root, me.options.classNames.join(' '));
	                _attr(me.root, me.options.attrs);
	                _css(me.root, me.options.styles);
	                me.nodes = _makeArray(root.children) || [];
	                handleWidget(me);
	                me.trigger('rendered');
	                me.trigger('loaded');
	                doReady(me);
	                me.trigger('completed');
	                me.trigger('beforeShow');
	                me.trigger('show');
	                me.trigger('actived');
	            }
	            return me;
	        },
	        /**
	         * 显示
	         *
	         * @prototype View.prototype.show
	         * @category Class:View
	         * @type {Function}
	         * @param {Element} container 渲染到的节点
	         * @param {Object} [startCss] 开始的样式
	         * @param {Object} [endCss] 结束的样式
	         * @param {Number} [duration] 持续时间，默认 200
	         * @return {View} view 当前视图实例
	         * @explain
	         * * 动画插件会复写此方法。
	         * * *QApp.open* 和 *QApp.show* 会自动调用此方法
	         */
	        show: $display.show,
	        /**
	         * 隐藏
	         *
	         * @prototype View.prototype.hide
	         * @category Class:View
	         * @type {Function}
	         * @return {View} view 当前视图实例
	         * @explain
	         * * 动画插件会复写此方法
	         * * *QApp.open* 和 *QApp.show* 会复写此方法
	         */
	        hide: $display.hide,
	        /**
	         * 关闭
	         *
	         * @prototype View.prototype.close
	         * @category Class:View
	         * @type {Function}
	         * @return {View} view 当前视图实例
	         * @explain
	         * * 动画插件会复写此方法
	         * * *QApp.open* 和 *QApp.show* 会复写此方法
	         */
	        close: $display.hide,
	        /**
	         * Merge 参数
	         *
	         * @prototype View.prototype.mergeParam
	         * @category Class:View
	         * @private
	         * @type {Function}
	         * @param {Object} newParam 新参数
	         * @return {View} view 当前视图实例
	         */
	        mergeParam: function (newParam) {
	            var me = this;
	            //INFO '[View] Merge 参数在视图', me.name, '上，新参数为', newParam
	            _extend(TRUE, me.param, newParam);
	            return me;
	        },
	        fn: function (name) {
	            var me = this;
	            return function () {
	                return _isFunction(me[name]) ?
	                    me[name].apply(this, _makeArray(arguments)) :
	                    NULL;
	            };
	        },
	
	        /**
	         * 绑定事件
	         *
	         * @prototype View.prototype.on
	         * @category Class:View
	         * @type {Function}
	         * @param {String} name 事件名
	         * @param {Function} listener 监听的回调
	         * @return {View} view 当前视图实例
	         */
	
	        /**
	         * 绑定事件（只监听一次）
	         *
	         * @prototype View.prototype.once
	         * @category Class:View
	         * @type {Function}
	         * @param {String} name 事件名
	         * @param {Function} listener 监听的回调
	         * @return {View} view 当前视图实例
	         */
	
	        /**
	         * 取消绑定事件
	         *
	         * @prototype View.prototype.off
	         * @category Class:View
	         * @type {Function}
	         * @param {String} [name] 事件名
	         * @param {Function} [listener] 监听的回调
	         * @return {View} view 当前视图实例
	         * @explain
	         * listener 不给出，则取消绑定此次事件名所有绑定的回调
	         * name 不给出，则取消所有绑定的事件
	         */
	
	        /**
	         * 触发事件
	         *
	         * @prototype View.prototype.trigger
	         * @category Class:View
	         * @type {Function}
	         * @param {String} name 事件名
	         * @param {Object} data 数据
	         * @return {View} view 当前视图实例
	         */
	
	        /**
	         * 绑定事件
	         *
	         * @prototype View.prototype.frontOn
	         * @category Class:View
	         * @type {Function}
	         * @param {String} name 事件名
	         * @param {Function} listener 监听的回调
	         * @return {View} view 当前视图实例
	         */
	        frontOn: function(name, listener) {
	            var me = this,
	                events = me._events[name] = me._events[name] || [];
	            events.unshift({
	                callback: listener,
	                ctx: me
	            });
	            return me;
	        },
	        /**
	         * 扫描并渲染组件
	         *
	         * @prototype View.prototype.scanWidget
	         * @category Class:View
	         * @type {Function}
	         * @param {Element} container 节点
	         */
	        scanWidget: function(container) {
	            handleWidget(this, container);
	        },
	        /**
	         * 显示组件
	         *
	         * @method View.prototype.showWidget
	         * @category Class:View
	         * @core
	         * @param {String} name 组件名
	         * @param {Element} [el] 节点
	         * @param {Object} options 配置
	         * @return {Any} obj 组件返回的对象
	         * @example
	         * var widget = View.showWidget('searchlist', {
	         *    onComplete: function() {
	         *          todoSomething();
	         *    }
	         * });
	         * @explain
	         * 所需参数和返回的对象由组件的适配器决定
	         */
	        showWidget: function (name, el, options) {
	            var widgets = QApp._widgets;
	            if (widgets[name]) {
	                if (_isElement(el)) {
	                    return widgets[name].adapter(el, options, this);
	                } else {
	                    return widgets[name].adapter(NULL, el, options, this);
	                }
	            }
	        },
	        /**
	         * 销毁视图
	         *
	         * @prototype View.prototype.destroy
	         * @category Class:View
	         * @private
	         * @type {Function}
	         * @explain
	         * 一般不需用户调用
	         */
	        destroy: function () {
	            //INFO '[View] 销毁视图:', this.name
	            var me = this;
	            if (me.options.destroyDom) {
	                _removeNode(me.root);
	            }
	
	            clearTimeout(me._renderEventTimer);
	
	            if (me._renderDeferred) {
	                me._renderDeferred.destroy();
	            }
	
	            _each(me.plugins, function(key, plugin) {
	                if (plugin && _isFunction(plugin.destroy)) {
	                    plugin.destroy();
	                }
	            });
	
	            _each(me.widgets, function(key, widget) {
	                if (widget && _isFunction(widget.destroy)) {
	                    widget.destroy();
	                }
	            });
	
	            me.trigger('destroy');
	            me.off();
	
	            _empty(me);
	
	            me.destroyed = TRUE;
	
	            return me;
	        }
	    });
	
	    return View;
	});
	
	/**
	 * 将要开始显示
	 *
	 * @event View:beforeShow
	 * @category Event:View
	 */
	
	/**
	 * 显示
	 *
	 * @event View:show
	 * @category Event:View
	 * @core
	 * @explain
	 * 业务逻辑推荐在这里开始执行，类似ajax的逻辑，会影响动画效率。
	 * 只有视图第一次显示时，才触发此事件。
	 */
	
	/**
	 * 将要开始隐藏
	 *
	 * @event View:beforeHide
	 * @category Event:View
	 */
	
	/**
	 * 隐藏
	 *
	 * @event View:hide
	 * @category Event:View
	 */
	
	/**
	 * 接收到数据
	 *
	 * @event View:receiveData
	 * @category Event:View
	 * @core
	 * @param {String} view 来源的视图名，例 view
	 * @param {String} name 带索引的视图名, 例 view:1
	 * @param {Object} [data] 携带的数据
	 * @example
	 * view.bind('receiveData', function(data) {
	 *     execute(data); //TODO 处理data
	 * });
	 * @explain
	 * 使用 [QApp.open](#QApp-router-open) 时，数据回溯，建议使用此事件接收。
	 */
	
	/**
	 * 被激活
	 *
	 * @event View:actived
	 * @category Event:View
	 * @core
	 * @explain
	 * 视图每次展现都会触发此事件
	 */
	
	/**
	 * 被取消激活
	 *
	 * @event View:deactived
	 * @category Event:View
	 */
	
	/**
	 * 销毁
	 *
	 * @event View:destroy
	 * @category Event:View
	 * @explain
	 * 一般用于销毁时，自动销毁用户创建的一些对象或者终止正在进行中的逻辑
	 */
	
	define('taskQ', function () {
	
	    var messageCenter = _createEventManager(),
	        curTasks = NULL,
	        timeout = 500;
	
	    function createQueue(tasks) {
	        QApp.trigger('running', TRUE);
	        _queue(tasks, [], TRUE).done(function() {
	            curTasks.forEach(function(task) {
	                if (task && _isFunction(task.destroy)) {
	                    task.destroy();
	                }
	            });
	            curTasks = NULL;
	            QApp.trigger('running', FALSE);
	        }).progress(function() {
	            messageCenter.trigger('ev');
	        });
	    }
	
	    var taskQueue = {
	        push: function(defer) {
	            if (curTasks) {
	                curTasks.push(defer);
	            } else {
	                curTasks = [defer];
	                createQueue(curTasks);
	            }
	        },
	        pushTask: function(task) {
	            taskQueue.push(new Deferred().startWith(function(that) {
	                try {
	                    task(that);
	                } catch(e) {}
	                _delay(function() {
	                    if (that && _isFunction(that.resolve)) {
	                        that.resolve();
	                    }
	                }, timeout);
	            }));
	        },
	        addListener: function(fn) {
	            messageCenter.on('ev', fn);
	        }
	    };
	
	    return taskQueue;
	});
	define('viewM', function() {
	
	    var View = r('view'),
	        $taskQueue = r('taskQ');
	
	    var optionsMap = QApp._viewOptionsMap = {},
	        viewMap = QApp._viewMap = {};
	
	    function throwNoViewError(name) {
	        //WARN '没有找到相应视图', name
	    }
	
	    function getRealName(name) {
	        return name.split(':')[0];
	    }
	
	    function getView(name, index, callback) {
	        var view;
	        if (viewMap[name] && viewMap[name][index]) {
	            callback(viewMap[name][index]);
	        } else if (optionsMap[name]) {
	            view = viewMap[name][index] = new View(_extend({
	                name: name + ':' + index
	            }, optionsMap[name]));
	            view.on('destroy', function () {
	                viewMap[name][index] = NULL;
	            });
	            callback(view);
	        } else {
	            throwNoViewError(name);
	        }
	    }
	
	    function getViewSync(name, index) {
	        var view = NULL;
	        if (viewMap[name] && viewMap[name][index]) {
	            view = viewMap[name][index];
	        } else if (optionsMap[name]) {
	            view = viewMap[name][index] = new View(_extend({
	                name: name + ':' + index
	            },optionsMap[name]));
	            view.on('destroy', function () {
	                viewMap[name][index] = NULL;
	            });
	        } else {
	            throwNoViewError(name);
	        }
	        return view;
	    }
	
	    function getNameAndIndex(key) {
	        var values = key.split(':');
	        return {
	            name: values[0],
	            index: values[1] || 0
	        };
	    }
	
	    function bindEvents(view, options) {
	        _each(options, function(key, value) {
	            if (key.indexOf('on') === 0 && _isFunction(value) && key != 'onComplete') {
	                view.on(key.substring(2).replace(/\w/, function (a) {
	                    return a.toLowerCase();
	                }), value);
	            }
	        });
	    }
	
	    function getOptions(args) {
	        return _extend.apply(NULL, [TRUE, {}].concat(_makeArray(args).map(function (item) {
	            return _isString(item) ? optionsMap[item] || {} : item;
	        })));
	    }
	
	    var Manager = {
	        /**
	         * 定义视图
	         *
	         * @method QApp.view.define
	         * @category View
	         * @core
	         * @alias QApp.defineView
	         * @param {String} name 视图名
	         * @param {Object} options 配置
	         * @example
	         *     QApp.defineView('view', {
	         *        // 模板
	         *        html: '',
	         *        // 给视图根节点添加的样式
	         *        classNames: ['class1', 'class2'],
	         *        // 给视图根节点添加的属性
	         *        attrs: {
	         *            'data-some': 'qapp'
	         *        },
	         *        // 给视图根节点添加的样式
	         *        styles: {
	         *            'background-color': 'red'
	         *        },
	         *        // 给视图实例添加属性和方法
	         *        init: {
	         *            someValue: null,
	         *            doSomething: function() {
	         *            }
	         *        },
	         *        // 插件配置
	         *        plugins: ['plugin1', {
	         *            name: 'plugin2',
	         *            options: {
	         *            }
	         *        }],
	         *        // 视图生命周期事件绑定
	         *        bindEvents: {
	         *            'show': function() {
	         *                // this 指向视图实例
	         *            }
	         *        },
	         *        // 视图创建完成的回调
	         *        ready: function() {
	         *            // this 指向视图实例
	         *        }
	         *     });
	         *
	         */
	        define: function (name) {
	            if (_isString(name)) {
	                optionsMap[name] = getOptions(arguments);
	                viewMap[name] = [];
	            }
	        },
	        /**
	         * 取消定义视图
	         *
	         * @method QApp.view.undefine
	         * @category View
	         * @param {String} name 视图名
	         */
	        undefine: function (name) {
	            if (_isString(name)) {
	                optionsMap[name] = NULL;
	            }
	        },
	        /**
	         * 获取视图定义的配置
	         *
	         * @method QApp.view.getOptions
	         * @category View
	         * @param {String} name 视图名
	         * @return {Object} options 配置
	         */
	        getOptions: function(name) {
	            return optionsMap[name];
	        },
	        /**
	         * 创建视图实例
	         *
	         * @method QApp.view.create
	         * @category View
	         * @param {Object} options 视图配置
	         * @return {View} view 视图实例
	         */
	        create: function () {
	            var entity = new View(getOptions(arguments)),
	                name = entity.name;
	            if (name) {
	                var opt = getNameAndIndex(name);
	                viewMap[opt.name][opt.index] = entity;
	                entity.on('destroy', function() {
	                    viewMap[opt.name][opt.index] = NULL;
	                });
	            }
	            return entity;
	        },
	        structure: function(viewName, options) {
	            options = options || {};
	            options.ani = _isString(options.ani) ? {name : options.ani} : options.ani || {};
	
	            var opt = _extend(TRUE, {}, Manager.getOptions(viewName.split(":")[0])),
	                type = options.ani.name || Config.defaultAnimate;
	
	            opt.name = viewName;
	
	            opt.init = opt.init || {};
	            opt.init.param = options.param || {};
	            opt.styles = _extend(opt.styles || {}, options.styles);
	            opt.classNames = (opt.classNames || []).concat(options.classNames);
	            if (type) {
	                opt.plugins = (opt.plugins || []).concat([{
	                    name: type,
	                    options: _extend({}, Manager.getExtraOption(viewName, type), options.ani)
	                }]);
	            }
	
	            var entity = Manager.create(opt);
	
	            entity.param = _extend({}, options.param);
	
	            bindEvents(entity, options);
	
	            entity.complete = function(data) {
	                if (_isFunction(options.onComplete)) {
	                    options.onComplete.call(entity, data);
	                }
	            };
	
	            // 兼容原形式
	            entity.on('callback', entity.complete);
	
	            return entity;
	        },
	        build: function(root) {
	            var options = getOptions(_makeArray(arguments).slice(1)),
	                view;
	            if (root && _isElement(root)) {
	                options.name = _attr(root, 'qapp-name');
	                view = new View(options);
	                view.staticBuild(root);
	            }
	            return view;
	        },
	        /**
	         * 显示视图
	         *
	         * @method QApp.view.show
	         * @category View
	         * @core
	         * @alias QApp.show
	         * @param {String} name 视图名
	         * @param {Object} [options] 配置
	         * @param {Object} [options.param] 传入参数
	         * @param {String|Object} [options.ani] 动画参数
	         * @param {Function} [callback] 回调
	         * @example
	         * QApp.show('view', {
	         *     param: {
	         *         x: 1,
	         *         y: 2
	         *     },
	         *     ani: 'actionSheet',
	         *     onComplete: function(data) {
	         *     }
	         * });
	         * @explain
	         * *show* 主要用于视图内的组件类的内容展示，类似于PC端的弹层。
	         * 关于动画，请参看 [QApp-plugin-basic](plugins.html#QApp-plugin-basic)
	         */
	        show: function(viewName, options) {
	            var args = _makeArray(arguments);
	            //DEBUG 'Show Arguments: ', args
	            var view = Manager.structure(viewName, options);
	            $taskQueue.pushTask(function(that) {
	                view.once('show', function() {
	                    that.resolve();
	                });
	                // 隐藏即销毁
	                view.once('hide', function() {
	                    _delay(function() {
	                        if (_isFunction(view.destroy)) {
	                            view.destroy();
	                        }
	                    });
	                });
	                view.show.apply(view, args.slice(2));
	            });
	            return view;
	        },
	        /**
	         * 查看视图是否定义
	         *
	         * @method QApp.view.exists
	         * @category View
	         * @alias QApp.existsView
	         * @param {String} name 视图名
	         * @return {Boolean} flag 是否存在
	         */
	        exists: function (name) {
	            return !!optionsMap[name];
	        },
	        /**
	         * 获取视图实例（异步）
	         *
	         * @method QApp.view.get
	         * @category View
	         * @alias QApp.getView
	         * @param {String} name 视图名
	         * @param {Function} callback 回调
	         * @example
	         * QApp.getView('someView', function(view) {
	         *      // view
	         * });
	         */
	        get: function (key, callback) {
	            var opt = {}, that;
	            if (_isString(key)) {
	                opt = getNameAndIndex(key);
	            }
	            if (_isFunction(callback)) {
	                getView(opt.name, opt.index, function (view) {
	                    callback(view);
	                });
	            } else {
	                that = {
	                    invoke: function () {
	                        var args = _makeArray(arguments),
	                            funcName = args.shift();
	                        getView(opt.name, opt.index, function (view) {
	                            _apply(view[funcName], view, args);
	                        });
	                        return that;
	                    },
	                    pushMessage: function (type, message) {
	                        var view = viewMap[opt.name] && viewMap[opt.name][opt.index];
	                        if (view) {
	                            view.trigger(type, message);
	                        }
	                        return that;
	                    }
	                };
	
	                return that;
	            }
	        },
	        /**
	         * 获取视图实例（同步）
	         *
	         * @method QApp.view.getSync
	         * @category View
	         * @alias QApp.getViewSync
	         * @param {String} name 视图名
	         * @return {View} view 视图实例
	         */
	        getSync: function(key) {
	            var opt = {}, values;
	            if (_isString(key)) {
	                values = key.split(':');
	                opt = {
	                    name: values[0],
	                    index: values[1] || 0
	                };
	            }
	            return getViewSync(opt.name, opt.index);
	        },
	        getExtraOption: function (name, key) {
	            var extra,
	                options = optionsMap[getRealName(name)];
	            if (options) {
	                extra = (options.extra && options.extra[Config.type]) || options.extra || {};
	                return extra[key];
	            }
	        },
	        getHashParams: function(name) {
	            var options = optionsMap[getRealName(name)];
	            return options ? options.hashParams || [] : [];
	        },
	        getRealName: getRealName
	    };
	
	    return Manager;
	
	});
	
	define('viewQ', function () {
	
	    var $display = r('display'),
	        $taskQueue = r('taskQ'),
	        $viewM = r('viewM'),
	        $router;
	
	    var decStack = [],
	        pushTask = $taskQueue.pushTask,
	        getRealName = $viewM.getRealName;
	
	    function getMinZIndex() {
	        var dec = decStack[0],
	            zIndex;
	        if (dec && dec.root) {
	            zIndex = parseInt(_css(dec.root, 'z-index'));
	        }
	        return (zIndex || _getZIndex()) - 1;
	    }
	
	    function getLast() {
	        if (decStack.length) {
	            return decStack[decStack.length - 1];
	        }
	    }
	
	    function findByName(name) {
	        var l = decStack.length,
	            i;
	        for (i = l - 1; i > -1; i --) {
	            if (decStack[i].name == name) {
	                return i;
	            }
	        }
	        return -1;
	    }
	
	    function fixName(name) {
	        if (name.indexOf(':new') > -1) {
	            return name.replace(':new', ':' + _getUniqueID());
	        } else {
	            for (var i = 0, l = decStack.length; i< l; i ++) {
	                if (name == decStack[i].name.split(':')[0]) {
	                    return false;
	                }
	            }
	            return name;
	        }
	    }
	
	    function run(dec, type, launch, arg, callback) {
	        type = type || 'show';
	        pushTask(function(that) {
	            dec.on(type.replace('_', ''), function() {
	                _delay(function() {
	                    that.resolve().done(callback);
	                });
	            });
	            if (_isFunction(launch)) {
	                launch();
	            } else {
	                dec[type](arg);
	                if (type.indexOf('hide') > -1 && !arg) {
	                    that.resolve();
	                }
	            }
	        });
	    }
	
	    function hideRun(dec) {
	        run(dec, '_hide', function () {
	            $display.hide.call(dec);
	        });
	    }
	
	    function execute(dec) {
	        var _hide = dec.hide,
	            _close = dec.close,
	            showEvents = dec._events.show = dec._events.show || [],
	            activedEvents = dec._events.actived = dec._events.actived || [];
	
	        function refresh() {
	            viewQueue.preView = viewQueue.curView;
	            viewQueue.curView = dec.name;
	        }
	
	        showEvents.unshift({
	            callback: refresh,
	            ctx: dec
	        });
	
	        activedEvents.unshift({
	            callback: refresh,
	            ctx: dec
	        });
	
	        dec.once('hide', function() {
	            var index = decStack.indexOf(dec);
	            if (index > -1) {
	                decStack.splice(index, 1);
	                _delay(function() {
	                    if (_isFunction(dec.destroy)) {
	                        dec.destroy();
	                    }
	                });
	            }
	        });
	
	        dec.hide = dec._hide = function(immediately) {
	            if (immediately === TRUE) {
	                _hide.call(dec);
	            } else {
	                pushTask(function (that) {
	                    dec.once('hide', function () {
	                        _delay(that.resolve);
	                    });
	                    _hide.call(dec);
	                });
	            }
	        };
	
	        dec.close = dec._close = function(immediately) {
	            if (immediately === FALSE) {
	                _close.call(dec);
	            } else {
	                pushTask(function (that) {
	                    dec.once('hide', function () {
	                        _delay(that.resolve);
	                    });
	                    _close.call(dec);
	                });
	            }
	        };
	    }
	
	    var viewQueue = {
	        curView: NULL,
	        preView: NULL,
	        add: function(name, options, atBottom, callback, startCallback) {
	            pushTask(function(that) {
	                //INFO '[ViewQueue] 增加视图', name, '配置', options, '是否从底部渲染', !!atBottom
	                name = fixName(name);
	                if (_isFunction(startCallback)) {
	                    if (startCallback(name) === FALSE) {
	                        that.resolve().done(_callback);
	                        return;
	                    }
	                }
	                var _callback = _isFunction(callback) ? callback : _noop;
	                if (name) {
	                    if ($viewM.exists(getRealName(name))) {
	                        viewQueue[atBottom ? 'unshift' : 'push']($viewM.structure(name, options), _callback);
	                        that.resolve();
	                    } else {
	                        //WARN 'Do Not Found View'
	                        that.resolve().done(_callback);
	                    }
	                } else {
	                    //WARN 'Do Not Show Same View.'
	                    that.resolve().done(_callback);
	                }
	            });
	        },
	        push: function(dec, callback) {
	            execute(dec);
	            dec.once('show', function() {
	                var lastDec = getLast();
	                _delay(function() {
	                    dec.trigger('actived');
	                    if (lastDec) {
	                        lastDec.trigger('deactived');
	                    }
	                });
	                decStack.push(dec);
	            });
	            run(dec, 'show', NULL, FALSE, function() {
	                callback(dec);
	            });
	        },
	        unshift: function(dec, callback) {
	            execute(dec);
	            dec.once('show', function() {
	                decStack.unshift(dec);
	                if (decStack.length === 1) {
	                    _delay(function() {
	                        dec.trigger('actived');
	                    });
	                }
	            });
	            dec.on('beforeShow', function() {
	                dec.initialShow = FALSE;
	                _css(dec.root, 'z-index', getMinZIndex() - 1);
	            });
	            run(dec, 'show', function() {
	                dec.show(TRUE);
	            }, FALSE,  function() {
	                callback(dec);
	            });
	        },
	        pop: function(num, data, callback) {
	            var dec = getLast();
	            if (num === UNDEFINED) {
	                num = 1;
	            }
	            if (dec && num > 0) {
	                var process = function(immediately) {
	                    var l = decStack.length,
	                        begin = l - num,
	                        i;
	                    if (begin >= 0) {
	                        for (i = begin; i < l - 1; i++) {
	                            hideRun(decStack[i]);
	                        }
	                    }
	                    if (begin > 0 && num > 0) {
	                        dec.once('hide', function () {
	                            var prevDec = decStack[begin - 1];
	                            if (prevDec) {
	                                if (data && data.data) {
	                                    prevDec.trigger('receiveData', data);
	                                }
	                                prevDec.trigger('actived');
	                            }
	                        });
	                    }
	                    run(dec, '_hide', NULL, immediately, callback);
	                };
	
	                pushTask(function (that) {
	                    if (num < decStack.length) {
	                        process(TRUE);
	                    } else if (num == decStack.length) {
	                        if (getRealName(decStack[0].name) !== Config.indexView) {
	                            viewQueue.add(Config.indexView, {}, TRUE);
	                            pushTask(function (that) {
	                                process(FALSE);
	                                that.resolve();
	                            });
	                        } else if (decStack.length > 1) {
	                            num = decStack.length - 1;
	                            process(TRUE);
	                        }
	                    }
	                    that.resolve();
	                });
	            }
	        },
	        remove: function(name, param, callback) {
	            pushTask(function(that) {
	                var index = findByName(name);
	                if (index > -1) {
	                    viewQueue.pop(decStack.length - index, param, callback);
	                }
	                that.resolve();
	            });
	        },
	        backTo: function(name, param, query, callback) {
	            //INFO '[ViewQueue] 回退到视图:', name, '参数', param, 'Hash参数', query
	            pushTask(function(that) {
	                var index = findByName(name),
	                    len = decStack.length;
	                //INFO '[ViewQueue] 视图索引', index
	                if (index === -1) {
	                    //INFO '[ViewQueue] 渲染视图', getRealName(name)
	                    viewQueue.add(getRealName(name), {
	                        param: query
	                    }, TRUE, function(view) {
	                        $router._reset(view);
	                        //INFO '[ViewQueue] 渲染完成，回退'
	                        viewQueue.pop(len, param, callback);
	                    });
	                } else {
	                    //INFO '[ViewQueue] 直接回退'
	                    len = decStack.length - index - 1;
	                    viewQueue.pop(len, param, callback);
	                }
	                that.resolve();
	            });
	        },
	        refresh: function(data) {
	            var dec = getLast();
	            if (dec) {
	                dec.trigger('receiveData', data);
	            }
	        },
	        clear: function(param, callback) {
	            pushTask(function(that) {
	                viewQueue.pop(decStack.length, param, callback);
	                that.resolve();
	            });
	        },
	        inject: function(router) {
	            $router = router;
	        }
	    };
	
	    return viewQueue;
	
	});
	
	define('history', function() {
	
	    var $viewM = r('viewM');
	
	    var location = win.location,
	        history = win.history,
	        sessionStorage = win.sessionStorage,
	        sessionSupport = !!sessionStorage, // 支持sessionStorage情况
	        historyStorage = sessionSupport ? win.sessionStorage : win.localStorage, // 历史纪录存储
	        useHash = TRUE, // 是否开启 Hash
	        hashSupport = NULL, // Hash 支持情况情况
	        usePath = NULL, // Hash 支持情况情况
	        h5Mode = !!(history.pushState), // h5 模式
	        hashChangeEvent = h5Mode ? 'popstate' : 'hashchange', // 监听的事件
	        localKeyPrefix = 'QAPP_HISTORY_', // 存储的前缀
	        localKeyId = 0, // 本地存储的id
	        localKey = '', // 本地历史存储的 key = localKeyPrefix + localKeyId
	        historyHashId = '_history',
	        localHistory = [], // 本地历史
	        backLocalHistory = [],
	        historyIndex = 0, // 历史索引
	        backHistoryIndex = 0,
	        virtualHistory = [], // 虚拟历史
	        eventManager = _createEventManager(), // 事件管理
	        getRealName = $viewM.getRealName, // 获取 realname
	        paramList = [], // Param List
	        basePath = (function() {
	            var obj = _parseURL(location.href);
	            obj.hash = {};
	            delete obj.query._qtid;
	            return obj.toUrl();
	        })(), // 页面基础 Url
	        curHash, // 当前的Hash
	        infoCache; // info 缓存
	
	    // fix Name
	    function fixName(name) {
	        if (name.length > 2 && name.lastIndexOf(':0') == name.length - 2) {
	            return name.substring(0, name.length - 2);
	        }
	        return name;
	    }
	
	    // 是否支持hash
	    function supportHash(view) {
	        view = getRealName(view);
	        var viewOpt = $viewM.getOptions(view);
	        // 视图配置不支持hash
	        if (!viewOpt || viewOpt.supportHash === FALSE) {
	            return FALSE;
	        }
	        // all时排定排除
	        if (hashSupport.all && hashSupport.except.indexOf(view) > -1) {
	            return FALSE;
	        }
	        // 非all时判定存在
	        if (!hashSupport.all && hashSupport.exist.indexOf(view) === -1) {
	            return FALSE;
	        }
	        return TRUE;
	    }
	
	    // 获取数组最后一个元素
	    function getLast(list) {
	        return list[list.length - 1];
	    }
	
	    // 触发事件
	    function pushMessage(type, data) {
	        return eventManager.trigger('change', {
	            type: type,
	            data: _extend(TRUE, {}, data)
	        });
	    }
	
	
	    // 初始化 本地历史
	    function initLocalHistory() {
	        var data = {},
	            curInfo = analyzeHash();
	
	        // 开头为 __ 为特殊的跳转视图，不做历史纪录的判定
	        if (curInfo.view && curInfo.view.indexOf('__')) {
	
	            if (sessionSupport) {
	                //INFO '[History] 使用 sessionStorage 存储历史记录'
	                localKey = historyHashId;
	            } else {
	                //INFO '[History] 使用 Hash 储存历史纪录'
	                if (curInfo.query[historyHashId]) {
	                    localKeyId = curInfo.query[historyHashId];
	                    localKey = localKeyPrefix + localKeyId;
	                } else {
	                    do {
	                        localKeyId = _getUniqueID();
	                        localKey = localKeyPrefix + localKeyId;
	                    } while (historyStorage[localKey]);
	                    setInfo(curInfo, TRUE);
	                }
	                //INFO '[History] Hash 历史 ID:', localKeyId
	            }
	
	            try {
	                data = JSON.parse(historyStorage.getItem(localKey)) || {};
	            } catch (e) {}
	
	            if (data.basePath == basePath) {
	                localHistory = _makeArray(data.history);
	                historyIndex = data.index;
	                // 判断历史是否和页面显示一直，如果不一致，清空
	                if (localHistory[historyIndex] !== curInfo.view) {
	                    localHistory = [];
	                    historyIndex = 0;
	                    historyStorage.removeItem(localKey);
	                }
	            }
	
	            if (!localHistory.length) {
	                localHistory.push(curInfo.view);
	            }
	
	            backLocalHistory = localHistory.slice(0);
	            backHistoryIndex = historyIndex;
	
	            //INFO '[History] 当前历史纪录', JSON.stringify(localHistory)
	
	        }
	    }
	
	
	    // 存储历史
	    function saveHistory() {
	        //INFO '[History] 存储历史: ', JSON.stringify(localHistory), '索引位置', historyIndex
	        try {
	            historyStorage.setItem(localKey, JSON.stringify({
	                basePath: basePath,
	                history: localHistory,
	                index: historyIndex
	            }));
	        } catch (e) {}
	    }
	
	    // 更改历史
	    function setHistory(view, replace) {
	        if (replace) {
	            localHistory[historyIndex] = view;
	        } else {
	            historyIndex++;
	            localHistory = localHistory.slice(0, historyIndex);
	            localHistory.push(view);
	        }
	        saveHistory();
	    }
	
	    // 获取 Hash
	    // 以 # 开头，以 # 结尾
	    function getHash() {
	        var path = location.hash,
	            index = path.indexOf('#'),
	            endIndex;
	        if (usePath) {
	            path = location.pathname.replace(usePath.basePath, '').replace(usePath.ext, '');
	        } else {
	            path = index > -1 ? path.slice(index + 1) : '';
	            endIndex = path.indexOf('#');
	            if (endIndex > -1) {
	                path = path.slice(0, endIndex);
	            }
	        }
	        return path;
	    }
	
	    // 设置 hash
	    function setHash(hash, replace) {
	        var path = basePath + '#' + hash;
	        curHash = hash;
	        if (h5Mode) {
	            if (usePath) {
	                var kv = hash.split('?');
	                path = basePath + kv[0] + usePath.ext + (kv.length > 1 ? '?' + kv.slice(1).join('?') : '');
	            }
	            history[(replace ? 'replace' : 'push') + 'State']({
	                path: path
	            }, doc.title, path);
	        } else {
	            if (replace) {
	                location.replace(path);
	            } else {
	                location.href = path;
	            }
	        }
	    }
	
	    // 获取 路由信息
	    function analyzeHash(hash) {
	        hash = hash || getHash();
	        var vq = hash.split('?'),
	            view = fixName(vq[0]) || Config.indexView,
	            query = _queryToJson(vq[1] || '', TRUE);
	
	        if (Config.jsonParam && query._param) {
	            try {
	                query = _extend(TRUE, query, JSON.parse(query._param));
	                delete query._param;
	            } catch (e) {}
	        }
	
	        return {
	            view: view,
	            query: query
	        };
	    }
	
	    // 获取 路由信息
	    function getInfo() {
	        if (infoCache) {
	            return infoCache;
	        }
	        infoCache = useHash ? (function() {
	            var info = analyzeHash();
	            info[historyHashId] = UNDEFINED;
	            return info;
	        })() : getLast(virtualHistory);
	        return infoCache;
	    }
	
	    // 设置 路由信息
	    function setInfo(info, replace) {
	        info = info || {};
	
	        var view = info.view || Config.indexView,
	            query = info.query || {},
	            curInfo = getInfo(),
	            queryString;
	
	        replace = replace || view == curInfo.view;
	
	        infoCache = NULL;
	
	        if (useHash) {
	            if (!sessionSupport) {
	                // 增加 History ID
	                query[historyHashId] = localKeyId;
	            }
	
	            setHistory(view, replace);
	            if (pushMessage('willForward', {
	                    view: view,
	                    query: query
	                }) !== FALSE) {
	                queryString = _jsonToQuery(Config.jsonParam ? {
	                    _param: JSON.stringify(query)
	                } : query, TRUE);
	                setHash(view + (queryString ? '?' + queryString : ''), replace);
	            } else {
	                return FALSE;
	            }
	        } else {
	            var newInfo = {
	                view: view,
	                query: query
	            };
	            if (replace) {
	                virtualHistory[virtualHistory.length - 1] = newInfo;
	            } else {
	                virtualHistory.push(newInfo);
	            }
	        }
	        return TRUE;
	    }
	
	    // 处理事件
	    function execHash(hash) {
	        var info = hash ? analyzeHash(hash) : getInfo(),
	            curView = info.view,
	            index = localHistory.indexOf(curView),
	            num;
	
	        // 如果在本地找不到相应的，则是做新开视图
	        if (index === -1) {
	            setHistory(curView);
	            pushMessage('forward', {
	                info: info
	            });
	        } else {
	            num = index - historyIndex;
	            historyIndex = index;
	
	            if (num < 0) {
	                // 回退
	                if (!supportHash(info.view)) {
	                    history.back();
	                } else {
	                    pushMessage('back', {
	                        info: info,
	                        param: paramList.shift()
	                    });
	                }
	            } else if (num === 0) {
	                // 刷新
	                pushMessage('refresh', {
	                    info: info
	                });
	            } else if (num === 1) {
	                // 前进一级
	                if (!supportHash(info.view)) {
	                    history.go(historyIndex < localHistory.length - 1 ? 1 : -1);
	                } else {
	                    pushMessage('forward', {
	                        info: info
	                    });
	                }
	            } else {
	                // 前进多级，直接刷新
	                _delay(function() {
	                    location.reload();
	                });
	            }
	            saveHistory();
	        }
	    }
	
	    // 开始监听
	    function startListen() {
	        win.addEventListener(hashChangeEvent, function() {
	            if (curHash !== getHash()) {
	                curHash = getHash();
	                infoCache = NULL;
	                execHash();
	            }
	        });
	    }
	
	    var History = {
	        basePath: basePath,
	        start: function() {
	            var info;
	            //INFO '[History] 开始初始化History模块, 使用Hash:', useHash, '当前Hash：', curHash
	            if (useHash) {
	                hashSupport = Config.hashSupport;
	                usePath = h5Mode ? hashSupport.usePath : FALSE;
	                if (usePath) {
	                    history.basePath = basePath = location.origin + usePath.basePath;
	                }
	                curHash = getHash();
	                info = getInfo();
	                initLocalHistory();
	                //INFO '[History] 初始化，视图: ', info.view, '参数: ', info.query
	                if (!supportHash(info.view)) {
	                    //INFO '[History] 此视图不支持Hash', info.view
	                    if (historyIndex > 0) {
	                        //INFO '[History] 回退一级'
	                        historyIndex--;
	                        infoCache = NULL;
	                        history.back();
	                        saveHistory();
	                        _delay(function() {
	                            History.start(flag);
	                        }, 100);
	                        return;
	                    } else {
	                        //INFO '[History] 显示主页'
	                        info = {
	                            view: Config.indexView,
	                            query: {}
	                        };
	                        setInfo(info, TRUE);
	                    }
	                }
	
	                pushMessage('init', {
	                    info: getInfo()
	                });
	                startListen();
	            } else {
	                info = {
	                    view: Config.indexView,
	                    query: analyzeHash().query
	                };
	                virtualHistory.push(info);
	                pushMessage('init', {
	                    info: info
	                });
	            }
	        },
	        analyzeHash: analyzeHash,
	        setHashInfo: setInfo,
	        getHashInfo: getInfo,
	        refreshParam: function(obj) {
	            var info = getInfo();
	            //INFO '[History] 刷新Hash参数, 视图:', info.view, '当前参数', info.query, '新参数', obj
	            info.query = _extend(info.query, obj);
	            setInfo(info, TRUE);
	        },
	        back: function(num, param) {
	            //INFO '[History] 历史回退, 回退级数', num, '参数', param
	            if (!_isNumber(num)) {
	                num = 1;
	                param = num;
	            }
	            var name = getInfo().view,
	                backData = {
	                    view: getRealName(name),
	                    name: name,
	                    data: param
	                };
	            num = num || 1;
	            if (useHash) {
	                paramList.push(backData);
	                if (historyIndex > num - 1) {
	                    history.go(-num);
	                } else {
	                    var indexView = Config.indexView;
	                    if (historyIndex === 0 && indexView === name) {
	                        QApp.trigger('close');
	                        history.go(-1);
	                    } else {
	                        if (historyIndex > 0) {
	                            history.go(-historyIndex);
	                        }
	                        setInfo({
	                            view: indexView
	                        }, TRUE);
	                        pushMessage('home', {
	                            info: getInfo()
	                        });
	                    }
	                }
	            } else {
	                var backToIndex = virtualHistory.length - num;
	                if (backToIndex < 1) {
	                    backToIndex = 1;
	                }
	                virtualHistory = virtualHistory.slice(0, backToIndex);
	                infoCache = NULL;
	                pushMessage('back', {
	                    info: getLast(virtualHistory),
	                    param: backData
	                });
	            }
	        },
	        backTo: function(view, param, allMatch) {
	            var historyList = useHash ? localHistory : virtualHistory.map(function(item) {
	                    return item.view;
	                }),
	                l = useHash ? historyIndex : (historyList.length - 1),
	                i;
	            //INFO '[History] 回退到视图', view, '参数', param, '是否全匹配', allMatch
	            for (i = l; i > -1; i--) {
	                if ((!allMatch && getRealName(historyList[i]) === view) || historyList[i] === view) {
	
	                    if (i === l) {
	                        // 刷新
	                        pushMessage('refresh', {
	                            info: getInfo(),
	                            param: param
	                        });
	                    } else {
	                        History.back(l - i, param);
	                    }
	                    return TRUE;
	                }
	            }
	            return FALSE;
	        },
	        home: function(param) {
	            //INFO '[History] 回退到首页'
	            History.back(useHash ? historyIndex : (virtualHistory.length - 1), param);
	        },
	        exit: function() {
	            //INFO '[History] 退出应用'
	            QApp.trigger('close');
	            if (useHash) {
	                history.go(-historyIndex - 1);
	            } else {
	                history.back();
	            }
	        },
	        onChange: function(fn) {
	            eventManager.on('change', fn);
	        },
	        buildHash: function(info, excludeBase) {
	            var view = info.view,
	                query = info.query,
	                queryString = _jsonToQuery(Config.jsonParam ? {
	                    _param: JSON.stringify(query)
	                } : query, TRUE);
	            return (excludeBase ? '' : basePath) + '#' + view + (queryString ? '?' + queryString : '');
	        },
	        buildPath: function(info) {
	            var view = info.view,
	                query = info.query,
	                queryString = _jsonToQuery(Config.jsonParam ? {
	                    _param: JSON.stringify(query)
	                } : query, TRUE);
	            return basePath + view + usePath.ext + (queryString ? '?' + queryString : '');
	        },
	        reset: function() {
	            localHistory = backLocalHistory.slice(0);
	            historyIndex = backHistoryIndex;
	        },
	        getAll: function() {
	            return {
	                index: historyIndex,
	                list: useHash ? localHistory : virtualHistory
	            }
	        },
	        setOptions: function(hashRouter, support) {
	            useHash = !!hashRouter;
	            hashSupport = support;
	            usePath = h5Mode && hashSupport ? hashSupport.usePath : FALSE;
	        },
	        usePath: function() {
	            return usePath;
	        }
	    };
	
	    return History;
	
	});
	
	/* ================================== Router ================================== */
	define('router', function() {
	
	    var $history = r('history'),
	        $viewQueue = r('viewQ'),
	        $viewM = r('viewM');
	
	    var started = FALSE,
	        backReg = /back(\((\d+)\))?/,
	        routerDelegated = _delegatedEvent(doc, [], Tags.role),
	        eventManager = _createEventManager(),
	        openFilters = [],
	        backFilters = [];
	
	    function reset(view) {
	        if (view) {
	            var _complete = view.complete,
	                completeData;
	            view.hide = function(data) {
	                Router.back(1, data || completeData);
	            };
	            view.complete = function(data) {
	                //WARN '使用路由打开，不建议用 complete/onComplete 方式，建议用 receiveData 事件，和 native 贴近'
	                completeData = data;
	                _apply(_complete, view, [data]);
	            };
	        }
	    }
	
	    // 开始历史纪录处理
	    function startHistory(useHash) {
	        $history.onChange(function(data) {
	            var d = data.data,
	                info = d.info,
	                param = d.param,
	                type = data.type;
	
	            //INFO '[Router] 历史纪录事件，类型为：', data.type
	            switch (type) {
	                case 'init':
	                    if (Config.autoInit) {
	                        //INFO '[Router] 初始化视图：', info.view
	                        $viewQueue.add(info.view, {
	                            param: info.query
	                        }, TRUE, function(view) {
	                            reset(view);
	                            eventManager.trigger(type, view);
	                        });
	                    }
	                    break;
	                case 'forward':
	                    //INFO '[Router] 打开视图：', info.view
	                    _delay(function() {
	                        if (eventManager.trigger('willForward', info) === false) {
	                            history.back();
	                        } else {
	                            $viewQueue.add(info.view, {
	                                param: info.query
	                            }, FALSE, function(view) {
	                                reset(view);
	                                eventManager.trigger(type, view);
	                            });
	                        }
	                    }, 100);
	                    break;
	                case 'refresh':
	                    //INFO '[Router] 刷新视图：', info.view
	                    $viewQueue.refresh({
	                        view: $viewM.getRealName(info.view),
	                        name: info.view,
	                        data: param
	                    });
	                    eventManager.trigger(type);
	                    break;
	                case 'back':
	                case 'home':
	                    //INFO '[Router] 回退到视图', info.view
	                    _delay(function() {
	                        $viewQueue.backTo(info.view, param, info.query, function() {
	                            eventManager.trigger(type);
	                        });
	                    }, 100);
	                    break;
	                case 'willForward':
	                    return eventManager.trigger(type, d);
	            }
	        });
	        $history.start(useHash);
	    }
	
	    // 绑定自定义锚点
	    function bindAnchor() {
	        routerDelegated.add('router', 'tap', function(e) {
	            var el = e.el,
	                href = _attr(el, 'href'),
	                target = _attr(el, 'target'),
	                param = _queryToJson(_attr(el, 'param') || '', TRUE),
	                info, allMatch,
	                match, vq;
	
	            if (!href.indexOf('#!')) {
	                if (href.indexOf('home') == 2) {
	                    Router.home(param);
	                } else {
	                    href = href.slice(2);
	                    match = href.match(backReg);
	                    if (match) {
	                        Router.back(match[2] || 1, param);
	                    }
	                }
	            } else if (!href.indexOf('#')) {
	                href = href.slice(1);
	                info = $history.analyzeHash(href);
	                if (target === '_blank') {
	                    Router.open(info.view + ':new', {
	                        param: _extend(info.query, param)
	                    });
	                } else {
	                    vq = info.view.split(':');
	                    allMatch = vq.length > 0;
	                    if (vq[1] == '0') {
	                        info.view = vq[0];
	                    }
	                    if (Router.backTo(info.view, param, allMatch) === FALSE) {
	                        Router.open(info.view, {
	                            param: _extend(info.query, param)
	                        });
	                    }
	                }
	            }
	        });
	    }
	
	    function doBackFilter(type) {
	        return function() {
	            var args = _makeArray(arguments);
	            if ((args[1] && args[1].skipFilter) || backFilters.reduce(function(ret, filter) {
	                    return ret && (filter(args) !== FALSE);
	                }, TRUE)) {
	                return _apply($history[type], $history, args);
	            }
	        };
	    }
	
	    var Router = _extend(eventManager, {
	        start: function() {
	            if (!started) {
	                started = TRUE;
	                startHistory();
	                bindAnchor();
	                $history.onChange(function(data) {
	                    eventManager.trigger('history', data);
	                });
	            }
	        },
	        /**
	         * 打开视图
	         *
	         * @method QApp.router.open
	         * @alias QApp.open
	         * @category Router
	         * @core
	         * @param {String} name 视图名
	         * @param {Object} [options] 配置
	         * @param {Object} [options.param] 传入参数
	         * @param {String|Object} [options.ani] 动画参数
	         * @param {Function} [callback] 回调
	         * @example
	         * QApp.open('view', {
	         *     param: {
	         *         x: 1,
	         *         y: 2
	         *     },
	         *     ani: 'moveEnter',
	         * });
	         * @explain
	         * *open* 主要用于切换视图，类似于PC端的跳转，近似于App上的切换视图操作。
	         *
	         * 建议使用 [View:receiveData](#View-receiveData) 事件做监听。
	         *
	         * 关于动画，请参看 [QApp-plugin-basic](plugins.html#QApp-plugin-basic)
	         * 由于需要和客户端相同，一般采用 moveEnter
	         */
	        open: function(name, options, callback) {
	            var args = _makeArray(arguments);
	            if ((args[1] && args[1].skipFilter) || openFilters.reduce(function(ret, filter) {
	                    return ret && (filter(args) !== FALSE);
	                }, TRUE)) {
	                options = options || {};
	                var param = options.param || {};
	                $viewQueue.add(name, options, !!options.atBottom, function(view) {
	                    if (view) {
	                        reset(view);
	                        _apply(callback, view, [view]);
	                        if (!options.atBottom) { // 当router.open时触发forward事件，如果是indexView，则不触发（indexView会触发init事件）
	                            eventManager.trigger('forward', view);
	                        }
	                    } else {
	                        _apply(callback);
	                    }
	                }, function(name) {
	                    return $history.setHashInfo({
	                        view: name,
	                        query: param
	                    });
	                });
	            }
	        },
	        transfer: function(name, param) {
	            _delay(function() {
	                if ($history.usePath()) {
	                    location.href = $history.buildPath({
	                        view: name,
	                        query: param
	                    });
	                } else {
	                    var urlObj = _parseURL($history.basePath);
	                    urlObj.setQuery('_qtid', Date.now());
	
	                    location.href = urlObj.toUrl() + $history.buildHash({
	                        view: name,
	                        query: param
	                    }, true);
	                }
	            });
	        },
	        /**
	         * 回退
	         *
	         * @method QApp.router.back
	         * @category Router
	         * @core
	         * @param {Number} [num] 回退的级数，默认是 1
	         * @param {Object} [param] 参数
	         */
	        back: doBackFilter('back'),
	        /**
	         * 回退到
	         *
	         * @method QApp.router.backTo
	         * @category Router
	         * @core
	         * @param {String} name 视图名
	         * @param {Object} [param] 参数
	         * @return {Boolean} flag 是否回退到
	         */
	        backTo: doBackFilter('backTo'),
	        /**
	         * 回退到首页
	         *
	         * @method QApp.router.home
	         * @category Router
	         * @param {Object} [param] 参数
	         */
	        home: doBackFilter('home'),
	        /**
	         * 跳转到（如果已存在，则回退到，否则新打开）
	         *
	         * @method QApp.router.goto
	         * @category Router
	         * @param {String} name 视图名
	         * @param {Object} [options] 打开视图需要的参数，同 open
	         * @param {Object} [param] 参数
	         */
	        goto: function(view, options, param, allMath) {
	            //INFO '[Router] Goto', view
	            if ($history.backTo(view, param, allMath) === FALSE) {
	                //INFO '[Router] 未返回，新打开视图'
	                Router.open(view, options);
	            }
	        },
	        /**
	         * 退出
	         *
	         * @method QApp.router.exit
	         * @category Router
	         */
	        exit: $history.exit,
	        /**
	         * 刷新参数
	         *
	         * @method QApp.router.refreshParam
	         * @category Router
	         * @param {Object} param 新参数
	         */
	        refreshParam: $history.refreshParam,
	        /**
	         * 添加open过滤器
	         *
	         * @method QApp.router.addOpenFilter
	         * @category Router
	         * @param {Function} filter 新参数
	         */
	        addOpenFilter: function(filter) {
	            if (_isFunction(filter)) {
	                openFilters = openFilters.concat(filter);
	            }
	        },
	        /**
	         * 移除open过滤器
	         *
	         * @method QApp.router.removeOpenFilter
	         * @category Router
	         * @param {Function} filter 新参数
	         */
	        removeOpenFilter: function(filter) {
	            var index = openFilters.indexOf(filter);
	            if (index > -1) {
	                openFilters.splice(index, 1);
	            }
	        },
	        /**
	         * 添加back过滤器
	         *
	         * @method QApp.router.addBackFilter
	         * @category Router
	         * @param {Function} filter 新参数
	         */
	        addBackFilter: function(filter) {
	            if (_isFunction(filter)) {
	                backFilters = backFilters.concat(filter);
	            }
	        },
	        /**
	         * 移除back过滤器
	         *
	         * @method QApp.router.removeBackFilter
	         * @category Router
	         * @param {Function} filter 新参数
	         */
	        removeBackFilter: function(filter) {
	            var index = backFilters.indexOf(filter);
	            if (index > -1) {
	                backFilters.splice(index, 1);
	            }
	        },
	        /**
	         * 获取当前视图名称
	         *
	         * @method QApp.router.getCurViewName
	         * @category Router
	         * @return {String}
	         */
	        getCurViewName: function(whole) {
	            return $viewQueue.curView && (whole ? $viewQueue.curView : $viewM.getRealName($viewQueue.curView));
	        },
	        /**
	         * 获取前一个视图名称
	         *
	         * @method QApp.router.getPreViewName
	         * @category Router
	         * @return {String}
	         */
	        getPreViewName: function(whole) {
	            return $viewQueue.preView && (whole ? $viewQueue.preView : $viewM.getRealName($viewQueue.preView));
	        },
	        buildUrl: function(info) {
	            return $history.usePath() ? $history.buildPath(info) : $history.buildHash(info)
	        },
	        getCurInfo: $history.getHashInfo,
	        resetHistory: $history.reset,
	        _getHistory: function() {
	            return $history.getAll();
	        },
	        _newSite: function() {
	            win.open($history.basePath);
	        },
	        _reset: reset
	    });
	
	    $viewQueue.inject(Router);
	
	    return Router;
	});
	
	var $viewM = r('viewM'),
	    $history = r('history'),
	    $router = r('router'),
	    $pluginM = r('pluginM'),
	    $widgetM = r('widgetM');
	
	var origin = {},
	    openFilters = [],
	    readyDefer = new Deferred(),
	    readyDependenceDefers = [];
	
	var VIRTUAL_HEIGHT = 100; // 处理虚拟按键等一类高度变化问题的 Magic Number
	
	function coreReady(fn) {
	    readyDefer.done(fn);
	}
	
	coreReady(function () {
	    // 设置并记录 Root 的位置和大小
	    var de = doc.documentElement,
	        winWidth = de.clientWidth,
	        winHeight = de.clientHeight,
	        appRoot = doc.createElement(Tags.app);
	
	    function refreshSize() {
	        winWidth = de.clientWidth;
	        winHeight = de.clientHeight;
	        _extend(origin , {
	            width: winWidth,
	            height: winHeight,
	            rootWidth: winWidth - Config.root.left - Config.root.right,
	            rootHeight: winHeight - Config.root.top - Config.root.bottom
	        });
	
	        _css(doc.body, 'height', winHeight + 'px');
	
	        _css(appRoot, {
	            height: origin.rootHeight + 'px',
	            width: origin.rootWidth + 'px'
	        });
	    }
	
	    function checkResize() {
	        var curHeight = de.clientHeight;
	        if ((_sniff.ios ||  curHeight > winHeight - VIRTUAL_HEIGHT) && curHeight != winHeight) {
	            refreshSize();
	        }
	    }
	
	    _extend(origin , {
	        width: winWidth,
	        height: winHeight,
	        rootTop: Config.root.top,
	        rootLeft: Config.root.left
	    });
	
	    _css(doc.body, 'height', winHeight + 'px');
	
	    if (Config.customRoot) {
	
	        origin.rootWidth = winWidth - Config.root.left - Config.root.right;
	        origin.rootHeight = winHeight - Config.root.top - Config.root.bottom;
	
	        _css(appRoot, {
	            top: origin.rootTop + 'px',
	            left: origin.rootLeft + 'px',
	            height: origin.rootHeight + 'px',
	            width: origin.rootWidth + 'px'
	        });
	
	        _appendNodes(doc.body, appRoot);
	    } else {
	        origin.rootWidth = winWidth;
	        origin.rootHeight = winHeight;
	
	        appRoot = doc.body;
	    }
	
	    QApp.root = Config.appRoot = appRoot;
	
	    QApp.checkResize = checkResize;
	
	    $router.start();
	
	    if (Config.screen) {
	        if (Config.screen.autoResize) {
	            win.addEventListener('resize', checkResize);
	        }
	        if (Config.screen.rotate) {
	            _orientation.on('change', refreshSize);
	        }
	    }
	
	    if (Config.preventMove) {
	        _addEvent(doc, 'touchmove', function(e) {
	            e.preventDefault();
	        });
	    }
	
	});
	
	QApp = _extend(QApp, _createEventManager());
	
	// 暴露接口
	_extend(QApp, {
	    /**
	     * 配置
	     *
	     * @method QApp.config
	     * @category Base
	     * @core
	     * @param {Object} conf 配置
	     * @return {Object} config 当前配置
	     * @example
	     * QApp.config({
	     *   // 默认的首屏 View
	     *   indexView: 'index',
	     *   // 默认的动画
	     *   defaultAnimate: 'moveEnter',
	     *   // 是否自动初始化视图
	     *   autoInit: true,
	     *   // 是否开启 hash router
	     *   hashRouter: true,
	     *   hashSupport: {
	     *       // 是否默认全部
	     *       all: true,
	     *       // 白名单
	     *       exist: [],
	     *       // 黑名单
	     *       except: [],
	     *       // 是否使用 path 变换（需要服务端支持）
	     *       usePath: false
	     *   },
	     *   // 是否使用 json 形式参数
	     *   jsonParam: false,
	     *   screen: {
	     *       // 是否支持屏幕旋转
	     *       rotate: false,
	     *       // 检测屏幕大小变换
	     *       autoResize: true
	     *   },
	     *   gesture: {
	     *       // 是否开启手势
	     *       open: true,
	     *       // 是否开启手势控制 (在 View 切换时，禁用手势)
	     *       ctrl: true,
	     *       // 长按是否触发 Tap 事件
	     *       longTap: true,
	     *       // 自动控制元素失去焦点
	     *       autoBlur: true
	     *   },
	     *   // 日志等级
	     *   logLevel: 1
	     * });
	     *
	     */
	    config: function (conf) {
	        var newConf =  _extend(TRUE, Config, conf),
	            plugins = newConf.plugins,
	            globalPlugins = newConf.globalPlugins;
	        if (_isArray(globalPlugins)) {
	            $pluginM.setGlobal(globalPlugins);
	        }
	        if (_isArray(plugins)) {
	            plugins.forEach(function(plugin) {
	                if (plugin && plugins.name) {
	                    $pluginM.setOpt(plugin.name, plugin.options);
	                }
	            });
	        } else if (plugins) {
	            _each(plugins, function(name, options) {
	                if (name) {
	                    $pluginM.setOpt(name, options);
	                }
	            });
	        }
	        $history.setOptions(newConf.hashRouter, newConf.hashSupport);
	        return newConf;
	    },
	
	    root: doc.body,
	
	    origin: origin,
	
	    defineView: $viewM.define,
	
	    undefineView: $viewM.undefine,
	
	    createView: $viewM.create,
	
	    buildView: $viewM.build,
	
	    existsView: $viewM.exists,
	
	    getView: $viewM.get,
	
	    getViewSync: $viewM.getSync,
	
	    addPlugin: $pluginM.add,
	
	    configPlugin: $pluginM.setOpt,
	
	    setGlobalPlugins: $pluginM.setGlobal,
	
	    addWidget: $widgetM.add,
	
	    showWidget: $widgetM.show,
	
	    router: $router,
	
	    open: $router.open,
	
	    exit: $router.exit,
	
	    view: $viewM,
	
	    show: $viewM.show,
	
	    showView: $viewM.show,
	    // 兼容老API
	    hash: {
	        getInfo: $history.getHashInfo,
	        setInfo: $history.setHashInfo,
	        analyzeHash: $history.analyzeHash,
	        setParam: $history.refreshParam,
	        build: $history.buildHash
	    },
	
	    sniff: _sniff
	});
	
	// 添加 util
	
	var util = QApp.util = {};
	
	util.ready = _ready;
	
	/**
	 *
	 * 准备完毕回调
	 *
	 * @method QApp.ready
	 * @category Base
	 * @core
	 * @param {Function} listener 回调函数
	 * @example
	 * QApp.ready(function() {
	 *      todoSomething();
	 * })
	 * @explain
	 * `QApp.ready` 不等同于 `Dom Ready`, 但依赖于 `Dom Ready`, 可以通过 [QApp.addReadyDependencies](#QApp-addReadyDependencies) 添加依赖
	 *
	 */
	QApp.ready = coreReady;
	
	/**
	 * 添加准备完毕依赖
	 *
	 * @method QApp.addReadyDependencies
	 * @category Base
	 * @param {Deferred} defer 依赖对象
	 *
	 */
	
	QApp.addReadyDependencies = function(defer) {
	    readyDependenceDefers.push(defer);
	};
	
	util.query = function(selector) {
	    return doc.querySelector(selector);
	};
	
	util.queryAll = function(selector) {
	    return doc.querySelectorAll(selector);
	};
	
	util.is = getType;
	util.isObject = _isObject;
	util.isString = _isString;
	util.isArray = _isArray;
	util.isFunction = _isFunction;
	util.isNumber = _isNumber;
	util.isElement = _isElement;
	util.isPlainObject = _isPlainObject;
	util.isEmptyObject = _isEmptyObject;
	
	util.extend = _extend;
	util.each = _each;
	util.makeArray = _makeArray;
	util.delay = _delay;
	util.associate = _associate;
	util.mapping = _mapping;
	util.camelCase = _camelCase;
	util.dasherize = _dasherize;
	util.empty = _empty;
	util.noop = _noop;
	util.getUniqueID = _getUniqueID;
	util.getZIndex = _getZIndex;
	util.jsonToQuery = _jsonToQuery;
	util.queryToJson = _queryToJson;
	util.parseURL = _parseURL;
	util.loader = _loader;
	
	util.builder = _builder;
	util.appendNodes = _appendNodes;
	util.insertElement = _insertElement;
	util.removeNode = _removeNode;
	util.attr = _attr;
	util.css = _css;
	util.removeStyle = _removeStyle;
	util.addClass = _addClass;
	util.removeClass = _removeClass;
	util.fixEvent = _fixEvent;
	util.addEvent = _addEvent;
	util.removeEvent = _removeEvent;
	util.dispatchEvent = _dispatchEvent;
	util.createStyle = _createStyle;
	util.size = _size;
	util.position = _position;
	util.contains = _contains;
	util.focus = _focus;
	util.blur = _blur;
	util.animate = _animate;
	util.dataSet = _dataSet;
	util.delegatedEvent = _delegatedEvent;
	
	util.CustEvent = util.custEvent = CustEvent;
	
	util.Deferred = util.deferred = Deferred;
	util.queue = _queue;
	util.parallel = _parallel;
	
	QApp.logger = util.logger = _logger;
	
	win.QApp = QApp;
	
	// init
	_ready(function() {
	    if (readyDependenceDefers.length) {
	        _parallel(readyDependenceDefers).done(function() {
	            readyDefer.resolve();
	        });
	    } else {
	        readyDefer.resolve();
	    }
	});
	
	(function() {
	
	    var _ = QApp.util;
	
	    QApp.addPlugin('static', function(view, opt, config) {
	        view.on('rendered', function() {
	            if (view.root) {
	                _.css(view.root, {
	                    position: 'absolute',
	                    width: '100%',
	                    height: '100%'
	                });
	            }
	        });
	    });
	})();
	
	(function () {
	
	    var display = 'display',
	        visibility = 'visibility';
	
	    // 0 => 无动画
	    // 1 => translate3d
	    // 2 => translate + translateZ
	    // 3 => 使用 left/top 形式
	    var transType = (function() {
	
	        var ua = navigator.userAgent.toLowerCase();
	
	        // ios 和 安卓上的微信 使用 translate3d
	        if (_sniff.ios || (_sniff.android && ua.indexOf('micromessenger') > -1)) {
	            return 1;
	        }
	
	        // 其他安卓设备 使用 translate + translateZ
	        return 2;
	
	        // 无动画
	        //return 0;
	
	    })();
	
	    function resetDisplay(node) {
	        _removeStyle(node, display);
	    }
	
	    function resetVisibility(node) {
	        _css(node, visibility, '');
	        _removeStyle(node, visibility);
	    }
	
	    function getSizeValue(size) {
	        return (~(size + '').indexOf('%') || ~(size + '').indexOf('px')) ? size : (size + 'px');
	    }
	
	    var getTranslate3dStyle = transType == 1 ? function (x, y, z) {
	        return {
	            translate3d: x + 'px, ' + y + 'px, ' + z + 'px'
	        };
	    } : function (x, y, z) {
	        return {
	            translate: x + 'px, ' + y + 'px',
	            translateZ: z + 'px'
	        };
	    };
	
	    // 统一逻辑
	    function commonHandle(name, view, opt) {
	        view.on('loadEnd', function () {
	            _attr(view.root, 'qapp-ani', name);
	            _css(view.root, visibility, 'hidden');
	        });
	
	        view.on('beforeHide', function () {
	            _blur(view.root);
	        });
	
	        view.on('destroy', function () {
	            view.show = NULL;
	            view.hide = NULL;
	        });
	    }
	
	    /* ================================== MoveEnter 插件 ================================== */
	
	    var MIN_GAP = 10;
	
	    var DEFAULT_OPT = {
	        position: 'right',
	        distance: 0,
	        duration: 200,
	        zIndex: 0
	    };
	
	    var queue = {},
	        moving = FALSE;
	
	    function findViewIndex(curQueue, view) {
	        var curIndex = -1,
	            i, len;
	        for (i = 0, len = curQueue.length; i < len; i++) {
	            if (curQueue[i].view === view) {
	                curIndex = i;
	                break;
	            }
	        }
	        return curIndex;
	    }
	
	    function animateQueue(curQueue, curIndex, duration, horizontal, root) {
	        var dis = 0;
	        return _parallel(curQueue.map(function (item, index) {
	            if (index < curIndex) {
	                item.view.trigger('beforeHide');
	                return _animate(item.view.root, horizontal ? getTranslate3dStyle(item.translate, 0, 0) : getTranslate3dStyle(0, item.translate, 0), duration);
	            } else {
	                dis += item.distance;
	                return _animate(item.view.root, horizontal ? getTranslate3dStyle(dis, 0, 0) : getTranslate3dStyle(0, dis, 0), duration);
	            }
	        }));
	    }
	
	    QApp.addPlugin('moveEnter', DEFAULT_OPT, function (view, opt, config) {
	
	        var startCss = {
	                position: 'absolute',
	                top: 0,
	                zIndex: opt.zIndex || _getZIndex()
	            },
	            simpleShow = config.type.indexOf && config.type.indexOf('pad') === -1,
	            horizontal = opt.position === 'right' || opt.position === 'left',
	            orientationNum = (opt.position === 'right' || opt.position === 'bottom') ? -1 : 1,
	            realDistance,
	            simpleMoving = FALSE,
	            curQueue,
	            panStart = FALSE,
	            panMove = FALSE;
	
	        if (opt.panBack === UNDEFINED) {
	            opt.panBack = config.type === 'app';
	        }
	
	        if (simpleShow) {
	            opt.distance = horizontal ? origin.rootWidth : origin.rootHeight;
	        }
	        realDistance = orientationNum * opt.distance;
	
	        if (!config.animate) {
	            opt.duration = 0;
	        }
	
	        if (simpleShow) {
	            curQueue = [];
	            startCss.width = '100%';
	            startCss.height = '100%';
	        } else {
	            if (!queue[opt.position]) {
	                queue[opt.position] = [];
	            }
	            curQueue = queue[opt.position];
	            startCss[horizontal ? 'height' : 'width'] = '100%';
	        }
	
	        if (opt.panBack && simpleShow && (opt.position === 'right' || opt.position === 'left')) {
	
	            var checkMove = function (e) {
	                if (~e.directions.indexOf(opt.position)) {
	                    return (e.clientX - e.offsetX < MIN_GAP);
	                }
	                return FALSE;
	            };
	
	            var executePan = function(e) {
	                if (panMove) {
	                    _css(view.root, getTranslate3dStyle(e.offsetX, 0, 0));
	                } else if (!panStart) {
	                    panStart = TRUE;
	                    panMove = checkMove(e);
	                }
	            };
	
	            var executePanEnd = function (e) {
	                if (panMove) {
	                    panMove = FALSE;
	                    if (Math.abs(e.offsetX) > Math.abs(opt.distance) / 2) {
	                        view.hide();
	                    } else {
	                        _animate(view.root, getTranslate3dStyle(0, 0, 0), opt.duration / 2).done();
	                    }
	                }
	                panStart = FALSE;
	            };
	
	            view.on('show', function () {
	                _addEvent(view.root, 'pan', executePan);
	                _addEvent(view.root, 'panend', executePanEnd);
	            });
	
	            view.on('hide', function () {
	                _removeEvent(view.root, 'pan', executePan);
	                _removeEvent(view.root, 'panend', executePanEnd);
	            });
	
	            view.on('rendered', function () {
	                var div = doc.createElement('div');
	                div.className = "touch-opacity";
	                _css(div, {
	                    position: 'absolute',
	                    zIndex: '9999',
	                    width: getSizeValue(MIN_GAP),
	                    height: '100%',
	                    backgroundColor: 'rgba(255, 255, 255, 0)'
	                });
	
	                _css(div, opt.position === 'right' ? 'left' : 'right', '0');
	
	                _addClass(view.root, 'shadow');
	                view.root.appendChild(div);
	            });
	        }
	
	        view.on('loaded', function () {
	            if (!opt.distance) {
	                opt.distance = _size(view.root)[horizontal ? 'width' : 'height'];
	            }
	            if (simpleShow) {
	                if (transType === 3) {
	                    if (opt.position === 'bottom') {
	                        startCss.top = getSizeValue(origin.rootHeight);
	                    } else {
	                        startCss[opt.position] = getSizeValue(-opt.distance);
	                    }
	                } else {
	                    if (opt.position === 'bottom') {
	                        startCss.top = getSizeValue(origin.rootHeight - opt.distance);
	                    } else {
	                        startCss[opt.position] = getSizeValue(0);
	                    }
	                    _extend(startCss, horizontal ? getTranslate3dStyle(-orientationNum * opt.distance, 0, 0) : getTranslate3dStyle(0, -orientationNum * opt.distance, 0));
	                }
	            } else {
	                if (opt.position !== 'bottom') {
	                    startCss[opt.position] = getSizeValue(-opt.distance);
	                } else {
	                    startCss.top = getSizeValue(origin.rootHeight);
	                }
	            }
	            _css(view.root, startCss);
	        });
	
	        commonHandle('moveEnter', view, opt);
	
	        view.show = function (preventAnimate) {
	            _blur();
	            if (!moving) {
	                moving = TRUE;
	                simpleMoving = TRUE;
	                var curIndex = findViewIndex(curQueue, view);
	                if (~curIndex) {
	                    animateQueue(curQueue, curIndex, (preventAnimate === TRUE || view.preventAnimate) ? 0 : opt.duration, horizontal).done(function () {
	                        curQueue.splice(0, curIndex).forEach(function (item) {
	                            item.view.trigger('hide');
	                        });
	                        moving = FALSE;
	                        simpleMoving = FALSE;
	                        view.trigger('refresh');
	                    });
	                } else {
	                    view.once('completed', function () {
	                        resetDisplay(view.root);
	                        resetVisibility(view.root);
	                        view.trigger('beforeShow');
	                        curQueue.unshift({
	                            view: view,
	                            distance: simpleShow ? 0 : realDistance,
	                            translate: simpleShow ? -realDistance : 0
	                        });
	                        _delay(function() {
	                            animateQueue(curQueue, 0, (preventAnimate === TRUE || view.preventAnimate) ? 0 : opt.duration, horizontal, view.root).done(function () {
	                                moving = FALSE;
	                                simpleMoving = FALSE;
	                                _removeStyle(view.root, 'transform');
	                                view.trigger('show');
	                            });
	                        });
	                    });
	                    view.renderTo(QApp.root);
	                }
	            }
	            return view;
	        };
	
	        view.hide = function (preventAnimate) {
	            if ((!moving || (simpleShow && !simpleMoving)) && view.isShow) {
	                moving = TRUE;
	                var curIndex = findViewIndex(curQueue, view);
	                animateQueue(curQueue, curIndex + 1, (preventAnimate === TRUE || view.preventAnimate) ? 0 : opt.duration, horizontal).done(function () {
	                    curQueue.splice(0, curIndex + 1).forEach(function (item) {
	                        item.view.trigger('hide');
	                    });
	                    moving = FALSE;
	                });
	            }
	            return view;
	        };
	
	        view.on('destroy', function () {
	            startCss = NULL;
	            curQueue = NULL;
	            view = NULL;
	        });
	
	        return {
	            setOption: function (newOpt) {
	                opt = _extend({}, DEFAULT_OPT, newOpt);
	            }
	        };
	    });
	})();

})();
(function() {
    var QApp = window.QApp;

    var TOUCHKEYS = [
            'screenX', 'screenY', 'clientX', 'clientY', 'pageX', 'pageY'
        ], // 需要复制的属性
        TOUCH_NUM = 2, // 最大支持触点数 1 或 2
        TAP_TIMEOUT = 200, // 判断 tap 的延时
        FLICK_TIMEOUT = 300, // 判断 flick 的延时
        PAN_DISTANCE = 10, // 判定 pan 的位移偏移量
        DIRECTION_DEG = 15, // 判断方向的角度
        DOUBLETAP_GAP = 500, // double 判定延时
        PINCH_DIS = 10; // 判定 pinch 的位移偏移量
    
    var curElement = null,
        curVetor = null,
        gestures = {},
        lastTapTime = 0,
        initialAngle = 0,
        rotation = 0,
        longTap = true,
        enabled = true;
    
    var slice = Array.prototype.slice;
    
    // 绑定事件
    function addEvent(node, type, listener, useCapture) {
        node.addEventListener(type, listener, !!useCapture);
    }
    
    // Array Make
    function makeArray(iterable) {
        var n = iterable.length;
        if (n === (n >>> 0)) {
            try {
                return slice.call(iterable);
            } catch (e) {
            }
        }
        return true;
    }
    
    // ready
    function ready(callback) {
        if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
            callback();
        } else {
            addEvent(document, 'DOMContentLoaded', function () {
                callback();
            });
        }
    }
    
    
    // 是否支持多指
    function supportMulti() {
        return TOUCH_NUM == 2;
    }
    
    // 获取 obj 中 key 的数量
    function getKeys(obj) {
        return Object.getOwnPropertyNames(obj);
    }
    
    // 判断对象是否为空
    function isEmpty(obj) {
        return getKeys(obj).length === 0;
    }
    
    // fix：safari可能是文本节点
    function fixElement(el) {
        return 'tagName' in el ? el : el.parentNode;
    }
    
    // 创建事件对象
    function createEvent(type) {
        var event = document.createEvent("HTMLEvents");
        event.initEvent(type, true, true);
        return event;
    }
    
    // 触发事件
    function trigger(curElement, event) {
        if (enabled && curElement && curElement.dispatchEvent) {
            curElement.dispatchEvent(event);
        }
    }
    
    // 复制 touch 对象上的有用属性到固定对象上
    function mixTouchAttr(target, source) {
        TOUCHKEYS.forEach(function(key) {
            target[key] = source[key];
        });
        return target;
    }
    
    // 获取方向
    function getDirection(offsetX, offsetY) {
        var ret = [],
            absX = Math.abs(offsetX),
            absY = Math.abs(offsetY),
            proportion = Math.tan(DIRECTION_DEG / 180 * Math.PI),
            transverse = absX > absY;
    
        if (absX > 0 || absY > 0) {
            ret.push(transverse ? offsetX > 0 ? 'right' : 'left' : offsetY > 0 ? 'down' : 'up');
            if (transverse && absY / absX > proportion) {
                ret.push(offsetY > 0 ? 'down' : 'up');
            } else if (!transverse && absX / absY > proportion) {
                ret.push(offsetX > 0 ? 'right' : 'left');
            }
        }
    
        return ret;
    }
    
    // 计算距离
    function computeDistance(offsetX, offsetY) {
        return Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2));
    }
    
    // 计算角度
    function computeDegree(offsetX, offsetY) {
        var degree = Math.atan2(offsetY, offsetX) / Math.PI * 180;
        return degree < 0 ? degree + 360 : degree;
    }
    
    // 计算角度，返回（0-180）
    function computeDegree180(offsetX, offsetY) {
        var degree = Math.atan(offsetY * -1 / offsetX) / Math.PI * 180;
        return degree < 0 ? degree + 180 : degree;
    }
    
    // 获取偏转角
    function getAngleDiff(offsetX, offsetY) {
        var diff = initialAngle - computeDegree180(offsetX, offsetY);
    
        while (Math.abs(diff - rotation) > 90) {
            if (rotation < 0) {
                diff -= 180;
            } else {
                diff += 180;
            }
        }
        rotation = diff;
        return rotation;
    }
    
    // 构造 pan / flick / panend 事件
    function createPanEvent(type, offsetX, offsetY, touch, duration) {
        var ev = createEvent(type);
        ev.offsetX = offsetX;
        ev.offsetY = offsetY;
        ev.degree = computeDegree(offsetX, offsetY);
        ev.directions = getDirection(offsetX, offsetY);
        if (duration) {
            ev.duration = duration;
            ev.speedX = ev.offsetX / duration;
            ev.speedY = ev.offsetY / duration;
        }
        return mixTouchAttr(ev, touch);
    }
    
    // 构造 pinch 事件
    function createMultiEvent(type, centerX, centerY, scale, deflection, touch1, touch2) {
        var ev = createEvent(type);
        ev.centerX = centerX;
        ev.centerY = centerY;
        if (scale !== void 0) {
            ev.scale = scale;
        }
        if (deflection !== void 0) {
            ev.deflection = deflection;
        }
        ev.touchs = [touch1, touch2];
        return ev;
    }
    
    // 判断是否处理完所有触点
    function checkEnd() {
        var flag = true;
        for (var key in gestures) {
            if (gestures[key].status != 'end') {
                flag = false;
                break;
            }
        }
        return flag;
    }
    
    ready(function() {
        var body = document.body;
    
        // 处理 touchstart 事件
        function touchStart(event) {
    
            // 判定现在是否开始手势判定
            if (isEmpty(gestures)) {
                // 获取第一个触点的Element
                curElement = fixElement(event.touches[0].target);
            }
    
            // 遍历每一个 touch 对象，进行处理
            makeArray(event.changedTouches).forEach(function(touch, index) {
                var keys = getKeys(gestures);
                if (keys.length < TOUCH_NUM) {
                    var origin = mixTouchAttr({}, touch),
                        gesture = {
                            startTouch: origin,
                            curTouch: origin,
                            startTime: Date.now(),
                            status: 'tapping',
                            other: null,
                            handler: setTimeout(function() {
                                if (gesture) {
                                    if (gesture.status == 'tapping') {
                                        gesture.status = 'pressing';
                                        trigger(curElement, mixTouchAttr(createEvent('press'), origin));
                                    }
                                    clearTimeout(gesture.handler);
                                    gesture.handler = null;
                                }
                            }, TAP_TIMEOUT)
                        };
    
                    trigger(curElement, mixTouchAttr(createEvent('feel'), origin));
    
                    // 每一次手势不同触点的 identifier 是不同的
                    gestures[touch.identifier] = gesture;
    
                    if (supportMulti() && keys.length == 1) {
                        var otherTouch = gestures[keys[0]].startTouch,
                            disX = origin.clientX - otherTouch.clientX,
                            disY = origin.clientY - otherTouch.clientY,
                            centerX = (origin.clientX + otherTouch.clientX) / 2,
                            centerY = (origin.clientY + otherTouch.clientY) / 2;
                        gesture.other = gestures[keys[0]];
                        gestures[keys[0]].other = gesture;
                        curVetor = {
                            centerX: centerX,
                            centerY: centerY,
                            pinch: false,
                            deflection: false,
                            distance: computeDistance(disX, disY)
                        };
    
                        initialAngle = computeDegree180(disX, disY);
                    }
                }
            });
        }
    
        // 处理 touchmove 事件
        function touchMove(event) {
            makeArray(event.changedTouches).forEach(function(touch, index) {
                var gesture = gestures[touch.identifier],
                    flag = false;
                if (gesture) {
                    var startTouch = gesture.startTouch,
                        offsetX = touch.clientX - startTouch.clientX,
                        offsetY = touch.clientY - startTouch.clientY;
    
                    if (gesture.status == 'tapping' || gesture.status == 'pressing') {
                        if (computeDistance(offsetX, offsetY) > PAN_DISTANCE) {
                            gesture.status = 'panning';
                            // 记录移动开始的时间
                            gesture.startMoveTime = Date.now();
                            trigger(curElement, createPanEvent('pan', offsetX, offsetY, touch));
                        }
                    } else if (gesture.status == 'panning') {
                        trigger(curElement, createPanEvent('pan', offsetX, offsetY, touch));
                    }
    
                    if (supportMulti() && gesture.other && gesture.other.status != 'end') {
                        var otherTouch = gesture.other.curTouch,
                            disX = touch.clientX - otherTouch.clientX,
                            disY = touch.clientY - otherTouch.clientY,
                            centerX = (touch.clientX + otherTouch.clientX) / 2,
                            centerY = (touch.clientY + otherTouch.clientY) / 2,
                            distance = computeDistance(disX, disY);
    
                        // 判断 pinch
                        if (!curVetor.pinch) {
                            if (Math.abs(curVetor.distance - distance) > PINCH_DIS) {
                                curVetor.pinch = true;
                                trigger(curElement, createMultiEvent('pinch', centerX, centerY, distance /
                                    curVetor.distance, void 0, touch, otherTouch));
                            }
                        } else {
                            trigger(curElement, createMultiEvent('pinch', centerX, centerY, distance /
                                curVetor.distance, void 0, touch, otherTouch));
                        }
    
                        // 判断 rorate
                        if (!curVetor.deflection) {
                            var rotation = getAngleDiff(disX, disY);
                            if (Math.abs(rotation) > DIRECTION_DEG) {
                                trigger(curElement, createMultiEvent('rotate', centerX, centerY, void 0, rotation, touch, otherTouch));
                                curVetor.deflection = true;
                            }
                        } else {
                            var rotation = getAngleDiff(disX, disY);
                            trigger(curElement, createMultiEvent('rotate', centerX, centerY, void 0, rotation, touch, otherTouch));
                        }
    
                    }
    
                    gesture.curTouch = mixTouchAttr({}, touch);
                }
            });
        }
    
        // 处理 touchend 事件
        function touchEnd(event) {
    
            makeArray(event.changedTouches).forEach(function(touch, index) {
                var gesture = gestures[touch.identifier];
                if (gesture) {
    
                    if (gesture.handler) {
                        clearTimeout(gesture.handler);
                        gesture.handler = null;
                    }
    
                    if (gesture.status == 'tapping') {
                        trigger(curElement, mixTouchAttr(createEvent('tap'), touch));
                    } else if (gesture.status == 'pressing') {
                        if (longTap) {
                            trigger(curElement, mixTouchAttr(createEvent('tap'), touch));
                        }
                        trigger(curElement, mixTouchAttr(createEvent('pressend'), touch));
                    } else if (gesture.status == 'panning') {
                        var startTouch = gesture.startTouch,
                            offsetX = touch.clientX - startTouch.clientX,
                            offsetY = touch.clientY - startTouch.clientY,
                            duration = Date.now() - gesture.startMoveTime;
                        trigger(curElement, createPanEvent('panend', offsetX, offsetY, touch, duration));
                        // 判断是否是快速移动
                        if (duration < FLICK_TIMEOUT) {
                            trigger(curElement, createPanEvent('flick', offsetX, offsetY, touch, duration));
                        }
                    }
    
                    if (supportMulti() && gesture.other && gesture.other.status != 'end') {
                        var otherTouch = gesture.other.curTouch,
                            disX = touch.clientX - otherTouch.clientX,
                            disY = touch.clientY - otherTouch.clientY,
                            centerX = (touch.clientX + otherTouch.clientX) / 2,
                            centerY = (touch.clientY + otherTouch.clientY) / 2,
                            distance = computeDistance(disX, disY);
                        if (curVetor.pinch) {
                            trigger(curElement, createMultiEvent('pinchend', centerX, centerY, distance /
                                curVetor.distance, void 0, touch, otherTouch));
                        }
                        if (curVetor.deflection) {
                            var rotation = getAngleDiff(disX, disY);
                            trigger(curElement, createMultiEvent('rotatend', centerX, centerY, void 0, rotation, touch, otherTouch));
    
    
                        }
                        rotation = 0;
                    }
    
                    gesture.status = 'end';
                }
    
            });
    
            if (checkEnd()) {
                for (var key in gestures) {
                    delete gestures[key];
                }
            }
        }
    
        addEvent(body, 'touchstart', touchStart);
        addEvent(body, 'touchmove', touchMove);
        addEvent(body, 'touchend', touchEnd);
    
        addEvent(body, 'tap', function(ev) {
            var now = Date.now();
            if (now - lastTapTime < DOUBLETAP_GAP) {
                trigger(curElement, mixTouchAttr(createEvent('doubletap'), ev));
                lastTapTime = 0;
            } else {
                lastTapTime = now;
            }
        });
    });
    
    var yGesture = {
        enable: function() {
            enabled= true;
        },
        disable: function() {
            enabled = false;
        },
        disableLongTap: function() {
            longTap = false;
        }
    };
    

    function ctrlFn(open) {
        yGesture[open ? 'disable' : 'enable']();
    }

    QApp.on('running', ctrlFn);

    QApp.gesture = yGesture;

    QApp.gesture.disableTransferCtrl = function() {
        QApp.off('running', ctrlFn);
    };

})();

;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}

    // 插件逻辑
    QApp.addPlugin('fastclick', {}, function(view, options) {
        var fc;

        view.on('show', function() {
            fc = new FastClick(view.root, options);
        });

        view.on('destroy', function() {
            if (fc && fc.destroy) {
                fc.destroy();
            }
        });

        return {
            getEntity: function() {
                return fc;
            }
        };
    });

    QApp.setGlobalPlugins('fastclick');
}());

/**
 * QApp-plugin-basic
 *
 * version: 0.1.1
 */

(function () {

    var win = window,
        doc = document,
        display = 'display',
        visibility = 'visibility';

    var origin = QApp.origin,
        _ = QApp.util,
        _extend = _.extend,
        _delay = _.delay,
        _appendNodes = _.appendNodes,
        _addClass = _.addClass,
        _addEvent = _.addEvent,
        _removeEvent = _.removeEvent,
        _removeNode = _.removeNode,
        _css = _.css,
        _removeStyle = _.removeStyle,
        _contains = _.contains,
        _animate = _.animate,
        _size = _.size,
        _position = _.position,
        _parallel = _.parallel,
        _blur = _.blur,
        _getZIndex = _.getZIndex,
        _getUniqueID = _.getUniqueID,
        _delegatedEvent = _.delegatedEvent,
        _dispatchEvent = _.dispatchEvent,
        _isFunction = _.isFunction;

    // 0 => 无动画
    // 1 => translate3d
    // 2 => translate + translateZ
    // 3 => 使用 left/top 形式
    var transType = (function() {

        var sniff = QApp.sniff,
            ua = navigator.userAgent.toLowerCase();

        // ios 和 安卓上的微信 使用 translate3d
        if (sniff.ios || (sniff.android && ua.indexOf('micromessenger') > -1)) {
            return 1;
        }

        // 其他安卓设备 使用 translate + translateZ
        return 2;

        // 无动画
        //return 0;

    })();

    function fixEvent(e) {

        if (e.pageX == null && e.clientX != null) {
            var html = document.documentElement;
            var body = document.body;

            e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || body && body.clientLeft || 0);
            e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || body && body.clientTop || 0);
        }

        return e;
    }

    function getNodeInfo(node) {
        var pos = _position(node),
            size = _size(node);
        return {
            left: pos.left,
            top: pos.top,
            right: pos.left + size.width,
            bottom: pos.top + size.height
        };
    }

    function hitTest(node, ev) {
        var info = getNodeInfo(node);

        ev = fixEvent(ev);

        return ev.pageX >= info.left && ev.pageX <= info.right && ev.pageY >= info.top && ev.pageY <= info.bottom;
    }

    function resetDisplay(node) {
        _removeStyle(node, display);
    }

    function resetVisibility(node) {
        _css(node, visibility, '');
        _removeStyle(node, visibility);
    }

    function getSizeValue(size) {
        return (~(size + '').indexOf('%') || ~(size + '').indexOf('px')) ? size : (size + 'px');
    }

    var getTranslate3dStyle = transType == 1 ? function (x, y, z) {
        return {
            translate3d: x + 'px, ' + y + 'px, ' + z + 'px'
        };
    } : function (x, y, z) {
        return {
            translate: x + 'px, ' + y + 'px',
            translateZ: z + 'px'
        };
    };

    var maskNode = null;

    function initMask() {
        if (!maskNode) {
            maskNode = doc.createElement('div');
            _css(maskNode, {
                position: 'absolute',
                top: 0,
                left: 0,
                width: getSizeValue(origin.width),
                height: getSizeValue(origin.height)
            });
        }
        return maskNode;
    }

    /* ================================== AutoHide ================================== */
    var autoHide = (function () {
        var queue = [],
            nextView = '';

        function add(view) {
            queue.unshift(view);
        }

        function remove(view) {
            var index = queue.indexOf(view);
            if (~index) {
                queue.splice(index, 1);
            }
        }

        function Manager(view) {
            view.once('show', function () {
                add(view);
            });
            view.once('hide', function () {
                remove(view);
                view = null;
            });
        }

        Manager.setNextView = function (nView) {
            nextView = nView;
        };

        _.ready(function () {
            doc.body.addEventListener('touchstart', function (e) {
                var view = queue[0];
                if (view && view.autoHide && !(_contains(view.root, e.target) || hitTest(view.root, e)) && (!view.relyElement || !_contains(view.relyElement, e.target))) {
                    if (view.isContainer) {
                        view.decHide();
                    } else {
                        view.hide();
                    }
                }
            }, false);
        });

        return Manager;
    })();

    // 统一逻辑
    function commonHandle(name, view, opt) {
        view.on('loadEnd', function () {
            _.attr(view.root, 'qapp-ani', name);
            _.css(view.root, visibility, 'hidden');
        });

        view.on('beforeHide', function () {
            _blur(view.root);
        });

        view.on('destroy', function () {
            view.show = null;
            view.hide = null;
        });

        view.autoHide = opt.autoHide && opt.autoHide !== 'false';
        autoHide(view);
    }


    /* ================================== actionSheet 插件 ================================== */
    (function () {
        var KEYBOARD_DELAY = 500;

        var DEFAULT_OPT = {
            autoHide: true,
            distance: 0,
            duration: 200,
            showMask: true,
            maskColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 0
        };

        QApp.addPlugin(['actionSheet', 'ui.actionSheet'], DEFAULT_OPT, function (view, opt, config) {

            var startCss = {
                    position: 'absolute',
                    left: 0,
                    width: '100%'
                },
                moving = false,
                maskLayer, delay;

            if (!config.animate) {
                opt.duration = 0;
            }

            opt.zIndex = opt.zIndex || _getZIndex();

            view.on('loaded', function () {
                // 如果用户未设置或为 0
                if (!opt.distance) {
                    // 避免 qapp-view css height: 100% 的影响
                    view.root.style.height = 'auto';
                    opt.distance = _size(view.root).height;
                }
                setPos(view.root, startCss, opt)
                _addClass(view.root, 'shadow');
            });

            view.show = function (preventAnimate) {
                if (preventAnimate && preventAnimate.fromHash) {
                    preventAnimate = true;
                }
                _blur();
                autoHide.setNextView(view.name);
                if (opt.showMask) {
                    maskLayer = initMask();
                    _css(maskLayer, {
                        display: 'block',
                        backgroundColor: opt.maskColor,
                        zIndex: opt.zIndex
                    });
                    _appendNodes(doc.body, maskLayer);
                }

                if (!moving) {
                    moving = true;
                    if (view.isShow) {
                        moving = false;
                        view.trigger('refresh');
                    } else {
                        delay = _size(win).height !== origin.height ? KEYBOARD_DELAY : 0;
                        view.once('completed', function () {
                            resetDisplay(view.root);
                            resetVisibility(view.root);
                            view.trigger('beforeShow');
                            _delay(function () {
                                _animate(view.root, getTranslate3dStyle(0, 0, 0), (preventAnimate === true || view.preventAnimate) ? 0 : opt.duration, 'ease-out', delay).done(function () {
                                    view.isShow = true;
                                    moving = false;
                                    _removeStyle(view.root, 'transform');
                                    view.trigger('show');
                                });
                            });
                        });
                        view.renderTo(doc.body);
                    }
                }
                return view;
            };

            view.hide = function (preventAnimate) {
                if (!moving && view.isShow) {
                    moving = true;
                    view.trigger('beforeHide');
                    _animate(view.root, startCss, (preventAnimate === true || view.preventAnimate) ? 0 : (opt.duration / 2), 'ease-out').done(function () {
                        view.isShow = false;
                        if (maskLayer) {
                            _css(maskLayer, display, 'none');
                            _removeNode(maskLayer);
                        }
                        moving = false;
                        view.trigger('hide');
                    });
                }
                return view;
            };
            view.refresh = function() {
                view.root.style.height = 'auto';
                opt.distance = _size(view.root).height;
                setPos(view.root, startCss, opt)
            }
            view.on('destroy', function () {
                startCss = null;
                maskLayer = null;
                view = null;
            });

            commonHandle('actionSheet', view, opt);

            return {
                setOption: function (newOpt) {
                    opt = _extend({}, opt, newOpt);
                }
            };
        });

        function setPos(root, startCss, opt) {
            _css(root, _extend(startCss, {
                top: getSizeValue(origin.height - opt.distance),
                height: getSizeValue(opt.distance),
                zIndex: opt.zIndex
            }, getTranslate3dStyle(0, opt.distance, 0)));
        }

    })();

    /* ================================== dialog 插件 ================================== */
    (function () {

        var DEFAULT_OPT = {
            autoHide: false,
            maskColor: 'rgba(0, 0, 0, .4)',
            duration: 200,
            width: 0,
            height: 0,
            zIndex: 0
        };

        QApp.addPlugin(['ui.dialog', 'dialog'], DEFAULT_OPT, function (view, opt, config) {

            var width = origin.width,
                height = origin.height,
                moving = false,
                maskLayer;

            if (!config.animate) {
                opt.duration = 0;
            }

            opt.zIndex = opt.zIndex || _getZIndex();

            view.on('loaded', function () {
                var size = _size(view.root);
                if (!opt.width) {
                    opt.width = size.width;
                }
                if (!opt.height) {
                    opt.height = size.height;
                }
                _css(view.root, _extend({
                    position: 'absolute',
                    width: getSizeValue(opt.width),
                    height: getSizeValue(opt.height),
                    zIndex: opt.zIndex,
                    display: 'none',
                    top: getSizeValue((height - opt.height) / 2),
                    left: getSizeValue((width - opt.width) / 2)
                }, getTranslate3dStyle(0, height, 0)));

                _addClass(view.root, 'shadow');
            });

            view.show = function (preventAnimate) {
                if (preventAnimate && preventAnimate.fromHash) {
                    preventAnimate = true;
                }
                autoHide.setNextView(view.name);
                maskLayer = initMask();
                _css(maskLayer, {
                    display: 'block',
                    backgroundColor: opt.maskColor,
                    zIndex: opt.zIndex
                });
                _appendNodes(doc.body, maskLayer);

                if (!moving) {
                    moving = true;
                    if (view.isShow) {
                        moving = false;
                        view.trigger('refresh');
                    } else {
                        view.once('completed', function () {
                            resetDisplay(view.root);
                            resetVisibility(view.root);
                            view.trigger('beforeShow');
                            _animate(view.root, getTranslate3dStyle(0, 0, 0), (preventAnimate === true || view.preventAnimate) ? 0 : opt.duration).done(function () {
                                view.isShow = true;
                                moving = false;
                                _removeStyle(view.root, 'transform');
                                view.trigger('show');
                            });
                        });
                        view.renderTo(doc.body);
                    }
                }
                return view;
            };

            view.hide = function (preventAnimate) {
                if (!moving && view.isShow) {
                    moving = true;
                    view.trigger('beforeHide');
                    _animate(view.root, getTranslate3dStyle(0, height, 0), (preventAnimate === true || view.preventAnimate) ? 0 : opt.duration).done(function () {
                        view.isShow = false;
                        if (maskLayer) {
                            _css(maskLayer, display, 'none');
                            _removeNode(maskLayer);
                        }
                        moving = false;
                        view.trigger('hide');
                    });
                }
                return view;
            };

            view.on('destroy', function () {
                maskLayer = null;
                view = null;
            });

            commonHandle('dialog', view, opt);

            return {
                setOption: function (newOpt) {
                    opt = _extend({}, opt, newOpt);
                }
            };
        });

    })();

    /* ================================== popup 插件 ================================== */

    (function () {

        var maskLayer = null,
            delegatedEvent;

        var DEFAULT_OPT = {
                autoHide: true,
                autoDirection: false,
                direction: 'right',
                duration: 200,
                width: 0,
                height: 0,
                position: 'center',
                dropDown: false,
                bgColor: 'rgba(0, 0, 0, 0.4)',
                group: false,
                item: null
            },
            startCSS = {
                opacity: 0
            },
            endCSS = {
                opacity: 1
            };

        function getPosition(el, opt, pos) {
            var top = 0,
                left = 0;

            switch (pos) {
                case 'right':
                    top = getSizeValue(_.position(el).top);
                    left = getSizeValue(_.position(el).left + _.size(el).width);
                    break;
                case 'left':
                    top = getSizeValue(_.position(el).top);
                    left = getSizeValue(_.position(el).left - parseInt(opt.width));
                    break;
                case 'bottom':
                    top = getSizeValue(_.position(el).top + _.size(el).height);
                    if (opt.position === 'left') {
                        left = getSizeValue(_.position(el).left);
                    } else if (opt.position === 'right') {
                        left = getSizeValue(_.position(el).left + _.size(el).width - opt.width);
                    } else {
                        left = getSizeValue(_.position(el).left + _.size(el).width / 2 - opt.width / 2);
                    }
                    break;
                case 'top':
                    top = getSizeValue(_.position(el).top - parseInt(opt.height));
                    if (opt.position === 'left') {
                        left = getSizeValue(_.position(el).left);
                    } else if (opt.position === 'right') {
                        left = getSizeValue(_.position(el).left + _.size(el).width - opt.width);
                    } else {
                        left = getSizeValue(_.position(el).left + _.size(el).width / 2 - opt.width / 2);
                    }
                    break;
            }
            return {
                top: top,
                left: left
            };
        }

        function fixedDirection(el, opt) {
            if (opt.autoDirection && opt.autoDirection !== 'false') {
                var direction = opt.direction,
                    elPos = _position(el),
                    elLeft = elPos.left,
                    elTop = elPos.top,
                    elSize = _size(el),
                    elWidth = elSize.width,
                    elHeight = elSize.height,
                    winWidth = origin.width,
                    winHeight = origin.height,
                    popupWidth = opt.width,
                    popupHeight = opt.height,
                    canRight = elLeft + elWidth + popupWidth <= winWidth,
                    canLeft = elLeft - popupWidth >= 0,
                    canBottom = elTop + elHeight + popupHeight <= winHeight,
                    canTop = elTop - popupHeight >= 0;
                if (direction === 'right') {
                    if (!canRight) {
                        if (canLeft) {
                            direction = 'left';
                        } else {
                            direction = 'bottom';
                        }
                    }
                } else if (direction === 'left') {
                    if (!canLeft) {
                        if (canRight) {
                            direction = 'right';
                        } else {
                            direction = 'bottom';
                        }
                    }
                }
                if (direction === 'bottom') {
                    if (!canBottom) {
                        direction = 'top';
                    }
                } else if (direction === 'top') {
                    if (!canTop) {
                        direction = 'bottom';
                    }
                }
                return direction;
            } else {
                return opt.direction;
            }
        }

        QApp.ready(function () {
            delegatedEvent = _delegatedEvent(doc.body, [], 'qapp-popup-group');
        });

        QApp.addPlugin(['popup', 'ui.popup'], DEFAULT_OPT, function (view, opt, config) {

            var moving = false,
                touchOther = false;

            if (!config.animate) {
                opt.duration = 0;
            }

            if (opt.dropDown) {
                opt.useArrow = false;
                opt.autoDirection = false;
                opt.direction = 'bottom';
                opt.dropDuration = opt.duration;
                opt.duration = 0;
            }

            opt.zIndex = opt.zIndex || _getZIndex();

            view.on('loaded', function () {
                var size = _size(view.root);
                if (!opt.width) {
                    opt.width = size.width;
                }
                if (!opt.height) {
                    opt.height = size.height;
                }
                _css(view.root, {
                    display: 'none',
                    position: 'absolute',
                    width: getSizeValue(opt.width),
                    height: getSizeValue(opt.height),
                    zIndex: opt.zIndex
                });
                _css(view.root, opt.dropDown ? endCSS : startCSS);
            });

            view.show = function (el, preventAnimate) {
                view.relyElement = el;
                autoHide.setNextView(view.name);
                if (!moving) {
                    moving = true;
                    var direction = fixedDirection(el, opt),
                        pos = getPosition(el, opt, direction);
                    if (view.isShow) {
                        resetDisplay(view.root);
                        resetVisibility(view.root);
                        _css(view.root, {
                            top: pos.top,
                            left: pos.left
                        });
                        moving = false;
                        view.trigger('refresh');
                    } else {
                        view.once('completed', function () {
                            view.trigger('beforeShow');
                            resetDisplay(view.root);
                            resetVisibility(view.root);
                            _css(view.root, {
                                top: pos.top,
                                left: pos.left
                            });
                            if (opt.dropDown) {
                                var els = view.root.childNodes,
                                    dropEl, i = -1;
                                do {
                                    i++;
                                    dropEl = els[i];
                                } while (dropEl.nodeType === 3);
                                _css(dropEl, _extend({
                                    height: getSizeValue(opt.height)
                                }, getTranslate3dStyle(0, -opt.height, 0)));
                                _css(view.root, {
                                    position: 'absolute',
                                    zIndex: opt.zIndex,
                                    width: getSizeValue(opt.width),
                                    height: getSizeValue(opt.dropDown),
                                    backgroundColor: opt.bgColor,
                                    overflow: 'hidden'
                                });
                                if (maskLayer) {
                                    _removeNode(maskLayer);
                                }
                                _delay(function () {
                                    _animate(dropEl, getTranslate3dStyle(0, 0, 0), (preventAnimate === true || view.preventAnimate) ? 0 : opt.dropDuration, 'ease-out').done(function () {
                                        view.isShow = true;
                                        moving = false;
                                        view.trigger('show');
                                    });
                                });
                            } else {
                                _animate(view.root, endCSS, (preventAnimate === true || view.preventAnimate) ? 0 : opt.duration).done(function () {
                                    view.isShow = true;
                                    moving = false;
                                    view.trigger('show');
                                });
                            }

                        });

                        view.once('rendered', function () {
                            if (opt.group) {
                                delegatedEvent.add(opt.group, 'touchstart', function (e) {
                                    if (e.el !== opt.item) {
                                        touchOther = true;
                                    }
                                });
                            }
                            view.root.addEventListener('tap', function (e) {
                                if (view && view.root === e.target) {
                                    view.once('hide', function () {
                                        view.destroy();
                                    });
                                    view.hide();
                                    e.stopPropagation();
                                }
                            }, true);
                        });

                        view.renderTo(doc.body);
                    }
                }
                return view;
            };

            view.hide = function (preventAnimate) {
                view.relyElement = null;
                if (!moving && view.isShow) {
                    moving = true;
                    view.trigger('beforeHide');
                    if (opt.dropDown) {
                        var els = view.root.childNodes,
                            dropDuration = (preventAnimate === true || view.preventAnimate) ? 0 : opt.dropDuration,
                            dropEl, i = -1;
                        do {
                            i++;
                            dropEl = els[i];
                        } while (dropEl.nodeType === 3);
                        dropDuration /= 2;
                        if (opt.group && touchOther) {
                            _animate(dropEl, {
                                opacity: 0
                            }, dropDuration, 'ease-in').done(function () {
                                view.isShow = false;
                                moving = false;
                                view.options.destroyDom = false;
                                if (maskLayer) {
                                    _removeNode(maskLayer);
                                }
                                maskLayer = view.root;
                                _delay(function () {
                                    _animate(maskLayer, {
                                        opacity: 0
                                    }, dropDuration, 'ease-in').done(function () {
                                        _removeNode(maskLayer);
                                        maskLayer = null;
                                    });
                                }, 100);
                                delegatedEvent.remove(opt.group, 'touchstart');
                                view.trigger('hide');
                            });
                        } else {
                            _animate(dropEl, _extend({
                                opacity: 0
                            }, getTranslate3dStyle(0, -opt.height, 0)), (preventAnimate === true || view.preventAnimate) ? 0 : dropDuration, 'ease-in').done(function () {
                                view.isShow = false;
                                moving = false;
                                view.trigger('hide');
                            });
                        }
                    } else {
                        _animate(view.root, startCSS, (preventAnimate === true || view.preventAnimate) ? 0 : opt.duration).done(function () {
                            view.isShow = false;
                            moving = false;
                            _css(view.root, display, 'none');
                            view.trigger('hide');
                        });
                    }
                }
                return view;
            };

            view.on('destroy', function () {
                view = null;
            });

            commonHandle('popup', view, opt);

            return {
                setOption: function (newOpt) {
                    opt = _extend({}, DEFAULT_OPT, newOpt);
                }
            };

        });

    })();

})();

(function() {
    var BASETAG = '_baseInfo', // 存储 Storage 配置信息
        INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7天清理一下 localStorage
    
    // Empty Function
    function EmplyFunc() {}
    
    // Null Function
    function NullFunc() {
        return null;
    }
    
    // 空的 Storage，模拟相关接口
    var EmplyStorage = {
        size: function() {
            return 0;
        },
        get: NullFunc,
        set: EmplyFunc,
        remove: EmplyFunc,
        clear: EmplyFunc
    };
    
    // 根据 type 创建 Storage 对象
    function createStorage(type) {
        var storage = (type in window) && window[type];
        return storage ? {
            // 获取 Size
            size: function() {
                return storage.length;
            },
            // 通过 index 获取键值 key
            key: (function() {
                return storage.key ? function(index) {
                    return storage.key(index);
                } : NullFunc;
            })(),
            // 通过键值 key 获取数据
            get: (function() {
                return storage.getItem ? function(key) {
                    try {
                        return JSON.parse(storage.getItem(key));
                    } catch (e) {
                        return null;
                    }
                } : NullFunc;
            })(),
            // 设置键值 key 对应的数据值为 value
            set: (function() {
                return storage.setItem ? function(key, value) {
                    try {
                        return storage.setItem(key, JSON.stringify(value));
                    } catch (e) {
                        return void 0;
                    }
                } : EmplyFunc;
            })(),
            // 移除键值 key 对应的数据项
            remove: (function() {
                return storage.removeItem ? function(key) {
                    return storage.removeItem(key);
                } : EmplyFunc;
            })(),
            // 清除数据
            clear: (function() {
                return storage.clear ? function() {
                    return storage.clear();
                } : EmplyFunc;
            })()
        } : EmplyStorage;
    }
    
    // 获取当前时间
    function now() {
        return new Date().getTime();
    }
    
    // Storage 对象 和 本地缓存
    var ls = createStorage('localStorage'),
        ss = createStorage('sessionStorage'),
        useCache = false,
        cache = {};
    
    // 检查数据是否超时，如果超时，删除数据。
    // 同时将可用数据加入本地缓存，方面以后获取
    function checkExpires() {
        var time = now(),
            i, len, key, value;
        for (i = 0, len = ls.size(); i < len; i++) {
            key = ls.key(i);
            value = ls.get(key);
            if (value && key !== BASETAG) {
                if (value.expires > 0 && value.createTime + value.expires < time) {
                    ls.remove(key);
                } else {
                    cache[key] = value.data;
                }
            }
        }
    }
    
    // 主方法
    var yStorage = function(key, value, time) {
        var argsNum = arguments.length,
            data = null;
        // 一个参数时，是获取数据
        if (argsNum === 1) {
            // 检查 key 是否在本地缓存里，如果在直接返回
            if (useCache && key in cache) {
                data = cache[key];
            } else {
                data = ss.get(key) || (function() {
                    var tmp = ls.get(key);
                    if (tmp) {
                        // 判断数据是否可用（未超时），如果可用，返回，否则删除
                        if (tmp.expires === 0 || (tmp.createTime + tmp.expires > now())) {
                            return tmp.data;
                        }
                        ls.remove(key);
                    }
                    return null;
                })();
                cache[key] = data;
            }
            return data;
        } else if (argsNum > 1) { // 参数大于1，则肯定是变更操作
            // value值是 undefined 或者 null，都是删除此键值对
            if (value === void 0 || value === null) {
                delete cache[key];
                return ss.remove(key) || ls.remove(key);
            } else {
                // 将值存入缓存
                cache[key] = value;
                time = time || 0;
                // 时间等于 -1， 则存入 SessionStorage
                if (time === -1) {
                    return ss.set(key, value);
                } else {
                    // 存入 localStorage
                    return ls.set(key, {
                        data: value,
                        createTime: now(),
                        expires: time
                    });
                }
            }
        }
    };
    
    yStorage.setCache = function(bool) {
        useCache = !!bool;
    };
    
    // 清除数据
    yStorage.clear = function() {
        var info = ls.get(BASETAG);
        ss.clear();
        ls.clear();
        ls.set(BASETAG, info);
    };
    
    // 初始化操作（非必须）
    yStorage.init = function(version) {
        var info = ls.get(BASETAG) || {},
            culVersion = info.version,
            lastCheckTime = info.cTime,
            changed = false;
        // 判断版本是否相同，如果不同则清空 localStorage
        if (!culVersion || culVersion !== version) {
            changed = true;
            ls.clear();
            culVersion = version;
        }
        // 检查后一次 cheak 时间，如果超过设置时间，而进行一次 check
        if (!lastCheckTime || now() - lastCheckTime > INTERVAL) {
            changed = true;
            checkExpires();
            lastCheckTime = now();
        }
        if (changed) {
            ls.set(BASETAG, {
                version: culVersion,
                cTime: lastCheckTime
            });
        }
    };
    

    QApp.util.storage = yStorage;

    // ======== dataSource ========

    var _ = QApp.util,
        dataSource = {};

    function Data() {
        this._source = {};
    }

    _.extend(Data.prototype, {
        get: function(key) {
            var value = this._source[key];
            if (_.isArray(value)) {
                return value.slice(0);
            } else if (_.isObject(value)) {
                return _.extend(true, {}, value);
            }
            return value;
        },
        set: function(key, value) {
            if (_.isArray(value)) {
                this._source[key] = value.slice(0);
            } else if (_.isObject(value)) {
                this._source[key] = _.extend(true, {}, value);
            } else {
                this._source[key] = value;
            }
            this.trigger('change', key, value);
        },
        merge: function(key, value) {
            if (this._source[key] !== void 0) {
                value = _.extend(true, this._source[key], value);
            }
            this.set(key, value);
        },
        remove: function(key) {
            this._source[key] = void 0;
            this.trigger('change', key);
        },
        clear: function() {
            for (var key in this._source) {
                this.remove(key);
            }
        },
        onChange: function(fn) {
            this.on('change', fn);
        },
        destroy: function() {
            this.off();
            this._source = null;
        }
    }, _.CustEvent);

    function init(space) {
        if (!dataSource[space]) {
            dataSource[space] = new Data();
        }
        return dataSource[space];
    }

    var globalSource = QApp.dataSource = {
        init: function(space) {
            return init(space);
        },
        get: function(space, key) {
            if (dataSource[space]) {
                return dataSource[space].get(key);
            }
        },
        set: function(space, key, value) {
            init(space).set(key, value);
        },
        merge: function(space, key, value) {
            init(space).merge(key, value);
        },
        remove: function(space, key) {
            init(space).remove(key);
        },
        clear: function(space) {
            if (dataSource[space]) {
                dataSource[space].clear();
            }
        },
        onChange: function(space, fn) {
            init(space).onChange(fn);
        }
    };

    // ======== globalContext ========

    var localKeys = [],
        space = QApp.hy ? QApp.hy.config().hybridId : 'global';

    var globalContext = QApp.dataSource.init(space),
        storage = QApp.util.storage;

    globalContext.on('change', function(key, value) {
        if (localKeys.indexOf(key) > -1) {
            storage(key, value);
        }
    });

    globalContext.addLocalKeys = function(keys) {
        localKeys = localKeys.concat(keys);
        localKeys.forEach(function(key) {
            globalContext.set(key, storage(key));
        });
    };

    globalContext.refresh = function() {
        localKeys.forEach(function(key) {
            globalContext.set(key, storage(key));
        })
    };

    if (QApp.hy) {
        QApp.hy.on('actived', function() {
            globalContext.refresh();
        });
    }

    QApp.util.globalContext = globalContext;

})();

(function () {

    var _ = QApp.util,
        Deferred = _.Deferred;

    var bizOptions = {},
        mockData = {},
        reqFilters = [],
        respFilters = [],
        jsonpExtraStamp = 0;

    var DEFAULT_OPT = {
        'url': '',
        'bizType': false,
        'charset': 'UTF-8',
        'timeout': 30 * 1000,
        'data': {},
        'argsType': 'query',
        'method': 'get',
        'headers': {},
        'isEncode': false,
        'dataType': 'json',
        'cache': false,
        'withCredentials': false,
        'jsonp': 'callback',
        'jsonpCallback': '',
        'success': _.noop,
        'error': _.noop,
        'onTimeout': _.noop,
        'onAbort': _.noop
    };

    function notNull(v) {
        return !(v === null || v === void 0);
    }

    function format(data, isEncode) {
        data = (data === null ? '' : data).toString().trim();
        return isEncode ? encodeURIComponent(data) : data;
    }

    function jsonToQuery(json, isEncode){
        var qs = [], k, i, len;
        for (k in json) {
            if(k === '$nullName'){
                qs = qs.concat(json[k]);
            } else if (_.isArray(json[k])) {
                for (i = 0, len = json[k].length; i < len; i++) {
                    if (!_.isFunction(json[k][i])) {
                        qs.push(k + "=" + format(json[k][i], isEncode));
                    }
                }
            } else if(!_.isFunction(json[k]) && notNull(json[k])){
                qs.push(k + "=" + format(json[k], isEncode));
            }
        }
        return qs.join('&');
    }

    function getXMLHttpRequest() {
        var xhr = false;
        try {
            xhr = new XMLHttpRequest();
        } catch (try_MS) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (other_MS) {
                try {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } catch (failed) {
                    xhr = false;
                }
            }
        }
        return xhr;
    }

    function setRequestHeader(trans, headers) {
        try {
            for (var key in headers) {
                trans.setRequestHeader(key, headers[key]);
            }
        } catch (e) {
        }
    }

    /**
     * 一般 ajax 请求处理函数（除 jsonp）
     * @param  {[type]} options  合并后的配置项
     * @param  {[type]} listener [description]
     * @return {[type]} trans    [description]
     */
    function doRequest(options, listener) {
        var trans = getXMLHttpRequest(),
            timeout,
            argsString = '',
            method = options.method.toLocaleLowerCase();

        if (options.withCredentials) {
            trans.withCredentials = true;
        }

        if (options.timeout) {
            timeout = _.delay(function () {
                try {
                    listener(null, {error: true, type: 'Timeout'});
                    trans.abort();
                } catch (exp) {
                }
            }, options.timeout);
        }

        /**
         * 重写 abort 方法
         * 原 abort 方法无法与无网络状态区分
         */
        var isAborted = false,
            _abort = trans.abort;

        trans.abort = function() {
            isAborted = true;
            _abort.call(trans);

            listener(null, {error: true, type: 'Abort'});
        }

        trans.onreadystatechange = function () {


            if (trans.readyState == 4) {
                clearTimeout(timeout);
                var data = {};
                if (options.dataType === 'xml') {
                    data = trans.responseXML;
                } else if (options.dataType === 'text') {
                    data = trans.responseText;
                } else {
                    try {
                        data = (trans.responseText && typeof trans.responseText === 'string') ? JSON.parse(trans.responseText) : {};
                    } catch (exp) {
                    }
                }
                if (trans.status === 200) {
                    listener(data);
                } else if (trans.status === 0) {
                    // 如果不是手动 abort 的
                    if (!isAborted) {
                        // 无网络
                        listener(null, {error: true, type: 'Fail'});
                    }
                } else {
                    listener(null, {error: true, type: 'Fail'});
                }
            }
        };

        /**
         * cache 处理
         * 默认为 false
         * 当为 get 请求时添加时间戳
         */
        if (method === 'get') {
            if (options.cache === false) {
                options.data.__rnd = new Date().getTime();
            }
        }

        if (options.argsType === 'query') {
            argsString = jsonToQuery(options.data, options.isEncode);
        } else if (options.argsType === 'json') {
            argsString = JSON.stringify(options.data);
            if (options.isEncode) {
                argsString = encodeURIComponent(argsString);
            }
        }

        // 设置 Content-Type
        if (!options.headers['Content-Type']) {
            // 如果用户未定义
            if (options.argsType === 'json') {
                // 如果用户设置请求数据格式为 json
                options.headers['Content-Type'] = 'application/json;charset=' + options.charset;
            } else {
                options.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=' + options.charset;
            }
        }
        // 设置 X-Requested-With
        if (!options.headers['X-Requested-With']) {
            options.headers['X-Requested-With'] = 'XMLHttpRequest';
        }

        if (method === 'get') {
            var url
            if (argsString) {
                url = options.url + (!~options.url.indexOf('?') ? '?' : '&') + argsString
            } else {
                url = options.url
            }
            trans.open('get', url, true);
            setRequestHeader(trans, options.headers);
            trans.send('');
        } else {
            trans.open('post', options.url, true);
            setRequestHeader(trans, options.headers);
            trans.send(argsString);
        }

        return trans;
    }

    /**
     * jsonp 请求处理函数
     * @return {[type]} [description]
     */
    function doJsonp(options, listener) {

        var trans = {},
            isCanceled = false,         // 是否被取消
            callbackName = '',          // 回调函数名
            overwritten,                // 用户回调函数寄存
            hasSetCallbackName = false, // 用户是否设置回调函数名
            scriptElem = document.createElement('script'),
            timer;

        /**
         * url 处理
         */
        // 相对路径转绝对路径
        // 参考 http://blog.wangdagen.com/coding/2015/01/29/get-url-ie.html
        scriptElem.src = options.url;

        // ie7- 下需要再赋值一次，qapp 目前不需要支持 ie
        // scriptElem.src ＝ scriptElem.src

        var URL = _.parseURL(scriptElem.src);

        URL.query = _.extend(URL.query, options.data);

        /**
         * 回调函数名
         */
        if (options.jsonpCallback) {
            // 如果用户设置了回调函数名
            hasSetCallbackName = true;
            // 寄存回调函数
            overwritten = window[options.jsonpCallback];
        } else {
            // 如果用户没有设置回调函数名，生成随机函数名
            options.jsonpCallback = 'QApp_' + (+ new Date()) + (jsonpExtraStamp ++);
        }
        callbackName = options.jsonpCallback;
        URL.query[options.jsonp] = callbackName;

        /**
         * cache 处理
         * 默认为 false
         */
        if (options.cache === false) {
            // 唯一数字戳
            URL.query.__rnd = (+ new Date()) + (jsonpExtraStamp ++);
        }

        /**
         * abort 方法
         */
        trans.abort = function() {
            isCanceled = true

            listener(null, {error: true, type: 'Abort'});
            backingOut();
        }

        window[callbackName] = function(data) {

            if (timer) {
                clearTimeout(timer);
            }

            if (isCanceled) {
                return
            }

            listener(data);
            backingOut();
        };

        timer = _.delay(function() {
            listener(null, {error: true, type: 'Timeout'});
            backingOut();
        }, options.timeout);


        /**
         * 插入 script 元素
         */
        // 创建 script 元素
        scriptElem.async = true;
        scriptElem.charset = options.charset;
        scriptElem.src = URL.toUrl();
        // script 元素事件绑定
        scriptElem.onerror = function() {
            if (timer) {
                clearTimeout(timer);
            }

            listener(null, {error: true, type: 'Fail'});
            backingOut();
        }

        // 强势插入
        document.head.appendChild(scriptElem);

        return trans;

        /**
         * 各种回调结束后的现场恢复函数
         */
        function backingOut() {
            // 回调函数处理
            if (hasSetCallbackName) {
                // 如果回调函数是用户设置，恢复
                window[callbackName] = overwritten;
            } else {
                // 如果回调函数不是用户设置，销毁
                delete window[callbackName];
            }
            // script 元素删除
            scriptElem.remove();
        }
    }

    function mockAjax(opt, deferred) {
        var mockObj = mockData[opt.mockKey || ''],
            data = null;
        _.delay(function () {
            if (mockObj) {
                if (_.isFunction(mockObj)) {
                    data = mockObj(opt);
                } else {
                    data = mockObj;
                }
            }
            var flag = true;
            respFilters.forEach(function(filter) {
                if (filter(data, null, opt, deferred) === false) {
                    flag = false;
                }
            });
            if (flag) {
                deferred.resolve(data);
                opt.success(data, null);
            }
        }, opt.mockTime || 1000);
    }

    var ajax = QApp.ajax = _.ajax = function (options) {
        if (_.isString(options)) {
            options = {url: options};
        }

        if (options.bizType && bizOptions[options.bizType]) {
            options = _.extend(true, {}, bizOptions[options.bizType], options);
        }



        var deferred = new Deferred(),
            opt = _.extend(true, {}, DEFAULT_OPT, options),
            trans = {},
            flag = true;

        reqFilters.forEach(function(filer) {
            if (filer(opt, deferred) === false) {
                flag = false;
            }
        });

        if (flag) {
            if (opt.mock) {
                trans.abort = function () {
                    deferred.reject({
                        error: true,
                        type: 'Abort'
                    });
                    opt.onAbort(null, trans);
                };
                mockAjax(opt, deferred);
            } else if (options.dataType === 'jsonp') {
                /**
                 * ------------- jsonp code here -------------
                 */
                trans = doJsonp(opt, listener);
            } else {
                /**
                 * ------------- common ajax code here -------------
                 */
                trans = doRequest(opt, listener);
            }
        }

        deferred.trans = trans;

        return deferred;


        function listener(data, err) {
            var flag = true;
            respFilters.forEach(function (filter) {
                if (filter(data, err, opt, deferred) === false) {
                    flag = false;
                }
            });
            if (flag) {
                if (err) {
                    deferred.reject(err);
                    if (err.type === 'Timeout') {
                        opt.onTimeout(data, trans);
                    } else if (err.type === 'Abort') {
                        opt.onAbort(data, trans);
                    } else {
                        opt.error(data, trans);
                    }
                } else {
                    deferred.resolve(data);
                    opt.success(data, trans);
                }
            }
        }
    };

    QApp.ajax.setBizOptions = function(key, opt) {
        if (_.isString(key)) {
            bizOptions[key] = opt;
        } else {
            _.extend(true, bizOptions, key);
        }
    };

    QApp.ajax.addMock = function(key, mock) {
        if (_.isString(key)) {
            mockData[key] = mock;
        } else {
            mockData = key;
        }
    };

    QApp.ajax.addReqFilter = function(filter) {
        reqFilters = reqFilters.concat(filter);
    };

    QApp.ajax.removeReqFilter = function(filter) {
        var index = reqFilters.indexOf(filter);
        if (index > -1) {
            reqFilters.splice(index, 1);
        }
    };

    QApp.ajax.addRespFilter = function(filter) {
        respFilters = respFilters.concat(filter);
    };

    QApp.ajax.removeRespFilter = function(filter) {
        var index = respFilters.indexOf(filter);
        if (index > -1) {
            respFilters.splice(index, 1);
        }
    };

    QApp.addPlugin('ajax', {
        bizType: '',
        mock: false
    }, function(view, opt) {

        var list = [];

        view.ajax = function(options) {
            var opts = _.extend(true, {}, opt, options);
            opts.__view = view;
            var _ajax = ajax(opts);
            list.push(_ajax);
            _ajax.all(function() {
                list.splice(list.indexOf(_ajax), 1);
            });
            return _ajax;
        };

        view.on('destroy', function() {
            list.forEach(function(_ajax) {
                _ajax.destroy();
                _ajax.trans && _ajax.trans.abort();
            });
            list.length = 0;
            list = null;
        });

    });

})();

(function() {
    var _ = QApp.util;

    var DEFAULT_OPT = {
        tag: 'node-type'
    };

    QApp.addPlugin('doms', DEFAULT_OPT, function (view, options, config) {

        view.doms = {};

        view.find = function(type) {
            return view.root ? _.makeArray(view.root.querySelectorAll('[' + options.tag + '="' + type + '"]')) : [];
        };

        view.on('rendered', function () {
            _.makeArray(view.root.querySelectorAll('[' + options.tag + ']')).forEach(function (item) {
                var name = _.attr(item, options.tag) || 'node';
                if (!view.doms[name]) {
                    view.doms[name] = item;
                } else {
                    if (_.isArray(view.doms[name])) {
                        view.doms[name].push(item);
                    } else {
                        view.doms[name] = [view.doms[name], item];
                    }
                }
            });
        });

        view.on('destroy', function () {
            _.empty(view.doms);
            view.doms = null;
        });

    });
})();

/*
 *  Copyright 2011 Twitter, Inc.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var Hogan = window.Hogan = QApp.util.hogan = {};

(function (Hogan, useArrayBuffer) {
    Hogan.Template = function (renderFunc, text, compiler, options) {
        this.r = renderFunc || this.r;
        this.c = compiler;
        this.options = options;
        this.text = text || '';
        this.buf = (useArrayBuffer) ? [] : '';
    }

    Hogan.Template.prototype = {
        // render: replaced by generated code.
        r: function (context, partials, indent) { return ''; },

        // variable escaping
        v: hoganEscape,

        // triple stache
        t: coerceToString,

        render: function render(context, partials, indent) {
            return this.ri([context], partials || {}, indent);
        },

        // render internal -- a hook for overrides that catches partials too
        ri: function (context, partials, indent) {
            return this.r(context, partials, indent);
        },

        // tries to find a partial in the curent scope and render it
        rp: function(name, context, partials, indent) {
            var partial = partials[name];

            if (!partial) {
                return '';
            }

            if (this.c && typeof partial == 'string') {
                partial = this.c.compile(partial, this.options);
            }

            return partial.ri(context, partials, indent);
        },

        // render a section
        rs: function(context, partials, section) {
            var tail = context[context.length - 1];

            if (!isArray(tail)) {
                section(context, partials, this);
                return;
            }

            for (var i = 0; i < tail.length; i++) {
                context.push(tail[i]);
                section(context, partials, this);
                context.pop();
            }
        },

        // maybe start a section
        s: function(val, ctx, partials, inverted, start, end, tags) {
            var pass;

            if (isArray(val) && val.length === 0) {
                return false;
            }

            if (typeof val == 'function') {
                val = this.ls(val, ctx, partials, inverted, start, end, tags);
            }

            pass = (val === '') || !!val;

            if (!inverted && pass && ctx) {
                ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
            }

            return pass;
        },

        // find values with dotted names
        d: function(key, ctx, partials, returnFound) {
            var names = key.split('.'),
                val = this.f(names[0], ctx, partials, returnFound),
                cx = null;

            if (key === '.' && isArray(ctx[ctx.length - 2])) {
                return ctx[ctx.length - 1];
            }

            for (var i = 1; i < names.length; i++) {
                if (val && typeof val == 'object' && names[i] in val) {
                    cx = val;
                    val = val[names[i]];
                } else {
                    val = '';
                }
            }

            if (returnFound && !val) {
                return false;
            }

            if (!returnFound && typeof val == 'function') {
                ctx.push(cx);
                val = this.lv(val, ctx, partials);
                ctx.pop();
            }

            return val;
        },

        // find values with normal names
        f: function(key, ctx, partials, returnFound) {
            var val = false,
                v = null,
                found = false;

            for (var i = ctx.length - 1; i >= 0; i--) {
                v = ctx[i];
                if (v && typeof v == 'object' && key in v) {
                    val = v[key];
                    found = true;
                    break;
                }
            }

            if (!found) {
                return (returnFound) ? false : "";
            }

            if (!returnFound && typeof val == 'function') {
                val = this.lv(val, ctx, partials);
            }

            return val;
        },

        // higher order templates
        ho: function(val, cx, partials, text, tags) {
            var compiler = this.c;
            var options = this.options;
            options.delimiters = tags;
            var text = val.call(cx, text);
            text = (text == null) ? String(text) : text.toString();
            this.b(compiler.compile(text, options).render(cx, partials));
            return false;
        },

        // template result buffering
        b: (useArrayBuffer) ? function(s) { this.buf.push(s); } :
            function(s) { this.buf += s; },
        fl: (useArrayBuffer) ? function() { var r = this.buf.join(''); this.buf = []; return r; } :
            function() { var r = this.buf; this.buf = ''; return r; },

        // lambda replace section
        ls: function(val, ctx, partials, inverted, start, end, tags) {
            var cx = ctx[ctx.length - 1],
                t = null;

            if (!inverted && this.c && val.length > 0) {
                return this.ho(val, cx, partials, this.text.substring(start, end), tags);
            }

            t = val.call(cx);

            if (typeof t == 'function') {
                if (inverted) {
                    return true;
                } else if (this.c) {
                    return this.ho(t, cx, partials, this.text.substring(start, end), tags);
                }
            }

            return t;
        },

        // lambda replace variable
        lv: function(val, ctx, partials) {
            var cx = ctx[ctx.length - 1];
            var result = val.call(cx);

            if (typeof result == 'function') {
                result = coerceToString(result.call(cx));
                if (this.c && ~result.indexOf("{\u007B")) {
                    return this.c.compile(result, this.options).render(cx, partials);
                }
            }

            return coerceToString(result);
        }

    };

    var rAmp = /&/g,
        rLt = /</g,
        rGt = />/g,
        rApos =/\'/g,
        rQuot = /\"/g,
        hChars =/[&<>\"\']/;


    function coerceToString(val) {
        return String((val === null || val === undefined) ? '' : val);
    }

    function hoganEscape(str) {
        str = coerceToString(str);
        return hChars.test(str) ?
            str
                .replace(rAmp,'&amp;')
                .replace(rLt,'&lt;')
                .replace(rGt,'&gt;')
                .replace(rApos,'&#39;')
                .replace(rQuot, '&quot;') :
            str;
    }

    var isArray = Array.isArray || function(a) {
            return Object.prototype.toString.call(a) === '[object Array]';
        };

})(Hogan);

(function (Hogan) {
    // Setup regex  assignments
    // remove whitespace according to Mustache spec
    var rIsWhitespace = /\S/,
        rQuot = /\"/g,
        rNewline =  /\n/g,
        rCr = /\r/g,
        rSlash = /\\/g,
        tagTypes = {
            '#': 1, '^': 2, '/': 3,  '!': 4, '>': 5,
            '<': 6, '=': 7, '_v': 8, '{': 9, '&': 10
        };

    Hogan.scan = function scan(text, delimiters) {
        var len = text.length,
            IN_TEXT = 0,
            IN_TAG_TYPE = 1,
            IN_TAG = 2,
            state = IN_TEXT,
            tagType = null,
            tag = null,
            buf = '',
            tokens = [],
            seenTag = false,
            i = 0,
            lineStart = 0,
            otag = '{{',
            ctag = '}}';

        function addBuf() {
            if (buf.length > 0) {
                tokens.push(new String(buf));
                buf = '';
            }
        }

        function lineIsWhitespace() {
            var isAllWhitespace = true;
            for (var j = lineStart; j < tokens.length; j++) {
                isAllWhitespace =
                    (tokens[j].tag && tagTypes[tokens[j].tag] < tagTypes['_v']) ||
                    (!tokens[j].tag && tokens[j].match(rIsWhitespace) === null);
                if (!isAllWhitespace) {
                    return false;
                }
            }

            return isAllWhitespace;
        }

        function filterLine(haveSeenTag, noNewLine) {
            addBuf();

            if (haveSeenTag && lineIsWhitespace()) {
                for (var j = lineStart, next; j < tokens.length; j++) {
                    if (!tokens[j].tag) {
                        if ((next = tokens[j+1]) && next.tag == '>') {
                            // set indent to token value
                            next.indent = tokens[j].toString()
                        }
                        tokens.splice(j, 1);
                    }
                }
            } else if (!noNewLine) {
                tokens.push({tag:'\n'});
            }

            seenTag = false;
            lineStart = tokens.length;
        }

        function changeDelimiters(text, index) {
            var close = '=' + ctag,
                closeIndex = text.indexOf(close, index),
                delimiters = trim(
                    text.substring(text.indexOf('=', index) + 1, closeIndex)
                ).split(' ');

            otag = delimiters[0];
            ctag = delimiters[1];

            return closeIndex + close.length - 1;
        }

        if (delimiters) {
            delimiters = delimiters.split(' ');
            otag = delimiters[0];
            ctag = delimiters[1];
        }

        for (i = 0; i < len; i++) {
            if (state == IN_TEXT) {
                if (tagChange(otag, text, i)) {
                    --i;
                    addBuf();
                    state = IN_TAG_TYPE;
                } else {
                    if (text.charAt(i) == '\n') {
                        filterLine(seenTag);
                    } else {
                        buf += text.charAt(i);
                    }
                }
            } else if (state == IN_TAG_TYPE) {
                i += otag.length - 1;
                tag = tagTypes[text.charAt(i + 1)];
                tagType = tag ? text.charAt(i + 1) : '_v';
                if (tagType == '=') {
                    i = changeDelimiters(text, i);
                    state = IN_TEXT;
                } else {
                    if (tag) {
                        i++;
                    }
                    state = IN_TAG;
                }
                seenTag = i;
            } else {
                if (tagChange(ctag, text, i)) {
                    tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
                        i: (tagType == '/') ? seenTag - ctag.length : i + otag.length});
                    buf = '';
                    i += ctag.length - 1;
                    state = IN_TEXT;
                    if (tagType == '{') {
                        if (ctag == '}}') {
                            i++;
                        } else {
                            cleanTripleStache(tokens[tokens.length - 1]);
                        }
                    }
                } else {
                    buf += text.charAt(i);
                }
            }
        }

        filterLine(seenTag, true);

        return tokens;
    }

    function cleanTripleStache(token) {
        if (token.n.substr(token.n.length - 1) === '}') {
            token.n = token.n.substring(0, token.n.length - 1);
        }
    }

    function trim(s) {
        if (s.trim) {
            return s.trim();
        }

        return s.replace(/^\s*|\s*$/g, '');
    }

    function tagChange(tag, text, index) {
        if (text.charAt(index) != tag.charAt(0)) {
            return false;
        }

        for (var i = 1, l = tag.length; i < l; i++) {
            if (text.charAt(index + i) != tag.charAt(i)) {
                return false;
            }
        }

        return true;
    }

    function buildTree(tokens, kind, stack, customTags) {
        var instructions = [],
            opener = null,
            token = null;

        while (tokens.length > 0) {
            token = tokens.shift();
            if (token.tag == '#' || token.tag == '^' || isOpener(token, customTags)) {
                stack.push(token);
                token.nodes = buildTree(tokens, token.tag, stack, customTags);
                instructions.push(token);
            } else if (token.tag == '/') {
                if (stack.length === 0) {
                    throw new Error('Closing tag without opener: /' + token.n);
                }
                opener = stack.pop();
                if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
                    throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
                }
                opener.end = token.i;
                return instructions;
            } else {
                instructions.push(token);
            }
        }

        if (stack.length > 0) {
            throw new Error('missing closing tag: ' + stack.pop().n);
        }

        return instructions;
    }

    function isOpener(token, tags) {
        for (var i = 0, l = tags.length; i < l; i++) {
            if (tags[i].o == token.n) {
                token.tag = '#';
                return true;
            }
        }
    }

    function isCloser(close, open, tags) {
        for (var i = 0, l = tags.length; i < l; i++) {
            if (tags[i].c == close && tags[i].o == open) {
                return true;
            }
        }
    }

    Hogan.generate = function (tree, text, options) {
        var code = 'var _=this;_.b(i=i||"");' + walk(tree) + 'return _.fl();';
        if (options.asString) {
            return 'function(c,p,i){' + code + ';}';
        }

        return new Hogan.Template(new Function('c', 'p', 'i', code), text, Hogan, options);
    }

    function esc(s) {
        return s.replace(rSlash, '\\\\')
            .replace(rQuot, '\\\"')
            .replace(rNewline, '\\n')
            .replace(rCr, '\\r');
    }

    function chooseMethod(s) {
        return (~s.indexOf('.')) ? 'd' : 'f';
    }

    function walk(tree) {
        var code = '';
        for (var i = 0, l = tree.length; i < l; i++) {
            var tag = tree[i].tag;
            if (tag == '#') {
                code += section(tree[i].nodes, tree[i].n, chooseMethod(tree[i].n),
                    tree[i].i, tree[i].end, tree[i].otag + " " + tree[i].ctag);
            } else if (tag == '^') {
                code += invertedSection(tree[i].nodes, tree[i].n,
                    chooseMethod(tree[i].n));
            } else if (tag == '<' || tag == '>') {
                code += partial(tree[i]);
            } else if (tag == '{' || tag == '&') {
                code += tripleStache(tree[i].n, chooseMethod(tree[i].n));
            } else if (tag == '\n') {
                code += text('"\\n"' + (tree.length-1 == i ? '' : ' + i'));
            } else if (tag == '_v') {
                code += variable(tree[i].n, chooseMethod(tree[i].n));
            } else if (tag === undefined) {
                code += text('"' + esc(tree[i]) + '"');
            }
        }
        return code;
    }

    function section(nodes, id, method, start, end, tags) {
        return 'if(_.s(_.' + method + '("' + esc(id) + '",c,p,1),' +
            'c,p,0,' + start + ',' + end + ',"' + tags + '")){' +
            '_.rs(c,p,' +
            'function(c,p,_){' +
            walk(nodes) +
            '});c.pop();}';
    }

    function invertedSection(nodes, id, method) {
        return 'if(!_.s(_.' + method + '("' + esc(id) + '",c,p,1),c,p,1,0,0,"")){' +
            walk(nodes) +
            '};';
    }

    function partial(tok) {
        return '_.b(_.rp("' +  esc(tok.n) + '",c,p,"' + (tok.indent || '') + '"));';
    }

    function tripleStache(id, method) {
        return '_.b(_.t(_.' + method + '("' + esc(id) + '",c,p,0)));';
    }

    function variable(id, method) {
        return '_.b(_.v(_.' + method + '("' + esc(id) + '",c,p,0)));';
    }

    function text(id) {
        return '_.b(' + id + ');';
    }

    Hogan.parse = function(tokens, text, options) {
        options = options || {};
        return buildTree(tokens, '', [], options.sectionTags || []);
    },

        Hogan.cache = {};

    Hogan.compile = function(text, options) {
        // options
        //
        // asString: false (default)
        //
        // sectionTags: [{o: '_foo', c: 'foo'}]
        // An array of object with o and c fields that indicate names for custom
        // section tags. The example above allows parsing of {{_foo}}{{/foo}}.
        //
        // delimiters: A string that overrides the default delimiters.
        // Example: "<% %>"
        //
        options = options || {};

        var key = text + '||' + !!options.asString;

        var t = this.cache[key];

        if (t) {
            return t;
        }

        t = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
        return this.cache[key] = t;
    };
})(Hogan);

/* ================================== 插件逻辑 ================================== */
(function() {
    var _ = QApp.util,
        _insertElement = _.insertElement,
        _builder = _.builder;

    QApp.addPlugin(['hogan', 'engine.hogan'], {}, function (view, options, config) {

        if (options.global) {
            view.on('loadEnd', function () {
                var html = view.html,
                    template;

                template = Hogan.compile(html, options.config || {});
                view.html = template.render(_.extend({}, options.global.data, view.param));
            });
        }

        view.renderData = function(key, data, hoganOpt, container, appendType) {
            var opt = options[key],
                root, template, html, nodes, node;
            if (opt) {
                container = container || opt.container;
                root = container ? view.root.querySelector(container) : view.root;
                if (root) {
                    appendType = appendType || opt.appendType || 'inner';
                    template = Hogan.compile(opt.template || '', hoganOpt || opt.options || {});
                    html = template.render(data || {});
                    if (appendType === 'inner') {
                        root.innerHTML = html;
                    } else {
                        nodes = _builder(html).children;
                        node = nodes.shift();
                        _insertElement(root, node, appendType);
                        nodes.reverse().forEach(function(n) {
                            _insertElement(node, n, 'afterend');
                        });
                    }
                }
            }
        }

    });
})();

(function() {
    var _ = QApp.util;

    var DEFAULT_OPT = {
        tag: 'action-type',
        eventType: 'tap'
    };

    QApp.addPlugin('delegated', DEFAULT_OPT, function (view, options, config) {

        view.on('loaded', function () {
            var delegatedEvent = view.delegatedEvent = _.delegatedEvent(view.root, [], options.tag);

            if (view.options.bindActions) {
                _.each(view.options.bindActions, function(key, process) {
                    var ae = key.split(':'),
                        action = ae[0],
                        eventType = ae[1] || options.eventType;

                    if (typeof process === 'string') process = view[process];

                    if (_.isFunction(process)) {
                        delegatedEvent.add(action, eventType, function (e, data) {
                            return process.call(view, e, data);
                        });
                    }
                });
            }

            view.bind = function (action, eventType, process) {
                if (_.isFunction(eventType)) {
                    process = eventType;
                    eventType = options.eventType;
                }
                if (_.isFunction(process)) {
                    delegatedEvent.add(action, eventType, function (e, data) {
                        return process.call(view, e, data);
                    });
                }
            };

            view.fireAction = delegatedEvent.fireAction;

        });

        view.on('destroy', function () {
            if (view.delegatedEvent && _.isFunction(view.delegatedEvent.destroy)) {
                view.delegatedEvent.destroy();
            }
            view.delegatedEvent = null;
            view.bind = null;
        });

    });
})();

/********************************* IScroll *****************************/
/*! iScroll v5.1.3 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
(function (window, document, Math) {
    var rAF = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    var utils = (function () {
        var me = {};

        var _elementStyle = document.createElement('div').style;
        var _vendor = (function () {
            var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
                transform,
                i = 0,
                l = vendors.length;

            for (; i < l; i++) {
                transform = vendors[i] + 'ransform';
                if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
            }

            return false;
        })();

        function _prefixStyle(style) {
            if (_vendor === false) return false;
            if (_vendor === '') return style;
            return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
        }

        me.getTime = Date.now || function getTime() {
            return new Date().getTime();
        };

        me.extend = function (target, obj) {
            for (var i in obj) {
                target[i] = obj[i];
            }
        };

        me.addEvent = function (el, type, fn, capture) {
            el.addEventListener(type, fn, !!capture);
        };

        me.removeEvent = function (el, type, fn, capture) {
            el.removeEventListener(type, fn, !!capture);
        };

        me.prefixPointerEvent = function (pointerEvent) {
            return window.MSPointerEvent ?
            'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10) :
                pointerEvent;
        };

        me.momentum = function (current, start, time, lowerMargin, wrapperSize, deceleration) {
            var distance = current - start,
                speed = Math.abs(distance) / time,
                destination,
                duration;

            deceleration = deceleration === undefined ? 0.0006 : deceleration;

            destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
            duration = speed / deceleration;

            if (destination < lowerMargin) {
                destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
                distance = Math.abs(destination - current);
                duration = distance / speed;
            } else if (destination > 0) {
                destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
                distance = Math.abs(current) + destination;
                duration = distance / speed;
            }

            return {
                destination: Math.round(destination),
                duration: duration
            };
        };

        var _transform = _prefixStyle('transform');

        me.extend(me, {
            hasTransform: _transform !== false,
            hasPerspective: _prefixStyle('perspective') in _elementStyle,
            hasTouch: 'ontouchstart' in window,
            hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
            hasTransition: _prefixStyle('transition') in _elementStyle
        });

        // This should find all Android browsers lower than build 535.19 (both stock browser and webview)
        me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));

        me.extend(me.style = {}, {
            transform: _transform,
            transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
            transitionDuration: _prefixStyle('transitionDuration'),
            transitionDelay: _prefixStyle('transitionDelay'),
            transformOrigin: _prefixStyle('transformOrigin')
        });

        me.hasClass = function (e, c) {
            var re = new RegExp("(^|\\s)" + c + "(\\s|$)");
            return re.test(e.className);
        };

        me.addClass = function (e, c) {
            if (me.hasClass(e, c)) {
                return;
            }

            var newclass = e.className.split(' ');
            newclass.push(c);
            e.className = newclass.join(' ');
        };

        me.removeClass = function (e, c) {
            if (!me.hasClass(e, c)) {
                return;
            }

            var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
            e.className = e.className.replace(re, ' ');
        };

        me.offset = function (el) {
            var left = -el.offsetLeft,
                top = -el.offsetTop;

            // jshint -W084
            while (el = el.offsetParent) {
                left -= el.offsetLeft;
                top -= el.offsetTop;
            }
            // jshint +W084

            return {
                left: left,
                top: top
            };
        };

        me.preventDefaultException = function (el, exceptions) {
            for (var i in exceptions) {
                if (exceptions[i].test(el[i])) {
                    return true;
                }
            }

            return false;
        };

        me.extend(me.eventType = {}, {
            touchstart: 1,
            touchmove: 1,
            touchend: 1,

            mousedown: 2,
            mousemove: 2,
            mouseup: 2,

            pointerdown: 3,
            pointermove: 3,
            pointerup: 3,

            MSPointerDown: 3,
            MSPointerMove: 3,
            MSPointerUp: 3
        });

        me.extend(me.ease = {}, {
            quadratic: {
                style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fn: function (k) {
                    return k * ( 2 - k );
                }
            },
            circular: {
                style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',   // Not properly "circular" but this looks better, it should be (0.075, 0.82, 0.165, 1)
                fn: function (k) {
                    return Math.sqrt(1 - ( --k * k ));
                }
            },
            back: {
                style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                fn: function (k) {
                    var b = 4;
                    return ( k = k - 1 ) * k * ( ( b + 1 ) * k + b ) + 1;
                }
            },
            bounce: {
                style: '',
                fn: function (k) {
                    if (( k /= 1 ) < ( 1 / 2.75 )) {
                        return 7.5625 * k * k;
                    } else if (k < ( 2 / 2.75 )) {
                        return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
                    } else if (k < ( 2.5 / 2.75 )) {
                        return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
                    } else {
                        return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
                    }
                }
            },
            elastic: {
                style: '',
                fn: function (k) {
                    var f = 0.22,
                        e = 0.4;

                    if (k === 0) {
                        return 0;
                    }
                    if (k == 1) {
                        return 1;
                    }

                    return ( e * Math.pow(2, -10 * k) * Math.sin(( k - f / 4 ) * ( 2 * Math.PI ) / f) + 1 );
                }
            }
        });

        me.tap = function (e, eventName) {
            var ev = document.createEvent('Event');
            ev.initEvent(eventName, true, true);
            ev.pageX = e.pageX;
            ev.pageY = e.pageY;
            e.target.dispatchEvent(ev);
        };

        me.click = function (e) {
            var target = e.target,
                ev;

            if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
                ev = document.createEvent('MouseEvents');
                ev.initMouseEvent('click', true, true, e.view, 1,
                    target.screenX, target.screenY, target.clientX, target.clientY,
                    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                    0, null);

                ev._constructed = true;
                target.dispatchEvent(ev);
            }
        };

        /**
         * 环境嗅探
         * @type {Object}
         * @attribute [isAndroid] {Boolen} 是否是安卓系统
         * @attribute [osVersionN] {Number} 系统版本
         */
        me.sniff = (function() {
            var sniff = {
                isAndroid: false,
                osVersionN: 0
            };

            if (QApp && QApp.sniff) {
                // 如果存在 QApp
                var QAppSniff = QApp.sniff;

                sniff.isAndroid = QAppSniff.android;
                sniff.osVersionN = QAppSniff.osVersionN;
            } else {
                // 如果不存在 QApp
                // todo..
            }

            return sniff;
        })()

        return me;
    })();

    function IScroll(el, options) {
        this.wrapper = typeof el == 'string' ? document.querySelector(el) : el;
        this.scroller = this.wrapper.children[0];
        this.scrollerStyle = this.scroller.style;       // cache style for better performance

        this.options = {

            resizeScrollbars: true,

            mouseWheelSpeed: 20,

            snapThreshold: 0.334,

            // INSERT POINT: OPTIONS

            startX: 0,
            startY: 0,
            scrollY: true,
            directionLockThreshold: 5,
            momentum: true,

            bounce: true,
            bounceTime: 600,
            bounceEasing: '',

            preventDefault: true,
            preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/},

            HWCompositing: true,
            useTransition: true,
            useTransform: true
        };

        for (var i in options) {
            this.options[i] = options[i];
        }

        // Normalize options
        this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

        this.options.useTransition = utils.hasTransition && this.options.useTransition;
        this.options.useTransform = utils.hasTransform && this.options.useTransform;

        this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
        this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

        // If you want eventPassthrough I have to lock one of the axes
        this.options.scrollY = this.options.eventPassthrough == 'vertical' ? false : this.options.scrollY;
        this.options.scrollX = this.options.eventPassthrough == 'horizontal' ? false : this.options.scrollX;

        // With eventPassthrough we also need lockDirection mechanism
        this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
        this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

        this.options.bounceEasing = typeof this.options.bounceEasing == 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

        this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

        if (this.options.tap === true) {
            this.options.tap = 'tap';
        }

        if (this.options.shrinkScrollbars == 'scale') {
            this.options.useTransition = false;
        }

        this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

        if (this.options.probeType == 3) {
            this.options.useTransition = false;
        }

// INSERT POINT: NORMALIZATION

        // Some defaults
        this.x = 0;
        this.y = 0;
        this.directionX = 0;
        this.directionY = 0;
        this._events = {};

// INSERT POINT: DEFAULTS

        this._init();
        this.refresh();

        this.scrollTo(this.options.startX, this.options.startY);
        this.enable();
    }

    IScroll.prototype = {
        version: '5.1.3',

        _init: function () {
            this._initEvents();

            if (this.options.scrollbars || this.options.indicators) {
                this._initIndicators();
            }

            if (this.options.mouseWheel) {
                this._initWheel();
            }

            if (this.options.snap) {
                this._initSnap();
            }

            if (this.options.keyBindings) {
                this._initKeys();
            }

            // INSERT POINT: _init

        },

        destroy: function () {
            this._initEvents(true);

            this._execEvent('destroy');
        },

        _transitionEnd: function (e) {
            if (e.target != this.scroller || !this.isInTransition) {
                return;
            }

            this._transitionTime();
            if (!this.resetPosition(this.options.bounceTime)) {
                this.isInTransition = false;
                this._execEvent('scrollEnd');
            }
        },

        _start: function (e) {
            // React to left mouse button only
            if (utils.eventType[e.type] != 1) {
                if (e.button !== 0) {
                    return;
                }
            }

            if (!this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated)) {
                return;
            }

            if (this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                e.preventDefault();
            }

            var point = e.touches ? e.touches[0] : e,
                pos;

            this.initiated = utils.eventType[e.type];
            this.moved = false;
            this.distX = 0;
            this.distY = 0;
            this.directionX = 0;
            this.directionY = 0;
            this.directionLocked = 0;

            this._transitionTime();

            this.startTime = utils.getTime();

            if (this.options.useTransition && this.isInTransition) {
                this.isInTransition = false;
                pos = this.getComputedPosition();
                this._translate(Math.round(pos.x), Math.round(pos.y));
                this._execEvent('scrollEnd');
            } else if (!this.options.useTransition && this.isAnimating) {
                this.isAnimating = false;
                this._execEvent('scrollEnd');
            }

            this.startX = this.x;
            this.startY = this.y;
            this.absStartX = this.x;
            this.absStartY = this.y;
            this.pointX = point.pageX;
            this.pointY = point.pageY;

            this._execEvent('beforeScrollStart');
        },

        _move: function (e) {
            if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                return;
            }

            if (this.options.preventDefault) {  // increases performance on Android? TODO: check!
                e.preventDefault();
            } else if (utils.sniff.isAndroid && utils.sniff.osVersionN < 5) {
                // 是安卓并且系统在 5.0 以下，touchmove 只被触发一次
                e.preventDefault();
            }

            var point = e.touches ? e.touches[0] : e,
                deltaX = point.pageX - this.pointX,
                deltaY = point.pageY - this.pointY,
                timestamp = utils.getTime(),
                newX, newY,
                absDistX, absDistY;

            this.pointX = point.pageX;
            this.pointY = point.pageY;

            this.distX += deltaX;
            this.distY += deltaY;
            absDistX = Math.abs(this.distX);
            absDistY = Math.abs(this.distY);

            // We need to move at least 10 pixels for the scrolling to initiate
            if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                return;
            }

            // If you are scrolling in one direction lock the other
            if (!this.directionLocked && !this.options.freeScroll) {
                if (absDistX > absDistY + this.options.directionLockThreshold) {
                    this.directionLocked = 'h';     // lock horizontally
                } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
                    this.directionLocked = 'v';     // lock vertically
                } else {
                    this.directionLocked = 'n';     // no lock
                }
            }

            if (this.directionLocked == 'h') {
                if (this.options.eventPassthrough == 'vertical') {
                    e.preventDefault();
                } else if (this.options.eventPassthrough == 'horizontal') {
                    this.initiated = false;
                    return;
                }

                deltaY = 0;
            } else if (this.directionLocked == 'v') {
                if (this.options.eventPassthrough == 'horizontal') {
                    e.preventDefault();
                } else if (this.options.eventPassthrough == 'vertical') {
                    this.initiated = false;
                    return;
                }

                deltaX = 0;
            }

            deltaX = this.hasHorizontalScroll ? deltaX : 0;
            deltaY = this.hasVerticalScroll ? deltaY : 0;

            newX = this.x + deltaX;
            newY = this.y + deltaY;

            // Slow down if outside of the boundaries
            if (newX > 0 || newX < this.maxScrollX) {
                newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
            }
            if (newY > 0 || newY < this.maxScrollY) {
                newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
            }

            this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

            if (!this.moved) {
                this._execEvent('scrollStart');
            }

            this.moved = true;

            this._translate(newX, newY);

            /* REPLACE START: _move */
            if (timestamp - this.startTime > 300) {
                this.startTime = timestamp;
                this.startX = this.x;
                this.startY = this.y;

                if (this.options.probeType == 1) {
                    this._execEvent('scroll');
                }
            }

            if (this.options.probeType > 1) {
                this._execEvent('scroll');
            }
            /* REPLACE END: _move */

        },

        _end: function (e) {
            if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                return;
            }

            if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                e.preventDefault();
            }

            var point = e.changedTouches ? e.changedTouches[0] : e,
                momentumX,
                momentumY,
                duration = utils.getTime() - this.startTime,
                newX = Math.round(this.x),
                newY = Math.round(this.y),
                distanceX = Math.abs(newX - this.startX),
                distanceY = Math.abs(newY - this.startY),
                time = 0,
                easing = '';

            this.isInTransition = 0;
            this.initiated = 0;
            this.endTime = utils.getTime();

            // reset if we are outside of the boundaries
            if (this.resetPosition(this.options.bounceTime)) {
                return;
            }

            this.scrollTo(newX, newY);  // ensures that the last position is rounded

            // we scrolled less than 10 pixels
            if (!this.moved) {
                if (this.options.tap) {
                    utils.tap(e, this.options.tap);
                }

                if (this.options.click) {
                    utils.click(e);
                }

                this._execEvent('scrollCancel');
                return;
            }

            if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
                this._execEvent('flick');
                return;
            }

            // start momentum animation if needed
            if (this.options.momentum && duration < 300) {
                momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
                    destination: newX,
                    duration: 0
                };
                momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
                    destination: newY,
                    duration: 0
                };
                newX = momentumX.destination;
                newY = momentumY.destination;
                time = Math.max(momentumX.duration, momentumY.duration);
                this.isInTransition = 1;
            }


            if (this.options.snap) {
                var snap = this._nearestSnap(newX, newY);
                this.currentPage = snap;
                time = this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(newX - snap.x), 1000),
                        Math.min(Math.abs(newY - snap.y), 1000)
                    ), 300);
                newX = snap.x;
                newY = snap.y;

                this.directionX = 0;
                this.directionY = 0;
                easing = this.options.bounceEasing;
            }

// INSERT POINT: _end

            if (newX != this.x || newY != this.y) {
                // change easing function when scroller goes out of the boundaries
                if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                    easing = utils.ease.quadratic;
                }

                this.scrollTo(newX, newY, time, easing);
                return;
            }

            this._execEvent('scrollEnd');
        },

        _resize: function () {
            var that = this;

            clearTimeout(this.resizeTimeout);

            this.resizeTimeout = setTimeout(function () {
                that.refresh();
            }, this.options.resizePolling);
        },

        resetPosition: function (time) {
            var x = this.x,
                y = this.y;

            time = time || 0;

            if (!this.hasHorizontalScroll || this.x > 0) {
                x = 0;
            } else if (this.x < this.maxScrollX) {
                x = this.maxScrollX;
            }

            if (!this.hasVerticalScroll || this.y > 0) {
                y = 0;
            } else if (this.y < this.maxScrollY) {
                y = this.maxScrollY;
            }

            if (x == this.x && y == this.y) {
                return false;
            }

            this.scrollTo(x, y, time, this.options.bounceEasing);

            return true;
        },

        disable: function () {
            this.enabled = false;
        },

        enable: function () {
            this.enabled = true;
        },

        refresh: function () {
            var rf = this.wrapper.offsetHeight;     // Force reflow

            this.wrapperWidth = this.wrapper.clientWidth;
            this.wrapperHeight = this.wrapper.clientHeight;

            /* REPLACE START: refresh */

            this.scrollerWidth = this.scroller.offsetWidth;
            this.scrollerHeight = this.scroller.offsetHeight;

            this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
            this.maxScrollY = this.wrapperHeight - this.scrollerHeight;

            /* REPLACE END: refresh */

            this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
            this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;

            if (!this.hasHorizontalScroll) {
                this.maxScrollX = 0;
                this.scrollerWidth = this.wrapperWidth;
            }

            if (!this.hasVerticalScroll) {
                this.maxScrollY = 0;
                this.scrollerHeight = this.wrapperHeight;
            }

            this.endTime = 0;
            this.directionX = 0;
            this.directionY = 0;

            this.wrapperOffset = utils.offset(this.wrapper);

            this._execEvent('refresh');

            this.resetPosition();

// INSERT POINT: _refresh

        },

        on: function (type, fn) {
            if (!this._events[type]) {
                this._events[type] = [];
            }

            this._events[type].push(fn);
        },

        off: function (type, fn) {
            if (!this._events[type]) {
                return;
            }

            var index = this._events[type].indexOf(fn);

            if (index > -1) {
                this._events[type].splice(index, 1);
            }
        },

        _execEvent: function (type) {
            if (!this._events[type]) {
                return;
            }

            var i = 0,
                l = this._events[type].length;

            if (!l) {
                return;
            }

            for (; i < l; i++) {
                this._events[type][i].apply(this, [].slice.call(arguments, 1));
            }
        },

        scrollBy: function (x, y, time, easing) {
            x = this.x + x;
            y = this.y + y;
            time = time || 0;

            this.scrollTo(x, y, time, easing);
        },

        scrollTo: function (x, y, time, easing) {
            easing = easing || utils.ease.circular;

            this.isInTransition = this.options.useTransition && time > 0;

            if (!time || (this.options.useTransition && easing.style)) {
                this._transitionTimingFunction(easing.style);
                this._transitionTime(time);
                this._translate(x, y);
            } else {
                this._animate(x, y, time, easing.fn);
            }
        },

        scrollToElement: function (el, time, offsetX, offsetY, easing) {
            el = el.nodeType ? el : this.scroller.querySelector(el);

            if (!el) {
                return;
            }

            var pos = utils.offset(el);

            pos.left -= this.wrapperOffset.left;
            pos.top -= this.wrapperOffset.top;

            // if offsetX/Y are true we center the element to the screen
            if (offsetX === true) {
                offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
            }
            if (offsetY === true) {
                offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
            }

            pos.left -= offsetX || 0;
            pos.top -= offsetY || 0;

            pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
            pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;

            time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;

            this.scrollTo(pos.left, pos.top, time, easing);
        },

        _transitionTime: function (time) {
            time = time || 0;

            this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

            if (!time && utils.isBadAndroid) {
                this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
            }


            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].transitionTime(time);
                }
            }


// INSERT POINT: _transitionTime

        },

        _transitionTimingFunction: function (easing) {
            this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].transitionTimingFunction(easing);
                }
            }


// INSERT POINT: _transitionTimingFunction

        },

        _translate: function (x, y) {
            if (this.options.useTransform) {

                /* REPLACE START: _translate */

                this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

                /* REPLACE END: _translate */

            } else {
                x = Math.round(x);
                y = Math.round(y);
                this.scrollerStyle.left = x + 'px';
                this.scrollerStyle.top = y + 'px';
            }

            this.x = x;
            this.y = y;


            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].updatePosition();
                }
            }


// INSERT POINT: _translate

        },

        _initEvents: function (remove) {
            var eventType = remove ? utils.removeEvent : utils.addEvent,
                target = this.options.bindToWrapper ? this.wrapper : window;

            eventType(window, 'orientationchange', this);
            eventType(window, 'resize', this);

            if (this.options.click) {
                eventType(this.wrapper, 'click', this, true);
            }

            if (!this.options.disableMouse) {
                eventType(this.wrapper, 'mousedown', this);
                eventType(target, 'mousemove', this);
                eventType(target, 'mousecancel', this);
                eventType(target, 'mouseup', this);
            }

            if (utils.hasPointer && !this.options.disablePointer) {
                eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
                eventType(target, utils.prefixPointerEvent('pointermove'), this);
                eventType(target, utils.prefixPointerEvent('pointercancel'), this);
                eventType(target, utils.prefixPointerEvent('pointerup'), this);
            }

            if (utils.hasTouch && !this.options.disableTouch) {
                eventType(this.wrapper, 'touchstart', this);
                eventType(target, 'touchmove', this);
                eventType(target, 'touchcancel', this);
                eventType(target, 'touchend', this);
            }

            eventType(this.scroller, 'transitionend', this);
            eventType(this.scroller, 'webkitTransitionEnd', this);
            eventType(this.scroller, 'oTransitionEnd', this);
            eventType(this.scroller, 'MSTransitionEnd', this);
        },

        getComputedPosition: function () {
            var matrix = window.getComputedStyle(this.scroller, null),
                x, y;

            if (this.options.useTransform) {
                matrix = matrix[utils.style.transform].split(')')[0].split(', ');
                x = +(matrix[12] || matrix[4]);
                y = +(matrix[13] || matrix[5]);
            } else {
                x = +matrix.left.replace(/[^-\d.]/g, '');
                y = +matrix.top.replace(/[^-\d.]/g, '');
            }

            return {x: x, y: y};
        },

        _initIndicators: function () {
            var interactive = this.options.interactiveScrollbars,
                customStyle = typeof this.options.scrollbars != 'string',
                indicators = [],
                indicator;

            var that = this;

            this.indicators = [];

            if (this.options.scrollbars) {
                // Vertical scrollbar
                if (this.options.scrollY) {
                    indicator = {
                        el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
                        interactive: interactive,
                        defaultScrollbars: true,
                        customStyle: customStyle,
                        resize: this.options.resizeScrollbars,
                        shrink: this.options.shrinkScrollbars,
                        fade: this.options.fadeScrollbars,
                        listenX: false
                    };

                    this.wrapper.appendChild(indicator.el);
                    indicators.push(indicator);
                }

                // Horizontal scrollbar
                if (this.options.scrollX) {
                    indicator = {
                        el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
                        interactive: interactive,
                        defaultScrollbars: true,
                        customStyle: customStyle,
                        resize: this.options.resizeScrollbars,
                        shrink: this.options.shrinkScrollbars,
                        fade: this.options.fadeScrollbars,
                        listenY: false
                    };

                    this.wrapper.appendChild(indicator.el);
                    indicators.push(indicator);
                }
            }

            if (this.options.indicators) {
                // TODO: check concat compatibility
                indicators = indicators.concat(this.options.indicators);
            }

            for (var i = indicators.length; i--;) {
                this.indicators.push(new Indicator(this, indicators[i]));
            }

            // TODO: check if we can use array.map (wide compatibility and performance issues)
            function _indicatorsMap(fn) {
                for (var i = that.indicators.length; i--;) {
                    fn.call(that.indicators[i]);
                }
            }

            if (this.options.fadeScrollbars) {
                this.on('scrollEnd', function () {
                    _indicatorsMap(function () {
                        this.fade();
                    });
                });

                this.on('scrollCancel', function () {
                    _indicatorsMap(function () {
                        this.fade();
                    });
                });

                this.on('scrollStart', function () {
                    _indicatorsMap(function () {
                        this.fade(1);
                    });
                });

                this.on('beforeScrollStart', function () {
                    _indicatorsMap(function () {
                        this.fade(1, true);
                    });
                });
            }


            this.on('refresh', function () {
                _indicatorsMap(function () {
                    this.refresh();
                });
            });

            this.on('destroy', function () {
                _indicatorsMap(function () {
                    this.destroy();
                });

                delete this.indicators;
            });
        },

        _initWheel: function () {
            utils.addEvent(this.wrapper, 'wheel', this);
            utils.addEvent(this.wrapper, 'mousewheel', this);
            utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

            this.on('destroy', function () {
                utils.removeEvent(this.wrapper, 'wheel', this);
                utils.removeEvent(this.wrapper, 'mousewheel', this);
                utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
            });
        },

        _wheel: function (e) {
            if (!this.enabled) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            var wheelDeltaX, wheelDeltaY,
                newX, newY,
                that = this;

            if (this.wheelTimeout === undefined) {
                that._execEvent('scrollStart');
            }

            // Execute the scrollEnd event after 400ms the wheel stopped scrolling
            clearTimeout(this.wheelTimeout);
            this.wheelTimeout = setTimeout(function () {
                that._execEvent('scrollEnd');
                that.wheelTimeout = undefined;
            }, 400);

            if ('deltaX' in e) {
                if (e.deltaMode === 1) {
                    wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
                    wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
                } else {
                    wheelDeltaX = -e.deltaX;
                    wheelDeltaY = -e.deltaY;
                }
            } else if ('wheelDeltaX' in e) {
                wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
                wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
            } else if ('wheelDelta' in e) {
                wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
            } else if ('detail' in e) {
                wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
            } else {
                return;
            }

            wheelDeltaX *= this.options.invertWheelDirection;
            wheelDeltaY *= this.options.invertWheelDirection;

            if (!this.hasVerticalScroll) {
                wheelDeltaX = wheelDeltaY;
                wheelDeltaY = 0;
            }

            if (this.options.snap) {
                newX = this.currentPage.pageX;
                newY = this.currentPage.pageY;

                if (wheelDeltaX > 0) {
                    newX--;
                } else if (wheelDeltaX < 0) {
                    newX++;
                }

                if (wheelDeltaY > 0) {
                    newY--;
                } else if (wheelDeltaY < 0) {
                    newY++;
                }

                this.goToPage(newX, newY);

                return;
            }

            newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
            newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

            if (newX > 0) {
                newX = 0;
            } else if (newX < this.maxScrollX) {
                newX = this.maxScrollX;
            }

            if (newY > 0) {
                newY = 0;
            } else if (newY < this.maxScrollY) {
                newY = this.maxScrollY;
            }

            this.scrollTo(newX, newY, 0);

            if (this.options.probeType > 1) {
                this._execEvent('scroll');
            }

// INSERT POINT: _wheel
        },

        _initSnap: function () {
            this.currentPage = {};

            if (typeof this.options.snap == 'string') {
                this.options.snap = this.scroller.querySelectorAll(this.options.snap);
            }

            this.on('refresh', function () {
                var i = 0, l,
                    m = 0, n,
                    cx, cy,
                    x = 0, y,
                    stepX = this.options.snapStepX || this.wrapperWidth,
                    stepY = this.options.snapStepY || this.wrapperHeight,
                    el;

                this.pages = [];

                if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
                    return;
                }

                if (this.options.snap === true) {
                    cx = Math.round(stepX / 2);
                    cy = Math.round(stepY / 2);

                    while (x > -this.scrollerWidth) {
                        this.pages[i] = [];
                        l = 0;
                        y = 0;

                        while (y > -this.scrollerHeight) {
                            this.pages[i][l] = {
                                x: Math.max(x, this.maxScrollX),
                                y: Math.max(y, this.maxScrollY),
                                width: stepX,
                                height: stepY,
                                cx: x - cx,
                                cy: y - cy
                            };

                            y -= stepY;
                            l++;
                        }

                        x -= stepX;
                        i++;
                    }
                } else {
                    el = this.options.snap;
                    l = el.length;
                    n = -1;

                    for (; i < l; i++) {
                        if (i === 0 || el[i].offsetLeft <= el[i - 1].offsetLeft) {
                            m = 0;
                            n++;
                        }

                        if (!this.pages[m]) {
                            this.pages[m] = [];
                        }

                        x = Math.max(-el[i].offsetLeft, this.maxScrollX);
                        y = Math.max(-el[i].offsetTop, this.maxScrollY);
                        cx = x - Math.round(el[i].offsetWidth / 2);
                        cy = y - Math.round(el[i].offsetHeight / 2);

                        this.pages[m][n] = {
                            x: x,
                            y: y,
                            width: el[i].offsetWidth,
                            height: el[i].offsetHeight,
                            cx: cx,
                            cy: cy
                        };

                        if (x > this.maxScrollX) {
                            m++;
                        }
                    }
                }

                this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

                // Update snap threshold if needed
                if (this.options.snapThreshold % 1 === 0) {
                    this.snapThresholdX = this.options.snapThreshold;
                    this.snapThresholdY = this.options.snapThreshold;
                } else {
                    this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
                    this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
                }
            });

            this.on('flick', function () {
                var time = this.options.snapSpeed || Math.max(
                        Math.max(
                            Math.min(Math.abs(this.x - this.startX), 1000),
                            Math.min(Math.abs(this.y - this.startY), 1000)
                        ), 300);

                this.goToPage(
                    this.currentPage.pageX + this.directionX,
                    this.currentPage.pageY + this.directionY,
                    time
                );
            });
        },

        _nearestSnap: function (x, y) {
            if (!this.pages.length) {
                return {x: 0, y: 0, pageX: 0, pageY: 0};
            }

            var i = 0,
                l = this.pages.length,
                m = 0;

            // Check if we exceeded the snap threshold
            if (Math.abs(x - this.absStartX) < this.snapThresholdX &&
                Math.abs(y - this.absStartY) < this.snapThresholdY) {
                return this.currentPage;
            }

            if (x > 0) {
                x = 0;
            } else if (x < this.maxScrollX) {
                x = this.maxScrollX;
            }

            if (y > 0) {
                y = 0;
            } else if (y < this.maxScrollY) {
                y = this.maxScrollY;
            }

            for (; i < l; i++) {
                if (x >= this.pages[i][0].cx) {
                    x = this.pages[i][0].x;
                    break;
                }
            }

            l = this.pages[i].length;

            for (; m < l; m++) {
                if (y >= this.pages[0][m].cy) {
                    y = this.pages[0][m].y;
                    break;
                }
            }

            if (i == this.currentPage.pageX) {
                i += this.directionX;

                if (i < 0) {
                    i = 0;
                } else if (i >= this.pages.length) {
                    i = this.pages.length - 1;
                }

                x = this.pages[i][0].x;
            }

            if (m == this.currentPage.pageY) {
                m += this.directionY;

                if (m < 0) {
                    m = 0;
                } else if (m >= this.pages[0].length) {
                    m = this.pages[0].length - 1;
                }

                y = this.pages[0][m].y;
            }

            return {
                x: x,
                y: y,
                pageX: i,
                pageY: m
            };
        },

        goToPage: function (x, y, time, easing) {
            easing = easing || this.options.bounceEasing;

            if (x >= this.pages.length) {
                x = this.pages.length - 1;
            } else if (x < 0) {
                x = 0;
            }

            if (y >= this.pages[x].length) {
                y = this.pages[x].length - 1;
            } else if (y < 0) {
                y = 0;
            }

            var posX = this.pages[x][y].x,
                posY = this.pages[x][y].y;

            time = time === undefined ? this.options.snapSpeed || Math.max(
                Math.max(
                    Math.min(Math.abs(posX - this.x), 1000),
                    Math.min(Math.abs(posY - this.y), 1000)
                ), 300) : time;

            this.currentPage = {
                x: posX,
                y: posY,
                pageX: x,
                pageY: y
            };

            this.scrollTo(posX, posY, time, easing);
        },

        next: function (time, easing) {
            var x = this.currentPage.pageX,
                y = this.currentPage.pageY;

            x++;

            if (x >= this.pages.length && this.hasVerticalScroll) {
                x = 0;
                y++;
            }

            this.goToPage(x, y, time, easing);
        },

        prev: function (time, easing) {
            var x = this.currentPage.pageX,
                y = this.currentPage.pageY;

            x--;

            if (x < 0 && this.hasVerticalScroll) {
                x = 0;
                y--;
            }

            this.goToPage(x, y, time, easing);
        },

        _initKeys: function (e) {
            // default key bindings
            var keys = {
                pageUp: 33,
                pageDown: 34,
                end: 35,
                home: 36,
                left: 37,
                up: 38,
                right: 39,
                down: 40
            };
            var i;

            // if you give me characters I give you keycode
            if (typeof this.options.keyBindings == 'object') {
                for (i in this.options.keyBindings) {
                    if (typeof this.options.keyBindings[i] == 'string') {
                        this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
                    }
                }
            } else {
                this.options.keyBindings = {};
            }

            for (i in keys) {
                this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
            }

            utils.addEvent(window, 'keydown', this);

            this.on('destroy', function () {
                utils.removeEvent(window, 'keydown', this);
            });
        },

        _key: function (e) {
            if (!this.enabled) {
                return;
            }

            var snap = this.options.snap,   // we are using this alot, better to cache it
                newX = snap ? this.currentPage.pageX : this.x,
                newY = snap ? this.currentPage.pageY : this.y,
                now = utils.getTime(),
                prevTime = this.keyTime || 0,
                acceleration = 0.250,
                pos;

            if (this.options.useTransition && this.isInTransition) {
                pos = this.getComputedPosition();

                this._translate(Math.round(pos.x), Math.round(pos.y));
                this.isInTransition = false;
            }

            this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

            switch (e.keyCode) {
                case this.options.keyBindings.pageUp:
                    if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                        newX += snap ? 1 : this.wrapperWidth;
                    } else {
                        newY += snap ? 1 : this.wrapperHeight;
                    }
                    break;
                case this.options.keyBindings.pageDown:
                    if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                        newX -= snap ? 1 : this.wrapperWidth;
                    } else {
                        newY -= snap ? 1 : this.wrapperHeight;
                    }
                    break;
                case this.options.keyBindings.end:
                    newX = snap ? this.pages.length - 1 : this.maxScrollX;
                    newY = snap ? this.pages[0].length - 1 : this.maxScrollY;
                    break;
                case this.options.keyBindings.home:
                    newX = 0;
                    newY = 0;
                    break;
                case this.options.keyBindings.left:
                    newX += snap ? -1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.up:
                    newY += snap ? 1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.right:
                    newX -= snap ? -1 : 5 + this.keyAcceleration >> 0;
                    break;
                case this.options.keyBindings.down:
                    newY -= snap ? 1 : 5 + this.keyAcceleration >> 0;
                    break;
                default:
                    return;
            }

            if (snap) {
                this.goToPage(newX, newY);
                return;
            }

            if (newX > 0) {
                newX = 0;
                this.keyAcceleration = 0;
            } else if (newX < this.maxScrollX) {
                newX = this.maxScrollX;
                this.keyAcceleration = 0;
            }

            if (newY > 0) {
                newY = 0;
                this.keyAcceleration = 0;
            } else if (newY < this.maxScrollY) {
                newY = this.maxScrollY;
                this.keyAcceleration = 0;
            }

            this.scrollTo(newX, newY, 0);

            this.keyTime = now;
        },

        _animate: function (destX, destY, duration, easingFn) {
            var that = this,
                startX = this.x,
                startY = this.y,
                startTime = utils.getTime(),
                destTime = startTime + duration;

            function step() {
                var now = utils.getTime(),
                    newX, newY,
                    easing;

                if (now >= destTime) {
                    that.isAnimating = false;
                    that._translate(destX, destY);

                    if (!that.resetPosition(that.options.bounceTime)) {
                        that._execEvent('scrollEnd');
                    }

                    return;
                }

                now = ( now - startTime ) / duration;
                easing = easingFn(now);
                newX = ( destX - startX ) * easing + startX;
                newY = ( destY - startY ) * easing + startY;
                that._translate(newX, newY);

                if (that.isAnimating) {
                    rAF(step);
                }

                if (that.options.probeType == 3) {
                    that._execEvent('scroll');
                }
            }

            this.isAnimating = true;
            step();
        },

        handleEvent: function (e) {
            switch (e.type) {
                case 'touchstart':
                case 'pointerdown':
                case 'MSPointerDown':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'pointermove':
                case 'MSPointerMove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'pointerup':
                case 'MSPointerUp':
                case 'mouseup':
                case 'touchcancel':
                case 'pointercancel':
                case 'MSPointerCancel':
                case 'mousecancel':
                    this._end(e);
                    break;
                case 'orientationchange':
                case 'resize':
                    this._resize();
                    break;
                case 'transitionend':
                case 'webkitTransitionEnd':
                case 'oTransitionEnd':
                case 'MSTransitionEnd':
                    this._transitionEnd(e);
                    break;
                case 'wheel':
                case 'DOMMouseScroll':
                case 'mousewheel':
                    this._wheel(e);
                    break;
                case 'keydown':
                    this._key(e);
                    break;
                case 'click':
                    if (!e._constructed) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    break;
            }
        }
    };
    function createDefaultScrollbar(direction, interactive, type) {
        var scrollbar = document.createElement('div'),
            indicator = document.createElement('div');

        if (type === true) {
            scrollbar.style.cssText = 'position:absolute;z-index:9999';
            indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
        }

        indicator.className = 'iScrollIndicator';

        if (direction == 'h') {
            if (type === true) {
                scrollbar.style.cssText += ';height:7px;left:2px;right:2px;bottom:0';
                indicator.style.height = '100%';
            }
            scrollbar.className = 'iScrollHorizontalScrollbar';
        } else {
            if (type === true) {
                scrollbar.style.cssText += ';width:7px;bottom:2px;top:2px;right:1px';
                indicator.style.width = '100%';
            }
            scrollbar.className = 'iScrollVerticalScrollbar';
        }

        scrollbar.style.cssText += ';overflow:hidden';

        if (!interactive) {
            scrollbar.style.pointerEvents = 'none';
        }

        scrollbar.appendChild(indicator);

        return scrollbar;
    }

    function Indicator(scroller, options) {
        this.wrapper = typeof options.el == 'string' ? document.querySelector(options.el) : options.el;
        this.wrapperStyle = this.wrapper.style;
        this.indicator = this.wrapper.children[0];
        this.indicatorStyle = this.indicator.style;
        this.scroller = scroller;

        this.options = {
            listenX: true,
            listenY: true,
            interactive: false,
            resize: true,
            defaultScrollbars: false,
            shrink: false,
            fade: false,
            speedRatioX: 0,
            speedRatioY: 0
        };

        for (var i in options) {
            this.options[i] = options[i];
        }

        this.sizeRatioX = 1;
        this.sizeRatioY = 1;
        this.maxPosX = 0;
        this.maxPosY = 0;

        if (this.options.interactive) {
            if (!this.options.disableTouch) {
                utils.addEvent(this.indicator, 'touchstart', this);
                utils.addEvent(window, 'touchend', this);
            }
            if (!this.options.disablePointer) {
                utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
            }
            if (!this.options.disableMouse) {
                utils.addEvent(this.indicator, 'mousedown', this);
                utils.addEvent(window, 'mouseup', this);
            }
        }

        if (this.options.fade) {
            this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
            this.wrapperStyle[utils.style.transitionDuration] = utils.isBadAndroid ? '0.001s' : '0ms';
            this.wrapperStyle.opacity = '0';
        }
    }

    Indicator.prototype = {
        handleEvent: function (e) {
            switch (e.type) {
                case 'touchstart':
                case 'pointerdown':
                case 'MSPointerDown':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'pointermove':
                case 'MSPointerMove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'pointerup':
                case 'MSPointerUp':
                case 'mouseup':
                case 'touchcancel':
                case 'pointercancel':
                case 'MSPointerCancel':
                case 'mousecancel':
                    this._end(e);
                    break;
            }
        },

        destroy: function () {
            if (this.options.interactive) {
                utils.removeEvent(this.indicator, 'touchstart', this);
                utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                utils.removeEvent(this.indicator, 'mousedown', this);

                utils.removeEvent(window, 'touchmove', this);
                utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
                utils.removeEvent(window, 'mousemove', this);

                utils.removeEvent(window, 'touchend', this);
                utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
                utils.removeEvent(window, 'mouseup', this);
            }

            if (this.options.defaultScrollbars) {
                this.wrapper.parentNode.removeChild(this.wrapper);
            }
        },

        _start: function (e) {
            var point = e.touches ? e.touches[0] : e;

            e.preventDefault();
            e.stopPropagation();

            this.transitionTime();

            this.initiated = true;
            this.moved = false;
            this.lastPointX = point.pageX;
            this.lastPointY = point.pageY;

            this.startTime = utils.getTime();

            if (!this.options.disableTouch) {
                utils.addEvent(window, 'touchmove', this);
            }
            if (!this.options.disablePointer) {
                utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
            }
            if (!this.options.disableMouse) {
                utils.addEvent(window, 'mousemove', this);
            }

            this.scroller._execEvent('beforeScrollStart');
        },

        _move: function (e) {
            var point = e.touches ? e.touches[0] : e,
                deltaX, deltaY,
                newX, newY,
                timestamp = utils.getTime();

            if (!this.moved) {
                this.scroller._execEvent('scrollStart');
            }

            this.moved = true;

            deltaX = point.pageX - this.lastPointX;
            this.lastPointX = point.pageX;

            deltaY = point.pageY - this.lastPointY;
            this.lastPointY = point.pageY;

            newX = this.x + deltaX;
            newY = this.y + deltaY;

            this._pos(newX, newY);


            if (this.scroller.options.probeType == 1 && timestamp - this.startTime > 300) {
                this.startTime = timestamp;
                this.scroller._execEvent('scroll');
            } else if (this.scroller.options.probeType > 1) {
                this.scroller._execEvent('scroll');
            }


// INSERT POINT: indicator._move

            e.preventDefault();
            e.stopPropagation();
        },

        _end: function (e) {
            if (!this.initiated) {
                return;
            }

            this.initiated = false;

            e.preventDefault();
            e.stopPropagation();

            utils.removeEvent(window, 'touchmove', this);
            utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
            utils.removeEvent(window, 'mousemove', this);

            if (this.scroller.options.snap) {
                var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

                var time = this.options.snapSpeed || Math.max(
                        Math.max(
                            Math.min(Math.abs(this.scroller.x - snap.x), 1000),
                            Math.min(Math.abs(this.scroller.y - snap.y), 1000)
                        ), 300);

                if (this.scroller.x != snap.x || this.scroller.y != snap.y) {
                    this.scroller.directionX = 0;
                    this.scroller.directionY = 0;
                    this.scroller.currentPage = snap;
                    this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
                }
            }

            if (this.moved) {
                this.scroller._execEvent('scrollEnd');
            }
        },

        transitionTime: function (time) {
            time = time || 0;
            this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';

            if (!time && utils.isBadAndroid) {
                this.indicatorStyle[utils.style.transitionDuration] = '0.001s';
            }
        },

        transitionTimingFunction: function (easing) {
            this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
        },

        refresh: function () {
            this.transitionTime();

            if (this.options.listenX && !this.options.listenY) {
                this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
            } else if (this.options.listenY && !this.options.listenX) {
                this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
            } else {
                this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
            }

            if (this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll) {
                utils.addClass(this.wrapper, 'iScrollBothScrollbars');
                utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

                if (this.options.defaultScrollbars && this.options.customStyle) {
                    if (this.options.listenX) {
                        this.wrapper.style.right = '8px';
                    } else {
                        this.wrapper.style.bottom = '8px';
                    }
                }
            } else {
                utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
                utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

                if (this.options.defaultScrollbars && this.options.customStyle) {
                    if (this.options.listenX) {
                        this.wrapper.style.right = '2px';
                    } else {
                        this.wrapper.style.bottom = '2px';
                    }
                }
            }

            var r = this.wrapper.offsetHeight;  // force refresh

            if (this.options.listenX) {
                this.wrapperWidth = this.wrapper.clientWidth;
                if (this.options.resize) {
                    this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
                    this.indicatorStyle.width = this.indicatorWidth + 'px';
                } else {
                    this.indicatorWidth = this.indicator.clientWidth;
                }

                this.maxPosX = this.wrapperWidth - this.indicatorWidth;

                if (this.options.shrink == 'clip') {
                    this.minBoundaryX = -this.indicatorWidth + 8;
                    this.maxBoundaryX = this.wrapperWidth - 8;
                } else {
                    this.minBoundaryX = 0;
                    this.maxBoundaryX = this.maxPosX;
                }

                this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));
            }

            if (this.options.listenY) {
                this.wrapperHeight = this.wrapper.clientHeight;
                if (this.options.resize) {
                    this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
                    this.indicatorStyle.height = this.indicatorHeight + 'px';
                } else {
                    this.indicatorHeight = this.indicator.clientHeight;
                }

                this.maxPosY = this.wrapperHeight - this.indicatorHeight;

                if (this.options.shrink == 'clip') {
                    this.minBoundaryY = -this.indicatorHeight + 8;
                    this.maxBoundaryY = this.wrapperHeight - 8;
                } else {
                    this.minBoundaryY = 0;
                    this.maxBoundaryY = this.maxPosY;
                }

                this.maxPosY = this.wrapperHeight - this.indicatorHeight;
                this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
            }

            this.updatePosition();
        },

        updatePosition: function () {
            var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
                y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

            if (!this.options.ignoreBoundaries) {
                if (x < this.minBoundaryX) {
                    if (this.options.shrink == 'scale') {
                        this.width = Math.max(this.indicatorWidth + x, 8);
                        this.indicatorStyle.width = this.width + 'px';
                    }
                    x = this.minBoundaryX;
                } else if (x > this.maxBoundaryX) {
                    if (this.options.shrink == 'scale') {
                        this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
                        this.indicatorStyle.width = this.width + 'px';
                        x = this.maxPosX + this.indicatorWidth - this.width;
                    } else {
                        x = this.maxBoundaryX;
                    }
                } else if (this.options.shrink == 'scale' && this.width != this.indicatorWidth) {
                    this.width = this.indicatorWidth;
                    this.indicatorStyle.width = this.width + 'px';
                }

                if (y < this.minBoundaryY) {
                    if (this.options.shrink == 'scale') {
                        this.height = Math.max(this.indicatorHeight + y * 3, 8);
                        this.indicatorStyle.height = this.height + 'px';
                    }
                    y = this.minBoundaryY;
                } else if (y > this.maxBoundaryY) {
                    if (this.options.shrink == 'scale') {
                        this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
                        this.indicatorStyle.height = this.height + 'px';
                        y = this.maxPosY + this.indicatorHeight - this.height;
                    } else {
                        y = this.maxBoundaryY;
                    }
                } else if (this.options.shrink == 'scale' && this.height != this.indicatorHeight) {
                    this.height = this.indicatorHeight;
                    this.indicatorStyle.height = this.height + 'px';
                }
            }

            this.x = x;
            this.y = y;

            if (this.scroller.options.useTransform) {
                this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
            } else {
                this.indicatorStyle.left = x + 'px';
                this.indicatorStyle.top = y + 'px';
            }
        },

        _pos: function (x, y) {
            if (x < 0) {
                x = 0;
            } else if (x > this.maxPosX) {
                x = this.maxPosX;
            }

            if (y < 0) {
                y = 0;
            } else if (y > this.maxPosY) {
                y = this.maxPosY;
            }

            x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
            y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

            this.scroller.scrollTo(x, y);
        },

        fade: function (val, hold) {
            if (hold && !this.visible) {
                return;
            }

            clearTimeout(this.fadeTimeout);
            this.fadeTimeout = null;

            var time = val ? 250 : 500,
                delay = val ? 0 : 300;

            val = val ? '1' : '0';

            this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

            this.fadeTimeout = setTimeout((function (val) {
                this.wrapperStyle.opacity = val;
                this.visible = +val;
            }).bind(this, val), delay);
        }
    };

    IScroll.utils = utils;

    if (typeof module != 'undefined' && module.exports) {
        module.exports = IScroll;
    }

    window.IScroll = IScroll;

})(window, document, Math);

/********************************* NScroll *****************************/
(function () {

    var _ = QApp.util,
        iScroll = _.iScroll = window.IScroll;

    var SCROLL_OPT = {
        scrollX: false,
        scrollY: true,
        freeScroll: false,
        mouseWheel: false,
        probeType: 3,
        preventDefault: false
    };

    var TOPOFFSET = {
        distance: 50,
        displayDelay: 1000,
        dragContent: 'drag to refresh',
        endContent: 'stop to refresh',
        loadContent: 'loading',
        successContent: 'success',
        failContent: 'failure'
    };

    var BOTTOMOFFSET = {
        distance: 50,
        displayDelay: 1000,
        loadContent: 'loading',
        endContent: 'end',
        failContent: ''
    };

    var DEFAULT_OPT = {
        builderNodes: true,
        template: '<div class="item"></div>',
        moreDis: 50,
        bindScrolls: {},
        scrollOpt: {},
        dataFilter: _.noop,
        changeFilter: _.noop,
        refresh: _.noop,
        topOffsetRefresh: false,
        bottomOffsetResfresh: false
    };

    function NScroll(el, opt) {
        var scroll = null,
            eventManager = (function () {
                var evt = function () {
                };
                _.extend(evt.prototype, _.CustEvent);
                return new evt();
            })(),
            cur = {
                column: 0,
                row: 0
            },
            options = _.extend({}, DEFAULT_OPT, opt),
            swap = el && el.children[0],
            itemList = [],
            topScroll = options.bindScrolls.x || null,
            leftScroll = options.bindScrolls.y || null,
            refreshX = false,
            refreshY = false,
            infiniteX = false,
            infiniteY = false,
            topContainer, bottomContainer,
            topRefreshStatus, bottomRefreshStatus,
            topEndFn, bottomEndFn,
            bottomMargin = 0,
            i, j, node;

        if (!swap) {
            throw 'Dom Structure Error!';
        }

        options.scrollOpt = _.extend({}, SCROLL_OPT, options.scrollOpt);

        // 计算属性。
        if (options.scrollOpt.scrollX && options.column) {
            infiniteX = true;
            options.column.num = options.column.num || parseInt(_.size(el).width / options.column.width) + 2;
            _.css(swap, 'width', Math.max(options.column.total * options.column.width, _.size(swap.parentNode).width + 1) + 'px');
        } else {
            options.column = {
                num: 1,
                total: 1,
                width: 1
            };
        }

        if (options.scrollOpt.scrollY && options.row) {
            infiniteY = true;
            options.row.num = options.row.num || parseInt(_.size(el).height / options.row.height) + 2;
            _.css(swap, 'height', Math.max(options.row.total * options.row.height, _.size(swap.parentNode).height + 1) + 'px');
        } else {
            options.row = {
                num: 1,
                total: 1,
                height: 1
            };
        }

        function computeTranslateStyle(column, row) {
            var pos = 'translate3d(' + column * options.column.width + 'px, ' + row * options.row.height + 'px, 0)';
            return {
                transform: pos,
                '-webkit-transform': pos
            };
        }

        function computeItems(scrollX, scrollY, directionX, directionY) {
            var curColumn = 0,
                lastColumn = options.column.num - 1,
                curRow = 0,
                lastRow = options.row.num - 1,
                changeX = false,
                changeY = false,
                args = [],
                area = null;

            if (scrollX > 0) {
                scrollX = 0;
            } else if (scrollX < scroll.maxScrollX) {
                scrollX = scroll.maxScrollX;
            }

            curColumn = parseInt(Math.abs(scrollX) / options.column.width);
            lastColumn = curColumn + options.column.num - 1;

            if (cur.column !== curColumn) {
                cur.column = curColumn;
                changeX = true;
            }

            if (scrollY > 0) {
                scrollY = 0;
            } else if (scrollY < scroll.maxScrollY + bottomMargin) {
                scrollY = scroll.maxScrollY + bottomMargin;
            }

            curRow = parseInt(Math.abs(scrollY) / options.row.height);
            lastRow = curRow + options.row.num - 1;

            if (cur.row !== curRow) {
                cur.row = curRow;
                changeY = true;
            }

            if (changeX || changeY) {

                area = getShowArea();

                itemList.forEach(function (item) {
                    var change = false,
                        toColumn = item.column,
                        toRow = item.row;
                    if (toColumn < curColumn && toColumn + options.column.num < options.column.total) {
                        do {
                            toColumn += options.column.num;
                        } while (toColumn < curColumn);
                        if (toColumn < options.column.total) {
                            change = true;
                        }
                    } else if (toColumn > lastColumn && toColumn - options.column.num > -1) {
                        change = true;
                        do {
                            toColumn -= options.column.num;
                        } while (toColumn > lastColumn);
                    }
                    if (toRow < curRow && toRow + options.row.num < options.row.total) {
                        do {
                            toRow += options.row.num;
                        } while (toRow < curRow);
                        if (toRow < options.row.total) {
                            change = true;
                        }
                    } else if (toRow > lastRow && toRow - options.row.num > -1) {
                        change = true;
                        do {
                            toRow -= options.row.num;
                        } while (toRow > lastRow);
                    }
                    if (change) {
                        args.push({
                            type: 'change',
                            el: item.node,
                            from: {
                                column: item.column,
                                row: item.row
                            },
                            to: {
                                column: toColumn,
                                row: toRow
                            }
                        });
                        options.dataFilter('remove', item.node, item.column, item.row, area);
                        item.column = toColumn;
                        item.row = toRow;
                        options.dataFilter('add', item.node, toColumn, toRow, area);
                    }
                });

                if (options.builderNodes) {
                    args.forEach(function (item) {
                        _.css(item.el, computeTranslateStyle(item.to.column, item.to.row));
                    });
                }

                options.changeFilter(args, area);
            }
        }

        function computeX(x) {
            var dis = Math.abs(x),
                num = parseInt(dis / options.column.width),
                nextX = -((dis % options.column.width > options.column.width / 2) ? num + 1 : num) * options.column.width;
            return {
                move: nextX !== x,
                x: nextX
            };
        }

        function computeY(y) {
            var dis = Math.abs(y),
                num = parseInt(dis / options.row.height),
                nextY = -((dis % options.row.height > options.row.height / 2) ? num + 1 : num) * options.row.height;
            return {
                move: nextY !== y,
                y: nextY
            };
        }


        function fixPosition() {
            var ret1 = computeX(scroll.x),
                ret2 = computeY(scroll.y);
            if (ret1.move || ret2.move) {
                if (topScroll) {
                    topScroll.scrollTo(ret1.x, 0, 300, IScroll.utils.ease.circular);
                }
                if (leftScroll) {
                    leftScroll.scrollTo(0, ret2.y, 300, IScroll.utils.ease.circular);
                }
                scroll.scrollTo(ret1.x, ret2.y, 300, IScroll.utils.ease.circular);
            }
        }

        function getShowArea() {
            return [cur.column, cur.row, cur.column + options.column.num - 1, cur.row + options.row.num - 1];
        }

        function inArea(column, row) {
            return (column >= cur.column && column < cur.column + options.column.num - 1 && row >= cur.row && row < cur.row + options.row.num - 1);
        }

        // 创建内部 Dom
        function buildInnerDom() {
            var args = [],
                area = getShowArea();

            if (options.builderNodes) {
                itemList.forEach(function (item) {
                    _.removeNode(item.node);
                });
            }
            itemList = [];

            for (i = 0; i < options.column.num; i++) {
                for (j = 0; j < options.row.num; j++) {
                    if (options.builderNodes) {
                        node = _.builder(options.template).children[0];
                        _.css(node, computeTranslateStyle(i, j));
                        swap.appendChild(node);
                    }
                    itemList.push({
                        column: i,
                        row: j,
                        node: node
                    });
                    options.dataFilter('add', node || null, i, j, area);
                    args.push({
                        type: 'create',
                        el: node || null,
                        from: {},
                        to: {
                            column: i,
                            row: j
                        }
                    });
                }
            }
            options.changeFilter(args, area);
            eventManager.trigger('ready');
        }

        function checkRefresh(scrollX, scrollY, directionX, directionY) {
            if (refreshX) {
                if (scrollX < options.moreDis && scrollX > scroll.maxScrollX - options.moreDis) {
                    refreshX = false;
                }
            } else {
                if (scrollX >= options.moreDis) {
                    refreshX = true;
                    eventManager.trigger('more', {
                        axis: 'x',
                        seq: 'prev'
                    });
                } else if (scrollX <= scroll.maxScrollX - options.moreDis) {
                    refreshX = true;
                    eventManager.trigger('more', {
                        axis: 'x',
                        seq: 'next'
                    });
                }
            }
            if (refreshY) {
                if (scrollY < options.moreDis && scrollY > scroll.maxScrollY - options.moreDis) {
                    refreshY = false;
                }
            } else {
                if (scrollY >= options.moreDis) {
                    refreshY = true;
                    eventManager.trigger('more', {
                        axis: 'y',
                        seq: 'prev'
                    });
                } else if (scrollY <= scroll.maxScrollY - options.moreDis) {
                    refreshY = true;
                    eventManager.trigger('more', {
                        axis: 'y',
                        seq: 'next'
                    });
                }
            }
        }

        scroll = new iScroll(el, options.scrollOpt);

        if (infiniteX || infiniteY) {
            scroll.on('scroll', function () {
                computeItems(scroll.x, scroll.y, scroll.directionX, scroll.directionY);
            });
            scroll.on('scrollEnd', function () {
                if (topScroll && scroll.x <= 0 && scroll.x >= scroll.maxScrollX) {
                    topScroll.scrollTo(scroll.x, 0);
                }
                if (leftScroll && scroll.y <= 0 && scroll.y >= scroll.maxScrollY) {
                    leftScroll.scrollTo(0, scroll.y);
                }
            });
            _.delay(buildInnerDom);
        }

        scroll.on('scroll', function () {
            checkRefresh(scroll.x, scroll.y, scroll.directionX, scroll.directionY);
        });

        scroll.on('scrollEnd', function () {
            if (topScroll && scroll.x <= 0 && scroll.x >= scroll.maxScrollX) {
                topScroll.scrollTo(scroll.x, 0);
            }
            if (leftScroll && scroll.y <= 0 && scroll.y >= scroll.maxScrollY) {
                leftScroll.scrollTo(0, scroll.y);
            }
        });

        if (topScroll) {
            scroll.on('scroll', function () {
                if (scroll.x <= 0 && scroll.x >= scroll.maxScrollX) {
                    topScroll.scrollTo(scroll.x, 0);
                }
            });
            topScroll.on('scroll', function () {
                if (topScroll.x <= 0 && topScroll.x >= topScroll.maxScrollX && topScroll.x >= scroll.maxScrollX) {
                    scroll.scrollTo(topScroll.x, scroll.y);
                    computeItems(topScroll.x, scroll.y, topScroll.directionX, 0);
                }
            });
        }

        if (leftScroll) {
            scroll.on('scroll', function () {
                if (scroll.y <= 0 && scroll.y >= scroll.maxScrollY) {
                    leftScroll.scrollTo(0, scroll.y);
                }
            });
            leftScroll.on('scroll', function () {
                if (leftScroll.y <= 0 && leftScroll.y >= leftScroll.maxScrollY && leftScroll.y >= scroll.maxScrollY) {
                    scroll.scrollTo(scroll.x, leftScroll.y);
                    computeItems(scroll.x, leftScroll.y, 0, leftScroll.directionY);
                }
            });
        }

        if (options.topOffsetRefresh) {
            if (options.topOffsetRefresh === true) {
                options.topOffsetRefresh = {};
            }
            _.extend(true, options.topOffsetRefresh, TOPOFFSET);

            topContainer = document.createElement('div');
            topRefreshStatus = 'drag';

            _.css(topContainer, {
                position: 'absolute',
                height: options.topOffsetRefresh.distance + 'px',
                width: '100%',
                top: (-options.topOffsetRefresh.distance) + 'px'
            });
            topContainer.innerHTML = options.topOffsetRefresh.dragContent;

            topEndFn = function () {
                if (topRefreshStatus === 'waitEnd') {
                    topRefreshStatus = 'startRefresh';
                    topContainer.innerHTML = options.topOffsetRefresh.loadContent;
                    _.css(swap, {
                        marginTop: options.topOffsetRefresh.distance + 'px'
                    });
                    scroll.scrollTo(scroll.x, scroll.y - options.topOffsetRefresh.distance, 0);
                    options.refresh('top');
                }
            }
            swap.addEventListener('touchend', topEndFn, false);

            scroll.on('scroll', function () {
                if (topRefreshStatus === 'drag' && scroll.y > options.topOffsetRefresh.distance) {
                    topRefreshStatus = 'waitEnd';
                    topContainer.innerHTML = options.topOffsetRefresh.endContent;
                }
                if (topRefreshStatus === 'waitEnd' && scroll.y <= options.topOffsetRefresh.distance) {
                    topRefreshStatus = 'drag';
                    topContainer.innerHTML = options.topOffsetRefresh.dragContent;
                }
            });

            _.delay(function () {
                _.insertElement(swap, topContainer, 'beforeend');
            }, 100);
        }

        if (options.bottomOffsetRefresh) {
            if (options.bottomOffsetRefresh === true) {
                options.bottomOffsetRefresh = {};
            }
            _.extend(true, options.bottomOffsetRefresh, BOTTOMOFFSET);

            bottomContainer = document.createElement('div');
            if (options.row.total * options.row.height < _.size(swap.parentNode).height + 1) {
                bottomRefreshStatus = 'none';
            } else {
                bottomRefreshStatus = 'drag';
            }

            _.css(bottomContainer, {
                position: 'absolute',
                height: options.bottomOffsetRefresh.distance + 'px',
                width: '100%',
                bottom: (-options.bottomOffsetRefresh.distance) + 'px'
            });
            bottomContainer.innerHTML = '';

            bottomEndFn = function () {
                if (bottomRefreshStatus === 'waitEnd') {
                    bottomRefreshStatus = 'startRefresh';
                    bottomMargin = options.bottomOffsetRefresh.distance;
                    bottomContainer.innerHTML = options.bottomOffsetRefresh.loadContent;
                    _.css(swap, {
                        height: (_.size(swap).height + bottomMargin) + 'px'
                    });
                    _.css(bottomContainer, {
                        bottom: 0
                    });
                    scroll.refresh();
                    options.refresh('bottom');
                }
            }

            swap.addEventListener('touchend', bottomEndFn, false);

            scroll.on('scroll', function () {
                if (bottomRefreshStatus === 'drag' && scroll.y < scroll.maxScrollY - options.bottomOffsetRefresh.distance) {
                    bottomRefreshStatus = 'waitEnd';
                }
                if (bottomRefreshStatus === 'waitEnd' && scroll.y >= scroll.maxScrollY - options.bottomOffsetRefresh.distance) {
                    bottomRefreshStatus = 'drag';
                }
            });

            _.delay(function () {
                _.insertElement(swap, bottomContainer, 'beforeend');
            }, 100);
        }
        eventManager.trigger('init');


        return _.extend(eventManager, {
            scroll: scroll,
            refresh: function () {
                scroll.refresh();
            },
            scrollTo: function () {
                scroll.scrollTo.apply(scroll, _.makeArray(arguments));
            },
            gotoTop: function (ret, duration) {
                duration = parseInt(duration) || 300;
                if (ret && options.topOffsetRefresh && topRefreshStatus !== 'startRefresh') {
                    topRefreshStatus = 'startRefresh';
                    topContainer.innerHTML = options.topOffsetRefresh.loadContent;
                    _.css(swap, {
                        marginTop: options.topOffsetRefresh.distance + 'px'
                    });
                    _.delay(function () {
                        options.refresh('top');
                    }, duration);
                }
                scroll.scrollTo(scroll.x, 0, duration);
            },
            setTopRefresh: function (ret) {
                if (options.topOffsetRefresh) {
                    topContainer.innerHTML = options.topOffsetRefresh[ret ? 'successContent' : 'failContent'];
                    _.delay(function () {
                        _.animate(swap, {
                            marginTop: '0'
                        }, 50, 'ease-out');
                        _.delay(function () {
                            topRefreshStatus = 'drag';
                            topContainer.innerHTML = options.topOffsetRefresh.dragContent;
                        }, 80);
                    }, options.topOffsetRefresh.displayDelay);
                    if (options.bottomOffsetRefresh && ret) {
                        if (options.row.total * options.row.height < _.size(swap.parentNode).height + 1) {
                            bottomRefreshStatus = 'none';
                        } else {
                            bottomRefreshStatus = 'drag';
                        }
                        bottomContainer.innerHTML = '';
                    }
                }
            },
            setBottomRefresh: function (ret, isEnd) {
                if (options.bottomOffsetRefresh) {
                    var html = ret ? '' : options.bottomOffsetRefresh.failContent;
                    bottomRefreshStatus = 'drag';
                    if (isEnd) {
                        bottomRefreshStatus = 'end';
                        html = options.bottomOffsetRefresh.endContent;
                    }
                    bottomContainer.innerHTML = html;
                    if (isEnd || (!ret && options.bottomOffsetRefresh.failContent)) {
                        _.delay(function () {
                            scroll.scrollTo(scroll.x, scroll.y + bottomMargin, options.bottomOffsetRefresh.displayDelay / 2);
                        }, options.bottomOffsetRefresh.displayDelay / 2);
                        _.delay(function () {
                            _.css(swap, {
                                height: (_.size(swap).height - bottomMargin) + 'px'
                            });
                            _.css(bottomContainer, {
                                bottom: -bottomMargin + 'px'
                            });
                            bottomMargin = 0;
                            scroll.refresh();
                        }, options.bottomOffsetRefresh.displayDelay);
                    } else if (!ret) {
                        _.css(swap, {
                            height: (_.size(swap).height - bottomMargin) + 'px'
                        });
                        _.css(bottomContainer, {
                            bottom: -bottomMargin + 'px'
                        });
                        bottomMargin = 0;
                        scroll.refresh();
                    } else {
                        _.css(swap, {
                            height: (_.size(swap).height - bottomMargin) + 'px'
                        });
                        _.css(bottomContainer, {
                            bottom: -bottomMargin + 'px'
                        });
                        bottomMargin = 0;
                        scroll.refresh();
                        _.delay(function () {
                            scroll.scrollTo(scroll.x, scroll.y - options.bottomOffsetRefresh.distance * 2, 500);
                        });
                    }
                }
            },
            fixPosition: function () {
                _.delay(fixPosition);
            },
            appendNode: function (node, column, row) {
                if (node && swap) {
                    _.css(node, computeTranslateStyle(column, row));
                    if (!_.contains(swap, node)) {
                        swap.appendChild(node);
                    }
                }
            },
            getShowArea: getShowArea,
            checkShow: function (pointArr) {
                return pointArr.some(function (item) {
                    return inArea(item[0], item[1]);
                });
            },
            resetNum: function (column, row) {
                options.column.num = column;
                options.row.num = row;
                buildInnerDom();
            },
            resetTotal: function (column, row, directionX, directionY) {
                options.column.total = column;
                options.row.total = row;
                if (options.scrollOpt.scrollX) {
                    _.css(swap, 'width', Math.max(options.column.total * options.column.width, _.size(swap.parentNode).width + 1) + 'px');
                }
                if (options.scrollOpt.scrollY) {
                    _.css(swap, 'height', Math.max(options.row.total * options.row.height, _.size(swap.parentNode).height + 1) + 'px');
                }
                if (options.bottomOffsetRefresh) {
                    if (options.row.total * options.row.height < _.size(swap.parentNode).height + 1) {
                        bottomRefreshStatus = 'none';
                    } else {
                        bottomRefreshStatus = 'drag';
                    }
                    bottomContainer.innerHTML = '';
                }
                _.delay(function () {
                    scroll.refresh();
                    computeItems(scroll.x, scroll.y, directionX || 0, directionY || 0);
                });
            },
            destroy: function () {
                eventManager.off();
                scroll.destroy();
                scroll = null;
                if (options.topOffsetRefresh) {
                    _.removeEvent(swap, topEndFn);
                }
                if (options.bottomOffsetRefresh) {
                    _.removeEvent(swap, bottomEndFn);
                }
                options = null;
                swap = null;
                if (leftScroll) {
                    leftScroll.destroy();
                }
                leftScroll = null;
                if (topScroll) {
                    topScroll.destroy();
                }
                topScroll = null;
                itemList.forEach(function (item) {
                    if (item.node) {
                        _.removeNode(item.node);
                        item.node = null;
                    }
                });
                itemList.length = 0;
                itemList = null;
            }
        });
    }

    NScroll.iScroll = iScroll;

    NScroll.setTopRefreshOpt = function (newOpt) {
        _.extend(true, TOPOFFSET, newOpt);
    };

    NScroll.setBottomRefreshOpt = function (newOpt) {
        _.extend(true, BOTTOMOFFSET, newOpt);
    };

    window.NScroll = QApp.util.nScroll = NScroll;
})();

/********************************* avalon.iscroll *****************************/
(function () {
    var avalon = window.avalon || QApp.avalon,
        NScroll = QApp.util.nScroll;

    var DEFAULT_OPT = { // 默认配置
            showLines: 10, // 显示的数量
            lineHeight: 0, // 每行的高度
            getData: function(){}
        },
    // 需要监听的事件
        events = ['beforeScrollStart', 'scrollCancel', 'scrollStart', 'scroll', 'scrollEnd', 'flick', 'zoomStart', 'zoomEnd'],
    // 刷新 Scroll 的间隔
        refreshTimeout = 100;

    function serialize(vm) {
        return JSON.parse(JSON.stringify(vm.$model));
    }

    function assign(obj, value) {

        if (avalon.type(obj) === 'array') {
            value = avalon.mix(true, {}, {
                _: value
            });
            obj = {
                _: obj
            };
        } else {
            value = avalon.mix(true, {}, value);
        }

        for (var i in obj) {
            if (typeof value[i] == 'undefined' || !obj.hasOwnProperty(i) || i === 'hasOwnProperty') continue;
            switch (avalon.type(obj[i])) {
                case 'object':
                    assign(obj[i], value[i]);
                    break;
                case 'array':
                    avalon.each(value[i], function (idx, v) {
                        var type = typeof obj[i][idx];
                        if (type === 'object' && obj[i][idx] !== null) {
                            assign(obj[i][idx], v);
                        } else {
                            if (idx >= obj[i].size()) {
                                obj[i].push(v);
                            } else {
                                obj[i].set(idx, v);
                            }
                        }
                    }); // jshint ignore: line

                    while (obj[i].length > value[i].length) {
                        obj[i].pop();
                    }
                    break;
                default:
                    obj[i] = value[i];
                    break;
            }
        }
    }

    // 获取 dom 节点上的相应属性和值
    function getAttr(el, attrName) {
        return ((el.hasAttributes() ? avalon.slice(el.attributes) : []).filter(function (attr) {
            return !attr.name.indexOf(attrName);
        })[0] || {}).name;
    }

    // 触发事件
    function dispatchEvent(el, type, args) {
        var evt = document.createEvent('HTMLEvents');
        evt.initEvent(type, true, true);
        avalon.mix(evt, args);
        el.dispatchEvent(evt);
    }

    // 给vmodels绑定事件
    function bindEvents(element, scroll) {
        events.forEach(function (eventName) {
            scroll.on(eventName, function () {
                dispatchEvent(element, eventName.toLowerCase());
            });
        });
    }

    if (avalon) {
        // 实现 ms-iscroll 指令
        avalon.bindingHandlers.iscroll = function (data, vmodels) {
            var element = data.element, // 绑定的 dom 节点
                args = data.value.match(/[^, ]+/g), // 分析参数，用逗号分割，第一个为配置所对应的参数key（后面的参数以后拓展）
                vm = vmodels[0], // 获取 VM
                options = avalon.mix({}, DEFAULT_OPT, vm.iscroll, element.dataset, args && args[1] ? vm[args[1]] : null), // merge 配置
                id = options.id || (args && args[0] !== '$' && args[0]) || ('iscroll' + setTimeout('1')), // jshint ignore:line
                son = element.children[0], // 儿子节点
                grandSon = element.children[0] && element.children[0].children[0], // 孙子节点
                eachAttr = son && getAttr(son, 'ms-each'), // 儿子节点是否有 ms-each
                repeatAttr = grandSon && getAttr(grandSon, 'ms-repeat'), // 孙子节点是否有 ms-repeat
                scroll, swap; // isroll 对象

            vm.scrolls = vm.scrolls || {}; // 存放 QApp-plugin-scroll 对象

            element.removeAttribute('ms-iscroll');

            // 判断是否使用 infinite 滚动
            if (eachAttr || repeatAttr) {
                var name, realName, timer, items = [],
                    rowNum = 0;

                if (eachAttr) {
                    name = son.getAttribute(eachAttr); // 获取监控的属性名
                    son.setAttribute(eachAttr, name + '$'); // 改为需要的属性名
                } else if (repeatAttr) {
                    name = grandSon.getAttribute(repeatAttr); // 获取监控的属性名
                    grandSon.setAttribute(repeatAttr, name + '$'); // 改为需要的属性名
                }
                // if (grandSon) {
                //     grandSon.setAttribute('ms-attr-QApp-plugin-data-index', '$index'); // 增加 index 绑定
                // }

                realName = name + '$'; // 真实绑定的属性。

                // 监控 数组是否改变
                // 用于数据刷新
                vm.$watch(name, function () {
                    var arr = vm[name],
                        newArr = vm[realName],
                        removeIndex = [],
                        oldLength = newArr.length,
                        i;

                    rowNum = arr.size() >= options.showLines ? options.showLines : arr.size();

                    // 判断是否是第一次加载
                    if (scroll) {
                        // 取消监听
                        newArr.forEach(function (item) {
                            item.$unwatch();
                        });
                        // 刷新数据
                        for (i = 0; i < rowNum; i++) {
                            // 判断元素是否存在
                            if (i >= oldLength) {
                                // 更新数据
                                if (newArr[i]) {
                                    newArr.set(i, serialize(arr[i]));
                                } else {
                                    newArr.push(serialize(arr[i]));
                                    scroll.appendNode(element.children[0].children[i], 1, i);
                                }

                                // 双向监控更新
                                newArr[i].$watch('$all', (function (index) {
                                    return function (key, value) {
                                        arr[index][key] = value;
                                    };
                                })(i)); // jshint ignore:line
                                arr[i].$watch('$all', (function (index) {
                                    return function (key, value) {
                                        newArr[index][key] = value;
                                    };
                                })(i)); // jshint ignore:line
                            }
                        }
                        for (i = rowNum; i < oldLength; i++) {
                            newArr.removeAt(rowNum);
                        }
                        items = swap.children;
                        scroll.resetNum(1, rowNum);
                        scroll.resetTotal(1, arr.size());
                        scroll.scrollTo(0, 0, 0);
                    } else {
                        // 配置数据和属性，创建 iScroll 对象
                        newArr.pushArray(JSON.parse(JSON.stringify(vm.$model[name].slice(0, rowNum)))); // 初始化僵尸数组的数据
                        swap = element.children[0];
                        items = swap.children;
                        options.lineHeight = options.lineHeight || (items[0] && items[0].offsetHeight);
                        if (!options.lineHeight) {
                            throw 'Can not know line height!';
                        }
                        scroll = vm.scrolls[id] = NScroll(element, {
                            builderNodes: false,
                            row: {
                                height: options.lineHeight,
                                num: rowNum,
                                total: arr.size()
                            },
                            scrollOpt: options,
                            topOffsetRefresh: options.topOffsetRefresh,
                            bottomOffsetRefresh: options.bottomOffsetRefresh,
                            refresh: function (type) {
                                if (typeof options.refresh === 'function') {
                                    options.refresh.call(scroll, type);
                                } else if (typeof options.refresh === 'string' && typeof vm[options.refresh] === 'function') {
                                    vm[options.refresh].call(scroll, type);
                                } else {
                                    dispatchEvent(element, 'refresh', {type: type});
                                }
                            },
                            dataFilter: function (type, el, column, row) {
                                var index = row % rowNum;
                                if (rowNum) {
                                    if (type === 'add') {
                                        scroll.appendNode(items[index], column, row);
                                        assign(newArr[index], serialize(arr[row]));
                                        newArr[index].$watch('$all', function (key, value) {
                                            arr[row][key] = value;
                                        });
                                        arr[row].$watch('$all', function (key, value) {
                                            newArr[index][key] = value;
                                        });
                                    } else {
                                        arr[row].$unwatch();
                                        newArr[index].$unwatch();
                                    }
                                }
                            }
                        }); // 创建 IScroll 对象
                        scroll.on('more', function (data) {
                            if (data.axis === 'y' && data.seq === 'next') {
                                if (typeof options.getData === 'function') {
                                    options.getData.call(scroll, arr.length);
                                } else if (typeof options.getData === 'string' && typeof vm[options.getData] === 'function') {
                                    vm[options.getData].call(scroll, arr.length);
                                } else {
                                    dispatchEvent(element, 'getdata', {start: arr.length});
                                }
                            }
                        });
                        bindEvents(element, scroll.scroll); // 绑定事件
                    }
                });

                // 监控原数组长度改变
                // 用于数据添加
                vm[name].$watch('length', function (value) {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function () {
                        if (scroll) {
                            scroll.resetTotal(0, vm[name].size(), 0, 1);
                        }
                    }, refreshTimeout);
                });

            } else {
                // 普通创建 IScroll
                scroll = vm.scrolls[id] = NScroll(element, options);
                bindEvents(element, scroll);

                vm.$watch('$all', function () {
                    if (timer) {
                        clearTimeout(timer);
                    }
                    timer = setTimeout(function () {
                        if (scroll) {
                            scroll.refresh();
                        }
                    }, refreshTimeout);
                });
            }


            // vmodel 移除时，销毁scroll
            vm.$remove = function () {
                if (scroll) {
                    scroll.destroy();
                    scroll = null;
                }
            };

        };
    }
})();

/********************************* Plugin *****************************/
(function () {
    var _ = QApp.util,
        iScroll = _.iScroll;

    var TIMEOUT = 300,
        TAG = 'qapp-scroll',
        SCROLL_OPT = {
            preventDefaultException: {
                tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/
            }
        };

    QApp.addPlugin(['scroll', 'ui.scroll'], SCROLL_OPT, function (view, options, config) {

        var refreshTimer, scroll;

        function refreshScroll() {
            if (refreshTimer) {
                clearTimeout(refreshTimer);
            }
            refreshTimer = _.delay(function () {
                if (scroll) {
                    scroll.refresh();
                }
            }, TIMEOUT);
        }

        view.on('ready', function () {
            var el = document.createElement(TAG);
            _.appendNodes(el, view.nodes);
            view.root.appendChild(el);
            scroll = view.scroll = new iScroll(
                view.root,
                options
            );
            view.root.addEventListener('DOMSubtreeModified', function () {
                refreshScroll();
            }, false);
            view.refreshScroll = refreshScroll;
            _.delay(refreshScroll);
        });

        view.on('destroy', function () {
            if (refreshTimer) {
                clearTimeout(refreshTimer);
            }
            if (scroll) {
                scroll.destroy();
            }
        });

        return {};
    });
})();

/********************************* Widget *****************************/
(function () {
    var _ = QApp.util,
        iScroll = _.iScroll;

    var TIMEOUT = 300;

    var SCROLL_OPT = {
        scrollX: false,
        scrollY: true,
        freeScroll: false,
        mouseWheel: false,
        probeType: 3,
        preventDefault: false
    };

    QApp.addWidget('scroll', function (element, options, view) {

        if (iScroll) {

            var scroll = {},
                refreshTimer,
                refreshScroll = function () {
                    if (refreshTimer) {
                        clearTimeout(refreshTimer);
                    }
                    refreshTimer = _.delay(function () {
                        if (scroll && scroll.refresh) {
                            scroll.refresh();
                        }
                    }, TIMEOUT);
                };

            _.css(element, 'overflow', 'hidden');

            _.addEvent(element, 'DOMSubtreeModified', function () {
                refreshScroll();
            });

            _.delay(refreshScroll);

            if (view) {
                // 判断 view 是否已显示
                
                if (view.isShow) {
                    // 如果已显示，例如通过 scanWidget 异部加载插件
                    // 直接 new iScroll
                    
                    var newScroll = new iScroll(
                        element,
                        _.extend({}, SCROLL_OPT, options)
                    );

                    _.each(view.widgets, function(key, item) {
                        if (item === scroll) {
                            view.widgets[key] = newScroll; 
                        }
                    });
                    scroll = newScroll;
                    
                } else {
                    // 如果未显示
                    
                    /* 
                     * `Android 4.3` 及更低版本下，
                     * QApp view 默认动画样式 `moveEnter` 初始会先让 view `visibility: hidden`，
                     * 导致 iScroll 部分白屏。
                     * 未避免这个问题，需要在 view show 后创建 iScroll 实例
                     */

                    var showEvents = view._events.show = view._events.show || [];

                    showEvents.unshift({
                        callback: function() {
                            var newScroll = new iScroll(
                                element,
                                _.extend({}, SCROLL_OPT, options)
                            );

                            _.each(view.widgets, function(key, item) {
                                if (item === scroll) {
                                    view.widgets[key] = newScroll; 
                                }
                            });
                            scroll = newScroll;
                        },
                        ctx: view
                    })
                }

            } else {
                var newScroll = new iScroll(
                    element,
                    _.extend({}, SCROLL_OPT, options)
                );
                scroll = newScroll;
            }

            return scroll;
        }

    });
})();