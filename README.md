# todolist
前端小白的入门级实战,得益于慕课网表严肃老师的实战课程(6小时 jQuery开发一个前端应用)

## 说明
jQuery out了? No No No 其实现在jQuery依然是前端最火的框架之一,也是前端小白入门必掌握的基础, jQuery想要玩的溜, 还是要下一番功夫的, 如果你原生JS可以的话可以忽略, 大神请飘过, 这只是初级小白练手项目

## 安装
可以直接Download ZIP 或者 使用 git clone https://github.com/AlwaysLucky/todolist.git

执行 cd todolist  

执行 npm install  

执行 npm start

## 演示
**访问:**   [http://diaosi19.com/todolist](http://diaosi19.com/todolist)  
![todolist](img/visit-todo.png)

## 功能
添加任务可通过Enter 或 确定按钮触发  

点击选择框会显示勾选状态 表示任务已完成 底部呈现  取消勾选 顶部呈现  

删除会提示确定删除(没有重写alert)  

双击触发对应列表详情  

点击详情可编辑标题(双击)  

添加时间不可小于当前时间 当当时间大于设定时间时 播放音乐

## 异同
#### 修改点:
* 页面布局略有不同 如果这个布局都有困难的话 建议多巩固一下基础吧
* 输入框添加任务的时候enter触发
* 点击详情修改标题(通过HTML5的contenteditable实现)
* 删除任务时 delete arr[index] 貌似不太恰当  因为会产生一堆冗余数据 Array.splice 代替
* 采用原生alert 没有重写
* 移动端简单的适配 只测试了android , ios 可能会有问题  待后续优化
* 兼容性待测 只用了自己的手机和电脑测试  待后续优化 如有问题大家可一起探讨