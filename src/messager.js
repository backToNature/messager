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
    var prefix = '[PROJECT_NAME]',// 消息前缀
        supportPostMessage = 'postMessage' in window,
        // supportConsole = 'console' in window;
        console = window.console || { log: function (err) {alert(err); }};
    /**
     * Messager类.
     * @param {string} projectName - 项目名称.
     * @param {HTMLObject} target - 目的窗口window对象
     * @param {string} origin - 规定哪些窗口接受消息
     */
    function Messager(projectName, target, origin) {
        if (!origin) {
            origin = '*';
        }
        this.listenFunc = []; // 消息监听函数
        if (!supportPostMessage) {
            window.navigator.listenFunc = [];
        }
        this.target = target;
        this.origin = origin;
        prefix = (projectName) || prefix;
        if (typeof prefix !== 'string') {
            prefix = prefix.toString();
        }
        this.init();// 初始化监听函数
    }
    // 初始化消息监听回调函数
    Messager.prototype.init = function () {
        var self = this;
        /**
         * 接受到消息后的回调函数.
         * @param {string} msg - 传输的消息，长度限制为10000字节.
         */
        var callback = function (msg) {
            // 验证是否是匹配的信息
            if (prefix !== msg.substring(0, msg.indexOf('|cy|'))) {
                return;
            }
            // 剥离消息前缀
            msg = msg.slice(prefix.length + 4);
            // 执行用户自定义回调
            var i;
            if (supportPostMessage) {
                for (i = 0; i < self.listenFunc.length; i++) {
                    self.listenFunc[i](msg);
                }
            } else {
                for (i = 0; i < window.navigator.listenFunc.length; i++) {
                    window.navigator.listenFunc[i](msg);
                }
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
            window.navigator.listenFunc[prefix + '|cy|'] = callback;
        }
    };
    /**
     * 发送消息.
     * @param {string} msg - 传输的消息.
     */
    Messager.prototype.post = function (msg) {
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
            this.target.postMessage(prefix + '|cy|' + msg, this.origin);
        } else {
            // 兼容IE6/7
            var targetFunc = window.navigator.listenFunc[prefix + '|cy|'];
            if (typeof targetFunc === 'function') {
                targetFunc(prefix + '|cy|' + msg, this.target);
            }
        }
    };
    Messager.prototype.listen = function (callback) {
        if (supportPostMessage) {
            // IE8+ 以及现代浏览器支持
            this.listenFunc.push(callback);
        } else {
            // 兼容IE6/7
            window.navigator.listenFunc.push(callback);
        }
    };
    return Messager;
})();