
/**
 *
 * @description iframe跨域通信简易组件.
 * @author 郭豪
 * @version 1.0
 * 
 * 
 */

window.ChangyanMsg = (function(){
    "use strict"
    var prefix = "[PROJECT_NAME+NES_NAME]",// 消息前缀
        supportPostMessage = 'postMessage' in window;
    function ChangyanMsg(msgName, projectName){
        /**
         * @param
         * msgName{string}: 消息的名称也就是key
         * projectName{string}: 项目的名称
         */
        this.name = msgName;
        this.listenFunc = []; // 消息监听函数
        prefix = (projectName + msgName) || prefix;
        if(typeof prefix !== 'string') {
            prefix = prefix.toString();
        }
        this.init();// 初始化监听函数
    }

    // 初始化消息监听回调函数
    ChangyanMsg.prototype.init = function(){
        var self = this;
        var callback = function(msg){
            if(typeof msg == 'object' && msg.data){
                // 这里还可以获取发送源
                msg = msg.data; // 传输的数据
            }
            // 验证是否是匹配的信息
            if(prefix != msg.substring(0,prefix.length)){
                return;
            }
            // 剥离消息前缀
            msg = msg.slice(prefix.length);
            for(var i = 0; i < self.listenFunc.length; i++){
                self.listenFunc[i](msg);
            }

        };
        if ( supportPostMessage ){
            // 绑定事件监听
            if ( 'addEventListener' in document ) {
                window.addEventListener('message', callback, false);
            } else if ( 'attachEvent' in document ) {
                window.attachEvent('onmessage', callback);
            }
        } else {
            // 兼容IE 6/7
            window.navigator[prefix + this.name] = callback;
        }
    };
    ChangyanMsg.prototype.post  = function(msg, target, origin) {
        if ( supportPostMessage ){
            // IE8+ 以及现代浏览器支持
            target.postMessage(prefix + msg, origin)
        } else {
            // 兼容IE 6/7
                var targetFunc = window.navigator[prefix + this.name];
                if ( typeof targetFunc == 'function' ) {
                    targetFunc(prefix + msg, window);
                }
        }
    };
    ChangyanMsg.prototype.listen = function(callback){
        this.listenFunc.push(callback);
    };
    return ChangyanMsg;

})();