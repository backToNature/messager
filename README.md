messager
========
messager类，用于iframe与父窗口之间通信。具体demo如下

## 父窗口代码如下:

```
var messager = new Messager("projectName");
messager.listen(function(msg){
    console.log(msg);
});
```

## 子窗口代码如下

```
var messager = new Messager("projectName",parent,"a.html");
var  data1 = '{"code":200,"data":[{"appid":"我爱","comment_0":156830,"comment_10":841,"comment_43":1582,"comment_60":685,"comment_96":433749,"comment_audited_0":110957,"comment_audited_10":449,"comment_audited_43":987,"comment_audited_60":487,"comment_audited_96":433749,"time":"20141217","topic_0":9474,"topic_10":561,"topic_43":766,"topic_60":374,"topic_96":24,"topic_audited_0":6815,"topic_audited_10":295,"topic_audited_43":526,"topic_audited_60":280,"topic_audited_96":24,"user_0":54132,"user_10":707,"user_43":847,"user_60":369,"user_96":47417,"user_audited_0":32270,"user_audited_10":413,"user_audited_43":602,"user_audited_60":276,"user_audited_96":47417}],"message":"success"}';
messager.post(eval("(" + data1 + ")"));
```

## 配置参数

```
var messager = new Messager(projectName, target, origin);
messager.post(json);
```
* Messager类
	* projectName: 项目名称,用来识别通信双方身份。
	* target: 目标窗口
	* origin: 规定哪些窗口接受消息
	* post方法: 传递消息。
	


