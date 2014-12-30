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
window.Messager = (function() {
    'use strict';
    var prefix = '[PROJECT_NAME]',// 消息前缀
        supportPostMessage = 'postMessage' in window,
        supportConsole = 'console' in window;
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
        this.target = target;
        this.origin = origin;
        prefix = (projectName) || prefix;
        if (typeof prefix !== 'string') {
            prefix = prefix.toString();
        }
        this.init();// 初始化监听函数
    }
    // 初始化消息监听回调函数
    Messager.prototype.init = function() {
        var self = this;
        /**
         * 接受到消息后的回调函数.
         * @param {Object json} msg - 传输的消息，长度限制为10000字节.
         */
        var callback = function(msg) {
            if (typeof msg == 'object' && msg.data) {
                // 这里还可以获取发送源
                msg = msg.data; // 传输的数据
            }
            // 验证是否是匹配的信息
            if (prefix != msg.substring(0, msg.indexOf('|cy|'))) {
                return;
            }
            // 剥离消息前缀
            msg = msg.slice(prefix.length + 4);
            // 将string转为json
            msg = eval('(' + msg + ')');
            if (supportPostMessage) {
                for (var i = 0; i < self.listenFunc.length; i++) {
                    self.listenFunc[i](msg);
                }
            } else {
                window.navigator.listenFunc(msg);
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
            window.navigator[prefix + '|cy|' + this.name] = callback;
        }
    };
    /**
     * 发送消息.
     * @param {Object json} msg - 传输的消息.
     */
    Messager.prototype.post = function(msg) {
        if (typeof msg == 'object') {
            var json2str = function(o) {
                var arr = [];
                var fmt = function(s) {
                    if (typeof s == 'object' && s != null) return json2str(s);
                    return /^(string|number)$/.test(typeof s) ?
                        "'" + s + "'" : s;
                };
                for (var i in o) arr.push("'" + i + "':" + fmt(o[i]));
                return '{' + arr.join(',') + '}';
            };
            msg = json2str(msg);
        } else {
            throw '请传输json数据';
        }
        // 信息长度检测
        if (msg.length >= 10000) {
            if (supportConsole) {
                console.log('数据长度超过限制');
                return;
            }
        }
        if (supportPostMessage) {
            // IE8+ 以及现代浏览器支持
            this.target.postMessage(prefix + '|cy|' + msg, this.origin);
        } else {
            // 兼容IE 6/7
            var targetFunc = window.navigator[prefix + '|cy|' + this.name];
            if (typeof targetFunc == 'function') {
                targetFunc(prefix + msg, this.target);
            }
        }
    };
    Messager.prototype.listen = function(callback) {
        if (supportPostMessage) {
            this.listenFunc.push(callback);
        } else {
            window.navigator.listenFunc = callback;
        }
    };
    return Messager; })();
