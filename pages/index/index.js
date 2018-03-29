var postsData = require('../../data/posts-data.js')

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  //name: "index",
  data: {

  },

  onLoad:function (options) {
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo: userInfo,
        name: userInfo.nickName,
        posts_key: postsData.postList
        
      })
    })
  },

  //以下为自定义点击事件
  menuTap: function (event) {
    //event(系统给的一个框架)、currentTarget(当前鼠标点击的一个组件)、dataset(所有自定义数据的集合)、  .（变量名）
    var postId = event.currentTarget.dataset.postid;
    //console.log("点击的postid " + postId);
    wx.navigateTo({
      url: '../Buy/Buy?id=' + postId
    })
  },

})

