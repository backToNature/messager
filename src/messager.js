/*jslint browser: true,
 vars: true, nomen: true,
 indent: 4, maxlen: 80,
 plusplus: true, sloppy: true,
 newcap: true, sub: true,
 regexp: true,
 continue: true*/
/*global console: true*/
/**
 * iframe跨域通信简易组件.
 * @author 郭豪
 * @version 2.0
 */
window.Messager = (function () {
    'use strict';
    var prefix = '[PROJECT_NAME]', // 消息前缀
        supportPostMessage = 'postMessage' in window,
        console = window.console || {
            log: function (err) {
                window.alert(err);
            }
        };
    if (!supportPostMessage && !window.navigator.listenFunc) {
        window.navigator.listenFunc = {};
        window.navigator.userListen = {};
    }
    /**
     * Messager类.
     * @param {string} projectName - 项目名称.
     * @param {HTMLObject} target - 目的窗口window对象
     * @param {string} name - 消息名称
     */
    function Messager(projectName, target, name) {
        this.listenFunc = []; // 消息监听函数
        this.target = target;
        this.name = name;
        prefix = projectName || prefix;
        if (typeof prefix !== 'string') {
            prefix = prefix.toString();
        }
        // 初始化监听函数
        this.init();
    }
    // 初始化消息监听回调函数
    Messager.prototype.init = function () {
        var self = this;
        /**
         * 接受到消息后的回调函数.
         * @param {string} msg - 传输的消息，长度限制为10000字节.
         */
        var callback = function (msg) {
            if (typeof msg === 'object') {
                msg = msg.data;
            }
            // 验证是否是匹配的信息
            if ((prefix + self.name) !== msg.substring(0, msg.indexOf('|cy|'))) {
                return;
            }
            // 剥离消息前缀
            msg = msg.slice((prefix + self.name).length + 4);
            // 执行用户自定义回调
            var i;
            if (supportPostMessage) {
                for (i = 0; i < self.listenFunc.length; i++) {
                    self.listenFunc[i](msg);
                }
            } else {
                window.navigator.userListen[prefix + self.name + '|cy|'](msg);
            }
        };
        if (supportPostMessage) {
            // 绑定事件监听
            if ('addEventListener' in document) {
                window.addEventListener('message', callback, false);
            } else if ('attachEvent' in document) {
                window.attachEvent('onmessage', callback);
            }
        } else {
            // 兼容IE 6/7
            window.navigator.listenFunc[prefix + this.name + '|cy|'] = callback;
        }
    };
    /**
     * 发送消息.
     * @param {string} msg - 传输的消息.
     * @param {string} name - 传输目的地名称
     */
    Messager.prototype.post = function (msg, name) {
        // 数据类型检测
        if (typeof msg !== 'string') {
            console.log('请输入字符串类型的数据;');
            return;
        }
        // 信息长度检测
        if (msg.length >= 10000) {
            console.log('数据长度超过限制');
            return;
        }
        if (supportPostMessage) {
            // IE8+ 以及现代浏览器支持
            this.target.postMessage(prefix + name + '|cy|' + msg, '*');
        } else {
            // 兼容IE6/7
            var targetFunc = window.navigator.listenFunc[prefix + name + '|cy|'];
            if (typeof targetFunc === 'function') {
                targetFunc(prefix + name + '|cy|' + msg);
            }
        }
    };
    Messager.prototype.listen = function (callback) {
        if (supportPostMessage) {
            // IE8+ 以及现代浏览器支持
            this.listenFunc.push(callback);
        } else {
            // 兼容IE6/7
            window.navigator.userListen[prefix + this.name + '|cy|'] = callback;
        }
    };
    return Messager;
})();